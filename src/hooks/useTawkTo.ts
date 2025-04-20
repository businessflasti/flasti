"use client";

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

// ID de tu cuenta de Tawk.to
const TAWK_TO_ID = '6281726e7b967b11798f79e1/1g34qe1tb'; // ID correcto de Tawk.to para Flasti

export const useTawkTo = (showBubble = true) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Evitar cargar múltiples instancias
    if (document.getElementById('tawkto-script')) {
      setIsLoaded(true);
      updateWidgetVisibility();
      return;
    }

    // Configuración inicial de Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Crear y cargar el script
    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_TO_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Cuando el script se carga
    script.onload = () => {
      setIsLoaded(true);
      updateWidgetVisibility();
    };

    document.head.appendChild(script);

    // Limpieza al desmontar (pero no eliminamos el script para evitar recargas)
    return () => {
      try {
        // No eliminamos el script, solo actualizamos la visibilidad si es necesario
        if (isLoaded && window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
          if (!showBubble) {
            window.Tawk_API.hideWidget();
          }
        }
      } catch (error) {
        console.warn('Error durante la limpieza del componente Tawk.to:', error);
      }
    };
  }, []);

  // Actualizar la visibilidad del widget cuando cambia showBubble
  useEffect(() => {
    updateWidgetVisibility();
  }, [showBubble]);

  // Función para actualizar la visibilidad del widget
  const updateWidgetVisibility = () => {
    try {
      if (isLoaded && window.Tawk_API) {
        if (showBubble && typeof window.Tawk_API.showWidget === 'function') {
          window.Tawk_API.showWidget();
        } else if (!showBubble && typeof window.Tawk_API.hideWidget === 'function') {
          window.Tawk_API.hideWidget();
        }
      }
    } catch (error) {
      console.warn('Error al actualizar la visibilidad del widget de Tawk.to:', error);
    }
  };

  // Método para abrir el chat manualmente
  const openChat = () => {
    try {
      if (window.Tawk_API) {
        // Asegurarse de que el widget esté visible
        if (typeof window.Tawk_API.showWidget === 'function') {
          try {
            window.Tawk_API.showWidget();
          } catch (error) {
            console.warn('Error al mostrar el widget de Tawk.to:', error);
          }
        }

        // Esperar un momento para asegurarse de que el widget esté visible
        setTimeout(() => {
          try {
            if (typeof window.Tawk_API.maximize === 'function') {
              window.Tawk_API.maximize();
            } else if (typeof window.Tawk_API.popup === 'function') {
              // Alternativa si maximize no está disponible
              window.Tawk_API.popup();
            }
          } catch (error) {
            console.warn('Error al maximizar el chat de Tawk.to:', error);
          }
        }, 500); // Aumentar el tiempo de espera para mayor seguridad
      } else {
        console.warn('Tawk.to API no está disponible, intentando cargar el script...');
        // Si Tawk_API no está disponible, intentar cargar el script y abrir el chat
        try {
          // Verificar si el script ya existe
          if (document.getElementById('tawkto-script')) {
            console.warn('El script de Tawk.to ya existe pero la API no está disponible');
            return;
          }

          // Crear y cargar el script
          const script = document.createElement('script');
          script.id = 'tawkto-script';
          script.async = true;
          script.src = `https://embed.tawk.to/${TAWK_TO_ID}`;
          script.charset = 'UTF-8';
          script.setAttribute('crossorigin', '*');

          script.onload = () => {
            console.log('Script de Tawk.to cargado correctamente');
            // Intentar abrir el chat después de que el script se cargue
            setTimeout(() => {
              try {
                if (window.Tawk_API) {
                  if (typeof window.Tawk_API.showWidget === 'function') {
                    window.Tawk_API.showWidget();
                  }
                  if (typeof window.Tawk_API.maximize === 'function') {
                    window.Tawk_API.maximize();
                  }
                }
              } catch (error) {
                console.warn('Error al abrir el chat después de cargar el script:', error);
              }
            }, 1500); // Aumentar el tiempo de espera para mayor seguridad
          };

          script.onerror = (error) => {
            console.error('Error al cargar el script de Tawk.to:', error);
          };

          document.head.appendChild(script);
        } catch (error) {
          console.error('Error al intentar cargar el script de Tawk.to:', error);
        }
      }
    } catch (error) {
      console.error('Error general al abrir el chat de Tawk.to:', error);
    }
  };

  return { isLoaded, openChat };
};

export default useTawkTo;
