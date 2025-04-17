'use client';

import { useEffect } from 'react';

/**
 * Componente que optimiza el rendimiento de las imágenes sin cambiar su apariencia visual
 * Este componente no renderiza nada visible, solo aplica optimizaciones
 */
const ImageOptimizer = () => {
  useEffect(() => {
    // Esperar a que el DOM esté completamente cargado
    const optimizeImages = () => {
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

    // Ejecutar optimizaciones inmediatamente
    optimizeImages();
    
    // También ejecutar después de un breve retraso para asegurar que todos los elementos estén cargados
    const timeoutId = setTimeout(optimizeImages, 1000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
};

export default ImageOptimizer;
