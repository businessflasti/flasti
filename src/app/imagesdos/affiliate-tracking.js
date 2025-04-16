/**
 * Sistema de seguimiento de afiliados para Flasti Images
 *
 * Este script maneja el seguimiento de afiliados en las páginas HTML de Flasti Images.
 * Captura el parámetro ref de la URL, lo guarda en localStorage, y lo preserva
 * durante la navegación entre páginas.
 *
 * URLs definitivas:
 * - Página principal: https://flasti.com/images
 * - Página de checkout: https://flasti.com/images/checkout
 */

// Configuración
const AFFILIATE_STORAGE_KEY = 'flasti_affiliate';
const AFFILIATE_COOKIE_NAME = 'flasti_affiliate';
const AFFILIATE_EXPIRY_DAYS = 7;
const TRACKING_ENDPOINT = '/api/affiliate/track';
const CHECKOUT_TRACKING_ENDPOINT = '/api/affiliate/checkout-visit';
const PRODUCT_ID = '1'; // ID de Flasti Images

/**
 * Captura el parámetro ref de la URL y lo guarda en localStorage
 * @returns El ID del afiliado si existe
 */
function captureAffiliateRef() {
  try {
    // Obtener el parámetro ref de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    // Si hay un parámetro ref en la URL, guardarlo
    if (ref) {
      // Guardar el ref y la timestamp
      const affiliateData = {
        ref: ref,
        timestamp: Date.now(),
        productId: PRODUCT_ID
      };

      localStorage.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(affiliateData));

      // Establecer cookie para el servidor
      setCookie(AFFILIATE_COOKIE_NAME, `${ref}_${PRODUCT_ID}`, AFFILIATE_EXPIRY_DAYS);

      // Registrar la visita en el servidor
      trackVisit(ref, PRODUCT_ID);

      return ref;
    }

    // Si no hay ref en la URL, verificar si hay uno guardado en localStorage
    const savedData = localStorage.getItem(AFFILIATE_STORAGE_KEY);
    if (savedData) {
      const { ref, timestamp } = JSON.parse(savedData);

      // Verificar si el ref guardado aún es válido (7 días)
      const now = Date.now();
      const expiryTime = AFFILIATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      if (now - timestamp < expiryTime) {
        return ref;
      } else {
        // Si ha expirado, eliminarlo
        localStorage.removeItem(AFFILIATE_STORAGE_KEY);
        deleteCookie(AFFILIATE_COOKIE_NAME);
      }
    }

    return null;
  } catch (error) {
    console.error('Error al capturar ref de afiliado:', error);
    return null;
  }
}

/**
 * Obtiene el ID del afiliado actual
 * @returns ID del afiliado o null si no hay
 */
function getCurrentAffiliateRef() {
  try {
    const savedData = localStorage.getItem(AFFILIATE_STORAGE_KEY);
    if (!savedData) return null;

    const { ref, timestamp } = JSON.parse(savedData);

    // Verificar si el ref guardado aún es válido (7 días)
    const now = Date.now();
    const expiryTime = AFFILIATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (now - timestamp < expiryTime) {
      return ref;
    }

    return null;
  } catch (error) {
    console.error('Error al obtener ref de afiliado:', error);
    return null;
  }
}

/**
 * Agrega el parámetro ref a una URL
 * @param {string} url URL a la que agregar el parámetro
 * @returns URL con el parámetro ref agregado
 */
function addAffiliateRefToUrl(url) {
  try {
    const ref = getCurrentAffiliateRef();
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
 * Registra una visita en el servidor
 * @param {string} ref ID del afiliado
 * @param {string} productId ID del producto
 */
function trackVisit(ref, productId) {
  try {
    fetch(`${TRACKING_ENDPOINT}?ref=${ref}&app=${productId}`, {
      method: 'GET',
      credentials: 'include'
    }).catch(error => {
      console.error('Error al registrar visita de afiliado:', error);
    });
  } catch (error) {
    console.error('Error al registrar visita:', error);
  }
}

/**
 * Registra una visita a checkout en el servidor
 * @param {string} ref ID del afiliado
 * @param {string} productId ID del producto
 */
function trackCheckoutVisit(ref, productId) {
  try {
    fetch(`${CHECKOUT_TRACKING_ENDPOINT}?ref=${ref}&product=${productId}`, {
      method: 'GET',
      credentials: 'include'
    }).catch(error => {
      console.error('Error al registrar visita de checkout:', error);
    });
  } catch (error) {
    console.error('Error al registrar visita a checkout:', error);
  }
}

/**
 * Establece una cookie
 * @param {string} name Nombre de la cookie
 * @param {string} value Valor de la cookie
 * @param {number} days Días de duración
 */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

/**
 * Elimina una cookie
 * @param {string} name Nombre de la cookie
 */
function deleteCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}

/**
 * Modifica los enlaces de checkout para incluir el parámetro ref
 */
function updateCheckoutLinks() {
  const ref = getCurrentAffiliateRef();
  if (!ref) return;

  // Buscar todos los enlaces a checkout
  // Buscar tanto enlaces relativos como absolutos
  const checkoutLinks = document.querySelectorAll(
    'a[href*="checkout.html"], a[href*="/images/checkout"], a[href*="flasti.com/images/checkout"]'
  );

  checkoutLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.setAttribute('href', addAffiliateRefToUrl(href));
  });
}

/**
 * Modifica el iframe de Hotmart para incluir el parámetro de afiliado
 */
function updateHotmartIframe() {
  const ref = getCurrentAffiliateRef();
  if (!ref) return;

  // Buscar el iframe de Hotmart
  const hotmartIframe = document.querySelector('iframe[src*="hotmart.com"]');

  if (hotmartIframe) {
    let src = hotmartIframe.getAttribute('src');
    src = `${src}${src.includes('?') ? '&' : '?'}aff=${ref}&src=flasti`;
    hotmartIframe.setAttribute('src', src);

    // Registrar la visita a checkout
    trackCheckoutVisit(ref, PRODUCT_ID);
  }
}

// Inicializar el seguimiento cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Capturar el parámetro ref
  captureAffiliateRef();

  // Actualizar enlaces de checkout
  updateCheckoutLinks();

  // Si estamos en la página de checkout, actualizar el iframe de Hotmart
  if (window.location.href.includes('checkout.html') ||
      window.location.href.includes('/images/checkout')) {
    // Esperar a que el iframe se cargue
    setTimeout(updateHotmartIframe, 1000);
  }
});
