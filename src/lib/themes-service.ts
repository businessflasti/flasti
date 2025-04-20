import { supabase } from './supabase';

export interface Theme {
  id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  is_dark: boolean;
  is_system: boolean;
}

export interface UserPreferences {
  id: number;
  user_id: string;
  theme_id: number | null;
  notification_settings: Record<string, any>;
  display_settings: Record<string, any>;
}

export class ThemesService {
  private static instance: ThemesService;

  private constructor() {}

  public static getInstance(): ThemesService {
    if (!ThemesService.instance) {
      ThemesService.instance = new ThemesService();
    }
    return ThemesService.instance;
  }

  /**
   * Obtiene todos los temas disponibles
   */
  public async getAllThemes(): Promise<Theme[]> {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('is_system', { ascending: false })
        .order('name');

      if (error) {
        console.error('Error al obtener temas:', error);
        return [];
      }

      return data as Theme[];
    } catch (error) {
      console.error('Error general al obtener temas:', error);
      return [];
    }
  }

  /**
   * Obtiene las preferencias del usuario
   */
  public async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontraron preferencias, crear unas por defecto
          return this.createDefaultUserPreferences(userId);
        }
        console.error('Error al obtener preferencias de usuario:', error);
        return null;
      }

      return data as UserPreferences;
    } catch (error) {
      console.error('Error general al obtener preferencias de usuario:', error);
      return null;
    }
  }

  /**
   * Crea preferencias por defecto para un usuario
   */
  private async createDefaultUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      // Obtener el tema claro por defecto
      const { data: lightTheme, error: themeError } = await supabase
        .from('themes')
        .select('id')
        .eq('name', 'Flasti Claro')
        .single();

      if (themeError) {
        console.error('Error al obtener tema por defecto:', themeError);
        return null;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          theme_id: lightTheme.id,
          notification_settings: {
            email_notifications: true,
            push_notifications: true
          },
          display_settings: {
            compact_view: false,
            show_tooltips: true
          }
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear preferencias por defecto:', error);
        return null;
      }

      return data as UserPreferences;
    } catch (error) {
      console.error('Error general al crear preferencias por defecto:', error);
      return null;
    }
  }

  /**
   * Actualiza el tema del usuario
   */
  public async updateUserTheme(userId: string, themeId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme_id: themeId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error al actualizar tema del usuario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error general al actualizar tema del usuario:', error);
      return false;
    }
  }

  /**
   * Obtiene el tema actual del usuario
   */
  public async getUserTheme(userId: string): Promise<Theme | null> {
    try {
      const preferences = await this.getUserPreferences(userId);
      
      if (!preferences || !preferences.theme_id) {
        // Si no hay preferencias o tema, obtener el tema claro por defecto
        const { data: defaultTheme, error: defaultError } = await supabase
          .from('themes')
          .select('*')
          .eq('name', 'Flasti Claro')
          .single();

        if (defaultError) {
          console.error('Error al obtener tema por defecto:', defaultError);
          return null;
        }

        return defaultTheme as Theme;
      }

      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('id', preferences.theme_id)
        .single();

      if (error) {
        console.error('Error al obtener tema del usuario:', error);
        return null;
      }

      return data as Theme;
    } catch (error) {
      console.error('Error general al obtener tema del usuario:', error);
      return null;
    }
  }
}

export const themesService = ThemesService.getInstance();
