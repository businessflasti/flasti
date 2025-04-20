'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Laptop, Check, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface ThemeSelectorProps {
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

const ThemeSelector = ({ variant = 'icon', size = 'md' }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { id: 'light', label: t('modoClaro'), icon: <Sun size={16} /> },
    { id: 'dark', label: t('modoOscuro'), icon: <Moon size={16} /> },
    { id: 'system', label: 'Sistema', icon: <Laptop size={16} /> },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Tamaños para el botón
  const sizeClasses = {
    sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
    md: { button: 'h-9 w-9', icon: 'h-5 w-5' },
    lg: { button: 'h-10 w-10', icon: 'h-6 w-6' },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {variant === 'icon' ? (
        <Button
          variant="ghost"
          size="icon"
          className={sizeClasses[size].button}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Moon className={sizeClasses[size].icon} />
          ) : theme === 'light' ? (
            <Sun className={sizeClasses[size].icon} />
          ) : (
            <Palette className={sizeClasses[size].icon} />
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentTheme.icon}
          <span>Tema</span>
        </Button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card/95 backdrop-blur-md border border-border/30 z-50">
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id === 'system' ? 'dark' : t.id as 'light' | 'dark');
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
                {theme === t.id && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
