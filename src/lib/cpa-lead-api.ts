"use strict";

// Usar fetch nativo de Node.js (disponible desde Node 18+)
// @ts-check

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
  payout_type: string;
  countries: string[];
  device: string;
  conversion: string;
  is_fast_pay: boolean;
  daily_cap: number | false;
  epc: number;
  creatives: {
    url?: string;
    screenshot?: string;
    og_image?: string;
  };
  offer_rank: number;
}

export interface CPALeadOffersResponse {
  offers: CPALeadOffer[];
  status: string;
  message?: string;
}

// Cache para ofertas
interface OffersCache {
  data: CPALeadOffer[];
  timestamp: number;
  country?: string;
}

// Cache global para ofertas
let offersCache: OffersCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Detección de país del usuario
export async function detectUserCountry(): Promise<string> {
  try {
    // Intentar obtener desde localStorage primero
    if (typeof window !== 'undefined') {
      const cachedCountry = localStorage.getItem('userCountry');
      const cacheTime = localStorage.getItem('userCountryTime');
      
      // Si el cache es reciente (menos de 1 hora), usarlo
      if (cachedCountry && cacheTime) {
        const timeDiff = Date.now() - parseInt(cacheTime);
        if (timeDiff < 60 * 60 * 1000) { // 1 hora
          console.log('🌍 País desde cache:', cachedCountry);
          return cachedCountry;
        }
      }
    }

    console.log('🌍 Detectando país del usuario...');

    // Servicios de geolocalización con fallback
    const geoServices = [
      'https://ipapi.co/country_code/',
      'https://api.country.is/',
      'https://ipinfo.io/country'
    ];

    for (const service of geoServices) {
      try {
        const response = await fetch(service, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          let country = '';
          
          if (service.includes('country.is')) {
            const data = await response.json();
            country = data.country;
          } else {
            country = (await response.text()).trim().replace(/"/g, '');
          }
          
          if (country && country.length === 2) {
            console.log(`🌍 País detectado: ${country} (desde ${service})`);
            
            // Guardar en localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('userCountry', country);
              localStorage.setItem('userCountryTime', Date.now().toString());
            }
            
            return country;
          }
        }
      } catch (error) {
        console.warn(`Error con servicio ${service}:`, error);
        continue;
      }
    }

    // Fallback: usar 'US' como default
    console.log('🌍 Usando país por defecto: US');
    return 'US';

  } catch (error) {
    console.error('Error detectando país:', error);
    return 'US';
  }
}

/**
 * Obtiene todas las ofertas disponibles de CPALead (sin filtro de país)
 * @returns Promise<CPALeadOffer[]> Array de ofertas o array vacío en caso de error
 */
export async function getAllOffersFromCpaLead(forceRefresh = false): Promise<CPALeadOffer[]> {
  try {
    // Verificar cache si no se fuerza el refresh
    if (!forceRefresh && offersCache) {
      const timeDiff = Date.now() - offersCache.timestamp;
      if (timeDiff < CACHE_DURATION) {
        console.log('🔄 CPALead: Usando ofertas desde cache');
        return offersCache.data;
      }
    }

    console.log('🔄 CPALead: Obteniendo ofertas frescas de la API...');
    
    const params = new URLSearchParams({
      id: CPALEAD_CONFIG.ID,
      api_key: CPALEAD_CONFIG.API_KEY,
      format: 'JSON',
      limit: '350', // Obtener el máximo de ofertas
      sort: 'payout_desc' // Ordenar por pago descendente
    });

    const url = `${CPALEAD_CONFIG.BASE_URL}/offers?${params.toString()}`;

    // Realizar la solicitud GET
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flasti.com/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('CPALead: Error en la respuesta HTTP:', response.status, response.statusText);
      return offersCache?.data || [];
    }

    // Procesar la respuesta JSON
    const data = await response.json() as CPALeadOffersResponse;

    if (!data || typeof data !== 'object') {
      console.error('CPALead: Respuesta inválida - no es un objeto JSON válido');
      return offersCache?.data || [];
    }

    // Verificar si la respuesta contiene ofertas
    if (!data.offers || !Array.isArray(data.offers)) {
      console.warn('CPALead: No se encontraron ofertas en la respuesta o formato inválido');
      return offersCache?.data || [];
    }

    console.log(`✅ CPALead: Se obtuvieron ${data.offers.length} ofertas exitosamente`);
    
    // Actualizar cache
    offersCache = {
      data: data.offers,
      timestamp: Date.now()
    };
    
    return data.offers;

  } catch (error) {
    console.error('CPALead: Error al obtener ofertas:', error);
    
    // Retornar cache si existe, sino array vacío
    return offersCache?.data || [];
  }
}

/**
 * Filtra ofertas por país del usuario
 * @param userCountry Código de país del usuario (ej: 'US', 'ES', 'MX')
 * @param forceRefresh Forzar actualización de ofertas
 * @returns Promise<CPALeadOffer[]> Array de ofertas filtradas
 */
export async function getOffersFromCpaLead(userCountry?: string, forceRefresh = false): Promise<CPALeadOffer[]> {
  try {
    // Detectar país del usuario si no se proporciona
    const detectedCountry = userCountry || await detectUserCountry();
    
    console.log('🌍 CPALead: Filtrando ofertas para país:', detectedCountry);
    
    // Obtener todas las ofertas
    const allOffers = await getAllOffersFromCpaLead(forceRefresh);
    
    if (allOffers.length === 0) {
      console.warn('CPALead: No hay ofertas disponibles para filtrar');
      return [];
    }

    // Filtrar ofertas que incluyen el país del usuario
    const filteredOffers = allOffers.filter(offer => 
      offer.countries && 
      Array.isArray(offer.countries) && 
      offer.countries.includes(detectedCountry)
    );

    console.log(`🎯 CPALead: ${filteredOffers.length} ofertas disponibles para ${detectedCountry} (de ${allOffers.length} totales)`);
    
    // Estadísticas para debug
    if (filteredOffers.length > 0) {
      const avgPayout = (filteredOffers.reduce((sum, o) => sum + parseFloat(o.amount || '0'), 0) / filteredOffers.length).toFixed(2);
      const fastPayCount = filteredOffers.filter(o => o.is_fast_pay).length;
      const fastPayPercent = ((fastPayCount / filteredOffers.length) * 100).toFixed(1);
      
      console.log(`💰 CPALead: Payout promedio: $${avgPayout} USD`);
      console.log(`⚡ CPALead: Fast Pay: ${fastPayCount}/${filteredOffers.length} (${fastPayPercent}%)`);
      
      // Mostrar top 3 ofertas
      const topOffers = filteredOffers.slice(0, 3);
      console.log('🏆 CPALead: Top 3 ofertas:');
      topOffers.forEach((offer, index) => {
        console.log(`  ${index + 1}. ${offer.title.substring(0, 40)}... - $${offer.amount} USD`);
      });
    }
    
    return filteredOffers;

  } catch (error) {
    console.error('CPALead: Error al filtrar ofertas por país:', error);
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Flasti.com/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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