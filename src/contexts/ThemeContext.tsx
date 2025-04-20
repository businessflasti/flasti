"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme as CustomTheme, themesService } from '@/lib/themes-service';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customTheme: CustomTheme | null;
  setCustomTheme: (themeId: number) => Promise<boolean>;
  applyCustomTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [customTheme, setCustomThemeState] = useState<CustomTheme | null>(null);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Cargar temas personalizados
  useEffect(() => {
    const loadCustomThemes = async () => {
      try {
        const themes = await themesService.getAllThemes();
        setCustomThemes(themes);
      } catch (error) {
        console.error('Error al cargar temas personalizados:', error);
      }
    };

    loadCustomThemes();
  }, []);

  // Cargar tema básico (claro/oscuro)
  useEffect(() => {
    // Recuperar tema guardado
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Si no hay tema guardado o es inválido, usar oscuro por defecto
      setTheme('dark');
    }
  }, []);

  // Aplicar tema básico
  useEffect(() => {
    // Guardar tema en localStorage
    localStorage.setItem('theme', theme);

    // Aplicar tema básico solo si no hay tema personalizado
    if (!customTheme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, customTheme]);

  // Función para aplicar tema personalizado
  const applyCustomTheme = (theme: CustomTheme) => {
    // Aplicar tema al documento
    const root = document.documentElement;

    // Aplicar colores
    root.style.setProperty('--primary-color', theme.primary_color);
    root.style.setProperty('--secondary-color', theme.secondary_color);
    root.style.setProperty('--accent-color', theme.accent_color);

    // Aplicar modo claro/oscuro
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme.is_dark ? 'dark' : 'light');

    // Actualizar el estado del tema básico para mantener sincronización
    setTheme(theme.is_dark ? 'dark' : 'light');

    // Guardar en localStorage
    localStorage.setItem('customThemeId', theme.id.toString());
    setCustomThemeState(theme);
  };

  // Cargar tema personalizado guardado
  useEffect(() => {
    const loadSavedCustomTheme = async () => {
      try {
        // Intentar cargar desde localStorage primero
        const savedThemeId = localStorage.getItem('customThemeId');

        if (savedThemeId && customThemes.length > 0) {
          const themeId = parseInt(savedThemeId);
          const theme = customThemes.find(t => t.id === themeId);

          if (theme) {
            applyCustomTheme(theme);
            return;
          }
        }

        // Si no hay tema guardado o no se encontró, intentar cargar desde la base de datos
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userTheme = await themesService.getUserTheme(userId);
          if (userTheme) {
            applyCustomTheme(userTheme);
          }
        }
      } catch (error) {
        console.error('Error al cargar tema personalizado guardado:', error);
      }
    };

    if (customThemes.length > 0) {
      loadSavedCustomTheme();
    }
  }, [customThemes]);

  // Función para cambiar el tema personalizado
  const setCustomTheme = async (themeId: number): Promise<boolean> => {
    try {
      const userId = localStorage.getItem('userId');

      // Si hay un usuario logueado, guardar en la base de datos
      if (userId) {
        await themesService.updateUserTheme(userId, themeId);
      }

      // Buscar el tema en la lista de temas
      const theme = customThemes.find(t => t.id === themeId);

      if (theme) {
        applyCustomTheme(theme);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error al cambiar tema personalizado:', error);
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      customTheme,
      setCustomTheme,
      applyCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}