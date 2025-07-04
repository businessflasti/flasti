"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
// Solo importamos los iconos necesarios
import LanguageSelector from "@/components/ui/language-selector";
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
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className={`px-3 py-2.1 min-w-[120px] min-h-[38px] rounded-lg flex items-center justify-center border-0 transition-all h-auto ${theme === 'dark'
                  ? 'bg-white text-black hover:bg-white hover:text-black hover:shadow-md hover:shadow-white/20 hover:translate-y-[-1px]'
                  : 'bg-black text-white hover:bg-black hover:text-white hover:shadow-md hover:shadow-black/20 hover:translate-y-[-1px]'}`}
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
// (Archivo eliminado: este era el header antiguo, ahora reemplazado por el nuevo header global)
