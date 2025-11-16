"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Lock, CheckCircle, ArrowUp, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import ChatButton from "@/components/chat/ChatButton";
import HomepageChatWidget from "@/components/chat/HomepageChatWidget";
import FeedbackTab from "@/components/ui/FeedbackTab";
import LanguageSelector from "@/components/ui/language-selector";
import SocialIcons from "@/components/ui/SocialIcons";
import RankingCard from "@/components/ui/ranking-card";

const FooterComponent = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
      <footer 
        className="relative overflow-hidden pt-12 pb-8 z-30" 
        style={{
          background: '#0A0A0A', 
          borderTop: '1px solid rgba(63, 140, 255, 0.15)',
          transform: 'translate3d(0, 0, 0)',
          contain: 'layout style paint',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Fondo sólido */}
        <div className="absolute inset-0" style={{background: '#0A0A0A', zIndex: -1}}></div>

        {/* Elementos decorativos eliminados */}

        <div 
          className="container-custom relative z-10"
          style={{
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {/* Sello de seguridad elegante - Versión escritorio */}
          <div className="hidden md:block mb-10 pb-6 border-b border-white/5">
            <div className="max-w-3xl mx-auto px-6 py-4 rounded-xl" style={{background: '#1a1a1a'}}>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2">
                    <Shield className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-xs text-foreground/70">{t('pagosProtegidos')}</span>
                </div>
                <div className="hidden md:block h-3 w-px bg-white/10"></div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2">
                    <Lock className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-xs text-foreground/70">{t('cifradoSSL')}</span>
                </div>
                <div className="hidden md:block h-3 w-px bg-white/10"></div>
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400/10 to-green-600/10 flex items-center justify-center mr-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                  </div>
                  <span className="text-xs text-foreground/70">{t('retirosVerificados')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sello de seguridad elegante - Versión móvil */}
          <div className="md:hidden mb-8 pb-4 border-b border-white/5">
            <div className="mx-auto px-4 py-3 rounded-lg" style={{ background: '#1a1a1a' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                </div>
                <div className="text-xs font-medium text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                  {t('retirosVerificados')}
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces de escritorio */}
          <div 
            className="hidden md:grid grid-cols-5 gap-8"
            style={{
              contain: 'layout style',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div>
              <div className="flex items-center">
                <Image
                  src="/logo/logo-web.png"
                  alt="flasti logo"
                  width={110}
                  height={32}
                  className="object-contain"
                  priority
                  unoptimized={true}
                />
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 py-0.5">
                  {t('gananciaColectiva')}
                </p>
              </div>
              {/* SocialIcons solo en móvil, no en escritorio debajo del lema */}
            </div>

            <div>
              <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('empresa').toUpperCase()}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/nosotros" className="font-bold text-foreground/60 dark:text-white light:text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                    {t('sobreNosotros')}
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
                    {t('contactanos')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('legal').toUpperCase()}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/informacion-legal" className="font-bold text-foreground/60 dark:text-white hover:text-white hover:dark:text-white transition-colors duration-200 text-sm inline-flex items-center">
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
              <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('recursos').toUpperCase()}</h4>
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
              <h4 className="font-bold mb-4 inline-block font-outfit text-white">{t('soporte').toUpperCase()}</h4>
              <div className="space-y-4">
                <p className="font-bold text-foreground/60 dark:text-white text-sm">{t('ayudaInmediata')}</p>
                <ChatButton
                  className="bg-white hover:bg-[#ededed] text-black font-bold transition-all flex items-center gap-2 border border-white px-2 py-1 text-xs"
                  text={t('iniciarChat')}
                />
              </div>
            </div>
          </div>

          {/* Enlaces de móvil - Diseño moderno */}
          <div 
            className="md:hidden mobile-footer-blocks"
            style={{
              contain: 'layout style',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/logo/isotipo-web.png"
                alt="flasti logo"
                width={28}
                height={28}
                className="object-contain"
                priority
                unoptimized={true}
              />
            </div>

            <div className="flex justify-center mb-4">
              <p className="text-xs uppercase tracking-wider font-medium text-foreground/80 px-4 py-1 rounded-full" style={{ background: '#1a1a1a' }}>
                {t('gananciaColectiva')}
              </p>
            </div>

            <div className="flex justify-center mb-4">
              {/* <SocialIcons /> Eliminado en móvil, solo en tarjeta nueva */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl p-4" style={{ background: '#1a1a1a' }}>
                <h4 className="font-bold mb-3 text-sm font-outfit text-white uppercase inline-flex items-center">
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
                      {t('contactanos')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl p-4" style={{ background: '#1a1a1a' }}>
                <h4 className="font-bold mb-3 text-sm font-outfit text-white uppercase inline-flex items-center">
                  {t('legal')}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/informacion-legal" className="font-bold dark:text-white text-foreground/80 hover:text-white hover:dark:text-white transition-colors duration-200 text-xs inline-block">
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

              <div className="rounded-xl p-3" style={{ background: '#1a1a1a' }}>
                <h4 className="font-bold mb-3 text-sm font-outfit text-white uppercase inline-flex items-center">
                  {t('recursos')}
                </h4>
                <ul className="space-y-2">
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

              <div className="rounded-xl p-3 flex flex-col items-center justify-center gap-3" style={{ background: '#1a1a1a' }}>
                <SocialIcons />
                <FeedbackTab />
              </div>

              <div className="rounded-xl p-4" style={{ background: '#1a1a1a' }}>
                <h4 className="font-bold mb-3 text-sm font-outfit text-white uppercase inline-flex items-center">
                  {t('soporte')}
                </h4>
                <div className="flex flex-col items-center">
                  <p className="font-bold dark:text-white text-foreground/80 text-xs mb-3 text-center">
                    {t('ayudaInmediata')}
                  </p>
                  <ChatButton
                    className="bg-white hover:bg-[#ededed] text-black font-bold transition-all flex items-center gap-2 justify-center px-2 py-1 text-xs"
                    text={t('iniciarChat')}
                    showIcon={true}
                  />
                </div>
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
                <RankingCard />
              </div>
            </div>
          </div>

          {/* Copyright escritorio con feedback extremos */}
          <div className="hidden md:block w-full border-t border-white/10 mt-10"></div>
          <div className="hidden md:flex pt-12 pb-4 justify-between items-center w-full px-0 max-w-none">
            <div className="flex items-center gap-6 ml-6">
              <RankingCard />
              <p className="text-sm dark:text-foreground/60 text-foreground/80 text-left flex items-center h-8">
                <span className="relative z-10">© {new Date().getFullYear()} Flasti LLC. {t('derechosReservados')}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 mr-6 h-8">
              <SocialIcons className="gap-4" />
              <FeedbackTab />
            </div>
          </div>

          {/* Copyright móvil */}
          <div className="md:hidden mt-6 pt-6 border-t border-white/5 flex flex-col items-center">
            <p className="text-xs font-medium dark:text-foreground/80 text-foreground/90 mb-1">© {new Date().getFullYear()} Flasti LLC.</p>
            <p className="text-xs dark:text-foreground/60 text-foreground/80 text-center px-6 pb-2">{t('derechosReservados')}</p>
          </div>
        </div>
        {/* Botón Volver Arriba (eliminado por solicitud) */}
      </footer>
    </>
  );
};

const Footer = React.memo(FooterComponent);

export default Footer;
