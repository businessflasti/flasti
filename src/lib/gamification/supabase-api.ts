import { supabase } from '../supabase';

/**
 * Clase para interactuar con la API de Supabase para las funcionalidades de gamificación
 */
export class SupabaseGamificationAPI {
  private static instance: SupabaseGamificationAPI;

  private constructor() {}

  public static getInstance(): SupabaseGamificationAPI {
    if (!SupabaseGamificationAPI.instance) {
      SupabaseGamificationAPI.instance = new SupabaseGamificationAPI();
    }
    return SupabaseGamificationAPI.instance;
  }

  /**
   * Verifica si existen las tablas necesarias para la gamificación
   */
  public async checkGamificationTables(): Promise<boolean> {
    try {
      // Verificar si existe la tabla de logros
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('id')
        .limit(1);

      if (achievementsError) {
        console.error('Error al verificar tabla de logros:', achievementsError);
        return false;
      }

      // Verificar si existe la tabla de temas
      const { data: themesData, error: themesError } = await supabase
        .from('themes')
        .select('id')
        .limit(1);

      if (themesError) {
        console.error('Error al verificar tabla de temas:', themesError);
        return false;
      }

      // Verificar si existe la tabla de objetivos
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('id')
        .limit(1);

      if (goalsError) {
        console.error('Error al verificar tabla de objetivos:', goalsError);
        return false;
      }

      // Verificar si existe la tabla de clasificaciones
      const { data: leaderboardsData, error: leaderboardsError } = await supabase
        .from('leaderboards')
        .select('id')
        .limit(1);

      if (leaderboardsError) {
        console.error('Error al verificar tabla de clasificaciones:', leaderboardsError);
        return false;
      }

      // Verificar si existe la tabla de tips diarios
      const { data: tipsData, error: tipsError } = await supabase
        .from('daily_tips')
        .select('id')
        .limit(1);

      if (tipsError) {
        console.error('Error al verificar tabla de tips diarios:', tipsError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error general al verificar tablas de gamificación:', error);
      return false;
    }
  }

  /**
   * Verifica si existen las funciones RPC necesarias para la gamificación
   */
  public async checkGamificationFunctions(): Promise<boolean> {
    try {
      // Verificar si existe la función get_user_achievement_points
      const { data: pointsData, error: pointsError } = await supabase
        .rpc('get_user_achievement_points', { user_id_param: '00000000-0000-0000-0000-000000000000' });

      if (pointsError && !pointsError.message.includes('invalid input syntax')) {
        console.error('Error al verificar función get_user_achievement_points:', pointsError);
        return false;
      }

      // Verificar si existe la función get_top_affiliates_for_period
      const { data: affiliatesData, error: affiliatesError } = await supabase
        .rpc('get_top_affiliates_for_period', { 
          start_date_param: new Date().toISOString(),
          end_date_param: new Date().toISOString(),
          limit_param: 1
        });

      if (affiliatesError && !affiliatesError.message.includes('invalid input syntax')) {
        console.error('Error al verificar función get_top_affiliates_for_period:', affiliatesError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error general al verificar funciones de gamificación:', error);
      return false;
    }
  }

  /**
   * Inicializa las tablas y funciones necesarias para la gamificación
   * Nota: Esta función debe ejecutarse con permisos de administrador
   */
  public async initializeGamification(): Promise<boolean> {
    // Esta función requeriría permisos de administrador para ejecutar SQL directamente
    // En una implementación real, esto se haría a través de migraciones o scripts de inicialización
    console.warn('La inicialización de gamificación debe realizarse manualmente siguiendo las instrucciones en README.md');
    return false;
  }
}

export const supabaseGamificationAPI = SupabaseGamificationAPI.getInstance();
