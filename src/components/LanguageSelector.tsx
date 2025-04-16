"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    if (language === 'es') {
      setLanguage('en');
    } else if (language === 'en') {
      setLanguage('pt-br');
    } else {
      setLanguage('es');
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors py-1 px-2 rounded-md bg-card/50 hover:bg-card/70"
      >
        <Globe size={14} />
        <span>
          {language === 'es' ? 'ES' : language === 'en' ? 'EN' : 'PT'}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-card/90 backdrop-blur-md border border-border/30 rounded-md shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-[999999] top-full">
        <div className="py-1">
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-primary/10"
            onClick={() => setLanguage('es')}
          >
            <span>Español</span>
            {language === 'es' && <Check size={16} className="text-primary" />}
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-primary/10"
            onClick={() => setLanguage('en')}
          >
            <span>English</span>
            {language === 'en' && <Check size={16} className="text-primary" />}
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-primary/10"
            onClick={() => setLanguage('pt-br')}
          >
            <span>Português</span>
            {language === 'pt-br' && <Check size={16} className="text-primary" />}
          </button>
        </div>
      </div>
    </div>
  );
};
