import { supabase } from '@/lib/supabase';

export interface CountryPrice {
  id: string;
  country_code: string;
  country_name: string;
  price: number;
  currency_code: string;
  currency_symbol: string;
  updated_at: string;
  created_at: string;
}

export class CountryPriceService {
  /**
   * Obtiene el precio para un país específico
   * @param countryCode Código de país de dos letras (ISO 3166-1 alpha-2)
   */
  static async getCountryPrice(countryCode: string): Promise<CountryPrice | null> {
    const { data, error } = await supabase
      .from('country_prices')
      .select('*')
      .eq('country_code', countryCode.toUpperCase())
      .single();

    if (error) {
      console.error('Error al obtener precio por país:', error);
      return null;
    }

    return data;
  }

  /**
   * Obtiene todos los precios por país
   */
  static async getAllCountryPrices(): Promise<CountryPrice[]> {
    const { data, error } = await supabase
      .from('country_prices')
      .select('*')
      .order('country_name', { ascending: true });

    if (error) {
      console.error('Error al obtener precios por país:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Actualiza el precio para un país
   * @param countryCode Código de país
   * @param price Nuevo precio
   */
  static async updateCountryPrice(countryCode: string, price: number): Promise<boolean> {
    const { error } = await supabase
      .from('country_prices')
      .update({ price })
      .eq('country_code', countryCode.toUpperCase());

    if (error) {
      console.error('Error al actualizar precio:', error);
      return false;
    }

    return true;
  }

  /**
   * Actualiza múltiples precios por país a la vez
   * @param prices Array de objetos con código de país y precio
   */
  static async updateMultipleCountryPrices(
    prices: Array<{ country_code: string; price: number }>
  ): Promise<boolean> {
    try {
      // Actualizar precios uno por uno
      for (const priceData of prices) {
        const { error } = await supabase
          .from('country_prices')
          .update({ price: priceData.price })
          .eq('country_code', priceData.country_code.toUpperCase());

        if (error) {
          console.error('Error al actualizar precio para', priceData.country_code, ':', error);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar precios:', error);
      return false;
    }
  }
}
