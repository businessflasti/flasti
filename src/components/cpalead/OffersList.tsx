"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { CPALeadOffer } from '@/lib/cpa-lead-api';
import { ExternalLink, DollarSign, Globe, Smartphone, Tag, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface OffersListProps {
  offers: CPALeadOffer[];
}

const OffersList: React.FC<OffersListProps> = ({ offers }) => {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [userCountry, setUserCountry] = useState<string>('US');
  const [userDevice, setUserDevice] = useState<string>('desktop');

  // Detectar país y dispositivo del usuario
  useEffect(() => {
    const detectUserInfo = async () => {
      try {
        // Detectar dispositivo
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(navigator.userAgent);
        
        let detectedDevice = 'desktop';
        if (isTablet) {
          detectedDevice = 'tablet';
        } else if (isMobile) {
          detectedDevice = 'mobile';
        }
        
        setUserDevice(detectedDevice);
        
        // Detectar país usando API de geolocalización
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          const countryCode = data.country_code || 'US';
          
          // Verificar si hay ofertas para este país
          const hasOffersForCountry = offers.some(offer => 
            offer.country?.toUpperCase() === countryCode.toUpperCase()
          );
          
          const finalCountry = hasOffersForCountry ? countryCode : 'US';
          setUserCountry(finalCountry);
          setSelectedCountry(finalCountry);
          
          console.log('Detección automática:', {
            detectedCountry: countryCode,
            finalCountry,
            hasOffersForCountry,
            detectedDevice
          });
          
        } catch (error) {
          console.log('Error detectando país, usando US por defecto:', error);
          setUserCountry('US');
          setSelectedCountry('US');
        }
        
        setSelectedDevice(detectedDevice);
        
      } catch (error) {
        console.error('Error en detección automática:', error);
      }
    };

    if (offers.length > 0) {
      detectUserInfo();
    }
  }, [offers]);

  // Obtener países únicos de las ofertas
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    offers.forEach(offer => {
      if (offer.country) {
        countries.add(offer.country);
      }
    });
    return Array.from(countries).sort();
  }, [offers]);

  // Obtener dispositivos únicos de las ofertas
  const availableDevices = useMemo(() => {
    const devices = new Set<string>();
    offers.forEach(offer => {
      if (offer.device) {
        devices.add(offer.device);
      }
    });
    return Array.from(devices).sort();
  }, [offers]);

  // Filtrar ofertas según selección
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const countryMatch = selectedCountry === 'all' || 
        offer.country?.toUpperCase() === selectedCountry.toUpperCase();
      
      const deviceMatch = selectedDevice === 'all' || 
        offer.device?.toLowerCase() === selectedDevice.toLowerCase() ||
        offer.device?.toLowerCase() === 'all_devices';
      
      return countryMatch && deviceMatch;
    });
  }, [offers, selectedCountry, selectedDevice]);

  // Mapeo de códigos de país a nombres
  const countryNames: { [key: string]: string } = {
    'US': 'Estados Unidos',
    'CA': 'Canadá',
    'GB': 'Reino Unido',
    'AU': 'Australia',
    'DE': 'Alemania',
    'FR': 'Francia',
    'ES': 'España',
    'IT': 'Italia',
    'BR': 'Brasil',
    'MX': 'México',
    'AR': 'Argentina',
    'CL': 'Chile',
    'CO': 'Colombia',
    'PE': 'Perú'
  };

  // Mapeo de dispositivos a nombres en español
  const deviceNames: { [key: string]: string } = {
    'mobile': 'Móvil',
    'desktop': 'Escritorio',
    'tablet': 'Tablet',
    'all_devices': 'Todos los dispositivos',
    'android': 'Android',
    'ios': 'iOS',
    'iphone': 'iPhone',
    'ipad': 'iPad'
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



  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Sistema de filtros */}
        <div className="bg-[#101010] rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
            {(selectedCountry !== 'all' || selectedDevice !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCountry('all');
                  setSelectedDevice('all');
                }}
                className="text-xs text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filtro por país */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                País
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-[#232323] border-border/50 text-white">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent className="bg-[#232323] border-border/50">
                  <SelectItem value="all" className="text-white hover:bg-[#333]">
                    Todos los países
                  </SelectItem>
                  {availableCountries.map(country => (
                    <SelectItem 
                      key={country} 
                      value={country}
                      className="text-white hover:bg-[#333]"
                    >
                      {countryNames[country] || country}
                      {country === userCountry && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Tu país
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por dispositivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Dispositivo
              </label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="bg-[#232323] border-border/50 text-white">
                  <SelectValue placeholder="Seleccionar dispositivo" />
                </SelectTrigger>
                <SelectContent className="bg-[#232323] border-border/50">
                  <SelectItem value="all" className="text-white hover:bg-[#333]">
                    Todos los dispositivos
                  </SelectItem>
                  {availableDevices.map(device => (
                    <SelectItem 
                      key={device} 
                      value={device}
                      className="text-white hover:bg-[#333]"
                    >
                      {deviceNames[device] || device}
                      {device === userDevice && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Tu dispositivo
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>
              Mostrando {filteredOffers.length} de {offers.length} ofertas
            </span>
            {(selectedCountry !== 'all' || selectedDevice !== 'all') && (
              <div className="flex items-center gap-2">
                {selectedCountry !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {countryNames[selectedCountry] || selectedCountry}
                  </Badge>
                )}
                {selectedDevice !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {deviceNames[selectedDevice] || selectedDevice}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mensaje si no hay ofertas filtradas */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay ofertas disponibles
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              No se encontraron ofertas que coincidan con los filtros seleccionados.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCountry('all');
                setSelectedDevice('all');
              }}
            >
              Ver todas las ofertas
            </Button>
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
                            alt={`${offer.title} - Imagen de la oferta`}
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
                    {offer.description || 'Completa esta oferta para ganar dinero fácilmente.'}
                  </CardDescription>

                  {/* Información adicional */}
                  <div className="space-y-2 mb-4">
                    {offer.device && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Smartphone className="w-3 h-3" />
                        <span>Dispositivo: {formatDeviceText(offer.device)}</span>
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