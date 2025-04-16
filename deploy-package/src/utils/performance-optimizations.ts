'use client';

/**
 * Utilidades para optimizar el rendimiento de la página
 */

// Función para optimizar las animaciones usando requestAnimationFrame
export const optimizeAnimation = (callback: FrameRequestCallback): number => {
  return requestAnimationFrame(callback);
};

// Función para cancelar una animación
export const cancelAnimation = (id: number): void => {
  cancelAnimationFrame(id);
};

// Función para retrasar la carga de elementos no críticos
export const deferLoad = (callback: () => void, delay: number = 100): void => {
  setTimeout(callback, delay);
};

// Función para optimizar la carga de imágenes
export const optimizeImageLoading = (imageElement: HTMLImageElement): void => {
  // Establecer loading="lazy" para imágenes
  imageElement.loading = 'lazy';

  // Usar un placeholder mientras se carga la imagen
  const originalSrc = imageElement.src;
  imageElement.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';

  // Cargar la imagen real después de un pequeño retraso
  setTimeout(() => {
    imageElement.src = originalSrc;
  }, 100);
};

// Función para optimizar la carga de elementos decorativos
export const optimizeDecorativeElements = (): void => {
  // Detectar dispositivos de muy bajo rendimiento (solo los realmente lentos)
  const isVeryLowPerfDevice = window.navigator.hardwareConcurrency <= 2 ||
                             (window.navigator.userAgent.includes('Android') && window.navigator.hardwareConcurrency <= 4);

  // Solo aplicar optimizaciones en dispositivos realmente lentos
  if (isVeryLowPerfDevice) {
    // Reducir la cantidad de elementos decorativos secundarios
    document.querySelectorAll('.decorative-element-secondary').forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });

    // Simplificar efectos de blur pesados
    document.querySelectorAll('.backdrop-blur-xl').forEach((element) => {
      element.classList.remove('backdrop-blur-xl');
      element.classList.add('backdrop-blur-md');
    });
  }

  // Aplicar aceleración por hardware a elementos clave (para todos los dispositivos)
  document.querySelectorAll('.card, .glass-effect, .glass-card, .animate-float, .animate-pulse').forEach((element) => {
    element.classList.add('hardware-accelerated');
  });
};

// Función para optimizar la carga de fuentes (desactivada para evitar cambios en las fuentes)
export const optimizeFontLoading = (): void => {
  // No hacer nada para evitar cambios en las fuentes
  return;
};

// Función para optimizar el rendimiento general de la página
export const optimizePagePerformance = (): void => {
  // Ejecutar optimizaciones cuando el documento esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }

  function runOptimizations() {
    // Optimizar la carga de fuentes
    optimizeFontLoading();

    // Optimizar elementos decorativos inmediatamente para evitar parpadeos
    optimizeDecorativeElements();

    // Optimizar imágenes
    document.querySelectorAll('img').forEach((img) => {
      optimizeImageLoading(img);
    });

    // Reducir la prioridad de scripts no críticos
    document.querySelectorAll('script:not([critical])').forEach((script) => {
      script.setAttribute('defer', '');
    });

    // Optimizar el renderizado
    optimizeRendering();

    // Aplicar optimizaciones adicionales después de que todo esté cargado
    window.addEventListener('load', () => {
      // Eliminar clases de animación innecesarias después de que se hayan ejecutado
      setTimeout(() => {
        document.querySelectorAll('.animate-fadeInUp, .animate-fadeIn, .animate-slideIn').forEach((element) => {
          element.classList.remove('animate-fadeInUp', 'animate-fadeIn', 'animate-slideIn');
        });
      }, 1000);
    });
  }
};

// Función para optimizar el renderizado
export const optimizeRendering = (): void => {
  // Detectar dispositivos de muy bajo rendimiento (solo los realmente lentos)
  const isVeryLowPerfDevice = window.navigator.hardwareConcurrency <= 2 ||
                             (window.navigator.userAgent.includes('Android') && window.navigator.hardwareConcurrency <= 4);

  // Aplicar optimizaciones de CSS solo para dispositivos de muy bajo rendimiento
  if (isVeryLowPerfDevice) {
    const style = document.createElement('style');
    style.textContent = `
      /* Optimizaciones para dispositivos de muy bajo rendimiento */
      .reduce-animations-for-low-end {
        animation-duration: 0.5s !important;
        transition-duration: 0.3s !important;
      }

      .blur-3xl {
        filter: blur(12px) !important;
      }
    `;
    document.head.appendChild(style);

    // Agregar clase para reducir animaciones en dispositivos lentos
    document.body.classList.add('reduce-animations-for-low-end');
  }

  // Aplicar aceleración por hardware a elementos clave (para todos los dispositivos)
  const hardwareAcceleratedStyle = document.createElement('style');
  hardwareAcceleratedStyle.textContent = `
    /* Optimizaciones para todos los dispositivos */
    .hardware-accelerated {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  `;
  document.head.appendChild(hardwareAcceleratedStyle);

  // Optimizar scrolling en móviles
  document.querySelectorAll('.mobile-smooth-scroll').forEach((element) => {
    (element as HTMLElement).style.cssText += 'overflow-y: auto; -webkit-overflow-scrolling: touch;';
  });

  // Mejorar respuesta táctil en móviles
  document.querySelectorAll('.mobile-touch-friendly').forEach((element) => {
    element.addEventListener('touchstart', () => {}, { passive: true });
  });

  // Añadir feedback táctil a botones en móviles
  document.querySelectorAll('.mobile-touch-feedback').forEach((element) => {
    element.addEventListener('touchstart', (e) => {
      (e.currentTarget as HTMLElement).style.opacity = '0.7';
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      setTimeout(() => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }, 100);
    }, { passive: true });
  });
};

// Función para optimizar las animaciones de entrada (desactivada para evitar cambios no deseados)
export const optimizeEntryAnimations = (): void => {
  // No hacer nada para evitar cambios no deseados
  return;
};

// Exportar todas las funciones
export default {
  optimizeAnimation,
  cancelAnimation,
  deferLoad,
  optimizeImageLoading,
  optimizeDecorativeElements,
  optimizeFontLoading,
  optimizePagePerformance,
  optimizeEntryAnimations,
  optimizeRendering
};
