"use client";

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationData {
  country: string;
  countryCode: string;
  city?: string;
  timezone?: string;
}

export default function LocationBadge() {
  const { t } = useLanguage();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [localTime, setLocalTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);
        
        // Intentar obtener la ubicación del usuario
        // En producción, esto se conectaría a un servicio de geolocalización
        
        // Simulación de detección de ubicación
        const detectedLocation: LocationData = {
          country: 'Argentina',
          countryCode: 'AR',
          city: 'Buenos Aires',
          timezone: 'America/Argentina/Buenos_Aires'
        };
        
        setLocation(detectedLocation);
        
        // Actualizar la hora local
        updateLocalTime(detectedLocation.timezone);
        
        // Configurar intervalo para actualizar la hora cada minuto
        const interval = setInterval(() => {
          updateLocalTime(detectedLocation.timezone);
        }, 60000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error al detectar ubicación:', error);
        // Establecer ubicación predeterminada en caso de error
        setLocation({
          country: 'Global',
          countryCode: 'GLOBAL'
        });
      } finally {
        setLoading(false);
      }
    };
    
    detectLocation();
  }, []);
  
  // Función para actualizar la hora local
  const updateLocalTime = (timezone?: string) => {
    try {
      const now = new Date();
      let timeString = '';
      
      if (timezone) {
        // Formatear la hora según la zona horaria detectada
        timeString = now.toLocaleTimeString('es-ES', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        // Usar la hora local del navegador como respaldo
        timeString = now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      setLocalTime(timeString);
    } catch (error) {
      console.error('Error al actualizar hora local:', error);
      // Usar la hora local del navegador como respaldo
      const fallbackTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setLocalTime(fallbackTime);
    }
  };
  
  // Si está cargando, mostrar un placeholder
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground/60 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-foreground/20"></div>
        <div className="w-24 h-4 rounded bg-foreground/20"></div>
      </div>
    );
  }
  
  // Si no se pudo detectar la ubicación
  if (!location) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 text-sm text-foreground/60 hardware-accelerated">
      <MapPin size={16} className="text-primary" />
      <span>
        {location.city ? `${location.city}, ` : ''}
        {location.country} • {localTime}
      </span>
    </div>
  );
}
