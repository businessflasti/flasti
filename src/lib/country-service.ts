import { supabase } from './supabase';

/**
 * Detecta el país del usuario usando ipapi.co
 */
export async function detectUserCountry(): Promise<string | null> {
  try {
    // Primero verificar localStorage
    const savedCountry = localStorage.getItem('userCountry');
    if (savedCountry && savedCountry !== 'GLOBAL') {
      return savedCountry;
    }

    // Detectar vía API
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Error al detectar país');
    }

    const data = await response.json();
    const countryCode = data.country_code;

    if (countryCode) {
      // Guardar en localStorage
      localStorage.setItem('userCountry', countryCode);
      return countryCode;
    }

    return null;
  } catch (error) {
    console.error('Error detectando país:', error);
    return null;
  }
}

/**
 * Guarda el país del usuario en su perfil
 */
export async function saveUserCountry(userId: string, countryCode: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ country: countryCode })
      .eq('user_id', userId);

    if (error) {
      console.error('Error guardando país del usuario:', error);
      return false;
    }

    console.log(`✅ País guardado para usuario ${userId}: ${countryCode}`);
    return true;
  } catch (error) {
    console.error('Error guardando país:', error);
    return false;
  }
}

/**
 * Detecta y guarda el país del usuario automáticamente
 */
export async function detectAndSaveUserCountry(userId: string): Promise<void> {
  try {
    // Verificar si el usuario ya tiene país guardado
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('country')
      .eq('user_id', userId)
      .single();

    // Si ya tiene país, no hacer nada
    if (profile?.country) {
      console.log(`Usuario ${userId} ya tiene país: ${profile.country}`);
      return;
    }

    // Detectar país
    const countryCode = await detectUserCountry();
    
    if (countryCode) {
      // Guardar en la base de datos
      await saveUserCountry(userId, countryCode);
    }
  } catch (error) {
    console.error('Error en detectAndSaveUserCountry:', error);
  }
}
