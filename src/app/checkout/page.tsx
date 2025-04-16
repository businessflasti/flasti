"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Declaración de tipos para Hotmart
declare global {
  interface Window {
    checkoutElements?: {
      init: (type: string, options: any) => {
        mount: (selector: string) => void;
      };
    };
  }
}
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Zap, Infinity, AlertTriangle, Sparkles, Shield, HeadphonesIcon, Gift } from "lucide-react";
import Script from "next/script";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import CheckoutHeader from "@/components/layout/CheckoutHeader";
import PayPalLogo from "@/components/icons/PayPalLogo";
import PayPalIcon from "@/components/icons/PayPalIcon";
import WorldIcon from "@/components/icons/WorldIcon";

const CheckoutContent = () => {
  const { t } = useLanguage();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isHotmartLoaded, setIsHotmartLoaded] = useState(false);
  const [isHotmartLoading, setIsHotmartLoading] = useState(false);
  const [hotmartLoadAttempts, setHotmartLoadAttempts] = useState(0);

  // Estados para el contador
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showCountdown, setShowCountdown] = useState(true);
  const totalSeconds = useRef(22 * 60 * 60); // 22 horas en segundos
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Función para cargar el script de Hotmart
  const loadHotmartScript = useCallback(() => {
    if (isHotmartLoading) return; // Evitar cargas múltiples simultáneas

    setIsHotmartLoading(true);

    // Eliminar cualquier script anterior si existe
    const existingScript = document.getElementById('hotmart-script');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    // Limpiar el contenedor de checkout
    const checkoutContainer = document.getElementById('inline_checkout');
    if (checkoutContainer) {
      checkoutContainer.innerHTML = '<div class="animate-pulse text-white/70">Cargando formulario de pago...</div>';
    }

    // Crear y cargar el nuevo script
    const script = document.createElement("script");
    script.id = 'hotmart-script';
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;

    script.onload = () => {
      if (window.checkoutElements) {
        try {
          const elements = window.checkoutElements.init("inlineCheckout", {
            offer: "mz63zpyh",
          });

          elements.mount("#inline_checkout");
          setIsHotmartLoaded(true);
          setIsHotmartLoading(false);
          setHotmartLoadAttempts(0); // Reiniciar los intentos cuando se carga con éxito

          console.log("Hotmart cargado exitosamente");
        } catch (error) {
          console.error("Error al inicializar Hotmart:", error);
          setIsHotmartLoading(false);
          retryHotmartLoad();
        }
      } else {
        console.error("checkoutElements no está disponible");
        setIsHotmartLoading(false);
        retryHotmartLoad();
      }
    };

    script.onerror = () => {
      console.error("Error al cargar el script de Hotmart");
      setIsHotmartLoading(false);
      retryHotmartLoad();
    };

    document.body.appendChild(script);

    return script;
  }, [isHotmartLoading]);

  // Función para reintentar la carga de Hotmart
  const retryHotmartLoad = useCallback(() => {
    const maxAttempts = 3;
    if (hotmartLoadAttempts < maxAttempts) {
      setHotmartLoadAttempts(prev => prev + 1);
      setTimeout(() => {
        console.log(`Reintentando cargar Hotmart (intento ${hotmartLoadAttempts + 1}/${maxAttempts})`);
        loadHotmartScript();
      }, 1000); // Esperar 1 segundo antes de reintentar
    } else {
      console.error(`No se pudo cargar Hotmart después de ${maxAttempts} intentos`);
    }
  }, [hotmartLoadAttempts, loadHotmartScript]);

  // Efecto para cargar Hotmart cuando se selecciona como método de pago
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    if (selectedPaymentMethod === "hotmart") {
      script = loadHotmartScript();
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [selectedPaymentMethod, loadHotmartScript]);

  // Efecto para el contador
  useEffect(() => {
    // Inicializar el contador desde localStorage o crear uno nuevo
    const initializeCountdown = () => {
      // Verificar si hay un contador guardado en localStorage
      const savedCountdown = localStorage.getItem('flastiCountdown');
      const savedExpiry = localStorage.getItem('flastiCountdownExpiry');

      if (savedCountdown && savedExpiry) {
        const expiryTime = parseInt(savedExpiry, 10);
        const now = Date.now();

        if (now < expiryTime) {
          // El contador aún no ha expirado, calcular tiempo restante
          const remainingMs = expiryTime - now;
          const remainingSeconds = Math.floor(remainingMs / 1000);
          const remainingHours = Math.floor(remainingSeconds / 3600);
          const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
          const remainingSecondsLeft = remainingSeconds % 60;

          setCountdown({
            hours: remainingHours,
            minutes: remainingMinutes,
            seconds: remainingSecondsLeft
          });

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

  const paypalOptions = {
    "client-id": "ARoSv53ctY4XSQw6eGen9Mr44GkmEniwbNfhmQqIeD1YzgTjo2wYdazS7rMwgjrMhDO6eEx8dUq_L_yz",
    currency: "USD",
    intent: "capture",
    components: "buttons",
    locale: "es_ES",
    "disable-funding": "credit,card,sofort",
  };

  return (
    <div className="min-h-screen mobile-smooth-scroll" style={{ background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)" }}>
      <CheckoutHeader />
      <div className="container-custom py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {/* Columna derecha - Resumen de compra (aparece primero en móvil) */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2 mb-2 lg:mb-0">
            <Card className="border border-[#2a2a4a] bg-[#1a1a2e] p-6 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-white">Flasti</h2>
                  <p className="text-sm text-white/70">Acceso exclusivo a la plataforma</p>
                </div>
                <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-medium py-1 px-3 rounded-full flex items-center gap-1 whitespace-nowrap md:-mt-7">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pago Seguro
                </div>
              </div>

              <div className="bg-[#0f0f1a] rounded-xl border border-[#2a2a4a] p-4 mt-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-bold text-white">$10</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-white/70">USD</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm line-through text-red-500">$50</span>
                      <span className="text-xs font-bold bg-green-500 text-black px-1.5 py-0.5 rounded">90% OFF</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/70 md:whitespace-nowrap mt-3">Pago único - Sin suscripciones ni cargos recurrentes</p>
              </div>

              {/* Countdown Timer - Solo se muestra si showCountdown es true */}
              {showCountdown && (
                <div className="mb-4 p-3 bg-gradient-to-r from-[#ec4899]/20 to-[#f97316]/20 backdrop-blur-sm rounded-xl border border-[#ec4899]/30 shadow-lg shadow-[#ec4899]/5 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#ec4899]/10 blur-2xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[#f97316]/10 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center">
                        <AlertTriangle className="text-[#ef4444] mr-2 h-5 w-5 animate-pulse" />
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

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <Zap className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Acceso inmediato</h4>
                    <p className="text-xs text-white/70">Comienza a generar ingresos ahora mismo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <Infinity className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Acceso de por vida</h4>
                    <p className="text-xs text-white/70">Sin límites de tiempo ni renovaciones</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <Shield className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Garantía de 7 días</h4>
                    <p className="text-xs text-white/70">Devolución del 100% si no estás satisfecho</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <HeadphonesIcon className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Soporte 24/7</h4>
                    <p className="text-xs text-white/70">Asistencia personalizada paso a paso</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <Sparkles className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Suite completa</h4>
                    <p className="text-xs text-white/70">Acceso a todas las funciones premium</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center flex-shrink-0 border border-[#3a3a5a]">
                    <Gift className="text-[#ec4899]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">Actualizaciones gratuitas</h4>
                    <p className="text-xs text-white/70">Nuevas funciones sin costo adicional</p>
                  </div>
                </div>
              </div>


            </Card>
          </div>

          {/* Columna izquierda - Métodos de pago */}
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <div className="mb-4 lg:mb-8">
              <h1 className="text-2xl font-bold mb-2 text-white">Información de pago</h1>
              <p className="text-white/70 text-sm">Todas las transacciones son seguras y encriptadas</p>
            </div>

            {/* Opciones de pago */}
            <div className="space-y-4">

              {/* Moneda local - Hotmart */}
              <Card className={`border border-[#2a2a4a] bg-[#1a1a2e] overflow-hidden rounded-xl mobile-card ${selectedPaymentMethod === "hotmart" ? "border-[#ec4899]" : ""}`}>
                <div
                  className="p-4 cursor-pointer flex items-center justify-between mobile-touch-friendly mobile-touch-feedback"
                  onClick={() => {
                    // Si ya está seleccionado, deseleccionarlo
                    if (selectedPaymentMethod === "hotmart") {
                      setSelectedPaymentMethod(null);
                      // Cambiar el método de pago
                    } else {
                      setSelectedPaymentMethod("hotmart");
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center border border-[#3a3a5a]">
                      <WorldIcon className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Moneda local</h3>
                      <div className="grid grid-cols-10 md:flex md:flex-nowrap gap-1 mt-3 w-full">
                        {[
                          // Primera línea (10 banderas)
                          "🇦🇷", // Argentina
                          "🇨🇴", // Colombia
                          "🇻🇪", // Venezuela
                          "🇵🇪", // Perú
                          "🇲🇽", // México
                          "🇵🇦", // Panamá
                          "🇬🇹", // Guatemala
                          "🇸🇻", // El Salvador
                          "🇩🇴", // República Dominicana
                          "🇵🇷", // Puerto Rico
                          // Segunda línea (10 banderas)
                          "🇪🇨", // Ecuador
                          "🇵🇾", // Paraguay
                          "🇪🇸", // España
                          "🇨🇷", // Costa Rica
                          "🇨🇱", // Chile
                          "🇺🇾", // Uruguay
                          "🇧🇴", // Bolivia
                          "🇭🇳", // Honduras
                          "🇺🇸", // Estados Unidos
                          "🇧🇷"  // Brasil
                        ].map((flag, index) => (
                          <span key={index} className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white">
                            <span className="text-[10px] font-bold">{flag}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-white/70 mt-3">Realiza tu pago rápido y seguro en tu moneda</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-[#3a3a5a] flex items-center justify-center">
                    {selectedPaymentMethod === "hotmart" && <CheckIcon className="h-4 w-4 text-[#ec4899]" />}
                  </div>
                </div>

                {selectedPaymentMethod === "hotmart" && (
                  <div className="p-6 border-t border-[#2a2a4a]" style={{ background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)" }}>
                    <div id="inline_checkout" className="min-h-[300px] flex items-center justify-center rounded-lg overflow-hidden">
                      <div className="animate-pulse text-white/70">Cargando formulario de pago...</div>
                    </div>
                  </div>
                )}
              </Card>

              {/* PayPal */}
              <Card className={`border border-[#2a2a4a] bg-[#1a1a2e] overflow-hidden rounded-xl mobile-card ${selectedPaymentMethod === "paypal" ? "border-[#ec4899]" : ""}`}>
                <div
                  className="p-4 cursor-pointer flex items-center justify-between mobile-touch-friendly mobile-touch-feedback"
                  onClick={() => {
                    // Si ya está seleccionado, deseleccionarlo
                    if (selectedPaymentMethod === "paypal") {
                      setSelectedPaymentMethod(null);
                    } else {
                      setSelectedPaymentMethod("paypal");
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center border border-[#3a3a5a]">
                      <div className="flex items-center justify-center w-full h-full pl-0.5">
                        <PayPalIcon className="text-white h-5 w-5 flex-shrink-0" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">PayPal</h3>
                      <p className="text-sm text-white/70">Paga de forma segura con tu cuenta de PayPal</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-[#3a3a5a] flex items-center justify-center">
                    {selectedPaymentMethod === "paypal" && <CheckIcon className="h-4 w-4 text-[#ec4899]" />}
                  </div>
                </div>

                {selectedPaymentMethod === "paypal" && (
                  <div className="p-6 border-t border-[#2a2a4a]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium mb-1 text-white">Pago con PayPal</h3>
                        <p className="text-sm text-white/70">Activa tu acceso al instante con PayPal de forma rápida y segura.</p>
                      </div>
                      <div className="text-white">
                        <PayPalLogo className="h-6 w-auto" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 p-3 bg-[#0f0f1a] rounded-lg border border-[#2a2a4a]">
                      <span className="text-sm text-white">Total</span>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-3">
                          <span className="text-sm line-through text-red-500">$50 USD</span>
                          <span className="text-xs font-bold bg-green-500 text-black px-1.5 py-0.5 rounded">90% OFF</span>
                        </div>
                        <span className="font-bold text-white mt-1">$ 10 USD</span>
                      </div>
                    </div>



                    <div className="mb-6">
                      {/* Mostramos directamente los botones de PayPal */}
                      <PayPalScriptProvider options={paypalOptions}>
                        <PayPalButtons
                          style={{ layout: "vertical", label: "pay", tagline: false, shape: "rect" }}
                          fundingSource="paypal"
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: "10.00",
                                  },
                                  description: "Acceso a Flasti",
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                              console.log("Pago completado. ID de transacción: " + details.id);
                              // Redirigir al usuario a la página de registro
                              window.location.href = "/register";
                            });
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>


                      <div className="flex items-center justify-center text-xs text-white/70 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        Pago 100% seguro, protegemos tus datos.
                      </div>


                    </div>
                )}
              </Card>

              {selectedPaymentMethod !== "paypal" && (
                <div className="flex items-center justify-center text-xs text-white/70 mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Pago 100% seguro, protegemos tus datos.
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
