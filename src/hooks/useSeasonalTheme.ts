import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type ThemeName = 'default' | 'halloween' | 'christmas';

const THEME_CACHE_KEY = 'flasti_active_theme';
const THEME_CACHE_TIMESTAMP_KEY = 'flasti_theme_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useSeasonalTheme() {
  // Cargar tema desde localStorage inmediatamente para evitar flash
  const getCachedTheme = (): ThemeName => {
    if (typeof window === 'undefined') return 'default';
    
    try {
      const cached = localStorage.getItem(THEME_CACHE_KEY);
      const timestamp = localStorage.getItem(THEME_CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          return cached as ThemeName;
        }
      }
    } catch (error) {
      console.error('Error reading theme cache:', error);
    }
    
    return 'default';
  };

  const [activeTheme, setActiveTheme] = useState<ThemeName>(getCachedTheme());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveTheme();

    // Suscripción en tiempo real para cambios de tema
    const channel = supabase
      .channel('seasonal_themes_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seasonal_themes',
        },
        () => {
          loadActiveTheme();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadActiveTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('seasonal_themes')
        .select('theme_name')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        const themeName = data.theme_name as ThemeName;
        setActiveTheme(themeName);
        
        // Guardar en localStorage para carga rápida
        try {
          localStorage.setItem(THEME_CACHE_KEY, themeName);
          localStorage.setItem(THEME_CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (error) {
          console.error('Error caching theme:', error);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  return { activeTheme, loading };
}
