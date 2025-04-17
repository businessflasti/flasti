'use client';

import { useEffect } from 'react';

/**
 * Componente que optimiza el rendimiento de las FAQs sin cambiar su apariencia visual
 * Este componente no renderiza nada visible, solo aplica optimizaciones
 */
const FAQOptimizer = () => {
  useEffect(() => {
    // Esperar a que el DOM esté completamente cargado
    const optimizeFAQs = () => {
      // Seleccionar todos los botones de FAQ
      const faqButtons = document.querySelectorAll('.glass-card button');
      
      // Aplicar optimizaciones a cada botón
      faqButtons.forEach(button => {
        // Usar passive: true para mejorar el rendimiento de eventos táctiles
        button.addEventListener('touchstart', () => {}, { passive: true });
        
        // Optimizar el contenido desplegable
        const content = button.nextElementSibling as HTMLElement;
        if (content) {
          // Reducir la duración de la transición para que abra/cierre más rápido
          // pero manteniendo la misma apariencia visual
          content.style.transitionDuration = '0.2s';
          content.style.willChange = 'max-height, opacity';
        }
      });
    };

    // Ejecutar optimizaciones inmediatamente
    optimizeFAQs();
    
    // También ejecutar después de un breve retraso para asegurar que todos los elementos estén cargados
    const timeoutId = setTimeout(optimizeFAQs, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
};

export default FAQOptimizer;
