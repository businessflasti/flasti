/**
 * Utilidades para el seguimiento de afiliados
 */

/**
 * Captura el parámetro ref de la URL y lo guarda en localStorage
 * @returns El ID del afiliado si existe
 */
export function captureAffiliateRef(): string | null {
  // Solo ejecutar en el cliente
  if (typeof window === 'undefined') return null;
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    // Si hay un parámetro ref en la URL, guardarlo
    if (ref) {
      // Guardar el ref y la timestamp
      const affiliateData = {
        ref,
        timestamp: Date.now(),
        // Capturar también el ID de la app si está disponible
        appId: urlParams.get('app') || getAppIdFromPath()
      };
      
      localStorage.setItem('flasti_affiliate', JSON.stringify(affiliateData));
      return ref;
    }
    
    // Si no hay ref en la URL, verificar si hay uno guardado en localStorage
    const savedData = localStorage.getItem('flasti_affiliate');
    if (savedData) {
      const { ref, timestamp } = JSON.parse(savedData);
      
      // Verificar si el ref guardado aún es válido (7 días)
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (now - timestamp < sevenDays) {
        return ref;
      } else {
        // Si ha expirado, eliminarlo
        localStorage.removeItem('flasti_affiliate');
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error al capturar ref de afiliado:', error);
    return null;
  }
}

/**
 * Obtiene el ID de la app basado en la ruta actual
 */
function getAppIdFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  
  const path = window.location.pathname;
  
  if (path.includes('/images')) {
    return '1'; // Flasti Images
  } else if (path.includes('/ai')) {
    return '2'; // Flasti AI
  }
  
  return null;
}

/**
 * Agrega el parámetro ref a una URL
 * @param url URL a la que agregar el parámetro
 * @returns URL con el parámetro ref agregado
 */
export function addAffiliateRefToUrl(url: string): string {
  if (typeof window === 'undefined') return url;
  
  try {
    const savedData = localStorage.getItem('flasti_affiliate');
    if (!savedData) return url;
    
    const { ref } = JSON.parse(savedData);
    if (!ref) return url;
    
    // Crear un objeto URL para manipular fácilmente los parámetros
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('ref', ref);
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error al agregar ref a URL:', error);
    return url;
  }
}

/**
 * Obtiene el ID del afiliado actual
 * @returns ID del afiliado o null si no hay
 */
export function getCurrentAffiliateRef(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedData = localStorage.getItem('flasti_affiliate');
    if (!savedData) return null;
    
    const { ref, timestamp } = JSON.parse(savedData);
    
    // Verificar si el ref guardado aún es válido (7 días)
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (now - timestamp < sevenDays) {
      return ref;
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener ref de afiliado:', error);
    return null;
  }
}
