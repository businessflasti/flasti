'use client';

/**
 * Utilidades para optimizar el rendimiento en dispositivos móviles
 * sin afectar la apariencia visual de la interfaz
 */

// Detectar si estamos en un dispositivo móvil
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detectar si estamos en un dispositivo de bajo rendimiento
export const isLowPerformanceDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Detectar por número de núcleos de CPU (2 o menos es generalmente un dispositivo de bajo rendimiento)
  const lowCpuCores = window.navigator.hardwareConcurrency <= 2;
  
  // Detectar Android de gama baja (4 o menos núcleos en Android suele indicar gama baja)
  const isLowEndAndroid = 
    /Android/i.test(navigator.userAgent) && 
    window.navigator.hardwareConcurrency <= 4;
    
  return lowCpuCores || isLowEndAndroid;
};

// Optimizar el rendimiento de las FAQs sin cambiar su apariencia
export const optimizeFAQs = (): void => {
  if (typeof window === 'undefined') return;
  
  // Seleccionar todos los botones de FAQ
  const faqButtons = document.querySelectorAll('.glass-card button');
  
  // Aplicar optimizaciones a cada botón
  faqButtons.forEach(button => {
    // Usar passive: true para mejorar el rendimiento de eventos táctiles
    button.addEventListener('touchstart', () => {}, { passive: true });
    
    // Aplicar aceleración por hardware para mejorar el rendimiento
    button.setAttribute('style', 'transform: translateZ(0); backface-visibility: hidden;');
    
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

// Optimizar el rendimiento del scroll sin cambiar la apariencia visual
export const optimizeScrolling = (): void => {
  if (typeof window === 'undefined') return;
  
  // Optimizar el rendimiento durante el scroll
  let scrollTimeout: number;
  let isScrolling = false;
  
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('is-scrolling');
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('is-scrolling');
    }, 100) as unknown as number;
  }, { passive: true });
  
  // Agregar estilos para pausar animaciones durante el scroll
  // sin cambiar la apariencia visual cuando no se está scrolleando
  const style = document.createElement('style');
  style.textContent = `
    .is-scrolling * {
      transition-duration: 0.001ms !important;
      animation-duration: 0.001ms !important;
    }
  `;
  document.head.appendChild(style);
};

// Optimizar imágenes sin cambiar su apariencia visual
export const optimizeImages = (): void => {
  if (typeof window === 'undefined') return;
  
  // Seleccionar todas las imágenes que no tengan ya loading="lazy"
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  
  // Aplicar carga diferida a las imágenes
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
};

// Optimizar elementos interactivos sin cambiar su apariencia visual
export const optimizeInteractiveElements = (): void => {
  if (typeof window === 'undefined') return;
  
  // Seleccionar todos los botones y enlaces
  const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
  
  // Aplicar optimizaciones a cada elemento
  interactiveElements.forEach(element => {
    // Usar passive: true para mejorar el rendimiento de eventos táctiles
    element.addEventListener('touchstart', () => {}, { passive: true });
    
    // Mejorar la respuesta táctil sin cambiar la apariencia visual
    (element as HTMLElement).style.touchAction = 'manipulation';
    (element as HTMLElement).style.webkitTapHighlightColor = 'transparent';
  });
};

// Aplicar todas las optimizaciones de rendimiento para móviles
export const applyMobileOptimizations = (): void => {
  if (typeof window === 'undefined') return;
  
  // Solo aplicar en dispositivos móviles
  if (isMobileDevice()) {
    // Optimizar FAQs para que abran/cierren más rápido
    optimizeFAQs();
    
    // Optimizar el rendimiento del scroll
    optimizeScrolling();
    
    // Optimizar imágenes
    optimizeImages();
    
    // Optimizar elementos interactivos
    optimizeInteractiveElements();
  }
};
