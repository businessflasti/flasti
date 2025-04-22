'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LocationBadge = () => {
  const { language } = useLanguage();
  const [locationData, setLocationData] = useState({
    country: '',
    countryCode: '',
    city: '',
    time: '',
    loading: true,
    error: false
  });

  useEffect(() => {
    // Función para actualizar la hora local cada minuto
    const updateLocalTime = (timezone?: string) => {
      try {
        let timeString;
        if (timezone) {
          // Si tenemos una zona horaria, intentar usarla
          const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone
          };
          timeString = new Date().toLocaleTimeString(navigator.language, options);
        } else {
          // Si no hay zona horaria, usar la hora local del navegador
          timeString = new Date().toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }

        setLocationData(prev => ({
          ...prev,
          time: timeString
        }));
      } catch (error) {
        console.error('Error al actualizar la hora:', error);
        // En caso de error, usar formato simple
        const simpleTime = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        setLocationData(prev => ({ ...prev, time: simpleTime }));
      }
    };

    // Obtener la ubicación del usuario
    const fetchLocation = async () => {
      try {
        // Primero establecer una ubicación predeterminada para mostrar algo rápidamente
        setLocationData({
          country: 'Global',
          countryCode: 'global',
          city: '',
          time: new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', hour12: true }),
          loading: false,
          error: false
        });

        // Luego intentar obtener la ubicación real
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Error al obtener la ubicación');

        const data = await response.json();

        setLocationData({
          country: data.country_name,
          countryCode: data.country_code.toLowerCase(),
          city: data.city || '',
          time: new Date().toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: data.timezone
          }),
          loading: false,
          error: false
        });

        // Configurar intervalo para actualizar la hora con la zona horaria correcta
        const interval = setInterval(() => updateLocalTime(data.timezone), 60000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocationData({
          country: 'Global',
          countryCode: 'global',
          city: '',
          time: new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit', hour12: true }),
          loading: false,
          error: true
        });

        // Actualizar la hora local sin zona horaria específica
        const interval = setInterval(() => updateLocalTime(), 60000);
        return () => clearInterval(interval);
      }
    };

    // Iniciar la obtención de datos
    const cleanup = fetchLocation();

    // Limpiar intervalos cuando el componente se desmonte
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [language]);

  return (
    <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
      {locationData.loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-foreground/20 animate-pulse"></div>
          <span className="text-foreground/60">
            {language === 'es' ? 'Detectando ubicación...' :
             language === 'en' ? 'Detecting location...' :
             'Detectando localização...'}
          </span>
        </div>
      ) : locationData.error ? (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#9333ea]" />
          <span className="text-foreground/80">
            {language === 'es' ? 'Acceso Global' :
             language === 'en' ? 'Global Access' :
             'Acesso Global'}
          </span>
          {locationData.time && (
            <span className="text-foreground/60 border-l border-foreground/20 pl-2">{locationData.time}</span>
          )}
        </div>
      ) : (
        <>
          <div className="w-5 h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10 flex items-center justify-center bg-primary/10">
            {locationData.countryCode && locationData.countryCode !== 'global' ? (
              <img
                src={`https://flagcdn.com/w20/${locationData.countryCode}.png`}
                alt={locationData.country}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si hay error al cargar la bandera, mostrar un globo
                  e.currentTarget.style.display = 'none';
                  const globe = document.createElement('span');
                  globe.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#9333ea]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                  e.currentTarget.parentElement?.appendChild(globe);
                }}
              />
            ) : (
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9333ea]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </span>
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
