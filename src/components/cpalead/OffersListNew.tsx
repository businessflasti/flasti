"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import PremiumTaskModal from '@/components/dashboard/PremiumTaskModal';
import { supabase } from '@/lib/supabase';
import CompletedTaskOverlay from './CompletedTaskOverlay';

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

interface CustomOffer {
  id: string;
  title: string;
  description: string;
  amount: number;
  image_url: string;
  modal_title: string;
  modal_subtitle: string;
  audio_url: string;
  video_url: string;
  input_placeholder: string;
  input_label: string;
  help_text: string;
  task_type: string;
  partner_name: string;
  partner_logo: string;
  objective: string;
  block_bg_color: string;
  image_bg_color: string;
  is_active: boolean;
  position: number;
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
  const [loadingCpaLead, setLoadingCpaLead] = useState(true);
  const [loadingCustomOffers, setLoadingCustomOffers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Refs para evitar recargas innecesarias cuando el usuario vuelve a la pestaña
  const hasLoadedCustomOffers = useRef(false);
  const hasLoadedCpaLeadOffers = useRef(false);
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

  // Estados para ofertas personalizadas
  const [customOffers, setCustomOffers] = useState<CustomOffer[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<CustomOffer | null>(null);
  const [completedOfferIds, setCompletedOfferIds] = useState<string[]>([]); // IDs de ofertas completadas
  const { shouldLockCard } = useCardLockConfig();

  // Estado de carga unificado: mostrar contenido cuando custom offers estén listas
  // Las ofertas de CPALead pueden cargar después sin bloquear la UI
  // Si ya hay datos cargados, no mostrar loading (evita bug al volver a la pestaña)
  const isInitialLoading = loadingCustomOffers && customOffers.length === 0;

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

  // Función para obtener ofertas de CPALead (ahora acepta country opcional)
  const fetchOffers = useCallback(async (forceRefresh = false, countryParam?: string) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoadingCpaLead(true);
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
        hasLoadedCpaLeadOffers.current = true; // Marcar como cargado
        
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
      setLoadingCpaLead(false);
      setRefreshing(false);
    }
  }, []);

  // Nueva función: detectar país vía API server-side (no bloquea ofertas personalizadas)
  const detectCountry = async (force = false) => {
    try {
      console.log('🌍 Iniciando detección de país...', { force });
      
      // Si no forzamos, intentar obtener país guardado en localStorage primero
      if (!force) {
        const cached = typeof window !== 'undefined' ? localStorage.getItem('userCountry') : null;
        if (cached && cached !== 'null') {
          console.log('🌍 País desde cache:', cached);
          setUserCountry(cached);
          // No usar await para no bloquear - las ofertas de CPALead cargan en background
          fetchOffers(false, cached);
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
        // No usar await para no bloquear
        fetchOffers(false, json.country);
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
          setLoading(false);
          setLoadingCpaLead(false);
          return;
        }
      }

      // Si todo falla, usar US como fallback
      console.log('🌍 Usando US como fallback');
      setUserCountry('US');
      localStorage.setItem('userCountry', 'US');
      fetchOffers(false, 'US');
      
    } catch (error) {
      console.error('❌ Error detectando país:', error);
      // En caso de error, usar US como fallback
      console.log('🌍 Error - usando US como fallback');
      setUserCountry('US');
      localStorage.setItem('userCountry', 'US');
      fetchOffers(false, 'US');
    }
  };

  // Cargar ofertas personalizadas PRIMERO (prioridad alta - desde Supabase)
  useEffect(() => {
    // Si ya se cargaron, no volver a cargar (evita el bug al volver a la pestaña)
    if (hasLoadedCustomOffers.current && customOffers.length > 0) {
      setLoadingCustomOffers(false);
      return;
    }
    
    const loadCustomOffersAndBonusStatus = async () => {
      setLoadingCustomOffers(true);
      
      try {
        // Cargar ofertas personalizadas activas - PRIORIDAD ALTA
        const { data: offers, error: offersError } = await supabase
          .from('custom_offers')
          .select('*')
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (!offersError && offers) {
          setCustomOffers(offers);
          hasLoadedCustomOffers.current = true;
        }

        // Cargar ofertas personalizadas completadas por el usuario
        if (user) {
          const { data: completions, error: completionsError } = await supabase
            .from('custom_offers_completions')
            .select('offer_id')
            .eq('user_id', user.id);

          if (!completionsError && completions) {
            setCompletedOfferIds(completions.map(c => c.offer_id));
          }
        }
      } catch (error) {
        console.error('Error loading custom offers:', error);
      } finally {
        setLoadingCustomOffers(false);
      }
    };

    // Ejecutar inmediatamente al montar
    loadCustomOffersAndBonusStatus();
  }, [user]);

  // Cargar ofertas de CPALead al montar el componente
  useEffect(() => {
    // Si ya se cargaron, no volver a cargar
    if (hasLoadedCpaLeadOffers.current && offers.length > 0) {
      setLoadingCpaLead(false);
      return;
    }
    
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
  const handleOfferClick = (offer: CPALeadOffer, isLocked: boolean) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // No permitir click si está bloqueada
    if (isLocked) {
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

  // Renderizar estado de carga - Solo mostrar cuando las ofertas personalizadas están cargando
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Cargando microtareas...</p>
      </div>
    );
  }

  // Selector de país si es necesario
  if (showCountryModal && loadingCpaLead) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-[#121212] border-gray-700">
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
        
        <Card className="bg-[#121212] border-red-500/50">
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
        <Card className="bg-[#121212] border-gray-700">
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
      {offers.length === 0 && customOffers.length === 0 && !loadingCpaLead ? (
        <Card className="bg-[#121212] border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No hay tareas disponibles para tu país ({userCountry})</p>
              <p className="text-sm text-gray-500">Las tareas se actualizan automáticamente cada 5 minutos</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="offers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ willChange: 'scroll-position', contain: 'layout style' }}>
          {/* Ofertas personalizadas */}
          {customOffers.map((customOffer, index) => {
            // Verificar si esta oferta ya fue completada
            const isCompleted = completedOfferIds.includes(customOffer.id);
            
            // Lógica de bloqueo secuencial:
            // - Tarea 1 (position 1): siempre desbloqueada
            // - Tarea 2+ (position > 1): bloqueada hasta que la anterior esté completada
            const previousOffer = customOffers.find(o => o.position === customOffer.position - 1);
            const isPreviousCompleted = previousOffer ? completedOfferIds.includes(previousOffer.id) : true;
            const isLocked = customOffer.position > 1 && !isPreviousCompleted;
            
            // Para ofertas personalizadas, isReadyToUnlock es false (no tienen botón desbloquear)
            // Se desbloquean automáticamente al completar la anterior
            const isReadyToUnlock = false;
            
            // Si está completada, mostrar overlay de completado
            if (isCompleted) {
              return (
                <div key={`custom-${customOffer.id}`} className="relative">
                  <CompletedTaskOverlay 
                    amount={customOffer.amount}
                    imageUrl={customOffer.image_url}
                  >
                    <Card 
                      className="relative bg-[#0A0A0A] border-0 rounded-3xl overflow-hidden h-full"
                      style={{ contain: 'layout style paint', transform: 'translate3d(0,0,0)' }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-white line-clamp-2 mb-2">
                              {customOffer.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge 
                                variant="secondary" 
                                className="bg-green-900/50 text-green-300 text-sm font-semibold px-3 py-1.5 whitespace-nowrap inline-flex items-center min-w-fit"
                              >
                                <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
                                {customOffer.amount.toFixed(2)} USD
                              </Badge>
                            </div>
                          </div>
                          {customOffer.image_url && (
                            <div className="ml-3 flex-shrink-0">
                              <Image
                                src={customOffer.image_url}
                                alt={customOffer.title}
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
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {customOffer.description && (
                            <CardDescription className="text-gray-400 line-clamp-2">
                              {customOffer.description}
                            </CardDescription>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Tag className="w-4 h-4" />
                              <span>Dispositivo: todos</span>
                            </div>
                          </div>
                          
                          <Button
                            disabled
                            className="w-full text-white opacity-50 cursor-not-allowed"
                            style={{ backgroundColor: '#6765F2' }}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Completada
                          </Button>
                          
                          <div className="w-full border border-gray-600 rounded-md px-4 py-2 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                            <span className="text-white text-sm font-medium flex items-center justify-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              Gana {customOffer.amount.toFixed(2)} USD
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CompletedTaskOverlay>
                </div>
              );
            }
            
            return (
              <div key={`custom-${customOffer.id}`} className="relative">
                <PremiumCardOverlay
                  isLocked={isLocked}
                  onUnlockClick={() => setShowWelcomeModal(true)}
                  taskNumber={customOffer.position}
                  isReadyToUnlock={isReadyToUnlock}
                >
                  <Card 
                    className={`relative bg-[#0A0A0A] border-0 rounded-3xl overflow-hidden ${isLocked ? 'flex flex-col' : 'h-full'}`}
                    style={isLocked ? { height: '360px', contain: 'layout style paint' } : { contain: 'layout style paint' }}
                  >
                    <CardHeader className={isLocked ? 'pb-4' : 'pb-3'}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className={`text-lg text-white line-clamp-2 ${isLocked ? 'mb-3' : 'mb-2'}`}>
                            {customOffer.title}
                          </CardTitle>
                          <div className={`flex items-center space-x-2 ${isLocked ? 'mb-3' : 'mb-2'}`}>
                            <Badge 
                              variant="secondary" 
                              className="bg-green-900/50 text-green-300 text-sm font-semibold px-3 py-1.5 whitespace-nowrap inline-flex items-center min-w-fit"
                            >
                              <DollarSign className="w-3 h-3 mr-1 flex-shrink-0" />
                              {customOffer.amount.toFixed(2)} USD
                            </Badge>
                          </div>
                        </div>
                        {customOffer.image_url && (
                          <div className="ml-3 flex-shrink-0">
                            <Image
                              src={customOffer.image_url}
                              alt={customOffer.title}
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
                        {customOffer.description && (
                          <CardDescription className={`text-gray-400 line-clamp-2 ${isLocked ? 'mb-1' : ''}`}>
                            {customOffer.description}
                          </CardDescription>
                        )}
                        
                        <div className={`flex items-center text-sm text-gray-500 ${isLocked ? 'mb-1' : ''}`}>
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4" />
                            <span>Dispositivo: todos</span>
                          </div>
                        </div>
                        
                        {isLocked ? (
                          <div className="mt-auto space-y-3">
                            <Button
                              onClick={() => {
                                setSelectedOffer(customOffer);
                                setShowWelcomeModal(true);
                              }}
                              className="w-full text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#6765F2' }}
                              disabled={isLocked}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Acceder a la tarea
                            </Button>
                            
                            {/* Botón decorativo motivador */}
                            <div className="w-full border border-gray-600 rounded-md px-4 py-2 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                              <span className="text-white text-sm font-medium flex items-center justify-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Gana {customOffer.amount.toFixed(2)} USD
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
                              onClick={() => {
                                setSelectedOffer(customOffer);
                                setShowWelcomeModal(true);
                              }}
                              className="w-full text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#6765F2' }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Acceder a la tarea
                            </Button>
                            
                            {/* Botón decorativo motivador */}
                            <div className="w-full border border-gray-600 rounded-md px-4 py-2 text-center" style={{ backgroundColor: '#1a1a1a' }}>
                              <span className="text-white text-sm font-medium flex items-center justify-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Gana {customOffer.amount.toFixed(2)} USD
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

          {/* Skeletons mientras cargan ofertas de CPALead */}
          {loadingCpaLead && offers.length === 0 && [...Array(6)].map((_, i) => (
            <div key={`skeleton-${i}`} className="relative">
              <Card className="bg-[#0A0A0A] border-0 rounded-3xl overflow-hidden h-[360px] animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-6 bg-green-900/30 rounded w-24"></div>
                    </div>
                    <div className="ml-3 w-[60px] h-[60px] bg-gray-700 rounded-lg"></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    <div className="h-10 bg-gray-700 rounded w-full mt-4"></div>
                    <div className="h-10 bg-gray-800 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Ofertas de CPALead */}
          {offers.map((offer, index) => {
            // Verificar si la tarea 2 (position 2) está completada
            const offer2 = customOffers.find(o => o.position === 2);
            const isOffer2Completed = offer2 ? completedOfferIds.includes(offer2.id) : false;
            
            // Las ofertas CPALead SIEMPRE están bloqueadas (hasta comprar premium)
            const isLocked = shouldLockCard(offer, isPremium);
            
            // Después de completar tarea 2, TODAS las ofertas CPALead muestran "lista para desbloquear"
            // Pero solo la primera (index 0) tiene el botón "Desbloquear"
            const isReadyToUnlock = isLocked && isOffer2Completed;
            const showUnlockButton = isReadyToUnlock && index === 0;
            
            // Debug lock status
            if (index < 3) {
              console.log(`🔒 Offer ${index + 1} (${offer.title.substring(0, 30)}...):`, {
                isLocked,
                isPremium,
                amount: offer.amount,
                offerId: offer.id,
                isReadyToUnlock
              });
            }
            
            return (
              <div key={offer.id} className="relative">
                <PremiumCardOverlay
                  isLocked={isLocked}
                  onUnlockClick={() => router.push('/dashboard/premium')}
                  taskNumber={index + 1}
                  isReadyToUnlock={isReadyToUnlock}
                  showUnlockButton={showUnlockButton}
                >
                  <Card 
                    className={`relative bg-[#0A0A0A] border-0 rounded-3xl overflow-hidden ${isLocked ? 'flex flex-col' : 'h-full'}`}
                    style={isLocked ? { height: '360px', contain: 'layout style paint' } : { contain: 'layout style paint' }}
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
                              onClick={() => handleOfferClick(offer, isLocked)}
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
                              onClick={() => handleOfferClick(offer, isLocked)}
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

      {/* Modal Premium para ofertas personalizadas */}
      {showWelcomeModal && user && selectedOffer && (
        <PremiumTaskModal
          userId={user.id}
          customOfferId={selectedOffer.id}
          modalTitle={selectedOffer.modal_title}
          modalSubtitle={selectedOffer.modal_subtitle}
          audioUrl={selectedOffer.audio_url}
          videoUrl={selectedOffer.video_url}
          inputPlaceholder={selectedOffer.input_placeholder}
          inputLabel={selectedOffer.input_label}
          helpText={selectedOffer.help_text}
          amount={selectedOffer.amount}
          imageUrl={selectedOffer.image_url}
          taskType={selectedOffer.task_type}
          partnerName={selectedOffer.partner_name}
          partnerLogo={selectedOffer.partner_logo}
          objective={selectedOffer.objective}
          blockBgColor={selectedOffer.block_bg_color}
          imageBgColor={selectedOffer.image_bg_color}
          userCountry={userCountry}
          onClose={() => {
            setShowWelcomeModal(false);
            setSelectedOffer(null);
          }}
          onComplete={() => {
            setShowWelcomeModal(false);
            setSelectedOffer(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default OffersListNew;