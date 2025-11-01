"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import { ExternalLink, DollarSign, Globe, Tag, RefreshCw, Zap } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay';
import { useRouter } from 'next/navigation';
import { usePremiumStatus } from '@/components/premium/hooks/usePremiumStatus';
import { useCardLockConfig } from '@/components/premium/hooks/useCardLockConfig';

interface OffersStats {
  total: number;
  fastPay: number;
  avgPayout: string;
  maxPayout: string;
  minPayout: string;
  devices: string[];
  payoutTypes: string[];
  fastPayPercentage: string;
}

interface OffersResponse {
  success: boolean;
  data: CPALeadOffer[];
  count: number;
  stats: OffersStats;
  country: string;
  offerCountry?: string;
  timestamp: string;
  cached: boolean;
  message?: string;
  // Nuevos campos para el sistema de asignación manual
  isUsingManualMapping?: boolean;
  mappingInfo?: {
    userCountry: string;
    offerCountry: string;
    notes: string | null;
    reason: string;
  } | null;
  // Campos antiguos (mantener compatibilidad)
  isUsingSpainFallback?: boolean;
  originalCount?: number;
  fallbackInfo?: {
    originalCountry: string;
    fallbackCountry: string;
    reason: string;
  } | null;
}

interface OffersListNewProps {
  onDataUpdate?: (data: { userCountry: string; refreshing: boolean; handleRefresh: () => void }) => void;
}

const OffersListNew: React.FC<OffersListNewProps> = ({ onDataUpdate }) => {
  const { user } = useAuth();
  const router = useRouter();

  // Helper para limpiar HTML y decodificar entidades
  const cleanHtmlText = (text: string): string => {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // Remover tags HTML
      .replace(/&nbsp;/g, ' ') // Reemplazar &nbsp; con espacios
      .replace(/&amp;/g, '&') // Decodificar &amp;
      .replace(/&lt;/g, '<') // Decodificar &lt;
      .replace(/&gt;/g, '>') // Decodificar &gt;
      .replace(/&quot;/g, '"') // Decodificar &quot;
      .replace(/&#39;/g, "'") // Decodificar &#39;
      .replace(/&#x27;/g, "'") // Decodificar &#x27;
      .replace(/&hellip;/g, '...') // Decodificar &hellip;
      .trim();
  };
  const [offers, setOffers] = useState<CPALeadOffer[]>([]);
  const [stats, setStats] = useState<OffersStats | null>(null);
  const [userCountry, setUserCountry] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountryManual, setSelectedCountryManual] = useState<string>('');
  // Estados para el sistema de asignación manual
  const [isUsingManualMapping, setIsUsingManualMapping] = useState(false);
  const [mappingInfo, setMappingInfo] = useState<{
    userCountry: string;
    offerCountry: string;
    notes: string | null;
    reason: string;
  } | null>(null);

  // Premium system hooks
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
  const { shouldLockCard } = useCardLockConfig();

  // Debug premium status
  useEffect(() => {
    console.log('🔒 Premium Status:', { isPremium, premiumLoading });
  }, [isPremium, premiumLoading]);

  // Notificar al componente padre cuando cambien los datos
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        userCountry,
        refreshing,
        handleRefresh
      });
    }
  }, [userCountry, refreshing, onDataUpdate]);

  // Función para obtener ofertas (ahora acepta country opcional)
  const fetchOffers = useCallback(async (forceRefresh = false, countryParam?: string) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 Obteniendo tareas de CPA Lead...');
      
      const params = new URLSearchParams();
      if (forceRefresh) {
        params.append('refresh', 'true');
      }
      if (countryParam) {
        params.append('country', countryParam);
      }
      // Si el usuario es premium, solicitar ofertas reales (sin respaldo de España)
      if (isPremium) {
        params.append('real', 'true');
        console.log('👑 Usuario premium: solicitando ofertas reales sin respaldo');
      }

      const url = `/api/cpalead/offers${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: forceRefresh ? 'no-store' : 'default'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: OffersResponse = await response.json();

      if (data.success) {
        setOffers(data.data);
        setStats(data.stats);
        setUserCountry(data.country);
        setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
        setIsUsingManualMapping(data.isUsingManualMapping || false);
        setMappingInfo(data.mappingInfo || null);
        
        console.log(`✅ ${data.count} tareas obtenidas para ${data.country}`);
        if (data.isUsingManualMapping) {
          console.log(`🎯 Asignación manual: ${data.mappingInfo?.userCountry} → ${data.mappingInfo?.offerCountry}`);
          console.log(`📝 Razón: ${data.mappingInfo?.reason}`);
        }
        console.log('📊 Estadísticas:', data.stats);
        console.log('🔍 Primeras 3 ofertas:', data.data.slice(0, 3));
        
        // Verificar si las ofertas tienen los campos necesarios
        data.data.forEach((offer, index) => {
          if (index < 3) {
            console.log(`Oferta ${index + 1}:`, {
              id: offer.id,
              title: offer.title,
              amount: offer.amount,
              link: offer.link,
              description: offer.description?.substring(0, 100),
              hasCreatives: !!offer.creatives?.url
            });
          }
        });
      } else {
        throw new Error(data.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error obteniendo tareas:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Nueva función: detectar país vía API server-side
  const detectCountry = async (force = false) => {
    try {
      console.log('🌍 Iniciando detección de país...', { force });
      
      // Si no forzamos, intentar obtener país guardado en localStorage primero
      if (!force) {
        const cached = typeof window !== 'undefined' ? localStorage.getItem('userCountry') : null;
        if (cached && cached !== 'null') {
          console.log('🌍 País desde cache:', cached);
          setUserCountry(cached);
          await fetchOffers(false, cached);
          return;
        }
      }

      console.log('🌍 Detectando país vía API...');
      
      // Llamada al endpoint server-side que usa ipapi -> ipinfo
      const res = await fetch('/api/detect-country');
      const json = await res.json();
      
      console.log('🌍 Respuesta de detección:', { status: res.status, data: json });
      
      if (json?.country && json.country.length === 2) {
        console.log('🌍 País detectado:', json.country);
        setUserCountry(json.country);
        localStorage.setItem('userCountry', json.country);
        localStorage.setItem('userCountryTime', Date.now().toString());
        await fetchOffers(false, json.country);
        return;
      }

      console.log('🌍 No se pudo detectar país, mostrando selector...');
      
      // Si no se detectó país, obtener lista de países soportados por CPALead y mostrar selector
      const listRes = await fetch('/api/cpalead/countries');
      if (listRes.ok) {
        const listJson = await listRes.json();
        if (listJson?.success && Array.isArray(listJson.countries) && listJson.countries.length > 0) {
          console.log('🌍 Países disponibles:', listJson.countries.length);
          setCountriesList(listJson.countries);
          setShowCountryModal(true);
          setLoading(false); // Importante: detener el loading aquí
          return;
        }
      }

      // Si todo falla, usar US como fallback
      console.log('🌍 Usando US como fallback');
      setUserCountry('US');
      localStorage.setItem('userCountry', 'US');
      await fetchOffers(false, 'US');
      
    } catch (error) {
      console.error('❌ Error detectando país:', error);
      // En caso de error, usar US como fallback
      console.log('🌍 Error - usando US como fallback');
      setUserCountry('US');
      localStorage.setItem('userCountry', 'US');
      await fetchOffers(false, 'US');
    }
  };

  // Cargar ofertas al montar el componente: antes detectar país
  useEffect(() => {
    detectCountry();
  }, []); // Remover dependencia para evitar bucles

  // Manejar selección manual del país
  const handleConfirmManualCountry = async () => {
    if (!selectedCountryManual) return;
    setShowCountryModal(false);
    setUserCountry(selectedCountryManual);
    localStorage.setItem('userCountry', selectedCountryManual);
    localStorage.setItem('userCountryTime', Date.now().toString());
    // Aquí podríamos persistir en perfil del usuario si está logueado (no implementado)
    await fetchOffers(false, selectedCountryManual);
  };

  // Manejar click en refresh manual: re-detectar país forzando (ignorar cache)
  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    setOffers([]);
    setStats(null);
    setUserCountry('');
    // Forzar redetección y recarga de ofertas
    await detectCountry(true);
    setRefreshing(false);
  };

  // Manejar click en oferta
  const handleOfferClick = (offer: CPALeadOffer) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Abrir la oferta en una nueva ventana
    window.open(offer.link, '_blank', 'noopener,noreferrer');
  };

  // Helper para nombre de país completo
  const getCountryName = (code: string) => {
    try {
      // Preferir Español
      if ((Intl as any).DisplayNames) {
        const dn = new (Intl as any).DisplayNames(['es'], { type: 'region' });
        return dn.of(code);
      }
    } catch (e) {
      // fallback
    }
    // Fallback simple: devolver mismo código si no se puede resolver
    return code;
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-gray-400 font-medium">Verificando tu ubicación…</p>

        {/* Selector inline dentro del bloque de ofertas si corresponde */}
        {showCountryModal && (
          <div className="w-full max-w-2xl mt-6">
            <Card className="bg-[#101010] border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-white text-lg font-semibold mb-2">Selecciona tu país</h3>
                  <p className="text-gray-400 mb-4">No pudimos confirmar tu ubicación. Elige tu país para continuar...</p>

                  <select
                    className="w-full p-3 bg-[#0b0b0b] border border-gray-700 rounded mb-4 text-white"
                    value={selectedCountryManual}
                    onChange={(e) => setSelectedCountryManual(e.target.value)}
                  >
                    <option value="">-- Selecciona --</option>
                    {countriesList.map((c) => (
                      <option key={c} value={c}>{c} - {getCountryName(c)}</option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-2">
                    <button onClick={handleConfirmManualCountry} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={!selectedCountryManual}>Confirmar</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Renderizar error
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </div>
        
        <Card className="bg-[#101010] border-red-500/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error al cargar tareas: {error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si se requiere selección manual, mostrar solo el selector dentro del bloque de ofertas
  if (showCountryModal) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto">
        <Card className="bg-[#101010] border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-white text-lg font-semibold mb-2">Selecciona tu país</h3>
              <p className="text-gray-400 mb-4">No pudimos confirmar tu ubicación. Elige tu país para continuar...</p>

              <select
                className="w-full p-3 bg-[#0b0b0b] border border-gray-700 rounded mb-4 text-white"
                value={selectedCountryManual}
                onChange={(e) => setSelectedCountryManual(e.target.value)}
              >
                <option value="">-- Selecciona --</option>
                {countriesList.map((c) => (
                  <option key={c} value={c}>{c} - {getCountryName(c)}</option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button onClick={handleConfirmManualCountry} className="px-4 py-2 rounded bg-blue-600 text-white" disabled={!selectedCountryManual}>Confirmar</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Lista de ofertas */}
      {offers.length === 0 ? (
        <Card className="bg-[#101010] border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No hay tareas disponibles para tu país ({userCountry})</p>
              <p className="text-sm text-gray-500">Las tareas se actualizan automáticamente cada 5 minutos</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {offers.map((offer, index) => {
            const isLocked = shouldLockCard(offer, isPremium);
            
            // Debug lock status
            if (index < 3) {
              console.log(`🔒 Offer ${index + 1} (${offer.title.substring(0, 30)}...):`, {
                isLocked,
                isPremium,
                amount: offer.amount,
                offerId: offer.id
              });
            }
            
            return (
              <div key={offer.id} className="relative">
                <PremiumCardOverlay
                  isLocked={isLocked}
                  onUnlockClick={() => router.push('/dashboard/premium')}
                  taskNumber={index + 1}
                >
                  <Card 
                    className={`relative bg-[#101010] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden ${isLocked ? 'flex flex-col' : 'h-full'}`}
                    style={isLocked ? { height: '360px' } : undefined}
                  >
                    <CardHeader className={isLocked ? 'pb-4' : 'pb-3'}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className={`text-lg text-white line-clamp-2 ${isLocked ? 'mb-3' : 'mb-2'}`}>
                            {cleanHtmlText(offer.title)}
                          </CardTitle>
                          <div className={`flex items-center space-x-2 ${isLocked ? 'mb-3' : 'mb-2'}`}>
                            <Badge 
                              variant="secondary" 
                              className="bg-green-900/50 text-green-300 text-sm font-semibold px-3 py-1.5 whitespace-nowrap inline-flex items-center min-w-fit"
                            >
                              <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
                              {offer.amount} {offer.payout_currency}
                            </Badge>
                            {offer.is_fast_pay && (
                              <Badge variant="secondary" className="bg-yellow-900/50 text-yellow-300 px-3 py-1.5 whitespace-nowrap inline-flex items-center min-w-fit">
                                <Zap className="w-3 h-3 mr-1 flex-shrink-0" />
                                Fast Pay
                              </Badge>
                            )}
                          </div>
                        </div>
                        {offer.creatives?.url && (
                          <div className="ml-3 flex-shrink-0">
                            <Image
                              src={offer.creatives.url}
                              alt={offer.title}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className={`pt-0 ${isLocked ? 'flex-1 flex flex-col' : ''}`}>
                      <div className={isLocked ? 'space-y-4 flex-1 flex flex-col' : 'space-y-3'}>
                        {offer.description && (
                          <CardDescription className={`text-gray-400 line-clamp-2 ${isLocked ? 'mb-1' : ''}`}>
                            {(() => {
                              const cleanDescription = cleanHtmlText(offer.description);
                              
                              // Debug: mostrar descripción original vs limpia para las primeras ofertas
                              if (offers.indexOf(offer) < 3) {
                                console.log(`Descripción oferta ${offers.indexOf(offer) + 1}:`, {
                                  original: offer.description.substring(0, 100),
                                  cleaned: cleanDescription.substring(0, 100)
                                });
                              }
                              
                              return cleanDescription;
                            })()}
                          </CardDescription>
                        )}
                        
                        <div className={`flex items-center text-sm text-gray-500 ${isLocked ? 'mb-1' : ''}`}>
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4" />
                            <span>
                              Dispositivo: {(() => {
                                const device = offer.device?.toLowerCase();
                                if (device === 'all' || device === 'all_devices') return 'todos';
                                if (device === 'desktop') return 'computadora';
                                if (device === 'mobile') return 'móvil';
                                return offer.device?.toLowerCase() || 'no especificado';
                              })()}
                            </span>
                          </div>
                        </div>
                        
                        {isLocked ? (
                          <div className="mt-auto space-y-3">
                            <Button
                              onClick={() => handleOfferClick(offer)}
                              className="w-full text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#3C66CE' }}
                              disabled={!user || isLocked}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {cleanHtmlText(offer.conversion) || 'Completar Tarea'}
                            </Button>
                            
                            {/* Botón decorativo motivador */}
                            <div className="w-full border border-gray-600 rounded-md px-4 py-2 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                              <span className="text-white text-sm font-medium flex items-center justify-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Gana {offer.amount} {offer.payout_currency}
                              </span>
                            </div>
                            
                            {!user && (
                              <p className="text-xs text-gray-500 text-center">
                                Inicia sesión para acceder a las tareas
                              </p>
                            )}
                          </div>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleOfferClick(offer)}
                              className="w-full text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#3C66CE' }}
                              disabled={!user || isLocked}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {cleanHtmlText(offer.conversion) || 'Completar Tarea'}
                            </Button>
                            
                            {/* Botón decorativo motivador */}
                            <div className="w-full border border-gray-600 rounded-md px-4 py-2 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                              <span className="text-white text-sm font-medium flex items-center justify-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Gana {offer.amount} {offer.payout_currency}
                              </span>
                            </div>
                            
                            {!user && (
                              <p className="text-xs text-gray-500 text-center">
                                Inicia sesión para acceder a las tareas
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </PremiumCardOverlay>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OffersListNew;