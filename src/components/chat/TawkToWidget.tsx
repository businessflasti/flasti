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
    // Configuración inicial de Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Configurar la visibilidad de la burbuja cuando el script se cargue
    const handleScriptLoad = () => {
      scriptLoaded.current = true;
      
      if (window.Tawk_API) {
        if (!showBubble && typeof window.Tawk_API.hideWidget === 'function') {
          setTimeout(() => {
            window.Tawk_API.hideWidget();
          }, 100);
        } else if (showBubble && typeof window.Tawk_API.showWidget === 'function') {
          setTimeout(() => {
            window.Tawk_API.showWidget();
          }, 100);
        }
      }
    };
    
    // Si el script ya está cargado, configurar la visibilidad
    if (scriptLoaded.current && window.Tawk_API) {
      if (!showBubble && typeof window.Tawk_API.hideWidget === 'function') {
        window.Tawk_API.hideWidget();
      } else if (showBubble && typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
      }
    }
    
    // Agregar el evento de carga del script
    const existingScript = document.getElementById('tawkto-widget-script');
    if (existingScript) {
      handleScriptLoad();
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
        scriptLoaded.current = true;
        if (!showBubble && window.Tawk_API) {
          setTimeout(() => {
            if (typeof window.Tawk_API.hideWidget === 'function') {
              window.Tawk_API.hideWidget();
            }
          }, 100);
        }
      }}
    />
  );
}
