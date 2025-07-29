"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import { ExternalLink, DollarSign, Globe, Smartphone, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

interface OffersListProps {
  offers: CPALeadOffer[];
}

const OffersList: React.FC<OffersListProps> = ({ offers }) => {
  const { user } = useAuth();
  const [hiddenAds, setHiddenAds] = useState<Set<string>>(new Set());

  // Función para crear array con ofertas y anuncios intercalados
  const createMixedArray = (offers: CPALeadOffer[]) => {
    const mixedArray: (CPALeadOffer | { type: 'ad', id: string })[] = [];
    
    offers.forEach((offer, index) => {
      mixedArray.push(offer);
      
      // Insertar anuncio después de cada 3 ofertas (posiciones 4, 8, 12, etc.)
      if ((index + 1) % 3 === 0 && index < offers.length - 1) {
        const adId = `ad-${Math.floor(index / 3)}`;
        // Solo agregar el anuncio si no está oculto
        if (!hiddenAds.has(adId)) {
          mixedArray.push({ type: 'ad', id: adId });
        }
      }
    });
    
    return mixedArray;
  };

  // Función para formatear el texto del dispositivo
  const formatDeviceText = (device: string): string => {
    const deviceMap: { [key: string]: string } = {
      'all_devices': 'todos',
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
  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Tag className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Microtrabajos disponibles
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          No se encontraron ofertas en este momento. Por favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  // Componente para tarjeta de anuncio - LÓGICA EXACTA DE ADBLOCK
  const AdCard: React.FC<{ adId: string }> = ({ adId }) => {
    const [isAdVisible, setIsAdVisible] = useState(true);
    const [adTried, setAdTried] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const adInsRef = useRef<HTMLModElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      // Evitar múltiples inicializaciones
      if (isInitialized) return;
      setIsInitialized(true);

      // Delay antes de inicializar AdSense para evitar conflictos
      const initDelay = setTimeout(() => {
        try {
          if (adInsRef.current && !adInsRef.current.hasAttribute('data-adsbygoogle-status')) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log(`AdSense inicializado para ${adId}`);
          }
        } catch (err) {
          console.error(`AdSense error para ${adId}:`, err);
        }
      }, 500);

      // Sistema de timeout de 15 segundos (exacto como AdBlock)
      timeoutRef.current = setTimeout(() => {
        setAdTried(true);
        if (adInsRef.current) {
          const isUnfilled = adInsRef.current.dataset.adStatus === 'unfilled';
          const isEmpty = adInsRef.current.innerHTML.trim() === '' && adInsRef.current.clientHeight === 0;
          
          console.log(`Verificando anuncio ${adId}:`, {
            isUnfilled,
            isEmpty,
            innerHTML: adInsRef.current.innerHTML.substring(0, 100),
            clientHeight: adInsRef.current.clientHeight
          });
          
          if (isUnfilled || isEmpty) {
            console.log(`Anuncio ${adId} no cargó, ocultando tarjeta`);
            setIsAdVisible(false);
            // Agregar a la lista de anuncios ocultos para futuras renderizaciones
            setHiddenAds(prev => new Set([...prev, adId]));
          }
        }
      }, 15000);

      return () => {
        clearTimeout(initDelay);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [adId, isInitialized]);

    // Si el anuncio no es visible, no renderizar nada (la tarjeta desaparece completamente)
    if (!isAdVisible) return null;

    return (
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-[#101010]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-semibold text-foreground line-clamp-2">
                Publicidad
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  Anuncio
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Área del anuncio AdSense - EXACTO COMO ADBLOCK */}
          <div className="w-full bg-white rounded-lg flex items-center justify-center relative overflow-hidden" style={{ minHeight: '250px' }}>
            {/* Contenedor del anuncio con overflow controlado */}
            <div className="w-full max-w-[288px] max-h-[250px] flex justify-center items-center overflow-hidden rounded-xl">
              <ins
                ref={adInsRef}
                className="adsbygoogle"
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  width: '288px', 
                  height: '250px', 
                  margin: '0 auto',
                  overflow: 'hidden'
                }}
                data-ad-client="ca-pub-8330194041691289"
                data-ad-slot="9313483236"
              />
            </div>
            
            {/* Fallback solo si adTried y no visible */}
            {adTried && !isAdVisible && (
              <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full animate-pulse">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32" className="mb-2 opacity-40">
                  <circle cx="16" cy="16" r="14" stroke="#666" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M10 16h12" stroke="#666" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                </svg>
                <span className="text-xs text-gray-500">No hay anuncios disponibles</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">


        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {createMixedArray(offers).map((item, index) => (
            <li key={'type' in item ? item.id : item.id} className="group">
              {'type' in item ? (
                <AdCard adId={item.id} />
              ) : (
                // Tarjeta de oferta normal
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-[#101010]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs px-3 py-1 flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3" />
                            {item.amount} {item.payout_currency}
                          </Badge>
                          {item.country && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {item.country}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {item.creatives?.url && (
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={item.creatives.url}
                              alt={`${item.title} - Imagen de la oferta`}
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
                      {item.description || 'Completa esta oferta para ganar dinero fácilmente.'}
                    </CardDescription>

                    {/* Información adicional */}
                    <div className="space-y-2 mb-4">
                      {item.device && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Smartphone className="w-3 h-3" />
                          <span>Dispositivo: {formatDeviceText(item.device)}</span>
                        </div>
                      )}
                      
                      {item.category && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" />
                          <span>Categoría: {item.category}</span>
                        </div>
                      )}

                      {item.requirements && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-xs text-muted-foreground line-clamp-2 cursor-help">
                              <strong>Requisitos:</strong> {item.requirements}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{item.requirements}</p>
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
                          href={generateTrackingLink(item.link)}
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
                        <span>Gana {item.amount} {item.payout_currency}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </li>
          ))}
        </ul>

        {/* Información de actualización */}
        <div className="mt-8 p-4 bg-[#101010] rounded-lg border border-border/50">
          <div className="text-center">
            <p className="text-sm text-gray-300 font-medium">
              Los microtrabajos se actualizan automáticamente. Revise periódicamente para acceder a nuevas oportunidades de ingresos.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default OffersList;