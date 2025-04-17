'use client';

/**
 * Utilidad para optimizar el rendimiento de las FAQs sin cambiar su apariencia visual
 */

// Optimizar el rendimiento de las FAQs para que abran/cierren más rápido
export const optimizeFAQs = (): void => {
  if (typeof window === 'undefined') return;

  // Seleccionar todos los contenedores de FAQ
  const faqContainers = document.querySelectorAll('.glass-card');

  // Aplicar optimizaciones para mejorar el rendimiento
  faqContainers.forEach(container => {
    // Encontrar el botón y el contenido
    const button = container.querySelector('button');
    const content = container.querySelector('div[data-faq-content="true"]');

    if (button && content) {
      // Optimizaciones para mejorar la fluidez
      const contentElement = content as HTMLElement;

      // 1. Reducir la duración de la transición
      contentElement.style.transitionDuration = '0.15s';

      // 2. Cambiar la función de temporización para que sea más suave
      contentElement.style.transitionTimingFunction = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

      // 3. Optimizar las propiedades que se animan
      contentElement.style.willChange = 'max-height, opacity';

      // 4. Usar transform en lugar de max-height cuando sea posible
      contentElement.style.transform = 'translateZ(0)';

      // 5. Aplicar hardware acceleration
      contentElement.style.backfaceVisibility = 'hidden';
    }
  });
};
