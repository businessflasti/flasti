"use client";

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

// ID de tu cuenta de Tawk.to
const TAWK_TO_ID = '65fef9c0cc1c1d5e8b2a9e9e'; // ID de Tawk.to para Flasti

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
    script.src = `https://embed.tawk.to/${TAWK_TO_ID}/default`;
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
      // No eliminamos el script, solo actualizamos la visibilidad si es necesario
      if (isLoaded && window.Tawk_API) {
        if (!showBubble) {
          window.Tawk_API.hideWidget();
        }
      }
    };
  }, []);

  // Actualizar la visibilidad del widget cuando cambia showBubble
  useEffect(() => {
    updateWidgetVisibility();
  }, [showBubble]);

  // Función para actualizar la visibilidad del widget
  const updateWidgetVisibility = () => {
    if (isLoaded && window.Tawk_API) {
      if (showBubble) {
        window.Tawk_API.showWidget();
      } else {
        window.Tawk_API.hideWidget();
      }
    }
  };

  // Método para abrir el chat manualmente
  const openChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    }
  };

  return { isLoaded, openChat };
};

export default useTawkTo;
