"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { CheckIcon, Sparkles, Zap, Shield, Clock, HeadphonesIcon, Infinity, AlertTriangle, ChevronDown, ChevronUp, LogIn, Gift, Wallet, Globe, UserRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const SimplePricingSection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showCountdown, setShowCountdown] = useState(true);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const [isArgentina, setIsArgentina] = useState(false);

  // Efecto para detectar si el usuario es de Argentina
  useEffect(() => {
    // Detectar si el usuario es de Argentina
    const detectCountry = async () => {
      try {
        // Intentar obtener la ubicación del usuario desde localStorage primero
        // Usar la misma clave que en checkout/page.tsx para consistencia
        const savedCountry = localStorage.getItem('flastiUserCountry');
        if (savedCountry) {
          setIsArgentina(savedCountry === 'AR');
          console.log(`[SimplePricingSection] País detectado desde localStorage: ${savedCountry}`);
          return;
        }

        // Si no hay información en localStorage, intentar detectar por IP
        console.log('[SimplePricingSection] Detectando país mediante API...');
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }

          const data = await response.json();
          console.log('[SimplePricingSection] Datos de geolocalización:', data);

          if (data && data.country_code) {
            const isAR = data.country_code === 'AR';

            // Guardar el resultado en localStorage para futuras visitas
            // Usar la misma clave que en checkout/page.tsx
            localStorage.setItem('flastiUserCountry', data.country_code);
            setIsArgentina(isAR);
            console.log(`[SimplePricingSection] País detectado: ${data.country_code}, isArgentina: ${isAR}`);
          } else {
            console.error('[SimplePricingSection] No se pudo obtener el código de país:', data);
            setIsArgentina(false);
          }
        } catch (apiError) {
          console.error('[SimplePricingSection] Error al consultar la API de geolocalización:', apiError);
          // En caso de error con la API, intentar con un servicio alternativo o mostrar el globo
          setIsArgentina(false);
        }
      } catch (error) {
        console.error('[SimplePricingSection] Error general al detectar país:', error);
        // En caso de error, asumir que no es de Argentina
        setIsArgentina(false);
      }
    };

    detectCountry();
  }, []);

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



          setShowCountdown(true);
        } else {
          // El contador ha expirado
          setShowCountdown(false);
        }
      } else {
        // No hay contador guardado, crear uno nuevo (17 horas y 47 minutos)
        const expiryTime = Date.now() + (17 * 60 * 60 * 1000) + (47 * 60 * 1000);
        localStorage.setItem('flastiCountdownExpiry', expiryTime.toString());
        localStorage.setItem('flastiCountdown', 'active');

        setCountdown({
          hours: 17,
          minutes: 47,
          seconds: 0
        });

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



        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    }



    // Limpiar al desmontar
    return () => {
      if (typeof window !== 'undefined' && countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  return (
    <div className="py-24 relative overflow-hidden">
      {/* Overlays decorativos ELIMINADOS */}
      {/* <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] h-[120px] bg-[#facc15]/10 blur-2xl rounded-full z-0"></div> */}
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-wider font-medium mb-2 inline-block text-white">{t('registrateAhoraBtn')}</span>
          <h2 className="text-3xl font-bold mb-3 title-google-sans"><span className="text-white">{t('unicoPago')}</span></h2>
          <p className="text-foreground/70 max-w-lg mx-auto hardware-accelerated">
            {t('accedeComienza')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Single Plan */}
          <Card className="bg-card/30 backdrop-blur-md shadow-xl overflow-hidden relative group h-full border-primary/30 hover:border-primary/50 transition-colors">
            {/* Animación eliminada: este bloque ya no tiene efecto motion ni animación de entrada */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 to-transparent"></div>

            <div className="absolute right-5 top-5">
              <div className="bg-[#16a34a] text-white text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-md shadow-[#16a34a]/20">
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
                  <h3
                    className="text-2xl text-white group-hover:text-white transition-all duration-300 title-google-sans"
                    style={{
                      fontFamily: "'Söhne', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >flasti</h3>
                  <p className="text-foreground/70">
                    {t('accesoExclusivoPlataforma')}
                  </p>
                </div>
              </div>

              <div className="mb-8 bg-gradient-to-br from-[#9333ea]/10 to-[#3c66ce]/10 p-6 rounded-xl border border-white/10 relative">
                {/* Versión móvil - Diseño más compacto */}
                <div className="md:hidden">
                  {isArgentina ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">AR$ 11.500</span>
                        <span className="text-xs text-[#22c55e] font-medium bg-[#22c55e]/10 px-1 py-0.5 rounded-full">{t('descuento')}</span>
                      </div>
                      <div className="flex items-center mt-1 hardware-accelerated">
                        <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">$10</span>
                          <span className="text-foreground/70 text-xs ml-1">USD</span>
                        </div>
                        <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">{t('descuento')}</span>
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
                            <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">{t('descuento')}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center w-full">
                          <div className="flex items-center">
                            <span className="text-4xl font-bold">$10</span>
                            <span className="text-foreground/70 text-sm ml-2">USD</span>
                          </div> 
                          <div className="flex items-center gap-1 ml-3">
                            <span className="text-sm line-through text-red-500">$50</span>
                            <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">{t('descuento')}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs md:text-sm text-foreground/70 mt-2">
                  {t('pagoUnico')}
                </p>

                {/* Etiqueta de ahorro - Versión móvil */}
                <div className="md:hidden mt-2 bg-gradient-to-r from-[#3c66ce]/20 to-[#3359b6]/20 py-1.5 px-2 rounded-lg border border-[#3c66ce]/30 flex items-center gap-1 shadow-sm shadow-[#3c66ce]/10">
                  <div className="w-4 h-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <Wallet className="h-2.5 w-2.5 text-[#22c55e]" />
                  </div>
                  <span className="text-xs font-medium text-[#22c55e]">
                    {isArgentina ? (
                      `${t('ahorras')} AR$ 46.000`
                    ) : (
                      `${t('ahorras')} $40`
                    )}
                  </span>
                </div>

                {/* Etiqueta de ahorro - Versión desktop */}
                <div className="hidden md:flex mt-3 bg-gradient-to-r from-[#3c66ce]/20 to-[#3359b6]/20 py-2 px-3 rounded-lg border border-[#3c66ce]/30 items-center gap-2 shadow-sm shadow-[#3c66ce]/10">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <Wallet className="h-3.5 w-3.5 text-[#22c55e]" />
                  </div>
                  <span className="text-xs font-medium text-[#22c55e]">
                    {isArgentina ? (
                      `${t('ahorras')} AR$ 46.000`
                    ) : (
                      `${t('ahorras')} $40 USD`
                    )}
                  </span>
                </div>
              </div>

              {/* Countdown Timer - Solo se muestra si showCountdown es true */}
              {showCountdown && (
                <div className="mb-6 p-1 rounded-xl border border-white/20 relative overflow-hidden backdrop-blur-md shadow-lg">
                  {/* Fondo degradado rellena completamente el bloque */}
                  <div className="absolute inset-0 w-full h-full rounded-[0.7rem] bg-gradient-to-r from-[#ef4444]/60 via-[#f97316]/60 to-[#f59e0b]/60 pointer-events-none" />
                  <div className="relative z-10 p-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center">
                        <AlertTriangle className="text-white mr-2 h-5 w-5 animate-pulse" />
                        <span className="text-sm font-medium text-white">{t('ofertaTermina')}</span>
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
                      <Zap className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm title-google-sans">{t('accesoInmediato')}</h4>
                      <p className="text-xs text-foreground/70">{t('comienzaGenerarIngresos')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Infinity className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('accesoPorVida')}</h4>
                      <p className="text-xs text-foreground/70">{t('sinLimitesRenovaciones')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Shield className="text-white" size={16} />
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
                      <HeadphonesIcon className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('soporte24_7')}</h4>
                      <p className="text-xs text-foreground/70">{t('asistenciaPersonalizada')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Sparkles className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('suiteCompleta')}</h4>
                      <p className="text-xs text-foreground/70">{t('accesoFuncionesPremium')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Gift className="text-white" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t('actualizacionesGratuitas')}</h4>
                      <p className="text-xs text-foreground/70">{t('nuevasFuncionesSinCosto')}</p>
                    </div>
                  </div>
                </div>
              </div>





              <Link href="/checkout"> 
                <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] border-0 shadow-lg shadow-[#16a34a]/20 flex items-center justify-center gap-2">
                  {t('empiezaGanarBtn').toUpperCase()}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Button>
              </Link>

              <div className="flex justify-center mt-4 mb-2">
                <div className="px-3 py-1 bg-[#0A0A0A] rounded-full shadow-sm flex items-center gap-1.5 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-primary/30 transition-all bg-[#0A0A0A]">
                  <button
                    className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left"
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3 border border-white/10">
                        <div className="text-white">
                          <UserRound className="h-4 w-4 text-white" />
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
