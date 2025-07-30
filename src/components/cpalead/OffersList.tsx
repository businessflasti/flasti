"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import { ExternalLink, DollarSign, Globe, Tag } from 'lucide-react';
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

  // Debug: mostrar información de las ofertas cuando se cargan
  useEffect(() => {
    if (offers.length > 0) {
      console.log('=== TAREAS CARGADAS PARA TU UBICACIÓN ===');
      console.log(`Total de tareas: ${offers.length}`);
      
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
  }, [offers]);

  // Sin filtros - mostrar todas las tareas que envía CPALead
  const filteredOffers = offers;



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
          No se encontraron tareas en este momento. Por favor, inténtalo de nuevo más tarde.
        </p>
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
          {filteredOffers.map((offer, index) => (
            <li key={offer.id} className="group">
              {/* Tarjeta de oferta */}
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 bg-[#101010]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {offer.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs px-3 py-1 flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3" />
                          {offer.amount} {offer.payout_currency}
                        </Badge>
                        {offer.country && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {offer.country}
                          </Badge>
                        )}
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
            </li>
          ))}
          </ul>
        )}

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