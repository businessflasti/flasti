'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, themesService } from '@/lib/themes-service';
import { toast } from 'sonner';

interface ThemesContextType {
  themes: Theme[];
  currentTheme: Theme | null;
  loading: boolean;
  setUserTheme: (themeId: number) => Promise<boolean>;
  applyTheme: (theme: Theme) => void;
}

const ThemesContext = createContext<ThemesContextType | undefined>(undefined);

export function ThemesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserTheme();
    }
  }, [user]);

  const loadThemes = async () => {
    setLoading(true);
    try {
      const allThemes = await themesService.getAllThemes();
      setThemes(allThemes);
    } catch (error) {
      console.error('Error al cargar temas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTheme = async () => {
    if (!user) return;
    
    try {
      const userTheme = await themesService.getUserTheme(user.id);
      
      if (userTheme) {
        setCurrentTheme(userTheme);
        applyTheme(userTheme);
      }
    } catch (error) {
      console.error('Error al cargar tema del usuario:', error);
    }
  };

  const setUserTheme = async (themeId: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const success = await themesService.updateUserTheme(user.id, themeId);
      
      if (success) {
        const selectedTheme = themes.find(theme => theme.id === themeId);
        
        if (selectedTheme) {
          setCurrentTheme(selectedTheme);
          applyTheme(selectedTheme);
          toast.success(`Tema "${selectedTheme.name}" aplicado con éxito`);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error al actualizar tema del usuario:', error);
      toast.error('Error al actualizar el tema');
      return false;
    }
  };

  const applyTheme = (theme: Theme) => {
    // Aplicar tema al documento
    const root = document.documentElement;
    
    // Aplicar colores
    root.style.setProperty('--primary-color', theme.primary_color);
    root.style.setProperty('--secondary-color', theme.secondary_color);
    root.style.setProperty('--accent-color', theme.accent_color);
    
    // Aplicar modo claro/oscuro
    if (theme.is_dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    themes,
    currentTheme,
    loading,
    setUserTheme,
    applyTheme
  };

  return <ThemesContext.Provider value={value}>{children}</ThemesContext.Provider>;
}

export function useThemes() {
  const context = useContext(ThemesContext);
  if (context === undefined) {
    throw new Error('useThemes debe ser usado dentro de un ThemesProvider');
  }
  return context;
}
