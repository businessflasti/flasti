'use client';

import { useEffect } from 'react';

/**
 * MobileExperience es un componente que mejora la experiencia móvil en toda la aplicación.
 * Aplica ajustes específicos para dispositivos móviles como:
 * - Manejo del viewport en iOS para evitar problemas con el teclado virtual
 * - Prevención de zoom no deseado en inputs
 * - Mejora del comportamiento de desplazamiento
 * - Ajustes para notch y áreas seguras en dispositivos modernos
 */
export function MobileExperience() {
  useEffect(() => {
    // Función para detectar si estamos en un dispositivo iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Función para manejar el viewport en iOS para evitar problemas con el teclado
    const handleIOSViewport = () => {
      if (isIOS) {
        // Ajustar el viewport cuando el teclado se muestra
        document.addEventListener('focusin', () => {
          document.documentElement.classList.add('ios-keyboard-open');
        });

        // Restaurar el viewport cuando el teclado se oculta
        document.addEventListener('focusout', () => {
          document.documentElement.classList.remove('ios-keyboard-open');
        });
      }
    };

    // Función para prevenir el zoom no deseado en inputs en iOS
    const preventIOSZoom = () => {
      if (isIOS) {
        // Prevenir el zoom en doble tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        }, { passive: false });
      }
    };

    // Función para mejorar el comportamiento de desplazamiento
    const improveScrolling = () => {
      // Aplicar desplazamiento suave a toda la página
      document.documentElement.style.scrollBehavior = 'smooth';

      // Optimizaciones para Android
      if (/Android/.test(navigator.userAgent)) {
        // Optimizar scrolling en toda la página
        document.body.style.cssText += '-webkit-overflow-scrolling: touch; overscroll-behavior-y: none;';

        // Optimizar el rendimiento durante el scroll
        let scrollTimeout: number;
        window.addEventListener('scroll', () => {
          document.body.classList.add('scrolling');
          clearTimeout(scrollTimeout);
          scrollTimeout = window.setTimeout(() => {
            document.body.classList.remove('scrolling');
          }, 100) as unknown as number;
        }, { passive: true });

        // Agregar estilos para optimizar el rendimiento durante el scroll
        const style = document.createElement('style');
        style.textContent = `
          body.scrolling * {
            transition-duration: 0.0001ms !important;
            animation-duration: 0.0001ms !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Prevenir el rebote de desplazamiento en iOS
      if (isIOS) {
        document.body.style.overscrollBehavior = 'none';
      }
    };

    // Función para ajustar el diseño para notch y áreas seguras
    const adjustForSafeAreas = () => {
      // Aplicar variables CSS para áreas seguras
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top, 0px)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right, 0px)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left, 0px)');
    };

    // Función para mejorar la experiencia táctil
    const improveTouchExperience = () => {
      // Optimizaciones para dispositivos móviles
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Aplicar estilos para mejorar la respuesta táctil sin cambiar la apariencia visual
        const touchOptimizationStyle = document.createElement('style');
        touchOptimizationStyle.textContent = `
          /* Optimizaciones para respuesta táctil */
          button, a, [role="button"], input[type="button"], input[type="submit"] {
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
          }
        `;
        document.head.appendChild(touchOptimizationStyle);

        // Agregar eventos de touch con passive: true para mejor rendimiento
        document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]').forEach(element => {
          element.addEventListener('touchstart', () => {}, { passive: true });
          element.addEventListener('touchend', () => {}, { passive: true });
        });
      }
    };

    // Aplicar todas las mejoras
    handleIOSViewport();
    preventIOSZoom();
    improveScrolling();
    adjustForSafeAreas();
    improveTouchExperience();

    // Limpiar al desmontar
    return () => {
      if (isIOS) {
        document.removeEventListener('focusin', () => {
          document.documentElement.classList.add('ios-keyboard-open');
        });
        document.removeEventListener('focusout', () => {
          document.documentElement.classList.remove('ios-keyboard-open');
        });
      }
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}

export default MobileExperience;
