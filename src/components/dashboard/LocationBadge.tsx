'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LocationBadge = () => {
  const [locationData, setLocationData] = useState({
    country: '',
    countryCode: '',
    city: '',
    time: '',
    loading: true,
    error: false
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Obtener la ubicación del usuario
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Error al obtener la ubicación');

        const data = await response.json();

        // Formatear la hora local
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) + ' hs';

        setLocationData({
          country: data.country_name,
          countryCode: data.country_code.toLowerCase(),
          city: data.city,
          time: timeString,
          loading: false,
          error: false
        });

        // Actualizar la hora cada minuto
        const interval = setInterval(() => {
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
        }, 60000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);

        // No mostrar nada si falla completamente la ubicación
        setLocationData({
          country: '',
          countryCode: '',
          city: '',
          time: '',
          loading: false,
          error: true
        });

        // No actualizamos la hora en caso de error
        return () => {};
      }
    };

    getLocation();
  }, []);

  // Si hay error, mostrar Acceso Global sin reloj
  if (locationData.error) {
    return (
      <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#9333ea]" />
          <span className="text-foreground/80">Acceso Global</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
      {locationData.loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-foreground/20 animate-pulse"></div>
          <span className="text-foreground/60">Detectando ubicación...</span>
        </div>
      ) : locationData.country ? (
        <>
          {locationData.countryCode && (
            <div className="w-5 h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10">
              <img
                src={`https://flagcdn.com/w40/${locationData.countryCode}.png`}
                alt={locationData.country}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center">
            {locationData.city && locationData.country ? (
              <>
                <span className="text-foreground/80">{locationData.city},</span>
                <span className="text-foreground/60 ml-1">{locationData.country}</span>
              </>
            ) : (
              <span className="text-foreground/80">{locationData.country}</span>
            )}
          </div>
          {locationData.time && (
            <span className="text-foreground/60 border-l border-foreground/20 pl-2">{locationData.time}</span>
          )}
        </>
      ) : null}
    </div>
  );
};

export default LocationBadge;
