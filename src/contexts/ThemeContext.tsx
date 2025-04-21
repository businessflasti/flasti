"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

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

  // No aplicar ninguna clase de tema
  useEffect(() => {
    // Guardar tema en localStorage
    localStorage.setItem('theme', theme);

    // Eliminar cualquier clase de tema
    document.documentElement.classList.remove('light', 'dark');
  }, [theme]);

  // Asegurarse de que no se aplique ningún tema cuando cambie la ruta
  useEffect(() => {
    const handleRouteChange = () => {
      // Eliminar cualquier clase de tema
      document.documentElement.classList.remove('light', 'dark');
    };

    // Escuchar cambios de ruta
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme
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