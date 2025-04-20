"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function HomepageChatWidget() {
  useEffect(() => {
    try {
      // Configuración inicial de Tawk_API
      if (typeof window !== 'undefined') {
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Función para ocultar el widget cuando se cargue
        window.Tawk_API.onLoad = function() {
          try {
            console.log('Tawk.to cargado en la página de inicio');
            if (typeof window.Tawk_API.hideWidget === 'function') {
              setTimeout(() => {
                try {
                  window.Tawk_API.hideWidget();
                } catch (error) {
                  console.warn('Error al ocultar el widget de Tawk.to:', error);
                }
              }, 500);
            }
          } catch (error) {
            console.warn('Error en onLoad de Tawk.to:', error);
          }
        };
      }
    } catch (error) {
      console.error('Error al configurar Tawk.to en la página de inicio:', error);
    }

    return () => {
      // No es necesario limpiar nada
    };
  }, []);

  return (
    <Script
      id="tawkto-widget-script"
      strategy="lazyOnload"
      src="https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb"
      onLoad={() => {
        try {
          console.log('Script de Tawk.to cargado correctamente en la página de inicio');
          // Dar tiempo suficiente para que la API se inicialice completamente
          setTimeout(() => {
            try {
              if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
                window.Tawk_API.hideWidget();
              }
            } catch (error) {
              console.warn('Error al ocultar el widget de Tawk.to en la página de inicio:', error);
            }
          }, 500);
        } catch (error) {
          console.error('Error en onLoad del script Tawk.to en la página de inicio:', error);
        }
      }}
      onError={(error) => {
        console.error('Error al cargar el script de Tawk.to en la página de inicio:', error);
      }}
    />
  );
}

// Declaración global para TypeScript
declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}
