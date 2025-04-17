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
        // Establecer una ubicación predeterminada para evitar errores
        setLocationData({
          country: 'Global',
          countryCode: 'global',
          city: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' hs',
          loading: false,
          error: false
        });

        // Intentar obtener la ubicación real
        try {
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
            country: data.country_name || 'Global',
            countryCode: data.country_code ? data.country_code.toLowerCase() : 'global',
            city: data.city || '',
            time: timeString,
            loading: false,
            error: false
          });
        } catch (error) {
          console.error('Error al obtener la ubicación:', error);
          // Ya tenemos una ubicación predeterminada, así que no necesitamos hacer nada más
        }

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
        console.error('Error general:', error);
        setLocationData({
          country: 'Global',
          countryCode: 'global',
          city: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' hs',
          loading: false,
          error: true
        });
      }
    };

    getLocation();
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
      {locationData.loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-foreground/20 animate-pulse"></div>
          <span className="text-foreground/60">Detectando ubicación...</span>
        </div>
      ) : (
        <>
          <div className="w-5 h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10 flex items-center justify-center bg-primary/10">
            {locationData.countryCode && locationData.countryCode !== 'global' ? (
              <img
                src={`https://flagcdn.com/w40/${locationData.countryCode}.png`}
                alt={locationData.country}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>';
                }}
              />
            ) : (
              <Globe className="h-3 w-3 text-[#9333ea]" />
            )}
          </div>
          <div className="flex items-center">
            {locationData.city ? (
              <>
                <span className="text-foreground/80">{locationData.city},</span>
                <span className="text-foreground/60 ml-1">{locationData.country}</span>
              </>
            ) : (
              <span className="text-foreground/80">{locationData.country || 'Global'}</span>
            )}
          </div>
          {locationData.time && (
            <span className="text-foreground/60 border-l border-foreground/20 pl-2">{locationData.time}</span>
          )}
        </>
      )}
    </div>
  );
};

export default LocationBadge;
