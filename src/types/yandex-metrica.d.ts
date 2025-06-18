// Tipos TypeScript para Yandex Metrica
declare global {
  interface Window {
    ym: (
      counterId: number,
      method: string,
      params?: any,
      callback?: () => void
    ) => void;
    Ya?: {
      Metrika2?: any;
    };
  }
}

// Parámetros para eventos de Yandex Metrica
export interface YandexMetricaEventParams {
  [key: string]: any;
}

// Parámetros para objetivos
export interface YandexMetricaGoalParams {
  order_price?: number;
  currency?: string;
  [key: string]: any;
}

// Parámetros para e-commerce
export interface YandexMetricaEcommerceParams {
  purchase?: {
    actionField: {
      id: string;
      revenue: number;
      currency?: string;
    };
    products: Array<{
      id: string;
      name: string;
      category?: string;
      price: number;
      quantity?: number;
    }>;
  };
  add?: {
    products: Array<{
      id: string;
      name: string;
      category?: string;
      price: number;
      quantity?: number;
    }>;
  };
  remove?: {
    products: Array<{
      id: string;
      name: string;
      category?: string;
      price: number;
      quantity?: number;
    }>;
  };
}

// Configuración de inicialización
export interface YandexMetricaConfig {
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
  webvisor?: boolean;
  trackHash?: boolean;
  ecommerce?: boolean;
  params?: YandexMetricaEventParams;
}

export {};
