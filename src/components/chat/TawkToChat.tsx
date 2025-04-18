"use client";

import { useEffect, useState } from 'react';

interface TawkToChatProps {
  showBubble?: boolean;
}

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

const TawkToChat = ({ showBubble = true }: TawkToChatProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar el script de Tawk.to solo una vez
    if (!isLoaded && typeof window !== 'undefined') {
      // Configuración inicial de Tawk_API
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Crear y cargar el script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/YOUR_TAWK_TO_ID/default'; // Reemplaza YOUR_TAWK_TO_ID con tu ID real
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      // Cuando el script se carga, configurar la visibilidad de la burbuja
      script.onload = () => {
        setIsLoaded(true);
        
        // Ocultar la burbuja si showBubble es false
        if (!showBubble && window.Tawk_API) {
          window.Tawk_API.onLoad = function() {
            window.Tawk_API.hideWidget();
          };
        }
      };
      
      document.head.appendChild(script);
      
      // Limpieza al desmontar
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else if (isLoaded && !showBubble && window.Tawk_API) {
      // Si el componente se actualiza y showBubble cambia a false
      window.Tawk_API.hideWidget();
    } else if (isLoaded && showBubble && window.Tawk_API) {
      // Si el componente se actualiza y showBubble cambia a true
      window.Tawk_API.showWidget();
    }
  }, [isLoaded, showBubble]);

  // Método para abrir el chat manualmente
  const openChat = () => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      window.Tawk_API.showWidget();
      window.Tawk_API.maximize();
    }
  };

  // No renderizamos nada visible, solo exponemos el método
  return { openChat };
};

export default TawkToChat;
