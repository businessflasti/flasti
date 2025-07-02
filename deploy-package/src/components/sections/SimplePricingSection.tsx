"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckIcon, Sparkles, Zap, Shield, Clock, HeadphonesIcon, Infinity, AlertTriangle, ChevronDown, ChevronUp, Lock, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SimplePricingSection = () => {
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progressWidth, setProgressWidth] = useState(0);
  const totalSeconds = useRef(22 * 60 * 60); // 22 horas en segundos
  const [showCountdown, setShowCountdown] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Inicializar el contador desde localStorage o crear uno nuevo
    const initializeCountdown = () => {
      // Verificar si hay un contador guardado en localStorage
      const savedCountdown = localStorage.getItem('flastiCountdown');
      const savedExpiry = localStorage.getItem('flastiCountdownExpiry');

      if (savedCountdown && savedExpiry) {
        const expiryTime = parseInt(savedExpiry, 10);
        const now = Date.now();

        // Si el contador aún no ha expirado
        if (expiryTime > now) {
          const remainingMs = expiryTime - now;
          const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
          const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

          setCountdown({
            hours: remainingHours,
            minutes: remainingMinutes,
            seconds: remainingSeconds
          });

          // Calcular el porcentaje de tiempo restante para la barra de progreso
          const totalRemainingSeconds = remainingHours * 3600 + remainingMinutes * 60 + remainingSeconds;
          const progressPercentage = (totalRemainingSeconds / totalSeconds.current) * 100;
          setProgressWidth(progressPercentage);

          setShowCountdown(true);
        } else {
          // El contador ha expirado
          setShowCountdown(false);
        }
      } else {
        // No hay contador guardado, crear uno nuevo (22 horas)
        const expiryTime = Date.now() + (22 * 60 * 60 * 1000);
        localStorage.setItem('flastiCountdownExpiry', expiryTime.toString());
        localStorage.setItem('flastiCountdown', 'active');

        setCountdown({
          hours: 22,
          minutes: 0,
          seconds: 0
        });
        // Inicializar la barra de progreso al 100% (llena)
        setProgressWidth(100);
        setShowCountdown(true);
      }
    };

    // Inicializar el contador (solo en el cliente)
    if (typeof window !== 'undefined') {
      initializeCountdown();
    }

    // Configurar el intervalo para actualizar el contador cada segundo (solo en el cliente)
    if (typeof window !== 'undefined') {
      countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        // Si el contador llega a cero
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          // Limpiar el intervalo
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
          }
          // Ocultar el contador
          setShowCountdown(false);
          return prev;
        }

        // Actualizar el contador
        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        // Actualizar el tiempo de expiración en localStorage
        const remainingSeconds = newHours * 3600 + newMinutes * 60 + newSeconds;
        const remainingMs = remainingSeconds * 1000;
        const newExpiryTime = Date.now() + remainingMs;
        localStorage.setItem('flastiCountdownExpiry', newExpiryTime.toString());

        // Actualizar la barra de progreso
        const progressPercentage = (remainingSeconds / totalSeconds.current) * 100;
        setProgressWidth(progressPercentage);

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    }

    // Lógica para la barra de progreso
    const handleScroll = () => {
      if (hasAnimated.current || !progressRef.current) return;

      const rect = progressRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible) {
        hasAnimated.current = true;
        let startTime: number | null = null;
        const duration = 1500; // 1.5 segundos para la animación

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Función de easing para hacer la animación más natural
          const easeOutQuad = (t: number) => t * (2 - t);
          const easedProgress = easeOutQuad(progress);

          setProgressWidth(Math.floor(easedProgress * 87));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      // Verificar también al cargar la página
      handleScroll();
    }

    // Limpiar al desmontar
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        if (countdownInterval.current) {
          clearInterval(countdownInterval.current);
        }
      }
    };
  }, []);

  return (
    <div className="py-24 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-wider font-medium mb-2 inline-block dark:text-white text-black">{t('registrateAhoraBtn')}</span>
          <h2 className="text-3xl font-bold font-outfit mb-3"><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333ea] via-[#3c66ce] to-[#facc15]">{t('unicoPago')}</span></h2>
          <p className="text-foreground/70 max-w-lg mx-auto">
            {t('accedeComienza')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Single Plan */}
          <Card className="glass-card overflow-hidden relative group h-full border-primary/30 hover:border-primary/50 transition-colors">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-transparent"></div>

            <div className="absolute right-5 top-5">
              <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-medium py-1 px-3 rounded-full flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('pagoSeguroLabel')}
              </div>
            </div>

            <div className="p-8 relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#3c66ce]/20 flex items-center justify-center mr-4 border border-white/10">
                  <Sparkles className="text-[#3c66ce]" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-gradient transition-all duration-300">Flasti</h3>
                  <p className="text-foreground/70">
                    {t('accesoExclusivoPlataforma')}
                  </p>
                </div>
              </div>

              <div className="mb-8 bg-gradient-to-br from-[#9333ea]/10 to-[#3c66ce]/10 p-6 rounded-xl border border-white/10">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold">$10</span>
                  <span className="text-foreground/70 text-sm ml-2">USD</span>
                  <span className="ml-2 text-sm line-through text-foreground/50">$50</span>
                  <span className="ml-2 text-xs text-[#22c55e] font-medium bg-[#22c55e]/10 px-2 py-0.5 rounded-full">{t('descuento')}</span>
                </div>
                <p className="text-sm text-foreground/70">
                  {t('pagoUnico')}
                </p>
              </div>

              {/* Countdown Timer - Solo se muestra si showCountdown es true */}
              {showCountdown && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#3c66ce]/20 to-[#f97316]/20 backdrop-blur-sm rounded-xl border border-[#3c66ce]/30 shadow-lg shadow-[#3c66ce]/5 relative overflow-hidden">

                  <div className="relative z-10">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <AlertTriangle className="text-[#ef4444] mr-2 h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium">{t('ofertaTermina')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner w-14 flex justify-center">
                          <span className="text-xl font-mono font-bold text-white tabular-nums">{countdown.hours.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-xl font-bold text-white">:</span>
                        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner w-14 flex justify-center">
                          <span className="text-xl font-mono font-bold text-white tabular-nums">{countdown.minutes.toString().padStart(2, '0')}</span>
                        </div>
                        <span className="text-xl font-bold text-white">:</span>
                        <div className="bg-black/30 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 shadow-inner w-14 flex justify-center">
                          <span className="text-xl font-mono font-bold text-white tabular-nums">{countdown.seconds.toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Zap className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('accesoInmediato')}</h4>
                      <p className="text-xs text-foreground/70">{t('comienzaGenerarIngresos')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Infinity className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('accesoPorVida')}</h4>
                      <p className="text-xs text-foreground/70">{t('sinLimitesRenovaciones')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Shield className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('garantia7Dias')}</h4>
                      <p className="text-xs text-foreground/70">{t('devolucion100')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <HeadphonesIcon className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('soporte24_7')}</h4>
                      <p className="text-xs text-foreground/70">{t('asistenciaPersonalizada')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Sparkles className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('suiteCompleta')}</h4>
                      <p className="text-xs text-foreground/70">{t('accesoFuncionesPremium')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Gift className="text-[#3c66ce]" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('actualizacionesGratuitas')}</h4>
                      <p className="text-xs text-foreground/70">{t('nuevasFuncionesSinCosto')}</p>
                    </div>
                  </div>
                </div>
              </div>



              {/* Progress Bar */}
              <div className="mb-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                <div className="p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-[#ef4444] mr-2" />
                      <span className="text-white text-sm">{t('terminandoseRapido')}</span>
                    </div>
                    <span className="text-white text-sm font-bold">87%</span>
                  </div>
                  <div className="h-2 w-full bg-[#ef4444]/30 rounded-full overflow-hidden" ref={progressRef}>
                    <div
                      className="h-full bg-gradient-to-r from-[#ef4444] to-[#22c55e] rounded-full relative overflow-hidden transition-all duration-300 ease-out"
                      style={{ width: `${progressWidth}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 animate-progress-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-0 shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-2">
                  {t('empiezaGanarBtn').toUpperCase()}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Button>
              </Link>

              <div className="flex justify-center mt-4 mb-2">
                <div className="px-3 py-1 bg-[#0A0A0A] rounded-full shadow-sm flex items-center gap-1.5 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-[10px] text-foreground/70">
                    {t('pagoSeguro')} PayPal {useLanguage().language === 'en' ? 'or' : useLanguage().language === 'pt-br' ? 'ou' : 'o'} {t('monedaLocal')}
                  </p>
                </div>
              </div>

              <div className="mt-4 mb-2">
                {/* Bloque de banderitas eliminado */}
              </div>

              <div className="mt-4 border-t border-white/10 pt-6">
                <div className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-[#3C66CE]/30 transition-all hover:shadow-lg hover:shadow-[#3C66CE]/5 bg-[#0A0A0A]">
                  <button
                    className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left"
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3 border border-white/10">
                        <div className="text-white">
                          <Lock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <span className="font-medium">{t('comoInicioSesion')}</span>
                    </div>
                    <div className="text-white">
                      {isLoginOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  <div
                    className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${isLoginOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                  >
                    <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                      {t('instruccionesInicioSesionSimple')}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#3C66CE]/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimplePricingSection;
