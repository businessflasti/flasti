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

    // Función para mejorar la experiencia táctil (desactivada para evitar cambios no deseados)
    const improveTouchExperience = () => {
      // No hacer nada para evitar cambios no deseados
      return;
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
