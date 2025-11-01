'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Shield, HeadphonesIcon, Infinity, Gift, Wallet, ChevronDown, ChevronUp, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from 'next/navigation';
import styles from './PremiumUpgradeModal.module.css';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSecondQuestionOpen, setIsSecondQuestionOpen] = useState(false);
  const [isArgentina, setIsArgentina] = useState(false);

  // Detectar si el usuario es de Argentina
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const savedCountry = localStorage.getItem('userCountry');
        if (savedCountry) {
          setIsArgentina(savedCountry === 'AR');
          return;
        }
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const isAR = data.country_code === 'AR';
        localStorage.setItem('userCountry', isAR ? 'AR' : 'OTHER');
        setIsArgentina(isAR);
      } catch (error) {
        setIsArgentina(false);
      }
    };
    if (typeof window !== 'undefined') {
      detectCountry();
    }
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar el scroll cuando se cierre el modal
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Función para navegar al checkout sin recargar la página
  const handleCheckoutNavigation = () => {
    onClose(); // Cerrar el modal primero
    router.push('/dashboard/checkout'); // Navegar internamente
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {/* Botón de cerrar */}
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          {/* Flecha hacia abajo en móvil, hacia la derecha en escritorio */}
          <svg 
            className="w-5 h-5 md:rotate-[-90deg]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {/* Contenido del pricing - Extraído de SimplePricingSection */}
        <Card className="bg-[#1a1a1a] overflow-hidden relative h-full rounded-3xl border-0">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="absolute right-2 top-2 md:right-3 md:top-3">
            <div className="bg-[#16a34a] text-white text-xs font-bold py-1 px-3 rounded-3xl flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Pago Seguro
            </div>
          </div>

          <div className="p-8 relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center mr-4 border-0">
                <Image src="/logo/isotipo-web.png" alt="logo flasti" width={26} height={26} className="m-auto" data-noindex="true" loading="lazy" />
              </div>
              <div>
                <h3 className="text-2xl text-white group-hover:text-white transition-all duration-300">flasti</h3>
                <p className="text-foreground/70">
                  Acceso exclusivo a la plataforma
                </p>
              </div>
            </div>

            <div className="mb-8 bg-gradient-to-br from-[#9333ea]/10 to-[#3c66ce]/10 p-6 rounded-3xl relative">
              {/* Versión móvil - Diseño más compacto */}
              <div className="md:hidden">
                {isArgentina ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">AR$ 11.500</span>
                      <span className="text-xs text-[#22c55e] font-medium bg-[#22c55e]/10 px-1 py-0.5 rounded-full">80% OFF</span>
                    </div>
                    <div className="flex items-center mt-1 hardware-accelerated">
                      <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">$3.90</span>
                        <span className="text-foreground/70 text-xs ml-1">USD</span>
                      </div>
                      <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">80% OFF</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs line-through text-red-500">$50</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Versión desktop - Diseño original */}
              <div className="hidden md:block">
                <div className="flex items-baseline mb-2">
                  {isArgentina ? (
                    <>
                      <div className="flex items-center w-full">
                        <span className="text-2xl font-bold">AR$ 11.500</span>
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">80% OFF</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center w-full">
                        <div className="flex items-center">
                          <span className="text-4xl font-bold">$3.90</span>
                          <span className="text-foreground/70 text-sm ml-2">USD</span>
                        </div> 
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-sm line-through text-red-500">$50</span>
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">80% OFF</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm text-foreground/70 mt-2">
                Pago único - Sin suscripciones ni cargos recurrentes
              </p>

              {/* Etiqueta de ahorro - Versión móvil */}
              <div className="md:hidden mt-2 bg-gradient-to-r from-[#3c66ce]/20 to-[#3359b6]/20 py-1.5 px-2 rounded-3xl border border-[#3c66ce]/30 flex items-center gap-1 shadow-sm shadow-[#3c66ce]/10">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                  <Wallet className="h-2.5 w-2.5 text-[#22c55e]" />
                </div>
                <span className="text-xs font-medium text-[#22c55e]">
                  {isArgentina ? (
                    `Ahorras AR$ 46.000`
                  ) : (
                    `Ahorras $40`
                  )}
                </span>
              </div>

              {/* Etiqueta de ahorro - Versión desktop */}
              <div className="hidden md:flex mt-3 bg-gradient-to-r from-[#3c66ce]/20 to-[#3359b6]/20 py-2 px-3 rounded-3xl border border-[#3c66ce]/30 items-center gap-2 shadow-sm shadow-[#3c66ce]/10">
                <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                  <Wallet className="h-3.5 w-3.5 text-[#22c55e]" />
                </div>
                <span className="text-xs font-medium text-[#22c55e]">
                  {isArgentina ? (
                    `Ahorras AR$ 46.000`
                  ) : (
                    `Ahorras $40 USD`
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Zap className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Acceso inmediato</h4>
                    <p className="text-xs text-foreground/70">Comienza a generar ingresos ahora mismo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Infinity className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Acceso de por vida</h4>
                    <p className="text-xs text-foreground/70">Sin límites de tiempo ni renovaciones</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Shield className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Garantía de 7 días</h4>
                    <p className="text-xs text-foreground/70">Devolución del 100% si no estás satisfecho</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <HeadphonesIcon className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Soporte 24/7</h4>
                    <p className="text-xs text-foreground/70">Asistencia personalizada paso a paso</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Sparkles className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Suite completa</h4>
                    <p className="text-xs text-foreground/70">Acceso a todas las funciones premium</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                    <Gift className="text-[#101010]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Actualizaciones gratuitas</h4>
                    <p className="text-xs text-foreground/70">Nuevas funciones sin costo adicional</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckoutNavigation}
              className="w-full py-6 text-xl font-bold bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] border-0 flex items-center justify-center gap-3 focus:outline-none focus:ring-0 focus:border-white/10 rounded-3xl"
            >
              REGÍSTRATE AHORA
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Button>

            <div className="flex justify-center mt-4 mb-2">
              <div className="px-3 py-2 rounded-xl flex items-center gap-1.5 border-0" style={{ background: '#1A1A1A' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-[10px] text-foreground/70">
                  Pago seguro con paypal o moneda local
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-6">
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all" style={{ background: '#1A1A1A' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => {
                    setIsLoginOpen(!isLoginOpen);
                    if (!isLoginOpen) {
                      setIsSecondQuestionOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10">
                      <div className="text-[#101010]">
                        <UserRound className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium">¿Cómo inicio sesión?</span>
                  </div>
                  <div className="text-white">
                    {isLoginOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isLoginOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>Una vez completado el pago, serás automáticamente llevado a la página de registro, donde podrás crear tu cuenta y acceder inmediatamente a tu panel personal. También recibirás un email de bienvenida en tu bandeja de entrada con todos los detalles de tu acceso.</span>
                  </div>
                </div>
              </div>

              {/* Segunda pregunta expandible */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all mt-3" style={{ background: '#1A1A1A' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => {
                    setIsSecondQuestionOpen(!isSecondQuestionOpen);
                    if (!isSecondQuestionOpen) {
                      setIsLoginOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10">
                      <div className="text-[#101010]">
                        <UserRound className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium">¿Cómo inicio sesión?</span>
                  </div>
                  <div className="text-white">
                    {isSecondQuestionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isSecondQuestionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>Una vez completado el pago, serás automáticamente llevado a la página de registro, donde podrás crear tu cuenta y acceder inmediatamente a tu panel personal. También recibirás un email de bienvenida en tu bandeja de entrada con todos los detalles de tu acceso.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;