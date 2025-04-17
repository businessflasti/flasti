'use client';

/**
 * Utilidades para precargar recursos críticos y optimizar la carga inicial
 */

// Lista de recursos críticos a precargar
const criticalResources = [
  // Imágenes críticas (logos, iconos, etc.)
  '/logo.svg',
  '/logo-dark.svg',
  '/icons/dashboard.svg',
  '/icons/stats.svg',
  '/icons/wallet.svg',
  // Perfiles de usuario (solo los más comunes)
  '/images/profiles/profile1.jpg',
  '/images/profiles/profile2.jpg',
  '/images/profiles/profile3.jpg',
];

// Función para precargar una imagen
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
};

// Función para precargar fuentes críticas
const preloadFonts = (): void => {
  // Las fuentes ya se cargan en globals.css, pero podemos optimizar su carga
  if ('fonts' in document) {
    // Precargar fuentes principales
    Promise.all([
      (document as any).fonts.load('400 1em Inter'),
      (document as any).fonts.load('700 1em Inter'),
      (document as any).fonts.load('400 1em Outfit'),
      (document as any).fonts.load('700 1em Outfit')
    ]).then(() => {
      // Marcar que las fuentes están listas
      document.documentElement.classList.add('fonts-loaded');
    });
  }
};

// Función para precargar un recurso genérico
const preloadResource = (url: string): Promise<void> => {
  if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp') || url.includes('.svg')) {
    return preloadImage(url);
  } else {
    return Promise.resolve();
  }
};

// Función para optimizar la carga de CSS
const optimizeCSSLoading = (): void => {
  // Detectar dispositivos de bajo rendimiento
  // Ampliamos la detección para incluir más dispositivos Android de gama media
  const isLowPerfDevice = window.navigator.hardwareConcurrency <= 6 ||
                         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         (window.navigator.userAgent.includes('Android') && window.navigator.hardwareConcurrency <= 8);

  // Crear un estilo optimizado para dispositivos de bajo rendimiento
  if (isLowPerfDevice) {
    const style = document.createElement('style');
    style.textContent = `
      /* Desactivar animaciones en dispositivos de bajo rendimiento */
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Optimizar renderizado */
      .card, .glass-card, .glass-effect {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      }

      /* Simplificar gradientes */
      .bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-bl, .bg-gradient-to-tr, .bg-gradient-to-tl {
        background: rgba(147, 51, 234, 0.1) !important;
      }

      /* Optimizar efectos de blur */
      .blur-3xl, .blur-2xl, .blur-xl {
        filter: blur(8px) !important;
      }

      /* Optimizar scrolling */
      body, .overflow-auto, .overflow-y-auto, .overflow-x-auto {
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: none !important;
        scroll-behavior: auto !important;
      }

      /* Reducir complejidad visual */
      .animate-pulse, .animate-ping, .animate-spin {
        display: none !important;
      }

      /* Optimizar rendimiento de FAQ */
      .faq-content {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Función principal para precargar todos los recursos críticos
export const preloadCriticalResources = (): void => {
  // Optimizar la carga de CSS inmediatamente
  optimizeCSSLoading();

  // Precargar fuentes
  preloadFonts();

  // Precargar recursos en segundo plano para no bloquear la carga inicial
  setTimeout(() => {
    criticalResources.forEach(url => {
      preloadResource(url).catch(() => {
        // Silenciar errores para no interrumpir la carga
        console.warn(`Failed to preload resource: ${url}`);
      });
    });
  }, 100);

  // Optimizar la carga de scripts de terceros
  optimizeThirdPartyScripts();
};

// Función para optimizar la carga de scripts de terceros
const optimizeThirdPartyScripts = (): void => {
  // Retrasar la carga de scripts no críticos
  window.addEventListener('load', () => {
    // Retrasar la carga del chat widget
    setTimeout(() => {
      const chatScript = document.querySelector('script[src*="tawk.to"]');
      if (!chatScript) {
        const script = document.createElement('script');
        script.src = 'https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb';
        script.async = true;
        document.body.appendChild(script);
      }
    }, 3000); // Retrasar 3 segundos después de la carga completa
  });
};

// Exportar todas las funciones
export default {
  preloadCriticalResources,
  preloadImage,
  preloadFonts,
  optimizeCSSLoading,
  optimizeThirdPartyScripts
};
