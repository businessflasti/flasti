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

  // Función para crear array con ofertas y anuncios intercalados
  const createMixedArray = (offers: CPALeadOffer[]) => {
    const mixedArray: (CPALeadOffer | { type: 'ad', id: string })[] = [];
    
    offers.forEach((offer, index) => {
      mixedArray.push(offer);
      
      // Insertar anuncio después de cada 3 ofertas (posiciones 4, 8, 12, etc.)
      if ((index + 1) % 3 === 0 && index < offers.length - 1) {
        const adId = `ad-${Math.floor(index / 3)}`;
        mixedArray.push({ type: 'ad', id: adId });
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

  // Componente para tarjeta de anuncio - VERSIÓN SIMPLE
  const AdCard: React.FC<{ adId: string }> = ({ adId }) => {
    const adInsRef = useRef<HTMLModElement>(null);

    useEffect(() => {
      // Inicializar AdSense después de que el componente se monte
      const timer = setTimeout(() => {
        try {
          if (window.adsbygoogle && adInsRef.current) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (err) {
          console.error('Error inicializando AdSense:', err);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

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
          {/* Área del anuncio AdSense - SIMPLE */}
          <div className="w-full bg-white rounded-lg flex items-center justify-center" style={{ minHeight: '280px' }}>
            <ins
              ref={adInsRef}
              className="adsbygoogle"
              style={{
                display: 'inline-block',
                width: '300px',
                height: '250px'
              }}
              data-ad-client="ca-pub-8330194041691289"
              data-ad-slot="9313483236"
              data-ad-format="rectangle"
            />
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