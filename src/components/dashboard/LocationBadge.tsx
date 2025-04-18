'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Usar useRef para almacenar la zona horaria entre renderizados
  const timezoneRef = useRef(null);

  // Efecto para obtener la ubicación inicial
  useEffect(() => {
    const getLocation = async () => {
      // Establecer una ubicación predeterminada para evitar errores
      setLocationData({
        country: 'Global',
        countryCode: 'global',
        city: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ' hs',
        loading: true, // Mantener loading en true mientras intentamos obtener la ubicación real
        error: false
      });

      try {
        // Usar un timeout para la petición fetch para evitar esperas largas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

        // Intentar obtener la ubicación real usando una API alternativa más confiable
        // Primero intentamos con ipapi.co
        let response;
        let data;

        try {
          response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Error de respuesta: ${response.status}`);
          }

          data = await response.json();

          if (!data || typeof data !== 'object' || !data.country_code) {
            throw new Error('Datos de ubicación inválidos');
          }
        } catch (fetchError) {
          console.warn('Error con ipapi.co, intentando con API alternativa:', fetchError);

          // Si falla, intentamos con una API alternativa (ipinfo.io)
          try {
            // Limpiar el timeout anterior si existe
            clearTimeout(timeoutId);

            // Crear un nuevo timeout para la segunda petición
            const newController = new AbortController();
            const newTimeoutId = setTimeout(() => newController.abort(), 5000);

            response = await fetch('https://ipinfo.io/json', {
              signal: newController.signal,
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              }
            });

            clearTimeout(newTimeoutId);

            if (!response.ok) {
              throw new Error(`Error de respuesta alternativa: ${response.status}`);
            }

            data = await response.json();

            if (!data || typeof data !== 'object' || !data.country) {
              throw new Error('Datos de ubicación alternativos inválidos');
            }

            // Adaptar el formato de ipinfo.io al formato que esperamos
            data = {
              country_name: data.country === 'US' ? 'United States' : data.country,
              country_code: data.country.toLowerCase(),
              city: data.city || '',
              timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
            };
          } catch (alternativeFetchError) {
            console.error('Error con API alternativa:', alternativeFetchError);
            throw new Error('No se pudo obtener la ubicación de ninguna API');
          }
        }

        // Guardar la zona horaria
        const timezone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        timezoneRef.current = timezone;

        // Formatear la hora local usando la zona horaria
        let timeString;
        try {
          const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: timezone
          };

          const formatter = new Intl.DateTimeFormat('es-ES', options);
          timeString = formatter.format(new Date()) + ' hs';
        } catch (timeError) {
          console.warn('Error al formatear la hora con zona horaria:', timeError);
          const now = new Date();
          timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) + ' hs';
        }

        // Actualizar los datos de ubicación
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

        // En caso de error, usar la ubicación predeterminada
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

  // Efecto separado para actualizar la hora cada minuto
  useEffect(() => {
    // Solo configurar el intervalo si ya hemos cargado los datos
    if (locationData.loading) return;

    const updateTime = () => {
      try {
        if (locationData.countryCode !== 'global' && timezoneRef.current) {
          // Usar la zona horaria guardada en la referencia
          try {
            const options = {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: timezoneRef.current
            };

            const formatter = new Intl.DateTimeFormat('es-ES', options);
            const timeString = formatter.format(new Date()) + ' hs';

            setLocationData(prev => ({
              ...prev,
              time: timeString
            }));
          } catch (error) {
            // Si hay un error, usar la hora local como respaldo
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
          }
        } else {
          // Si no hay zona horaria, usar la hora local
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
        }
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
  }, [locationData.loading, locationData.countryCode]);

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
