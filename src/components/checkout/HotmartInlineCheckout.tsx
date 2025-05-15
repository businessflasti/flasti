"use client";

import React, { useEffect, useRef } from 'react';

interface HotmartInlineCheckoutProps {
  offerId: string;
}

const HotmartInlineCheckout: React.FC<HotmartInlineCheckoutProps> = ({ offerId }) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef<boolean>(false);

  useEffect(() => {
    // Verificar si el script ya está cargado
    if (!scriptLoaded.current) {
      // Cargar el script de Hotmart
      const script = document.createElement('script');
      script.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        initializeCheckout();
      };
      document.body.appendChild(script);

      return () => {
        // Limpiar el script al desmontar
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else {
      // Si el script ya está cargado, inicializar el checkout
      initializeCheckout();
    }
  }, [offerId]);

  const initializeCheckout = () => {
    if (window.checkoutElements && checkoutRef.current) {
      // Limpiar el contenido anterior
      checkoutRef.current.innerHTML = '';
      
      // Inicializar el checkout con el ID de oferta proporcionado
      const elements = window.checkoutElements.init('inlineCheckout', {
        offer: offerId
      });
      
      elements.mount('#hotmart-checkout-container-' + offerId);
    }
  };

  return (
    <div className="w-full">
      <div id={`hotmart-checkout-container-${offerId}`} ref={checkoutRef}></div>
    </div>
  );
};

export default HotmartInlineCheckout;

// Agregar la definición de tipos para window.checkoutElements
declare global {
  interface Window {
    checkoutElements: {
      init: (type: string, config: { offer: string }) => {
        mount: (selector: string) => void;
      };
    };
  }
}
