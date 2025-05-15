"use client";

import React, { useEffect, useRef } from 'react';

interface MercadoPagoButtonProps {
  preferenceId: string | null;
  initPoint: string | null;
  amount: number;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ preferenceId, initPoint, amount }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const amountFormatted = amount.toLocaleString('es-AR');

  useEffect(() => {
    // Crear el botón personalizado
    if (buttonRef.current) {
      buttonRef.current.innerHTML = '';
      
      const button = document.createElement('button');
      button.className = 'w-full py-4 px-6 bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] duration-200';
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mr-1">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M20 12v4H6a2 2 0 0 0-2 2c0 1.1.9 2 2 2h12v-4" />
        </svg>
        <span class="font-bold">¡PAGAR AHORA!</span>
        <span class="ml-2 bg-white/20 px-2 py-1 rounded text-sm">AR$ ${amountFormatted}</span>
      `;
      
      // Agregar evento de clic
      button.addEventListener('click', () => {
        // Mostrar animación de carga
        button.disabled = true;
        button.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando pago...
        `;
        
        // Redirigir a la URL de pago o a la página de registro
        if (initPoint) {
          window.location.href = initPoint;
        } else {
          setTimeout(() => {
            window.location.href = "https://flasti.com/secure-registration-portal-7f9a2b3c5d8e";
          }, 2000);
        }
      });
      
      buttonRef.current.appendChild(button);
    }
  }, [preferenceId, initPoint, amountFormatted]);

  return <div ref={buttonRef} className="w-full"></div>;
};

export default MercadoPagoButton;
