"use client";

import { useEffect } from 'react';
import Script from 'next/script';

export default function HomepageChatWidget() {
  useEffect(() => {
    // Configuración inicial de Tawk_API
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      
      // Función para ocultar el widget cuando se cargue
      window.Tawk_API.onLoad = function() {
        if (typeof window.Tawk_API.hideWidget === 'function') {
          window.Tawk_API.hideWidget();
        }
      };
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
