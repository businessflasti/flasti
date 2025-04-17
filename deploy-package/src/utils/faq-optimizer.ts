'use client';

/**
 * Utilidad para optimizar el rendimiento de las FAQs sin cambiar su apariencia visual
 */

// Optimizar el rendimiento de las FAQs para que abran/cierren más rápido
export const optimizeFAQs = (): void => {
  if (typeof window === 'undefined') return;
  
  // Seleccionar todos los contenedores de FAQ
  const faqContainers = document.querySelectorAll('.glass-card');
  
  faqContainers.forEach(container => {
    // Encontrar el botón y el contenido
    const button = container.querySelector('button');
    const content = container.querySelector('div[class*="transition-all"]');
    
    if (button && content) {
      // Reducir la duración de la transición para que abra/cierre más rápido
      // pero manteniendo la misma apariencia visual
      (content as HTMLElement).style.transitionDuration = '0.2s';
    }
  });
};
