'use client';

import { useEffect, useState } from 'react';
import {
  optimizePagePerformance,
  optimizeRendering,
  optimizeDecorativeElements
} from '@/utils/performance-optimizations';
import { preloadCriticalResources } from '@/utils/preload-resources';
import { usePathname } from 'next/navigation';

/**
 * Componente que optimiza el rendimiento de la página
 * Se debe incluir en el layout principal para que se aplique a toda la aplicación
 */
const PerformanceOptimizer = () => {
  const pathname = usePathname();
  const [isOptimized, setIsOptimized] = useState(false);
  const isDashboard = pathname?.startsWith('/dashboard');

  // Optimizaciones iniciales (una sola vez)
  useEffect(() => {
    if (!isOptimized) {
      console.log('Aplicando optimizaciones de rendimiento...');

      // Precargar recursos críticos inmediatamente
      preloadCriticalResources();

      // Optimizar el rendimiento general de la página
      optimizePagePerformance();

      // Optimizar el renderizado
      optimizeRendering();

      // Optimizaciones adicionales para dispositivos Android de gama media
      if (window.navigator.userAgent.includes('Android')) {
        // Aplicar aceleración por hardware a elementos clave
        document.querySelectorAll('.glass-card, .card, .glass-effect, .blur-3xl, .blur-2xl, .blur-xl').forEach((element) => {
          element.classList.add('hardware-accelerated');
        });

        // Optimizar scrolling en toda la página
        document.body.style.cssText += '-webkit-overflow-scrolling: touch; overscroll-behavior-y: none;';

        // Reducir la calidad de los efectos de blur en Android
        const style = document.createElement('style');
        style.textContent = `
          .blur-3xl, .blur-2xl, .blur-xl {
            filter: blur(8px) !important;
          }
          .faq-content {
            transition: none !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Marcar como optimizado
      setIsOptimized(true);
    }
  }, [isOptimized]);

  // Optimizaciones específicas para el dashboard
  useEffect(() => {
    if (!isDashboard) return;

    // Optimizaciones adicionales para el dashboard
    const dashboardOptimizations = () => {
      // Eliminar animaciones innecesarias
      optimizeDecorativeElements();

      // Optimizar scrolling en el dashboard
      document.querySelectorAll('.mobile-smooth-scroll').forEach((element) => {
        (element as HTMLElement).style.cssText += 'overflow-y: auto; -webkit-overflow-scrolling: touch;';
      });

      // Optimizar la carga de componentes del dashboard
      const dashboardComponents = document.querySelectorAll('.card, .glass-effect, .glass-card');
      dashboardComponents.forEach((element) => {
        // Aplicar aceleración por hardware
        element.classList.add('hardware-accelerated');

        // Eliminar efectos de hover en dispositivos móviles
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          element.classList.remove('hover-lift', 'hover:shadow-lg', 'hover:scale-105');
        }
      });
    };

    // Ejecutar optimizaciones del dashboard
    dashboardOptimizations();

    // Configurar lazy loading para imágenes y componentes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;

          // Cargar imágenes cuando sean visibles
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.setAttribute('src', element.dataset.src);
            observer.unobserve(element);
          }

          // Cargar componentes diferidos cuando sean visibles
          if (element.hasAttribute('data-defer-load')) {
            element.removeAttribute('data-defer-load');
            element.classList.remove('opacity-0');
            observer.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '200px', // Cargar con más anticipación para evitar parpadeos
      threshold: 0.1
    });

    // Observar imágenes y componentes diferidos
    document.querySelectorAll('img[data-src], [data-defer-load]').forEach(element => {
      observer.observe(element);
    });

    // Optimizar la navegación entre páginas del dashboard
    const optimizeNavigation = () => {
      document.querySelectorAll('a[href^="/dashboard"]').forEach(link => {
        link.addEventListener('click', () => {
          // Mostrar indicador de carga
          const loadingIndicator = document.createElement('div');
          loadingIndicator.className = 'fixed top-0 left-0 w-full h-1 bg-primary/50 z-50';
          loadingIndicator.style.animation = 'loadingBar 2s linear forwards';
          document.body.appendChild(loadingIndicator);

          // Limpiar el indicador si la navegación tarda demasiado
          setTimeout(() => {
            if (document.body.contains(loadingIndicator)) {
              document.body.removeChild(loadingIndicator);
            }
          }, 2000);
        });
      });
    };

    optimizeNavigation();

    return () => {
      observer.disconnect();
    };
  }, [isDashboard]);

  return null; // Este componente no renderiza nada visible
};

export default PerformanceOptimizer;
