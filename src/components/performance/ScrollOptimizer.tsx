'use client';

import { useEffect } from 'react';

/**
 * Componente que optimiza el rendimiento del scroll sin cambiar la apariencia visual
 * Este componente no renderiza nada visible, solo aplica optimizaciones
 */
const ScrollOptimizer = () => {
  useEffect(() => {
    // Optimizar el rendimiento durante el scroll
    let scrollTimeout: number;
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
      }, 100) as unknown as number;
    };
    
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
    
    // Agregar el evento de scroll con passive: true para mejorar el rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
};

export default ScrollOptimizer;
