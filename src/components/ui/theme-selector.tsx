"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: "light", label: t('modoClaro'), icon: <Sun size={14} /> },
    { value: "dark", label: t('modoOscuro'), icon: <Moon size={14} /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border/30 bg-card/30 backdrop-blur-sm text-foreground/70 hover:text-foreground transition-colors"
      >
        {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-card/95 backdrop-blur-md border border-border/30 z-50">
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value as "light" | "dark" | "system");
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
                {theme === t.value && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
