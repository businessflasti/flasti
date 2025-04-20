"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface TawkToWidgetProps {
  showBubble?: boolean;
}

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

export default function TawkToWidget({ showBubble = true }: TawkToWidgetProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    try {
      // Configuración inicial de Tawk_API
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Función segura para actualizar la visibilidad del widget
      const safeUpdateVisibility = (shouldShow: boolean) => {
        try {
          if (!window.Tawk_API) return;

          setTimeout(() => {
            try {
              if (!shouldShow && typeof window.Tawk_API.hideWidget === 'function') {
                window.Tawk_API.hideWidget();
              } else if (shouldShow && typeof window.Tawk_API.showWidget === 'function') {
                window.Tawk_API.showWidget();
              }
            } catch (error) {
              console.warn('Error al actualizar visibilidad del widget Tawk.to:', error);
            }
          }, 500); // Aumentar el tiempo para mayor seguridad
        } catch (error) {
          console.warn('Error en safeUpdateVisibility:', error);
        }
      };

      // Configurar la visibilidad de la burbuja cuando el script se cargue
      const handleScriptLoad = () => {
        try {
          scriptLoaded.current = true;
          safeUpdateVisibility(showBubble);
        } catch (error) {
          console.warn('Error en handleScriptLoad:', error);
        }
      };

      // Si el script ya está cargado, configurar la visibilidad
      if (scriptLoaded.current) {
        safeUpdateVisibility(showBubble);
      }

      // Verificar si el script ya existe
      const existingScript = document.getElementById('tawkto-widget-script');
      if (existingScript) {
        handleScriptLoad();
      }
    } catch (error) {
      console.error('Error en el useEffect de TawkToWidget:', error);
    }

    return () => {
      // No es necesario limpiar nada, ya que no queremos eliminar el script
    };
  }, [showBubble]);

  return (
    <Script
      id="tawkto-widget-script"
      strategy="lazyOnload"
      src="https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb"
      onLoad={() => {
        try {
          console.log('Script de Tawk.to cargado correctamente');
          scriptLoaded.current = true;

          // Dar tiempo suficiente para que la API se inicialice completamente
          setTimeout(() => {
            try {
              if (window.Tawk_API) {
                if (!showBubble && typeof window.Tawk_API.hideWidget === 'function') {
                  window.Tawk_API.hideWidget();
                } else if (showBubble && typeof window.Tawk_API.showWidget === 'function') {
                  window.Tawk_API.showWidget();
                }
              }
            } catch (error) {
              console.warn('Error al configurar la visibilidad del widget Tawk.to:', error);
            }
          }, 500);
        } catch (error) {
          console.error('Error en onLoad del script Tawk.to:', error);
        }
      }}
      onError={(error) => {
        console.error('Error al cargar el script de Tawk.to:', error);
      }}
    />
  );
}
