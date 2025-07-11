'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';

// Importar estilos
import './casino-theme.css';
import './mobile-menu-fix.css';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Inicializar el estado
    checkIfMobile();

    // Establecer un valor inicial para asegurar que se muestre correctamente
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="casino-layout">
      {/* Header */}
      <div className="casino-header">
        <div className="header-left">
          {/* Versión móvil */}
          {isMobile && (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-button mr-3">
                {/* Icono de menú */}
              </Button>
              {/* Logo */}
            </div>
          )}

          {/* Versión desktop */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              {/* Logo */}
            </div>
          )}
        </div>

        {/* Espacio central en móvil */}
        {isMobile && (
          <div className="flex-1"></div>
        )}

        <div className="header-right">
          <div className="flex items-center gap-3">
            <LanguageSelector />

            <div className="user-balance hidden md:block">
              <div className="user-balance-amount">
                <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
              </div>
              <div className="user-balance-usd text-xs text-[#b0b0b0]">
                {profile?.balance?.toFixed(2) ?? '0.00'} CR
              </div>
            </div>

            <div className="user-profile relative">
              <div className="flex items-center gap-3">
                <div className="user-avatar relative">
                  {profile?.avatar_url ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img
                        src={profile.avatar_url}
                        alt={profile?.name || user?.email?.split('@')[0] || 'Usuario'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img src="/images/default-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <span className="hidden md:block">{profile?.name || user?.email?.split('@')[0] || 'Usuario'}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-primary/10 transition-colores text-foreground/70 hover:text-foreground"
                  title="Cerrar Sesión"
                >
                  {/* Icono de cerrar sesión */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú desplegable de perfil eliminado */}

      {/* Overlay para menú móvil */}
      {isMobile && mobileMenuOpen && (
        <div
          className={`mobile-menu-overlay active`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Contenido principal */}
      <main className="casino-main">
        {children}
      </main>
    </div>
  );
}
