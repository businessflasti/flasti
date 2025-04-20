'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LocationBadge = () => {
  const [locationData, setLocationData] = useState({
    country: 'Global',
    countryCode: 'global',
    city: '',
    time: '',
    loading: true,
    error: false
  });

  // Efecto para establecer la ubicación predeterminada inmediatamente
  useEffect(() => {
    // Establecer una ubicación predeterminada para evitar errores
    setLocationData({
      country: 'Global',
      countryCode: 'global',
      city: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' hs',
      loading: false,
      error: false
    });

    // Configurar el intervalo para actualizar la hora cada minuto
    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) + ' hs';

        setLocationData(prev => ({
          ...prev,
          time: timeString
        }));
      } catch (error) {
        console.error('Error al actualizar la hora:', error);
      }
    };

    // Actualizar la hora inmediatamente
    updateTime();

    // Configurar el intervalo para actualizar cada minuto
    const interval = setInterval(updateTime, 60000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
      <div className="w-5 h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10 flex items-center justify-center bg-primary/10">
        <Globe className="h-3 w-3 text-[#9333ea]" />
      </div>
      <div className="flex items-center">
        <span className="text-foreground/80">Acceso global</span>
      </div>
    </div>
  );
};

export default LocationBadge;
