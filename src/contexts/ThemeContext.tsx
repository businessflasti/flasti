"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'premium';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isPremiumUser: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Verificar si el usuario es premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/user/premium-status');
        if (response.ok) {
          const data = await response.json();
          setIsPremiumUser(data.isPremium || false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    checkPremiumStatus();
  }, []);

  // Cargar tema básico (claro/oscuro/premium)
  useEffect(() => {
    // Recuperar tema guardado
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'premium')) {
      // Si el tema es premium pero el usuario no es premium, usar dark
      if (savedTheme === 'premium' && !isPremiumUser) {
        setTheme('dark');
      } else {
        setTheme(savedTheme);
      }
    } else {
      // Si no hay tema guardado o es inválido, usar oscuro por defecto
      setTheme('dark');
    }
  }, [isPremiumUser]);

  // Aplicar clases de tema
  useEffect(() => {
    // Guardar tema en localStorage
    localStorage.setItem('theme', theme);

    // Eliminar cualquier clase de tema anterior
    document.documentElement.classList.remove('light', 'dark', 'premium');
    
    // Aplicar la clase del tema actual
    document.documentElement.classList.add(theme);
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
      setTheme,
      isPremiumUser
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