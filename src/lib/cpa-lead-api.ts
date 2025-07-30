// Usar fetch nativo de Node.js (disponible desde Node 18+)

// Configuración de la API de CPALead
const CPALEAD_CONFIG = {
  API_KEY: '22ac92e230e74a1ea5152eaa3258fecd',
  BASE_URL: 'https://www.cpalead.com/api',
  ID: '1' // Parámetro requerido por CPALead
};

// Tipos para las ofertas de CPALead
export interface CPALeadOffer {
  id: string;
  title: string;
  description: string;
  link: string;
  amount: string;
  payout_currency: string;
  creatives: {
    url?: string;
  };
  country: string;
  device: string;
  category: string;
  requirements: string;
}

export interface CPALeadOffersResponse {
  offers: CPALeadOffer[];
  status: string;
  message?: string;
}

/**
 * Obtiene las ofertas disponibles de CPALead
 * @returns Promise<CPALeadOffer[]> Array de ofertas o array vacío en caso de error
 */
export async function getOffersFromCpaLead(userCountry?: string): Promise<CPALeadOffer[]> {
  try {
    // Validar y normalizar el código de país
    let countryCode = userCountry;
    if (countryCode === 'Argentina') countryCode = 'AR';
    console.log('CPALead API Client: Procesando solicitud para país:', countryCode);

    // Construir la URL con todos los parámetros requeridos
    const params = new URLSearchParams({
      id: CPALEAD_CONFIG.ID,
      api_key: CPALEAD_CONFIG.API_KEY,
      format: 'JSON',
      country: countryCode || 'all', // Usar el código normalizado
      limit: '100', // Aumentar el límite para asegurar que obtengamos todas las ofertas
      offerwall_offers: 'true',
      device: 'all' // Obtener todas las ofertas independientemente del dispositivo
    });

    const url = `${CPALEAD_CONFIG.BASE_URL}/offers?${params.toString()}`;

    console.log('CPALead: Solicitando ofertas desde:', url);
    console.log('CPALead: País solicitado:', userCountry || 'all');

    // Realizar la solicitud GET con timeout más largo para asegurar respuesta completa
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flasti.com/1.0',
        'Cache-Control': 'no-cache' // Evitar caché
      },
      timeout: 10000 // 10 segundos de timeout
    });

    if (!response.ok) {
      console.error('CPALead: Error en la respuesta HTTP:', response.status, response.statusText);
      return [];
    }

    // Procesar la respuesta JSON
    const data = await response.json() as CPALeadOffersResponse;

    if (!data || typeof data !== 'object') {
      console.error('CPALead: Respuesta inválida - no es un objeto JSON válido');
      return [];
    }

    // Verificar si la respuesta contiene ofertas
    if (!data.offers || !Array.isArray(data.offers)) {
      console.warn('CPALead: No se encontraron ofertas en la respuesta o formato inválido');
      return [];
    }

    console.log(`CPALead: Se obtuvieron ${data.offers.length} ofertas exitosamente`);
    
    // Debug: mostrar información de las primeras ofertas
    if (data.offers.length > 0) {
      console.log('CPALead: Muestra de ofertas obtenidas:');
      data.offers.slice(0, 3).forEach((offer, index) => {
        console.log(`  Oferta ${index + 1}:`, {
          id: offer.id,
          title: offer.title?.substring(0, 50) + '...',
          country: offer.country,
          device: offer.device,
          amount: offer.amount,
          currency: offer.payout_currency
        });
      });
      
      // Mostrar países únicos
      const countries = [...new Set(data.offers.map(o => o.country).filter(Boolean))];
      console.log('CPALead: Países disponibles:', countries);
      
      // Mostrar dispositivos únicos
      const devices = [...new Set(data.offers.map(o => o.device).filter(Boolean))];
      console.log('CPALead: Dispositivos disponibles:', devices);
    }
    
    return data.offers;

  } catch (error) {
    console.error('CPALead: Error al obtener ofertas:', error);
    
    // Manejo específico de diferentes tipos de errores
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.error('CPALead: Timeout - La API tardó demasiado en responder');
      } else if (error.message.includes('ENOTFOUND')) {
        console.error('CPALead: Error de DNS - No se pudo resolver el dominio');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('CPALead: Conexión rechazada - El servidor no está disponible');
      }
    }

    // Retornar array vacío en caso de cualquier error
    return [];
  }
}

/**
 * Obtiene las reversiones de CPALead para un rango de fechas específico
 * @param startDate Fecha de inicio en formato yyyy-mm-dd
 * @param endDate Fecha de fin en formato yyyy-mm-dd
 * @returns Promise<any[]> Array de reversiones o array vacío en caso de error
 */
export async function getReversalsFromCpaLead(startDate: string, endDate: string): Promise<any[]> {
  try {
    // Validar formato de fechas
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      console.error('CPALead: Formato de fecha inválido. Use yyyy-mm-dd');
      return [];
    }

    // Verificar que el rango no sea mayor a un mes
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 31) {
      console.error('CPALead: El rango de fechas no puede ser mayor a un mes');
      return [];
    }

    // Construir la URL con parámetros
    const params = new URLSearchParams({
      id: CPALEAD_CONFIG.ID,
      api_key: CPALEAD_CONFIG.API_KEY,
      date_start: startDate,
      date_end: endDate,
      format: 'JSON'
    });

    const url = `${CPALEAD_CONFIG.BASE_URL}/reversals?${params.toString()}`;

    console.log('CPALead: Solicitando reversiones desde:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flasti.com/1.0'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.error('CPALead: Error en la respuesta HTTP para reversiones:', response.status, response.statusText);
      return [];
    }

    const data = await response.json() as any;

    if (!data || !data.reversals || !Array.isArray(data.reversals)) {
      console.warn('CPALead: No se encontraron reversiones en la respuesta');
      return [];
    }

    console.log(`CPALead: Se obtuvieron ${data.reversals.length} reversiones exitosamente`);
    return data.reversals;

  } catch (error) {
    console.error('CPALead: Error al obtener reversiones:', error);
    return [];
  }
}