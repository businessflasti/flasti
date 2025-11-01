"use client";

import React from 'react';
import Logo from "@/components/ui/logo";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from 'next/link';

interface HeaderProps {
  showStickyBanner?: boolean;
}

export default function Header({ showStickyBanner = false }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-[#101010] sticky top-0 z-50 relative">
      <div className="container-custom">
        <div className="flex items-center justify-between py-3.5">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="md" showTextWhenExpanded={true} />
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="bg-[#101010] hover:bg-[#1a1a1a] text-white border border-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              {t('iniciarSesion')}
            </a>
            <a
              href="/register"
              className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Regístrate
            </a>
          </div>

          {/* Right Side Actions - Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="/login"
              className="bg-[#101010] hover:bg-[#1a1a1a] text-white border border-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              {t('iniciarSesion')}
            </a>
            <a
              href="/register"
              className="bg-white hover:bg-gray-200 text-black px-3 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Regístrate
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}