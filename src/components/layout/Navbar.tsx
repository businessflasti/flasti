"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
// Solo importamos los iconos necesarios
import LanguageSelector from "@/components/ui/language-selector";
import ThemeSelector from "@/components/ui/theme-selector";
import Logo from "@/components/ui/logo";
// Ya no necesitamos estados para el menú
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  // Ya no necesitamos el estado isMenuOpen
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="w-full py-3 border-b border-border/20 bg-card/70 backdrop-blur-md fixed top-0 z-50">
      <div className="container-custom flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2 mr-1">
            <LanguageSelector />
            <ThemeSelector />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className={`whitespace-nowrap border-0 transition-colors ${theme === 'dark'
                  ? 'bg-white text-black hover:bg-white hover:text-black'
                  : 'bg-black text-white hover:bg-black hover:text-white'}`}
              >
                {t('iniciarSesion')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil eliminado */}
    </header>
  );
};

export default Navbar;
