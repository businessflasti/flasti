'use client';

import { useEffect } from 'react';

/**
 * Componente para solucionar problemas de hidratación relacionados con atributos
 * añadidos por extensiones de navegador como cz-shortcut-listen
 */
const HydrationFix = () => {
  useEffect(() => {
    // Eliminar atributos problemáticos del body que causan errores de hidratación
    const body = document.querySelector('body');
    if (body) {
      // Eliminar el atributo cz-shortcut-listen que causa el error de hidratación
      if (body.hasAttribute('cz-shortcut-listen')) {
        body.removeAttribute('cz-shortcut-listen');
      }
      
      // Eliminar otros atributos que puedan causar problemas similares
      const attributesToRemove = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'data-xstate'
      ];
      
      attributesToRemove.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    }
  }, []);

  return null;
};

export default HydrationFix;
