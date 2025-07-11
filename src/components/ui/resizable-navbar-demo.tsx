"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import LanguageSelector from "@/components/ui/language-selector";
import Logo from "@/components/ui/logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, User } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export function NavbarDemo() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const avatar = profile?.avatar_url || '/images/profiles/profile1.jpg';
  const color = profile?.accent_color || '#9333ea';

  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar className="pt-1 lg:pt-2">
        {/* Desktop Navigation */}
        <NavBody visible={visible}>
          <Logo size="md" showTextWhenExpanded={true} />
          {/* NavItems solo visibles en escritorio y solo cuando el header está chico (scrolleado) */}
          {visible && (
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <NavItems items={navItems} />
            </div>
          )}
          <div className="flex items-center gap-4 w-full justify-end">
            <LanguageSelector />
            {/* Acceso rápido a notificaciones */}
            {/* Eliminado: Notificaciones y avatar de perfil */}
            <NavbarButton
              href="/login"
              variant="primary"
              className="ml-0"
            >
              {t('iniciarSesion')}
            </NavbarButton>
          </div>
        </NavBody>
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader className="pt-1">
            <Logo size="md" showTextWhenExpanded={true} />
            <div className="flex items-center gap-2 ml-auto">
              <LanguageSelector mobile />
              {/* Eliminado: Notificaciones y avatar de perfil en mobile */}
              <NavbarButton
                href="/login"
                variant="primary"
                className="max-w-[140px] px-3 py-1.5 text-xs h-8 flex items-center"
              >
                {t('iniciarSesion')}
              </NavbarButton>
            </div>
          </MobileNavHeader>
          {/* Menú desplegable eliminado, solo header visible en móvil */}
        </MobileNav>
      </Navbar>
    </div>
  );
}
