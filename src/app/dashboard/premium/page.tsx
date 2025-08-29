'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Shield, HeadphonesIcon, Infinity, Gift, Wallet, ChevronDown, ChevronUp, UserRound, DollarSign, MapPin, Key, Star, Info, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from 'next/navigation';

const PremiumPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSecondQuestionOpen, setIsSecondQuestionOpen] = useState(false);
  const [isThirdQuestionOpen, setIsThirdQuestionOpen] = useState(false);
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

  // Función para navegar al checkout
  const handleCheckoutNavigation = () => {
    router.push('/dashboard/checkout');
  };

  // Función para ir hacia atrás
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#101010] pt-4 md:pt-8 pb-16 md:pb-8 px-4 relative">
      {/* Fondo de imagen solo en desktop */}
      <div 
        className="hidden md:block fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/images/premium.png)'
        }}
      ></div>
      
      {/* Layout responsive: Desktop 2 columnas, Móvil 1 columna */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          
          {/* Columna izquierda: Imagen/FAQ (Desktop) - Abajo (Móvil) */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            {/* Bloque de imagen del dashboard - Solo visible en desktop */}
            <div className="hidden lg:block mb-8">
              <div className="bg-gradient-to-br from-[#232323] to-[#1a1a1a] rounded-3xl p-6 relative overflow-hidden">
                {/* Imagen del dashboard */}
                <div className="relative mb-4">
                  <img 
                    src="/images/premium.png" 
                    alt="Vista previa del dashboard premium" 
                    className="w-full h-48 object-cover rounded-2xl"
                    style={{ objectPosition: 'top' }}
                  />
                  {/* Overlay gradient para mejor legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                
                {/* Texto descriptivo */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    ¡Desbloquea ya todas tus microtareas y comienza a ganar dinero ahora mismo!
                  </h3>
                  <p className="text-sm text-gray-400">
                    No pierdas ni un segundo más: tus primeras microtareas de hoy ya están asignadas exclusivamente para ti. Desbloquéalas todas ahora y comienza a generar ingresos sin esperas ni complicaciones
                  </p>
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* FAQ Section fuera de la tarjeta principal */}
            <div className="space-y-4 mb-8">
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all" style={{ background: '#232323' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => {
                    setIsLoginOpen(!isLoginOpen);
                    if (!isLoginOpen) {
                      setIsSecondQuestionOpen(false);
                      setIsThirdQuestionOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10">
                      <div className="text-[#101010]">
                        <Info className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white">¿Por qué debo hacer un pago único para desbloquear las microtareas?</span>
                  </div>
                  <div className="text-white">
                    {isLoginOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isLoginOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>El acceso a la plataforma es gratuito, sin embargo, debido a abusos reiterados y accesos no autorizados por parte de algunos usuarios, se implementó este pago único para desbloquear y trabajar con microtareas. Esta medida funciona como un filtro necesario que garantiza un entorno profesional, seguro y exclusivo, destinado únicamente a quienes están verdaderamente comprometidos a trabajar con seriedad, responsabilidad y compromiso en nuestra plataforma. Este pago es definitivo y otorga acceso de por vida a todas las microtareas, las cuales se renuevan diariamente para brindarte nuevas oportunidades de forma constante. Estamos totalmente seguros de la efectividad de nuestro sistema comprobado y de tu capacidad para aprovecharlo, por lo que sabemos que recuperarás y superarás tu inversión rápidamente, incluso en estas mismas primeras horas, tal como lo están logrando numerosos usuarios satisfechos en este preciso momento.</span>
                  </div>
                </div>
              </div>

              {/* Segunda pregunta expandible */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all" style={{ background: '#232323' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => {
                    setIsSecondQuestionOpen(!isSecondQuestionOpen);
                    if (!isSecondQuestionOpen) {
                      setIsLoginOpen(false);
                      setIsThirdQuestionOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10">
                      <div className="text-[#101010]">
                        <MapPin className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white">¿Puedo empezar a trabajar desde mi ubicación actual ahora?</span>
                  </div>
                  <div className="text-white">
                    {isSecondQuestionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isSecondQuestionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>Sí, ahora mismo puedes completar microtareas desde tu ubicación actual. Nuestro sistema detectó automáticamente tu país y te asignó tareas específicas diseñadas para ser realizadas exclusivamente desde tu región. Esto garantiza que siempre tengas oportunidades diarias adaptadas a tu contexto particular. Estamos comprometidos a brindarle apoyo desde este primer momento y a ayudarle a maximizar las posibilidades que ofrece nuestra plataforma.</span>
                  </div>
                </div>
              </div>

              {/* Tercera pregunta expandible */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all" style={{ background: '#232323' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => {
                    setIsThirdQuestionOpen(!isThirdQuestionOpen);
                    if (!isThirdQuestionOpen) {
                      setIsLoginOpen(false);
                      setIsSecondQuestionOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10">
                      <div className="text-[#101010]">
                        <Shield className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white">¿Cómo me respalda la garantía?</span>
                  </div>
                  <div className="text-white">
                    {isThirdQuestionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isThirdQuestionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>En Flasti, tu satisfacción es nuestra prioridad. Por eso, cuentas con una garantía incondicional de 7 días. Estamos tan seguros de que te encantará trabajar en nuestra plataforma que tu pago está completamente respaldado. Si, por algún motivo, no cumplimos tus expectativas o no estás completamente satisfecho, podrás solicitar un reembolso del 100% de tu dinero, sin tener que dar justificaciones ni llenar formularios interminables con preguntas incómodas. Comienza sin preocupaciones. ¡Tu inversión está completamente protegida!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Pricing (Desktop) - Arriba (Móvil) */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            {/* Bloque de imagen solo visible en móvil - ARRIBA del pricing */}
            <div className="lg:hidden mb-6">
              <div className="bg-gradient-to-br from-[#232323] to-[#1a1a1a] rounded-3xl p-6 relative overflow-hidden">
                {/* Imagen del dashboard */}
                <div className="relative mb-4">
                  <img 
                    src="/images/premium.png" 
                    alt="Vista previa del dashboard premium" 
                    className="w-full h-48 object-cover rounded-2xl"
                    style={{ objectPosition: 'top' }}
                  />
                  {/* Overlay gradient para mejor legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                
                {/* Texto descriptivo */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    ¡Desbloquea ya todas tus microtareas y comienza a ganar dinero ahora mismo!
                  </h3>
                  <p className="text-sm text-gray-400">
                    No pierdas ni un segundo más: tus primeras microtareas de hoy ya están asignadas exclusivamente para ti. Desbloquéalas todas ahora y comienza a generar ingresos sin esperas ni complicaciones
                  </p>
                </div>
                
                {/* Elementos decorativos */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto lg:mx-0">
        {/* Contenido del pricing - Extraído del modal */}
        <Card className="bg-[#232323] overflow-hidden relative h-full rounded-3xl border-0">


          {/* Etiqueta "Pago Seguro" más esquinada */}
          <div className="absolute right-4 top-4 md:right-6 md:top-7">
            <div className="bg-[#3C66CD] text-white text-xs font-bold py-1 px-3 rounded-3xl flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Premium
            </div>
          </div>

          <div className="p-8 relative z-10">       
     <div className="flex items-center mb-6 mt-6 md:mt-0">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mr-4 border-0">
                <Lock className="w-7 h-7 text-[#101010]" />
              </div>
              <div>
                <h3 className="text-lg text-white group-hover:text-white transition-all duration-300">Desbloquea todas tus microtareas ahora</h3>
                <p className="text-foreground/70">
                  Acceso exclusivo
                </p>
              </div>
            </div>

            <div className="mb-8 bg-gradient-to-br from-[#FF7F50]/10 to-[#FF4500]/10 p-6 rounded-3xl relative">
              {/* Versión móvil - Diseño más compacto */}
              <div className="md:hidden">
                {isArgentina ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">AR$ 6.900</span>
                      <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">$7</span>
                        <span className="text-foreground/70 text-xs ml-1">USD</span>
                      </div>
                      <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
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
                        <span className="text-2xl font-bold">AR$ 6.900</span>
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center w-full">
                        <div className="flex items-center">
                          <span className="text-4xl font-bold">$7</span>
                          <span className="text-foreground/70 text-sm ml-2">USD</span>
                        </div> 
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm text-foreground/70 mt-2">
                Pago único - Sin suscripciones ni cargos recurrentes
              </p>


            </div>       
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
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

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-white/10">
                  <HeadphonesIcon className="text-[#101010]" size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Soporte 24/7</h4>
                  <p className="text-xs text-foreground/70">Asistencia personalizada paso a paso</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckoutNavigation}
              className="w-full py-6 text-lg md:text-xl font-bold bg-gradient-to-r from-[#FF7F50] to-[#FF4500] hover:from-[#E6723D] hover:to-[#E63E00] border-0 flex items-center justify-center gap-3 focus:outline-none focus:ring-0 focus:border-white/10 rounded-3xl"
            >
              QUIERO DESBLOQUEAR YA
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
          </div>
        </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;