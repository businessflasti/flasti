"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Shield, Lock, CheckCircle, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ChatButton from "@/components/ui/chat-button";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <footer className="relative overflow-hidden pt-12 pb-8">
      {/* Fondo futurista */}
      <div className="absolute inset-0 bg-card/70 backdrop-blur-md -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhMDQ1ZTkiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djNjMCAxLjEtLjkgMi0yIDJoLTR2MWg0YTIgMiAwIDAgMCAxLjktMS4zbDEuMS0zLjdBMyAzIDAgMCAwIDM0IDMyaC02djVoMXYtNGg1YTIgMiAwIDAgMSAyIDJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 -z-10"></div>

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10"></div>
      {/* Círculos pequeños eliminados */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent -z-10 md:hidden"></div>

      <div className="container-custom">
        {/* Sello de seguridad elegante - Versión escritorio */}
        <div className="hidden md:block mb-10 pb-6 border-b border-white/5">
          <div className="max-w-3xl mx-auto px-6 py-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 shadow-lg shadow-primary/5">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2 border border-green-400/20">
                  <Shield className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-xs text-foreground/70">{t('pagosProtegidos')}</span>
              </div>
              <div className="hidden md:block h-3 w-px bg-white/10"></div>
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2 border border-green-400/20">
                  <Lock className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-xs text-foreground/70">{t('cifradoSSL')}</span>
              </div>
              <div className="hidden md:block h-3 w-px bg-white/10"></div>
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2 border border-green-400/20">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-xs text-foreground/70">{t('retirosVerificados')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sello de seguridad elegante - Versión móvil */}
        <div className="md:hidden mb-8 pb-4 border-b border-white/5">
          <div className="mx-auto px-4 py-3 rounded-lg bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border border-green-400/30 shadow-inner shadow-green-400/10">
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border border-green-400/30 shadow-inner shadow-green-400/10">
                  <Lock className="h-4 w-4 text-green-400" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border border-green-400/30 shadow-inner shadow-green-400/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                {t('retirosVerificados')}
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces de escritorio */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          <div>
            <Logo size="md" />
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 border-l-2 border-primary/40 pl-2 py-0.5">
                {t('gananciaColectiva')}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit dark:text-white text-black">{t('informacion')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros" className="font-bold text-foreground/60 dark:text-white light:text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('sobreNosotros')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="font-bold text-foreground/60 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('contacto')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit dark:text-white text-black">{t('legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="font-bold text-foreground/60 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('informacionLegal')}
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="font-bold text-foreground/60 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('terminosCondiciones')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit dark:text-white text-black">{t('recursos')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidad" className="font-bold text-foreground/60 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('politicaPrivacidad')}
                </Link>
              </li>
              <li>
                <Link href="mailto:access@flasti.com" className="font-bold text-foreground/60 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  access@flasti.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Enlaces de móvil - Diseño moderno */}
        <div className="md:hidden">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          <div className="flex justify-center mb-4">
            <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 px-4 py-1 rounded-full border border-primary/20">
              {t('gananciaColectiva')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="dark:bg-black/20 bg-white/80 backdrop-blur-sm rounded-xl p-4 border dark:border-white/5 border-black/10">
              <h4 className="font-bold mb-3 text-sm font-outfit dark:text-white text-black inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
                {t('empresa')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/nosotros" className="font-bold dark:text-foreground/70 text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('sobreNosotros')}
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="font-bold dark:text-foreground/70 text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('contacto')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="dark:bg-black/20 bg-white/80 backdrop-blur-sm rounded-xl p-4 border dark:border-white/5 border-black/10">
              <h4 className="font-bold mb-3 text-sm font-outfit dark:text-white text-black inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
                {t('legal')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/legal" className="font-bold dark:text-foreground/70 text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('informacionLegal')}
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="font-bold dark:text-foreground/70 text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('terminosCondiciones')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <p className="font-bold text-foreground/60 dark:text-white text-sm">{t('ayudaInmediata')}</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={scrollToTop}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-colors duration-200"
              aria-label={t('volverArriba')}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Botón de chat - Versión escritorio */}
        <div className="hidden md:flex justify-center mt-8">
          <ChatButton
            className="bg-[#3c66ce] text-white hover:bg-[#254a99] transition-all flex items-center gap-2"
            size="sm"
            text={t('iniciarChat')}
          />
        </div>

        {/* Botón de chat - Versión móvil */}
        <div className="md:hidden mt-4">
          <ChatButton
            className="bg-[#3c66ce] text-white hover:bg-[#254a99] transition-all flex items-center gap-2 w-full justify-center"
            size="sm"
            text={t('iniciarChat')}
            showIcon={true}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
