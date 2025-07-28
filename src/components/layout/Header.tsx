"use client";

import React from 'react';
import Logo from "@/components/ui/logo";
import LanguageSelector from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from 'next/link';

interface HeaderProps {
  showStickyBanner?: boolean;
}

export default function Header({ showStickyBanner = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-[#101010] sticky top-0 z-50 relative">
      {/* Gradiente azul en el borde inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3C66CD] to-transparent"></div>
      <div className="container-custom">
        <div className="flex items-center justify-between py-3.5">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="md" showTextWhenExpanded={true} />
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Link
              href="/login"
              className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              {t('iniciarSesion')}
            </Link>
          </div>

          {/* Right Side Actions - Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <LanguageSelector mobile />
            <Link
              href="/login"
              className="bg-white hover:bg-gray-100 text-black px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              {t('iniciarSesion')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}