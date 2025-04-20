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
    // Función segura para ocultar el widget
    const safeHideWidget = () => {
      try {
        if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
          window.Tawk_API.hideWidget();
        }
      } catch (error) {
        console.warn('No se pudo ocultar el widget de Tawk.to:', error);
      }
    };

    // Evitar cargar múltiples instancias
    if (document.getElementById('direct-tawkto-script')) {
      if (!showBubble) {
        // Intentar ocultar el widget si ya existe el script
        setTimeout(safeHideWidget, 500); // Dar tiempo a que la API esté disponible
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
      if (!showBubble) {
        // Dar tiempo suficiente para que la API se inicialice completamente
        setTimeout(safeHideWidget, 1000);
      }
    };

    document.head.appendChild(script);

    // Limpieza al desmontar
    return () => {
      // No eliminamos el script para evitar problemas, solo actualizamos la visibilidad
      if (!showBubble) {
        safeHideWidget();
      }
    };
  }, [showBubble]);

  // Función para abrir el chat manualmente
  const openChat = () => {
    try {
      // Verificar si la API está disponible
      if (!window.Tawk_API) {
        console.warn('Tawk.to API no está disponible aún');
        // Intentar cargar el script si no existe
        if (!document.getElementById('direct-tawkto-script')) {
          // Recargar el script
          const script = document.createElement('script');
          script.id = 'direct-tawkto-script';
          script.async = true;
          script.src = 'https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb';
          script.charset = 'UTF-8';
          script.setAttribute('crossorigin', '*');
          document.head.appendChild(script);
        }
        return;
      }

      // Asegurarse de que el widget esté visible
      if (typeof window.Tawk_API.showWidget === 'function') {
        window.Tawk_API.showWidget();
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
    } catch (error) {
      console.error('Error al abrir el chat de Tawk.to:', error);
    }
  };

  return { openChat };
}
