// Configuración de productos de Hotmart y aplicaciones internas

export const HOTMART_PRODUCTS = {
  FLASTI_IMAGENES: {
    id: '4962378', // ID real del producto en Hotmart
    name: 'Flasti Imágenes',
    appId: 1,
    description: 'Genera imágenes impresionantes con inteligencia artificial',
    basePrice: 5,
    commissionLevels: {
      1: 50, // 50% para nivel 1
      2: 60, // 60% para nivel 2
      3: 70  // 70% para nivel 3
    }
  },
  FLASTI_AI: {
    id: '4968671', // ID real del producto en Hotmart
    name: 'Flasti AI',
    appId: 2,
    description: 'Asistente de IA avanzado para responder preguntas y generar contenido',
    basePrice: 7,
    commissionLevels: {
      1: 50,
      2: 60,
      3: 70
    }
  }
};

// Mapeo de IDs de Hotmart a IDs de aplicaciones internas
export const HOTMART_TO_APP_ID_MAP = {
  '4962378': 1, // Flasti Imágenes
  '4968671': 2  // Flasti AI
};

// Función para obtener el ID de la aplicación interna a partir del ID de Hotmart
export function getAppIdFromHotmartId(hotmartProductId: string): number | null {
  return HOTMART_TO_APP_ID_MAP[hotmartProductId] || null;
}