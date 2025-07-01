"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Shield, Lock, CheckCircle, ArrowUp, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import ChatButton from "@/components/chat/ChatButton";
import HomepageChatWidget from "@/components/chat/HomepageChatWidget";

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
    <>
      {/* Widget de chat para la página de inicio (oculto por defecto) */}
      <HomepageChatWidget />
    <footer className="relative overflow-hidden pt-12 pb-8 bg-[#171717]">
      {/* Fondo sólido */}
      <div className="absolute inset-0 bg-[#171717] -z-10"></div>

      {/* Elementos decorativos eliminados */}

      <div className="container-custom">
        {/* Sello de seguridad elegante - Versión escritorio */}
        <div className="hidden md:block mb-10 pb-6 border-b border-white/5">
          <div className="max-w-3xl mx-auto px-6 py-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
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
          <div className="mx-auto px-4 py-3 rounded-lg bg-gradient-to-r from-black/40 via-black/60 to-black/40 backdrop-blur-md">
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
        <div className="hidden md:grid grid-cols-5 gap-8">
          <div>
            <Logo size="md" />
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 py-0.5">
                {t('gananciaColectiva')}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('informacion')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros" className="font-bold text-foreground/60 dark:text-white light:text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('sobreNosotros')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('contacto')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('informacionLegal')}
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('terminosCondiciones')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('recursos')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidad" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  {t('politicaPrivacidad')}
                </Link>
              </li>
              <li>
                <Link href="mailto:access@flasti.com" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                  access@flasti.com
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('soporte')}</h4>
            <div className="space-y-4">
              <p className="font-bold text-foreground/60 dark:text-white text-sm">{t('ayudaInmediata')}</p>
              <ChatButton
                className="bg-[#3c66ce] text-white hover:bg-[#254a99] transition-all flex items-center gap-2"
                size="sm"
                text={t('iniciarChat')}
              />
            </div>
          </div>
        </div>

        {/* Enlaces de móvil - Diseño moderno */}
        <div className="md:hidden mobile-footer-blocks">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          <div className="flex justify-center mb-4">
            <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 px-4 py-1 rounded-full border border-primary/20">
              {t('gananciaColectiva')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
              <h4 className="font-bold mb-3 text-sm font-outfit text-white inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
                {t('empresa')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/nosotros" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('sobreNosotros')}
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('contacto')}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
              <h4 className="font-bold mb-3 text-sm font-outfit text-white inline-flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
                {t('legal')}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/legal" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('informacionLegal')}
                  </Link>
                </li>
                <li>
                  <Link href="/terminos" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                    {t('terminosCondiciones')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20 mb-6">
            <h4 className="font-bold mb-3 text-sm font-outfit text-white inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
              {t('recursos')}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacidad" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                  {t('politicaPrivacidad')}
                </Link>
              </li>
              <li>
                <Link href="mailto:access@flasti.com" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
                  access@flasti.com
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20 mb-6">
            <h4 className="font-bold mb-3 text-sm font-outfit text-white inline-flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] mr-2"></span>
              {t('soporte')}
            </h4>
            <div className="flex flex-col items-center">
              <p className="font-bold dark:text-white text-foreground/80 text-xs mb-3 text-center">
                {t('ayudaInmediata')}
              </p>
              <ChatButton
                className="bg-[#3c66ce] text-white hover:bg-[#254a99] transition-all flex items-center gap-2 w-full justify-center"
                size="sm"
                text={t('iniciarChat')}
                showIcon={true}
              />
            </div>
          </div>
        </div>

        {/* Copyright escritorio */}
        <div className="hidden md:flex mt-10 pt-10 pb-4 border-t border-white/5 justify-center items-center">
          <p className="text-sm dark:text-foreground/60 text-foreground/80 text-center relative">
            <span className="relative z-10">© {new Date().getFullYear()} Flasti Inc. {t('derechosReservados')}</span>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10"></span>
          </p>
        </div>

        {/* Copyright móvil */}
        <div className="md:hidden mt-6 pt-6 border-t border-white/5 flex flex-col items-center">
          <p className="text-xs font-medium dark:text-foreground/80 text-foreground/90 mb-1">© {new Date().getFullYear()} Flasti Inc.</p>
          <p className="text-xs dark:text-foreground/60 text-foreground/80 text-center px-6 pb-2">{t('derechosReservados')}</p>
        </div>
      </div>
      {/* Botón Volver Arriba */}
      {/* Botón eliminado por solicitud */}
    </footer>
    </>
  );
};

export default Footer;
