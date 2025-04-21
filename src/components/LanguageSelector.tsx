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
        className="flex items-center gap-1.5 text-sm text-white hover:text-white/90 transition-colors py-1.5 px-3 rounded-lg bg-[rgba(20,20,25,0.95)] hover:bg-[rgba(30,30,35,0.95)] border border-white/5"
      >
        <Globe size={14} />
        <span className="hidden md:inline">
          {language === 'es' ? 'Español' : language === 'en' ? 'English' : 'Português'}
        </span>
        <span className="md:hidden">
          {language === 'es' ? 'ES' : language === 'en' ? 'EN' : 'PT'}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-[rgba(20,20,25,0.95)] backdrop-blur-md border border-white/5 rounded-lg shadow-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-[999999] top-full">
        <div className="py-1">
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between text-white hover:bg-white/5"
            onClick={() => setLanguage('es')}
          >
            <span>Español</span>
            {language === 'es' && <Check size={16} className="text-white" />}
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between text-white hover:bg-white/5"
            onClick={() => setLanguage('en')}
          >
            <span>English</span>
            {language === 'en' && <Check size={16} className="text-white" />}
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm flex items-center justify-between text-white hover:bg-white/5"
            onClick={() => setLanguage('pt-br')}
          >
            <span>Português</span>
            {language === 'pt-br' && <Check size={16} className="text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
};
