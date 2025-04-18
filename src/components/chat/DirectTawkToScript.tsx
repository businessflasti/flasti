"use client";

import { useEffect } from 'react';

interface DirectTawkToScriptProps {
  showBubble?: boolean;
}

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

export default function DirectTawkToScript({ showBubble = true }: DirectTawkToScriptProps) {
  useEffect(() => {
    // Evitar cargar múltiples instancias
    if (document.getElementById('direct-tawkto-script')) {
      if (!showBubble && window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
      return;
    }

    // Configuración inicial de Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Crear y cargar el script exactamente como se proporcionó
    const script = document.createElement('script');
    script.id = 'direct-tawkto-script';
    script.async = true;
    script.src = 'https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Cuando el script se carga, configurar la visibilidad
    script.onload = () => {
      if (!showBubble && window.Tawk_API) {
        // Ocultar el widget si showBubble es false
        setTimeout(() => {
          if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
            window.Tawk_API.hideWidget();
          }
        }, 100);
      }
    };

    document.head.appendChild(script);

    // Limpieza al desmontar
    return () => {
      // No eliminamos el script para evitar problemas, solo actualizamos la visibilidad
      if (!showBubble && window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
  }, [showBubble]);

  // Función para abrir el chat manualmente
  const openChat = () => {
    if (window.Tawk_API) {
      // Asegurarse de que el widget esté visible
      if (typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
      }
      
      // Esperar un momento para asegurarse de que el widget esté visible
      setTimeout(() => {
        if (typeof window.Tawk_API.maximize === 'function') {
          window.Tawk_API.maximize();
        } else if (typeof window.Tawk_API.popup === 'function') {
          // Alternativa si maximize no está disponible
          window.Tawk_API.popup();
        }
      }, 300);
    }
  };

  return { openChat };
}
