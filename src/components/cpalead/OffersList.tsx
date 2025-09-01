"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import { ExternalLink, DollarSign, Globe, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay';
import { useRouter } from 'next/navigation';
import { usePremiumStatus } from '@/components/premium/hooks/usePremiumStatus';
import { useCardLockConfig } from '@/components/premium/hooks/useCardLockConfig';
import { formatPremiumMessage } from '@/components/premium/utils/premiumUtils';

interface OffersListProps {
  offers: CPALeadOffer[];
}

const OffersList: React.FC<OffersListProps> = ({ offers }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [userCountry, setUserCountry] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // CSS para la animación de pulso azul
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-blue {
        0%, 100% {
          background-color: #101010;
          box-shadow: 0 0 0 0 rgba(60, 102, 205, 0.7);
        }
        50% {
          background-color: #3c66cd;
          box-shadow: 0 0 0 10px rgba(60, 102, 205, 0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  // Premium system hooks
  const { isPremium, isLoading: premiumLoading } = usePremiumStatus();
  const { shouldLockCard } = useCardLockConfig();

  const handleUpgradeClick = () => {
    router.push('/dashboard/premium');
  };

  // Detectar país del usuario
  useEffect(() => {
    const geoServices = [
      {
        name: 'cloudflare',
        url: 'https://www.cloudflare.com/cdn-cgi/trace',
        extract: (data: string) => {
          const lines = data.split('\n');
          const locLine = lines.find(line => line.startsWith('loc='));
          return locLine ? locLine.split('=')[1] : null;
        }
      },
      {
        name: 'ipapi',
        url: 'https://ipapi.co/json/',
        extract: (data: any) => data.country_code
      },
      {
        name: 'ipinfo',
        url: 'https://ipinfo.io/json',
        extract: (data: any) => data.country
      },
      {
        name: 'bigdatacloud',
        url: 'https://api.bigdatacloud.net/data/ip-geolocation',
        extract: (data: any) => data.country?.isoAlpha2
      }
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const detectCountry = async () => {
      console.log('🌍 Iniciando detección robusta de país...');
      
      // Primero verificar si ya tenemos un país guardado y es reciente
      const savedCountry = localStorage.getItem('userCountry');
      const savedTimestamp = localStorage.getItem('userCountryTimestamp');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

      if (savedCountry && savedTimestamp && (now - parseInt(savedTimestamp)) < oneHour) {
        console.log(`✅ Usando país guardado (válido por 1h): ${savedCountry}`);
        setUserCountry(savedCountry.toUpperCase());
        setLoading(false);
        return;
      }

      let detected = false;
      let retries = 0;
      const maxRetries = 3;
      let bestGuess = null;
      const detectionResults: { service: string; country: string | null; confidence: number }[] = [];

      while (!detected && retries < maxRetries) {
        console.log(`🔄 Intento ${retries + 1} de detección de país...`);
        
        for (const service of geoServices) {
          if (detected) break;

          try {
            console.log(`🌐 Consultando ${service.name}...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // Aumentado a 8 segundos

            const response = await fetch(service.url, {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              },
              cache: 'no-store'
            });

            clearTimeout(timeoutId);

            if (!response.ok && service.name !== 'cloudflare') {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = service.name === 'cloudflare' 
              ? await response.text() 
              : await response.json();

            const countryCode = service.extract(data);

            if (countryCode && countryCode.length === 2) {
              const upperCountry = countryCode.toUpperCase();
              console.log(`✅ ${service.name} detectó: ${upperCountry}`);
              
              // Asignar confianza basada en el servicio
              let confidence = 1;
              if (service.name === 'cloudflare') confidence = 0.9; // Cloudflare es muy confiable
              if (service.name === 'ipapi') confidence = 0.8;
              if (service.name === 'ipinfo') confidence = 0.7;
              if (service.name === 'bigdatacloud') confidence = 0.6;

              detectionResults.push({
                service: service.name,
                country: upperCountry,
                confidence
              });

              // Si es un servicio de alta confianza, usar inmediatamente
              if (confidence >= 0.8) {
                console.log(`🎯 Alta confianza con ${service.name}, usando: ${upperCountry}`);
                localStorage.setItem('userCountry', upperCountry);
                localStorage.setItem('userCountryTimestamp', now.toString());
                setUserCountry(upperCountry);
                detected = true;
                break;
              } else if (!bestGuess || confidence > bestGuess.confidence) {
                bestGuess = { country: upperCountry, confidence, service: service.name };
              }
            } else {
              console.warn(`⚠️ ${service.name} devolvió código inválido:`, countryCode);
            }
          } catch (error) {
            console.warn(`❌ Error con ${service.name}:`, error instanceof Error ? error.message : error);
            continue;
          }

          // Pequeña pausa entre servicios para evitar rate limiting
          await delay(500);
        }

        if (!detected) {
          retries++;
          if (retries < maxRetries) {
            console.log(`⏳ Esperando 3 segundos antes del siguiente intento...`);
            await delay(3000);
          }
        }
      }

      // Si no se detectó con alta confianza, usar la mejor opción disponible
      if (!detected && bestGuess) {
        console.log(`🤔 Usando mejor estimación: ${bestGuess.country} (${bestGuess.service}, confianza: ${bestGuess.confidence})`);
        localStorage.setItem('userCountry', bestGuess.country);
        localStorage.setItem('userCountryTimestamp', now.toString());
        setUserCountry(bestGuess.country);
        detected = true;
      }

      // Consenso entre múltiples servicios
      if (!detected && detectionResults.length > 1) {
        const countryVotes: { [key: string]: number } = {};
        detectionResults.forEach(result => {
          if (result.country) {
            countryVotes[result.country] = (countryVotes[result.country] || 0) + result.confidence;
          }
        });

        const winner = Object.entries(countryVotes).reduce((a, b) => a[1] > b[1] ? a : b);
        if (winner[1] > 1) { // Al menos confianza combinada > 1
          console.log(`🗳️ Consenso detectado: ${winner[0]} (puntuación: ${winner[1].toFixed(2)})`);
          localStorage.setItem('userCountry', winner[0]);
          localStorage.setItem('userCountryTimestamp', now.toString());
          setUserCountry(winner[0]);
          detected = true;
        }
      }

      // Fallback final
      if (!detected) {
        console.warn('⚠️ No se pudo detectar el país después de todos los intentos');
        
        // Intentar usar país guardado anteriormente (aunque sea viejo)
        if (savedCountry) {
          console.log(`🔄 Usando país guardado anterior: ${savedCountry}`);
          setUserCountry(savedCountry.toUpperCase());
        } else {
          // Detectar por zona horaria como último recurso
          try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneCountryMap: { [key: string]: string } = {
              'America/Argentina': 'AR',
              'America/Mexico': 'MX',
              'America/Bogota': 'CO',
              'America/Lima': 'PE',
              'America/Santiago': 'CL',
              'America/Sao_Paulo': 'BR',
              'Europe/Madrid': 'ES',
              'America/New_York': 'US',
              'America/Los_Angeles': 'US',
              'Europe/London': 'GB',
              'Europe/Paris': 'FR',
              'Europe/Berlin': 'DE',
              'Asia/Tokyo': 'JP',
              'Australia/Sydney': 'AU'
            };

            const detectedByTimezone = Object.entries(timezoneCountryMap).find(([tz]) => 
              timezone.includes(tz.split('/')[1])
            );

            if (detectedByTimezone) {
              console.log(`🕐 Detectado por zona horaria: ${detectedByTimezone[1]} (${timezone})`);
              setUserCountry(detectedByTimezone[1]);
            } else {
              console.log('🌐 Usando fallback global');
              setUserCountry('GLOBAL');
            }
          } catch (timezoneError) {
            console.warn('Error detectando por zona horaria:', timezoneError);
            setUserCountry('GLOBAL');
          }
        }
      }

      console.log('📊 Resumen de detección:', {
        detected,
        attempts: retries + 1,
        services: detectionResults.length,
        finalCountry: userCountry
      });

      setLoading(false);
    };

    detectCountry();

    return () => {
      // Cleanup si es necesario
      setLoading(false);
    };
  }, []);

  // Debug: mostrar información de las ofertas cuando se cargan
  useEffect(() => {
    if (offers.length > 0) {
      console.log('=== TAREAS CARGADAS PARA TU UBICACIÓN ===');
      console.log(`Total de tareas: ${offers.length}`);
      console.log('País detectado:', userCountry);
      
      // Mostrar muestra de las primeras 3 ofertas
      offers.slice(0, 3).forEach((offer, index) => {
        console.log(`Tarea ${index + 1}:`, {
          id: offer.id,
          title: offer.title,
          country: offer.country,
          device: offer.device,
          amount: offer.amount,
          currency: offer.payout_currency
        });
      });
      
      console.log('=======================================');
    }
  }, [offers, userCountry]);

  // Sistema robusto de filtrado de ofertas por país
  const filteredOffers = useMemo(() => {
    console.log('🔍 Iniciando filtrado de ofertas...');
    console.log(`País detectado: ${userCountry}`);
    console.log(`Total ofertas recibidas: ${offers.length}`);

    // Si no hay país detectado, mostrar mensaje de carga
    if (!userCountry) {
      console.log('⏳ País no detectado aún, mostrando todas las ofertas temporalmente');
      return offers;
    }

    // Mapeo de códigos de país para mejorar la compatibilidad
    const countryMappings: { [key: string]: string[] } = {
      'AR': ['ar', 'argentina', 'arg'],
      'US': ['us', 'usa', 'united states', 'america'],
      'MX': ['mx', 'mexico', 'méxico'],
      'CO': ['co', 'colombia'],
      'PE': ['pe', 'peru', 'perú'],
      'CL': ['cl', 'chile'],
      'BR': ['br', 'brazil', 'brasil'],
      'ES': ['es', 'spain', 'españa'],
      'UK': ['uk', 'gb', 'united kingdom', 'england'],
      'CA': ['ca', 'canada'],
      'AU': ['au', 'australia'],
      'DE': ['de', 'germany', 'deutschland'],
      'FR': ['fr', 'france'],
      'IT': ['it', 'italy', 'italia'],
      'NL': ['nl', 'netherlands', 'holland'],
      'BE': ['be', 'belgium'],
      'PT': ['pt', 'portugal'],
      'IN': ['in', 'india'],
      'PH': ['ph', 'philippines'],
      'TH': ['th', 'thailand'],
      'VN': ['vn', 'vietnam'],
      'ID': ['id', 'indonesia'],
      'MY': ['my', 'malaysia'],
      'SG': ['sg', 'singapore'],
      'JP': ['jp', 'japan'],
      'KR': ['kr', 'korea', 'south korea'],
      'CN': ['cn', 'china'],
      'TW': ['tw', 'taiwan'],
      'HK': ['hk', 'hong kong'],
      'ZA': ['za', 'south africa'],
      'EG': ['eg', 'egypt'],
      'NG': ['ng', 'nigeria'],
      'KE': ['ke', 'kenya'],
      'GH': ['gh', 'ghana']
    };

    // Obtener variaciones del país del usuario
    const userCountryVariations = countryMappings[userCountry.toUpperCase()] || [userCountry.toLowerCase()];
    userCountryVariations.push(userCountry.toLowerCase(), userCountry.toUpperCase());

    console.log(`🌍 Variaciones de país para ${userCountry}:`, userCountryVariations);

    const filtered = offers.filter(offer => {
      // Si no hay país especificado en la oferta, verificar si es realmente global
      if (!offer.country || offer.country.trim() === '') {
        console.log(`🌐 Oferta sin país específico (global): ${offer.title.substring(0, 30)}...`);
        return true; // Incluir ofertas globales
      }

      const offerCountry = offer.country.toLowerCase().trim();
      
      // Lista expandida de valores que indican ofertas globales
      const globalValues = [
        'all', 'all_countries', 'worldwide', 'global', '*', 'international',
        'any', 'universal', 'multi', 'multiple', 'various', 'mixed',
        'tier1', 'tier2', 'tier3', 'tier 1', 'tier 2', 'tier 3',
        'english', 'spanish', 'portuguese', 'french', 'german'
      ];

      // Verificar si es una oferta global
      if (globalValues.some(global => offerCountry.includes(global))) {
        console.log(`🌐 Oferta global detectada: ${offer.title.substring(0, 30)}... (${offer.country})`);
        return true;
      }

      // Verificar coincidencia exacta con el país del usuario
      const isMatch = userCountryVariations.some(variation => 
        offerCountry === variation || 
        offerCountry.includes(variation) ||
        variation.includes(offerCountry)
      );

      if (isMatch) {
        console.log(`✅ Oferta para ${userCountry}: ${offer.title.substring(0, 30)}... (${offer.country})`);
      } else {
        console.log(`❌ Oferta no compatible: ${offer.title.substring(0, 30)}... (${offer.country}) - Usuario: ${userCountry}`);
      }

      return isMatch;
    });

    // Estadísticas de filtrado
    console.log('📊 Estadísticas de filtrado:');
    console.log(`  - Ofertas totales: ${offers.length}`);
    console.log(`  - Ofertas filtradas: ${filtered.length}`);
    console.log(`  - Porcentaje mostrado: ${offers.length > 0 ? ((filtered.length / offers.length) * 100).toFixed(1) : 0}%`);

    // Mostrar países únicos en las ofertas para debug
    const uniqueCountries = [...new Set(offers.map(o => o.country).filter(Boolean))];
    console.log(`  - Países disponibles en ofertas:`, uniqueCountries);

    // Si no hay ofertas para el país específico, mostrar ofertas globales como fallback
    if (filtered.length === 0) {
      console.log('🔄 No hay ofertas específicas para el país, mostrando ofertas globales...');
      const globalOffers = offers.filter(offer => {
        if (!offer.country || offer.country.trim() === '') return true;
        const offerCountry = offer.country.toLowerCase().trim();
        const globalValues = ['all', 'worldwide', 'global', '*', 'international'];
        return globalValues.some(global => offerCountry.includes(global));
      });
      
      console.log(`🌐 Ofertas globales encontradas: ${globalOffers.length}`);
      return globalOffers;
    }

    return filtered;
  }, [offers, userCountry]);



  // Función para formatear el dispositivo
  const formatDevice = (device: string): string => {
    if (!device) return device;
    
    const deviceMap: { [key: string]: string } = {
      'all_devices': 'todos',
      'all': 'todos',
      'mobile': 'móvil',
      'desktop': 'escritorio',
      'tablet': 'tablet',
      'android': 'Android',
      'ios': 'iOS',
      'iphone': 'iPhone',
      'ipad': 'iPad'
    };
    
    return deviceMap[device.toLowerCase()] || device;
  };

  // Función para generar enlace con subid
  const generateTrackingLink = (originalLink: string): string => {
    if (!user?.id) {
      console.warn('CPALead: Usuario no autenticado, no se puede agregar subid');
      return originalLink;
    }
    
    const separator = originalLink.includes('?') ? '&' : '?';
    const trackingLink = `${originalLink}${separator}subid=${user.id}`;
    
    // Debug: mostrar en consola
    console.log('CPALead Tracking:', {
      originalLink,
      userId: user.id,
      trackingLink
    });
    
    return trackingLink;
  };

  if (loading || premiumLoading) {
    return (
      <div className="text-center py-12">
        <div 
          className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" 
          style={{ 
            backgroundColor: '#101010',
            animation: 'pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        >
          <Globe className="w-12 h-12 text-muted-foreground animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {loading ? 'Analizando microtareas disponibles' : 'Verificando tu ubicación'}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Cargando microtareas...
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2 bg-[#2a2a2a] border-[#404040] text-white hover:bg-[#1f1f1f] hover:border-[#505050] hover:text-white transition-all duration-200"
        >
          Actualizar página
        </Button>
      </div>
    );
  }

  if (!offers || offers.length === 0 || (userCountry && userCountry !== 'GLOBAL' && filteredOffers.length === 0)) {
    // Obtener nombre del país para mostrar
    const countryNames: { [key: string]: string } = {
      'AR': 'Argentina', 'US': 'Estados Unidos', 'MX': 'México', 'CO': 'Colombia',
      'PE': 'Perú', 'CL': 'Chile', 'BR': 'Brasil', 'ES': 'España', 'UK': 'Reino Unido',
      'CA': 'Canadá', 'AU': 'Australia', 'DE': 'Alemania', 'FR': 'Francia', 'IT': 'Italia'
    };
    
    const countryName = userCountry ? (countryNames[userCountry] || userCountry) : 'tu ubicación';
    
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Tag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {userCountry && userCountry !== 'GLOBAL' ? `Microtareas para ${countryName}` : 'Microtareas disponibles'}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          {userCountry && userCountry !== 'GLOBAL'
            ? `No hay tareas específicas disponibles para ${countryName} en este momento. Nuestro sistema está buscando nuevas oportunidades para tu región.`
            : 'Detectando tu ubicación para mostrarte las mejores oportunidades disponibles...'
          }
        </p>
        
        {userCountry && userCountry !== 'GLOBAL' && (
          <div className="mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="bg-[#2a2a2a] border-[#404040] text-white hover:bg-[#1f1f1f] hover:border-[#505050] hover:text-white transition-all duration-200"
            >
              Buscar nuevas ofertas
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Mensaje si no hay ofertas filtradas */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Tag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay tareas disponibles
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No se encontraron tareas para tu ubicación en este momento. Inténtalo de nuevo más tarde.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer, index) => {
            const isLocked = shouldLockCard(offer, isPremium);
            
            return (
              <li key={offer.id} className="group">
                {/* Tarjeta de oferta con overlay premium */}
                <PremiumCardOverlay
                  isLocked={isLocked}
                  onUnlockClick={() => handleUpgradeClick()}
                  customMessage={formatPremiumMessage(offer)}
                  showShimmer={true}
                  blurIntensity="medium"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-[#101010]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {offer.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center space-x-1 text-gray-400" id="country-info-mobile">
                          <Globe className="w-3 h-3 text-white" />
                          <span className="text-xs">--</span>
                        </div>
                      </div>
                    </div>
                    
                    {offer.creatives?.url && (
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={offer.creatives.url}
                            alt={`${offer.title} - Imagen de la tarea`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="64px"
                            onError={(e) => {
                              // Ocultar imagen si falla la carga
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {offer.description || 'Completa esta tarea para ganar dinero fácilmente.'}
                  </CardDescription>

                  {/* Información adicional */}
                  <div className="space-y-2 mb-4">
                    {offer.device && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        <span>Dispositivo: {formatDevice(offer.device)}</span>
                      </div>
                    )}
                    
                    {offer.category && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        <span>Categoría: {offer.category}</span>
                      </div>
                    )}

                    {offer.requirements && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                            <strong>Requisitos:</strong> {offer.requirements}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{offer.requirements}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {/* Botón de acción */}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group-hover:shadow-md"
                    >
                      <a
                        href={generateTrackingLink(offer.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>Iniciar</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>

                  {/* Indicador de ganancia destacada */}
                  <div className="mt-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                      <DollarSign className="w-4 h-4" />
                      <span>Gana {offer.amount} {offer.payout_currency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </PremiumCardOverlay>
            </li>
            );
          })}
          </ul>
        )}

        {/* Información de actualización */}
        <div className="mt-8 p-4 bg-[#101010] rounded-lg border border-border/50">
          <div className="text-center">
            <p className="text-sm text-gray-300 font-medium">
              Las microtareas se actualizan automáticamente. Revise periódicamente para acceder a nuevas oportunidades de ingresos.
            </p>
          </div>
        </div>


      </div>
    </TooltipProvider>
  );
};

export default OffersList;