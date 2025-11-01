import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type ThemeName = 'default' | 'halloween' | 'christmas';

const THEME_CACHE_KEY = 'flasti_active_theme';
const THEME_CACHE_TIMESTAMP_KEY = 'flasti_theme_timestamp';
const THEME_CHANGE_EVENT = 'flasti_theme_changed';
const CACHE_DURATION = 10 * 1000; // 10 segundos - caché muy corto para actualizaciones rápidas

export function useSeasonalTheme() {
  // Cargar tema desde localStorage inmediatamente para evitar flash, pero sin asumir 'default'
  const getCachedTheme = (): ThemeName | null => {
    if (typeof window === 'undefined') return null;
    
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
    
    return null; // No asumir 'default', esperar a cargar desde Supabase
  };

  const cachedTheme = getCachedTheme();
  const [activeTheme, setActiveTheme] = useState<ThemeName>(cachedTheme || 'default');
  const [loading, setLoading] = useState(true);

  const clearThemeCache = () => {
    try {
      localStorage.removeItem(THEME_CACHE_KEY);
      localStorage.removeItem(THEME_CACHE_TIMESTAMP_KEY);
      console.log('🎨 Caché de tema limpiado');
    } catch (error) {
      console.error('Error clearing theme cache:', error);
    }
  };

  const loadActiveTheme = async (fromBroadcast = false) => {
    try {
      console.log('🎨 Cargando tema desde Supabase...');
      const { data, error } = await supabase
        .from('seasonal_themes')
        .select('theme_name')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        const themeName = data.theme_name as ThemeName;
        console.log('🎨 Tema cargado desde Supabase:', themeName, fromBroadcast ? '(desde broadcast)' : '');
        setActiveTheme(themeName);
        
        // Guardar en localStorage para carga rápida en próximas visitas
        try {
          localStorage.setItem(THEME_CACHE_KEY, themeName);
          localStorage.setItem(THEME_CACHE_TIMESTAMP_KEY, Date.now().toString());
          
          // Notificar a otras pestañas/ventanas
          if (!fromBroadcast && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: themeName }));
          }
        } catch (error) {
          console.error('Error caching theme:', error);
        }
      } else {
        // Si no hay tema activo o hay error, usar default
        console.log('🎨 Sin tema activo en Supabase, usando default', error ? `(error: ${error.message})` : '');
        setActiveTheme('default');
        try {
          localStorage.setItem(THEME_CACHE_KEY, 'default');
          localStorage.setItem(THEME_CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (e) {
          console.error('Error caching default theme:', e);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setActiveTheme('default');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar tema inicial
    loadActiveTheme();

    // Escuchar cambios de tema desde otras pestañas/ventanas (BroadcastChannel)
    const handleThemeChange = (event: CustomEvent) => {
      console.log('🎨 Cambio de tema detectado desde otra pestaña:', event.detail);
      clearThemeCache();
      loadActiveTheme(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(THEME_CHANGE_EVENT as any, handleThemeChange as any);
    }

    // Suscripción en tiempo real para cambios de tema - TODOS los eventos
    const channel = supabase
      .channel('seasonal_themes_realtime', {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar TODOS los eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'seasonal_themes',
        },
        (payload) => {
          console.log('🎨 Cambio detectado en temas desde Supabase:', payload);
          // Limpiar caché inmediatamente
          clearThemeCache();
          // Recargar tema inmediatamente
          loadActiveTheme();
        }
      )
      .subscribe((status) => {
        console.log('🎨 Estado de suscripción de temas:', status);
      });

    // Polling adicional cada 5 segundos como respaldo
    const pollingInterval = setInterval(() => {
      const timestamp = localStorage.getItem(THEME_CACHE_TIMESTAMP_KEY);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age > CACHE_DURATION) {
          console.log('🎨 Polling: Actualizando tema por caché expirado');
          clearThemeCache();
          loadActiveTheme();
        }
      }
    }, 5000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(THEME_CHANGE_EVENT as any, handleThemeChange as any);
      }
      supabase.removeChannel(channel);
      clearInterval(pollingInterval);
    };
  }, []);

  return { activeTheme, loading };
}
