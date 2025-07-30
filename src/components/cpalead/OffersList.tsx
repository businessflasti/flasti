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

  // Debug: mostrar información de las ofertas cuando se cargan
  useEffect(() => {
    if (offers.length > 0) {
      console.log('=== OFERTAS CARGADAS ===');
      console.log(`Total de ofertas: ${offers.length}`);
      
      // Mostrar muestra de las primeras 3 ofertas
      offers.slice(0, 3).forEach((offer, index) => {
        console.log(`Oferta ${index + 1}:`, {
          id: offer.id,
          title: offer.title,
          country: offer.country,
          device: offer.device,
          amount: offer.amount,
          currency: offer.payout_currency
        });
      });
      
      // Mostrar países únicos
      const uniqueCountries = [...new Set(offers.map(o => o.country).filter(Boolean))];
      console.log('Países únicos en ofertas:', uniqueCountries);
      
      // Mostrar dispositivos únicos
      const uniqueDevices = [...new Set(offers.map(o => o.device).filter(Boolean))];
      console.log('Dispositivos únicos en ofertas:', uniqueDevices);
      
      console.log('========================');
    }
  }, [offers]);

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
      if (offer.country && offer.country.trim() !== '') {
        countries.add(offer.country.toUpperCase());
      }
    });
    const sortedCountries = Array.from(countries).sort();
    console.log('Países disponibles en ofertas:', sortedCountries);
    return sortedCountries;
  }, [offers]);

  // Obtener dispositivos únicos de las ofertas
  const availableDevices = useMemo(() => {
    const devices = new Set<string>();
    offers.forEach(offer => {
      if (offer.device && offer.device.trim() !== '') {
        devices.add(offer.device.toLowerCase());
      }
    });
    const sortedDevices = Array.from(devices).sort();
    console.log('Dispositivos disponibles en ofertas:', sortedDevices);
    return sortedDevices;
  }, [offers]);

  // Filtrar ofertas según selección
  const filteredOffers = useMemo(() => {
    const filtered = offers.filter(offer => {
      // Filtro por país
      const countryMatch = selectedCountry === 'all' || 
        (offer.country && offer.country.toUpperCase() === selectedCountry.toUpperCase());
      
      // Filtro por dispositivo
      const deviceMatch = selectedDevice === 'all' || 
        (offer.device && (
          offer.device.toLowerCase() === selectedDevice.toLowerCase() ||
          offer.device.toLowerCase() === 'all_devices' ||
          offer.device.toLowerCase() === 'all'
        ));
      
      return countryMatch && deviceMatch;
    });
    
    console.log(`Filtros aplicados - País: ${selectedCountry}, Dispositivo: ${selectedDevice}`);
    console.log(`Ofertas filtradas: ${filtered.length} de ${offers.length}`);
    
    return filtered;
  }, [offers, selectedCountry, selectedDevice]);

  // Mapeo de códigos de país a nombres (más completo)
  const countryNames: { [key: string]: string } = {
    'US': 'Estados Unidos',
    'CA': 'Canadá',
    'GB': 'Reino Unido',
    'UK': 'Reino Unido',
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
    'PE': 'Perú',
    'VE': 'Venezuela',
    'EC': 'Ecuador',
    'BO': 'Bolivia',
    'UY': 'Uruguay',
    'PY': 'Paraguay',
    'CR': 'Costa Rica',
    'PA': 'Panamá',
    'GT': 'Guatemala',
    'HN': 'Honduras',
    'SV': 'El Salvador',
    'NI': 'Nicaragua',
    'DO': 'República Dominicana',
    'CU': 'Cuba',
    'PR': 'Puerto Rico',
    'IN': 'India',
    'CN': 'China',
    'JP': 'Japón',
    'KR': 'Corea del Sur',
    'TH': 'Tailandia',
    'VN': 'Vietnam',
    'PH': 'Filipinas',
    'ID': 'Indonesia',
    'MY': 'Malasia',
    'SG': 'Singapur',
    'RU': 'Rusia',
    'PL': 'Polonia',
    'NL': 'Países Bajos',
    'BE': 'Bélgica',
    'CH': 'Suiza',
    'AT': 'Austria',
    'SE': 'Suecia',
    'NO': 'Noruega',
    'DK': 'Dinamarca',
    'FI': 'Finlandia',
    'PT': 'Portugal',
    'IE': 'Irlanda',
    'ZA': 'Sudáfrica',
    'EG': 'Egipto',
    'NG': 'Nigeria',
    'KE': 'Kenia',
    'MA': 'Marruecos',
    'TN': 'Túnez',
    'DZ': 'Argelia',
    'IL': 'Israel',
    'TR': 'Turquía',
    'SA': 'Arabia Saudí',
    'AE': 'Emiratos Árabes Unidos',
    'QA': 'Qatar',
    'KW': 'Kuwait',
    'BH': 'Baréin',
    'OM': 'Omán',
    'JO': 'Jordania',
    'LB': 'Líbano',
    'SY': 'Siria',
    'IQ': 'Irak',
    'IR': 'Irán',
    'PK': 'Pakistán',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'NP': 'Nepal',
    'MM': 'Myanmar',
    'KH': 'Camboya',
    'LA': 'Laos',
    'MN': 'Mongolia',
    'KZ': 'Kazajistán',
    'UZ': 'Uzbekistán',
    'TM': 'Turkmenistán',
    'KG': 'Kirguistán',
    'TJ': 'Tayikistán',
    'AF': 'Afganistán'
  };

  // Mapeo de dispositivos a nombres en español
  const deviceNames: { [key: string]: string } = {
    'mobile': 'Móvil',
    'desktop': 'Escritorio',
    'tablet': 'Tablet',
    'all_devices': 'Todos los dispositivos',
    'all': 'Todos los dispositivos',
    'android': 'Android',
    'ios': 'iOS',
    'iphone': 'iPhone',
    'ipad': 'iPad',
    'windows': 'Windows',
    'mac': 'Mac',
    'linux': 'Linux'
  };

  // Función para obtener el nombre del país
  const getCountryName = (countryCode: string): string => {
    return countryNames[countryCode.toUpperCase()] || countryCode.toUpperCase();
  };

  // Función para obtener el nombre del dispositivo
  const getDeviceName = (deviceCode: string): string => {
    return deviceNames[deviceCode.toLowerCase()] || deviceCode;
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
                      {getCountryName(country)}
                      {country.toUpperCase() === userCountry.toUpperCase() && (
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
                      {getDeviceName(device)}
                      {device.toLowerCase() === userDevice.toLowerCase() && (
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
                    {getCountryName(selectedCountry)}
                  </Badge>
                )}
                {selectedDevice !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {getDeviceName(selectedDevice)}
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