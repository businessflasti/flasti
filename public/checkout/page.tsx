"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExitIntentPopup from "@/components/checkout/ExitIntentPopup";
import { loadMercadoPago } from "./mercadoPago";
import MercadoPagoLogo from "@/components/icons/MercadoPagoLogo";
import Image from "next/image";
import CheckoutFomoWrapper from '@/components/checkout/CheckoutFomoWrapper';

// Declaración de tipos para Hotmart
declare global {
  interface Window {
    checkoutElements?: {
      init: (type: string, options: any) => {
        mount: (selector: string) => void;
      };
    };
    MercadoPago?: any;
  }
}
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Zap, Infinity, AlertTriangle, Sparkles, Shield, HeadphonesIcon, Gift, Wallet, Globe } from "lucide-react";
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
  const [isArgentina, setIsArgentina] = useState(false);

  // Estados para los popups
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalDiscountApplied, setFinalDiscountApplied] = useState(false);
  const [price, setPrice] = useState("10.00");

  // Estados para el contador
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showCountdown, setShowCountdown] = useState(true);
  const totalSeconds = useRef((17 * 60 * 60) + (47 * 60)); // 17 horas y 47 minutos en segundos
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Referencia para rastrear si el usuario ya ha visto el popup
  const hasSeenPopup = useRef(false);

  // La función loadMercadoPago ahora se importa desde "./mercadoPago"

  // Función para cargar el script de Hotmart
  const loadHotmartScript = useCallback(() => {
    if (isHotmartLoading) return; // Evitar cargas múltiples simultáneas

    console.log("Cargando Hotmart con estado de descuentos:", { discountApplied, finalDiscountApplied, price });

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
          // Usar una oferta diferente basada en el descuento aplicado
          let offerCode = "mz63zpyh"; // Oferta normal (precio completo: $10 USD)

          if (finalDiscountApplied) {
            offerCode = "5h87lps7"; // Oferta con descuento final (precio: $5 USD)
          } else if (discountApplied) {
            offerCode = "yegwjf6i"; // Oferta con descuento inicial (precio: $8 USD)
          }

          const elements = window.checkoutElements.init("inlineCheckout", {
            offer: offerCode,
          });

          elements.mount("#inline_checkout");
          setIsHotmartLoaded(true);
          setIsHotmartLoading(false);
          setHotmartLoadAttempts(0); // Reiniciar los intentos cuando se carga con éxito

          console.log(`Hotmart cargado exitosamente con oferta: ${offerCode}`);
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
  }, [isHotmartLoading, discountApplied, finalDiscountApplied, price]);

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
  }, [hotmartLoadAttempts, loadHotmartScript, discountApplied, finalDiscountApplied]);

  // Referencia para almacenar el preferenceId de Mercado Pago
  const mercadoPagoPreferenceId = useRef<string | null>(null);
  const mercadoPagoInitPoint = useRef<string | null>(null);
  const isFetchingPreference = useRef(false);

  // Función para precargar el preferenceId de Mercado Pago
  const preloadMercadoPagoPreference = useCallback(async () => {
    // Evitar múltiples solicitudes simultáneas
    if (isFetchingPreference.current || mercadoPagoPreferenceId.current) return;

    isFetchingPreference.current = true;

    try {
      // Obtener el precio actual desde localStorage
      let amountARS = 11500; // Valor por defecto: 11.500 ARS

      // Verificar si hay descuentos aplicados
      const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
      const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

      if (finalDiscountApplied) {
        amountARS = 5750; // 5.750 ARS para el descuento de $5 USD
      } else if (discountApplied) {
        amountARS = 9200; // 9.200 ARS para el descuento de $8 USD
      }

      // Obtener el preferenceId desde nuestro endpoint
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Acceso a Flasti',
          unitPrice: amountARS,
          currency: 'ARS',
          quantity: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener preferenceId');
      }

      const data = await response.json();
      mercadoPagoPreferenceId.current = data.id;
      mercadoPagoInitPoint.current = data.init_point;
      console.log('PreferenceId precargado:', data.id);

      // Precargar el script de Mercado Pago si no está cargado
      if (!document.getElementById('mercadopago-script')) {
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;
        script.id = 'mercadopago-script';
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error('Error al precargar preferenceId:', error);
    } finally {
      isFetchingPreference.current = false;
    }
  }, []);

  // Efecto para precargar el preferenceId cuando se detecta que el usuario es de Argentina
  useEffect(() => {
    if (isArgentina) {
      // Precargar el preferenceId para tenerlo listo cuando el usuario seleccione Moneda local
      preloadMercadoPagoPreference();

      // No precargar el script de Mercado Pago aquí, se cargará cuando se seleccione el método de pago
    }
  }, [isArgentina, preloadMercadoPagoPreference]);

  // Efecto para cargar Hotmart o Mercado Pago cuando se selecciona como método de pago
  useEffect(() => {
    // Limpiar cualquier botón de Mercado Pago existente
    const cleanupMercadoPago = () => {
      const mpContainer = document.getElementById('mp-wallet-container');
      if (mpContainer) {
        // Eliminar cualquier script de Mercado Pago existente
        const existingScripts = document.querySelectorAll('script[src*="mercadopago"]');
        existingScripts.forEach(script => {
          console.log('Eliminando script de Mercado Pago:', script);
          script.remove();
        });

        // Eliminar script con ID específico
        const namedScript = document.getElementById('mercadopago-script');
        if (namedScript) {
          console.log('Eliminando script con ID mercadopago-script');
          namedScript.remove();
        }

        // Limpiar el contenedor
        while (mpContainer.firstChild) {
          mpContainer.removeChild(mpContainer.firstChild);
        }

        // Agregar mensaje de carga
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
        loadingDiv.innerHTML = 'Conectando con Mercado Pago<span class="opacity-80">...</span>';
        mpContainer.appendChild(loadingDiv);
      }
    };

    if (selectedPaymentMethod === "hotmart") {
      // Si el usuario es de Argentina, cargar Mercado Pago en lugar de Hotmart
      if (isArgentina) {
        console.log('Usuario argentino detectado, cargando Mercado Pago...');

        // Limpiar cualquier botón existente
        cleanupMercadoPago();

        // Precargar el preferenceId con el precio actual
        preloadMercadoPagoPreference();

        // Esperar un momento para asegurarse de que el preferenceId se haya cargado
        setTimeout(() => {
          // Cargar Mercado Pago
          loadMercadoPago(mercadoPagoPreferenceId.current, mercadoPagoInitPoint.current);
          console.log('Mercado Pago cargado inicialmente');
        }, 300);
      } else {
        console.log('Usuario no argentino, cargando Hotmart...');
        // Cargar Hotmart
        loadHotmartScript();
      }
    }

    // Función de limpieza vacía
    return () => {};
  }, [selectedPaymentMethod, loadHotmartScript, loadMercadoPago, isArgentina, preloadMercadoPagoPreference]);

  // Función para aplicar el descuento
  const applyDiscount = useCallback(() => {
    if (!discountApplied && !finalDiscountApplied) {
      setDiscountApplied(true);
      setPrice("8.00");

      // Guardar en localStorage que el descuento ha sido aplicado
      localStorage.setItem('flastiDiscountApplied', 'true');

      // Cerrar la sección de "moneda local" si está abierta
      setSelectedPaymentMethod(null);

      // Esperar un momento y luego recargar
      setTimeout(() => {
        // Si Hotmart está cargado, recargar con el nuevo precio
        if (selectedPaymentMethod === "hotmart") {
        // Si el usuario es de Argentina, recargar Mercado Pago
        if (isArgentina) {
          // Precargar el preferenceId con el nuevo precio
          preloadMercadoPagoPreference();

          // Limpiar y recargar el botón de Mercado Pago
          console.log('Aplicando descuento y recargando Mercado Pago...');

          // Eliminar TODOS los scripts de Mercado Pago
          const existingScripts = document.querySelectorAll('script[src*="mercadopago"]');
          existingScripts.forEach(script => {
            console.log('Eliminando script de Mercado Pago:', script);
            script.remove();
          });

          // Eliminar cualquier script con ID específico
          const namedScript = document.getElementById('mercadopago-script');
          if (namedScript) {
            console.log('Eliminando script con ID mercadopago-script');
            namedScript.remove();
          }

          // Eliminar TODOS los botones de Mercado Pago en el documento
          const allButtons = document.querySelectorAll('.mercadopago-button');
          if (allButtons.length > 0) {
            console.log(`Eliminando ${allButtons.length} botones de Mercado Pago existentes...`);
            allButtons.forEach(button => button.remove());
          }

          // Limpiar el contenedor
          const mpContainer = document.getElementById('mp-wallet-container');
          if (mpContainer) {
            // Limpiar completamente el contenedor
            while (mpContainer.firstChild) {
              mpContainer.removeChild(mpContainer.firstChild);
            }

            // Agregar mensaje de carga
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
            loadingDiv.innerHTML = 'Conectando con Mercado Pago<span class="opacity-80">...</span>';
            mpContainer.appendChild(loadingDiv);

            // Esperar un momento para asegurarnos de que todo se ha limpiado
            setTimeout(() => {
              // Precargar el preferenceId con el nuevo precio
              preloadMercadoPagoPreference();

              // Esperar otro momento para que se cargue el preferenceId
              setTimeout(() => {
                // Eliminar nuevamente cualquier botón que haya aparecido
                const newButtons = document.querySelectorAll('.mercadopago-button');
                if (newButtons.length > 0) {
                  console.log(`Eliminando ${newButtons.length} botones de Mercado Pago antes de recargar...`);
                  newButtons.forEach(button => button.remove());
                }

                // Cargar Mercado Pago con el nuevo precio
                loadMercadoPago(null, null);
                console.log('Mercado Pago recargado con descuento aplicado');

                // Verificar y eliminar botones duplicados después de un momento
                setTimeout(() => {
                  const finalButtons = document.querySelectorAll('.mercadopago-button');
                  if (finalButtons.length > 1) {
                    console.log(`Eliminando ${finalButtons.length - 1} botones duplicados finales...`);
                    for (let i = 1; i < finalButtons.length; i++) {
                      finalButtons[i].remove();
                    }
                  }
                }, 1000);
              }, 500);
            }, 300);
          }
        } else {
          // Si no es de Argentina, cargar Hotmart
          loadHotmartScript();
        }
      }

      console.log("Descuento aplicado: $8.00 USD");
      }, 100); // Esperar 100ms antes de recargar
    }
  }, [discountApplied, finalDiscountApplied, selectedPaymentMethod, loadHotmartScript, isArgentina, preloadMercadoPagoPreference, setSelectedPaymentMethod]);

  // Función para aplicar el descuento final (última oportunidad)
  const applyFinalDiscount = useCallback(() => {
    if (!finalDiscountApplied) {
      setFinalDiscountApplied(true);
      setDiscountApplied(false); // Asegurarse de que el descuento normal no esté aplicado
      setPrice("5.00");

      // Guardar en localStorage que el descuento final ha sido aplicado
      localStorage.setItem('flastiFinalDiscountApplied', 'true');
      localStorage.removeItem('flastiDiscountApplied'); // Eliminar el descuento normal

      // Cerrar la sección de "moneda local" si está abierta
      setSelectedPaymentMethod(null);

      // Esperar un momento y luego recargar
      setTimeout(() => {
        // Si Hotmart está cargado, recargar con el nuevo precio
        if (selectedPaymentMethod === "hotmart") {
        // Si el usuario es de Argentina, recargar Mercado Pago
        if (isArgentina) {
          // Precargar el preferenceId con el nuevo precio
          preloadMercadoPagoPreference();

          // Limpiar y recargar el botón de Mercado Pago
          console.log('Aplicando descuento final y recargando Mercado Pago...');

          // Eliminar TODOS los scripts de Mercado Pago
          const existingScripts = document.querySelectorAll('script[src*="mercadopago"]');
          existingScripts.forEach(script => {
            console.log('Eliminando script de Mercado Pago:', script);
            script.remove();
          });

          // Eliminar cualquier script con ID específico
          const namedScript = document.getElementById('mercadopago-script');
          if (namedScript) {
            console.log('Eliminando script con ID mercadopago-script');
            namedScript.remove();
          }

          // Eliminar TODOS los botones de Mercado Pago en el documento
          const allButtons = document.querySelectorAll('.mercadopago-button');
          if (allButtons.length > 0) {
            console.log(`Eliminando ${allButtons.length} botones de Mercado Pago existentes...`);
            allButtons.forEach(button => button.remove());
          }

          // Limpiar el contenedor
          const mpContainer = document.getElementById('mp-wallet-container');
          if (mpContainer) {
            // Limpiar completamente el contenedor
            while (mpContainer.firstChild) {
              mpContainer.removeChild(mpContainer.firstChild);
            }

            // Agregar mensaje de carga
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
            loadingDiv.innerHTML = 'Conectando con Mercado Pago<span class="opacity-80">...</span>';
            mpContainer.appendChild(loadingDiv);

            // Esperar un momento para asegurarnos de que todo se ha limpiado
            setTimeout(() => {
              // Precargar el preferenceId con el nuevo precio
              preloadMercadoPagoPreference();

              // Esperar otro momento para que se cargue el preferenceId
              setTimeout(() => {
                // Eliminar nuevamente cualquier botón que haya aparecido
                const newButtons = document.querySelectorAll('.mercadopago-button');
                if (newButtons.length > 0) {
                  console.log(`Eliminando ${newButtons.length} botones de Mercado Pago antes de recargar...`);
                  newButtons.forEach(button => button.remove());
                }

                // Cargar Mercado Pago con el nuevo precio
                loadMercadoPago(null, null);
                console.log('Mercado Pago recargado con descuento final aplicado');

                // Verificar y eliminar botones duplicados después de un momento
                setTimeout(() => {
                  const finalButtons = document.querySelectorAll('.mercadopago-button');
                  if (finalButtons.length > 1) {
                    console.log(`Eliminando ${finalButtons.length - 1} botones duplicados finales...`);
                    for (let i = 1; i < finalButtons.length; i++) {
                      finalButtons[i].remove();
                    }
                  }
                }, 1000);
              }, 500);
            }, 300);
          }
        } else {
          // Si no es de Argentina, cargar Hotmart
          loadHotmartScript();
        }
      }

      console.log("Descuento final aplicado: $5.00 USD");
      }, 100); // Esperar 100ms antes de recargar
    }
  }, [finalDiscountApplied, selectedPaymentMethod, loadHotmartScript, isArgentina, preloadMercadoPagoPreference, setSelectedPaymentMethod]);

  // Efecto para detectar el país del usuario
  useEffect(() => {
    // Función para detectar si el usuario está en Argentina
    const detectCountry = async () => {
      try {
        // Primero verificar si ya tenemos la información guardada en localStorage
        const savedCountry = localStorage.getItem('flastiUserCountry');

        if (savedCountry === 'AR') {
          setIsArgentina(true);
          console.log('[Checkout] Usuario argentino detectado desde localStorage.');
          return;
        } else if (savedCountry) {
          setIsArgentina(false);
          console.log(`[Checkout] Usuario de ${savedCountry} detectado desde localStorage.`);
          return;
        }

        // Si no hay información guardada, usar el servicio de geolocalización
        console.log('[Checkout] Detectando país mediante API...');
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
          }

          const data = await response.json();
          console.log('[Checkout] Datos de geolocalización:', data);

          if (data && data.country_code) {
            // Guardar el país en localStorage para futuras visitas
            localStorage.setItem('flastiUserCountry', data.country_code);

            // Verificar si el país es Argentina
            if (data.country_code === 'AR') {
              setIsArgentina(true);
              console.log('[Checkout] Usuario detectado en Argentina. Mostrando Mercado Pago.');
            } else {
              setIsArgentina(false);
              console.log(`[Checkout] Usuario detectado en ${data.country_name || data.country_code}. Mostrando Hotmart.`);
            }
          } else {
            console.error('[Checkout] No se pudo obtener el código de país:', data);
            setIsArgentina(false);
          }
        } catch (apiError) {
          console.error('[Checkout] Error al consultar la API de geolocalización:', apiError);
          setIsArgentina(false); // Por defecto, no es Argentina
        }
      } catch (error) {
        console.error('[Checkout] Error general al detectar el país:', error);
        setIsArgentina(false); // Por defecto, no es Argentina
      }
    };

    // Detectar el país solo en el cliente
    if (typeof window !== 'undefined') {
      detectCountry();
    }
  }, []);

  // Ya no seleccionamos automáticamente ningún método de pago
  // para que el usuario elija manualmente
  useEffect(() => {
    // Inicialmente, ningún método de pago está seleccionado
    setSelectedPaymentMethod(null);
  }, []);

  // Efecto para detectar intento de salida y mostrar el popup automáticamente después de 10 minutos
  useEffect(() => {
    // Verificar si el descuento final ya ha sido aplicado en una sesión anterior
    const savedFinalDiscount = localStorage.getItem('flastiFinalDiscountApplied');
    if (savedFinalDiscount === 'true') {
      setFinalDiscountApplied(true);
      setPrice("5.00");
    }
    // Si no hay descuento final, verificar si hay descuento normal
    else {
      const savedDiscount = localStorage.getItem('flastiDiscountApplied');
      if (savedDiscount === 'true') {
        setDiscountApplied(true);
        setPrice("8.00");
      }
    }

    // Referencia para el temporizador de 10 minutos
    let autoShowTimer: NodeJS.Timeout | null = null;

    // Función para mostrar el popup
    const showPopup = () => {
      if (!hasSeenPopup.current && !discountApplied && !finalDiscountApplied) {
        setShowExitPopup(true);
        hasSeenPopup.current = true;
      }
    };

    // Función para detectar cuando el mouse sale de la ventana
    const handleMouseLeave = (e: MouseEvent) => {
      // Solo mostrar el popup si el mouse sale por la parte superior de la ventana
      // y no se ha aplicado ningún descuento
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    // Función para detectar gestos de deslizamiento en dispositivos móviles
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartX = e.touches[0].clientX;
      const touchStartY = e.touches[0].clientY;

      const handleTouchMove = (e: TouchEvent) => {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Calcular la dirección principal del deslizamiento
        const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

        // Solo activar el popup si el usuario desliza horizontalmente hacia la derecha (gesto para ir hacia atrás)
        // y el deslizamiento es principalmente horizontal (no vertical)
        if (isHorizontalSwipe && diffX > 50) {
          // showPopup(); // Se elimina la llamada al popup en el gesto de deslizamiento
          // document.removeEventListener('touchmove', handleTouchMove); // Se elimina, ya se limpia en handleTouchEnd
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: true });

      // Limpiar el event listener de touchmove cuando termina el toque
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    };

    // Asegurarse de que estamos en el cliente antes de agregar event listeners
    if (typeof window !== 'undefined') {
      // Configurar el temporizador para mostrar el popup automáticamente después de 10 minutos
      autoShowTimer = setTimeout(() => {
        showPopup();
      }, 10 * 60 * 1000); // 10 minutos en milisegundos

      // Agregar event listeners
      document.addEventListener('mouseleave', handleMouseLeave); // Este listener se mantiene para el "exit intent" de ratón
      document.addEventListener('touchstart', handleTouchStart, { passive: true });

      // Limpiar event listeners y temporizador al desmontar
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('touchstart', handleTouchStart);

        if (autoShowTimer) {
          clearTimeout(autoShowTimer);
        }
      };
    }
  }, [discountApplied, finalDiscountApplied]);

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

  const paypalOptions = {
    "client-id": "ARoSv53ctY4XSQw6eGen9Mr44GkmEniwbNfhmQqIeD1YzgTjo2wYdazS7rMwgjrMhDO6eEx8dUq_L_yz",
    currency: "USD",
    intent: "capture",
    components: "buttons",
    locale: "es_ES",
    "disable-funding": "credit,card,sofort",
    clientId: "ARoSv53ctY4XSQw6eGen9Mr44GkmEniwbNfhmQqIeD1YzgTjo2wYdazS7rMwgjrMhDO6eEx8dUq_L_yz", // Añadido para compatibilidad
  };

  return (
    <div className="min-h-screen mobile-smooth-scroll" style={{ background: "linear-gradient(to bottom, #0f0f1a, #1a1a2e)" }}>
      <CheckoutHeader />

      {/* Exit Intent Popup */}
      <ExitIntentPopup
        isOpen={showExitPopup}
        onClose={() => setShowExitPopup(false)}
        onApplyCoupon={applyDiscount}
        onApplyFinalDiscount={applyFinalDiscount}
        isArgentina={isArgentina}
      />

      <div className="container-custom py-6 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {/* Columna derecha - Resumen de compra (aparece primero en móvil) */}
          <div className="w-full lg:w-1/3 order-1 lg:order-2 mb-2 lg:mb-0">
            <Card className="border border-[#2a2a4a] bg-[#1a1a2e] p-6 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl text-white"
                    style={{
                      fontFamily: "'Söhne', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontWeight: 600,
                      letterSpacing: '-0.01em'
                    }}
                  >flasti</h2>
                  <p className="text-sm text-white/70">Acceso exclusivo a la plataforma</p>
                </div>
                <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-medium py-1 px-3 rounded-full flex items-center gap-1 whitespace-nowrap md:-mt-7">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pago Seguro
                </div>
              </div>

              <div className="bg-[#0f0f1a] rounded-xl border border-[#2a2a4a] p-4 mt-4 mb-4 relative">
                {/* Banderita del país - En la esquina superior derecha en desktop, inferior en móvil */}
                <div className="md:absolute md:top-3 md:right-3 absolute bottom-3 right-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10 flex items-center justify-center bg-primary/10">
                    {(() => {
                      // Obtener el código de país desde localStorage
                      const countryCode = typeof window !== 'undefined' ? localStorage.getItem('flastiUserCountry') : null;

                      // Si tenemos un código de país válido, mostrar la bandera correspondiente
                      if (countryCode && countryCode.length === 2) {
                        return (
                          <img
                            src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                            alt={countryCode.toUpperCase()}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              // Verificar que parentElement no sea null antes de modificar innerHTML
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>';
                              }
                            }}
                          />
                        );
                      } else {
                        // Si no hay código de país o no es válido, mostrar el icono de globo
                        return <Globe className="h-2 w-2 md:h-2.5 md:w-2.5 text-[#9333ea]" />;
                      }
                    })()}
                  </div>
                </div>

                {/* Versión móvil - Diseño más compacto */}
                <div className="md:hidden">
                  {/* Mostrar precio en USD cuando se selecciona PayPal o cuando no es Argentina */}
                  {(selectedPaymentMethod === "paypal" || !isArgentina) ? (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          $ {finalDiscountApplied ? "5" : (discountApplied ? "8" : "10")} USD
                        </span>
                        <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-black px-1 py-0.5 rounded whitespace-nowrap">
                          {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs line-through text-red-500">$50</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          AR$ {finalDiscountApplied ? "5.750" : (discountApplied ? "9.200" : "11.500")}
                        </span>
                        <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-black px-1 py-0.5 rounded whitespace-nowrap">
                          {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Versión desktop - Diseño original */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Mostrar precio en USD cuando se selecciona PayPal o cuando no es Argentina */}
                    {(selectedPaymentMethod === "paypal" || !isArgentina) ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">
                            $ {finalDiscountApplied ? "5" : (discountApplied ? "8" : "10")} USD
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs line-through text-red-500">$50</span>
                            <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-black px-1 py-0.5 rounded ml-1 whitespace-nowrap">
                              {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">
                            AR$ {finalDiscountApplied ? "5.750" : (discountApplied ? "9.200" : "11.500")}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                            <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-black px-1 py-0.5 rounded ml-1 whitespace-nowrap">
                              {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white/70 md:whitespace-nowrap mt-2">Pago único - Sin suscripciones ni cargos recurrentes</p>
              </div>

              {/* Etiqueta de ahorro llamativa (como caja separada pero compacta) */}
              {/* Versión móvil - Diseño más compacto */}
              <div className="md:hidden mb-3 mt-3 bg-gradient-to-r from-[#22c55e]/20 to-[#16a34a]/20 py-2 px-2 rounded-lg border border-[#22c55e]/30 flex items-center justify-between shadow-sm shadow-[#22c55e]/10">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <Wallet className="h-3 w-3 text-[#22c55e]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#22c55e] whitespace-nowrap">
                    {selectedPaymentMethod === "paypal" ? (
                      `Ahorras $${finalDiscountApplied ? "45" : (discountApplied ? "42" : "40")}`
                    ) : isArgentina ? (
                      `Ahorras AR$ ${finalDiscountApplied ? "51.750" : (discountApplied ? "48.300" : "46.000")}`
                    ) : (
                      `Ahorras $${finalDiscountApplied ? "45" : (discountApplied ? "42" : "40")}`
                    )}
                  </span>
                </div>

                {/* Etiqueta de cupón aplicado - Solo visible cuando hay descuento */}
                {(discountApplied || finalDiscountApplied) && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#f59e0b]/20 to-[#eab308]/20 px-1.5 py-0.5 rounded border border-[#f59e0b]/30 animate-pulse">
                    <Zap className="h-2.5 w-2.5 text-[#fbbf24]" />
                    <span className="text-xs font-medium text-[#fbbf24]">Cupón</span>
                  </div>
                )}
              </div>

              {/* Versión desktop - Diseño original */}
              <div className="hidden md:flex mb-3 mt-3 bg-gradient-to-r from-[#22c55e]/20 to-[#16a34a]/20 py-2 px-3 rounded-lg border border-[#22c55e]/30 items-center justify-between shadow-sm shadow-[#22c55e]/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <Wallet className="h-3.5 w-3.5 text-[#22c55e]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-[#22c55e] whitespace-nowrap">
                    {selectedPaymentMethod === "paypal" ? (
                      `Ahorras $${finalDiscountApplied ? "45" : (discountApplied ? "42" : "40")} USD`
                    ) : isArgentina ? (
                      `Ahorras AR$ ${finalDiscountApplied ? "51.750" : (discountApplied ? "48.300" : "46.000")}`
                    ) : (
                      `Ahorras $${finalDiscountApplied ? "45" : (discountApplied ? "42" : "40")} USD`
                    )}
                  </span>
                </div>

                {/* Etiqueta de cupón aplicado - Solo visible cuando hay descuento */}
                {(discountApplied || finalDiscountApplied) && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#f59e0b]/20 to-[#eab308]/20 px-2 py-1 rounded border border-[#f59e0b]/30 animate-pulse">
                    <Zap className="h-3 w-3 text-[#fbbf24]" />
                    <span className="text-xs font-medium text-[#fbbf24]">Cupón</span>
                  </div>
                )}
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

              {/* Moneda local - Hotmart o Mercado Pago */}
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

                      <div className="grid grid-cols-10 md:flex md:flex-nowrap gap-1 mt-3 w-full pr-2">
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
                            ].map((flag, index) => {
                              // Obtener el código de país a partir del emoji de la bandera
                              const countryCode = flag.codePointAt(0)! - 127397;
                              const countryChar1 = String.fromCharCode(countryCode);
                              const countryCode2 = flag.codePointAt(2)! - 127397;
                              const countryChar2 = String.fromCharCode(countryCode2);
                              const country = (countryChar1 + countryChar2).toLowerCase();

                              return (
                                <span key={index} className="w-4 h-4 md:w-5 md:h-5 rounded-full overflow-hidden flex items-center justify-center bg-[#0f0f1a] border border-white/10">
                                  <img
                                    src={`https://flagcdn.com/w20/${country}.png`}
                                    alt={country.toUpperCase()}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      // Verificar que parentElement no sea null antes de modificar innerHTML
                                      if (e.currentTarget.parentElement) {
                                        e.currentTarget.parentElement.innerHTML = `<span class="text-[8px] md:text-[10px] font-bold">${flag}</span>`;
                                      }
                                    }}
                                  />
                                </span>
                              );
                            })}
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
                      {isArgentina ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium mb-1 text-white">Pago en pesos argentinos</h3>
                              <p className="text-sm text-white/70">
                                <span className="sm:inline block">Activa tu acceso al instante</span>
                                <span className="sm:inline block"> de forma rápida y segura.</span>
                              </p>
                            </div>
                            <div className="text-white">
                              <Image
                                src="/images/mercadoppp.svg"
                                alt="Mercado Pago"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-3 p-3 bg-[#0f0f1a] rounded-lg border border-[#2a2a4a]">
                            <div className="flex flex-col">
                              <span className="text-sm text-white">Total</span>
                              {/* Etiqueta de ahorro para usuarios de Argentina */}
                              <span className="text-xs text-green-500 font-medium mt-1">
                                Ahorras AR$ {finalDiscountApplied ? "51.750" : (discountApplied ? "48.300" : "46.000")}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-3">
                                {isArgentina ? (
                                  <span className="text-xs line-through text-red-500">AR$ 57.500</span>
                                ) : (
                                  <span className="text-sm line-through text-red-500">$50 USD</span>
                                )}
                                <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-black px-1 py-0.5 rounded ml-1 whitespace-nowrap">
                                  {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                                </span>
                              </div>
                              <div className="font-bold text-white mt-1">
                                {isArgentina ? (
                                  <span className="text-lg">AR$ {finalDiscountApplied ? "5.750" : (discountApplied ? "9.200" : "11.500")}</span>
                                ) : (
                                  <span>$ {finalDiscountApplied ? "5" : (discountApplied ? "8" : "10")} USD</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div id="mp-wallet-container" className="mb-1 mercadopago-container">
                            <div className="animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide">
                              Conectando con Mercado Pago<span className="opacity-80">...</span>
                            </div>
                          </div>

                          {/* Imagen de medios de pago aceptados */}
                          <div className="flex justify-center items-center mx-auto mb-4 max-w-[220px]">
                            <Image
                              src="/images/pagosmer.svg"
                              alt="Medios de pago aceptados"
                              width={200}
                              height={40}
                              className="h-auto w-full opacity-80"
                            />
                          </div>

                          <div className="flex items-center justify-center text-xs text-white/70 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            Pago seguro, protegemos tus datos.
                          </div>
                        </div>
                      ) : (
                        <div className="animate-pulse text-white/70">Cargando formulario de pago...</div>
                      )}
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
                        <p className="text-sm text-white/70">
                          <span className="sm:inline block">Activa tu acceso al instante</span>
                          <span className="sm:inline block"> de forma rápida y segura.</span>
                        </p>
                      </div>
                      <div className="text-white">
                        <PayPalIcon className="h-8 w-8" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 p-3 bg-[#0f0f1a] rounded-lg border border-[#2a2a4a]">
                      <div className="flex flex-col">
                        <span className="text-sm text-white">Total</span>
                        {/* Etiqueta de ahorro siempre en USD para PayPal */}
                        <span className="text-xs text-green-500 font-medium mt-1">
                          Ahorras ${finalDiscountApplied ? "45" : (discountApplied ? "42" : "40")} USD
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-3">
                          <span className="text-sm line-through text-red-500">$50 USD</span>
                          <span className="text-xs font-bold bg-green-500 text-black px-1.5 py-0.5 rounded">
                            {finalDiscountApplied ? "90%" : (discountApplied ? "84%" : "80%")} OFF
                          </span>
                        </div>
                        <span className="font-bold text-white mt-1">$ {finalDiscountApplied ? "5" : (discountApplied ? "8" : "10")} USD</span>
                      </div>
                    </div>



                    <div className="mb-6">
                      {/* Mostramos directamente los botones de PayPal */}
                      <PayPalScriptProvider options={paypalOptions}>
                        <PayPalButtons
                          style={{ layout: "vertical", label: "pay", tagline: false, shape: "rect" }}
                          fundingSource="paypal"
                          createOrder={(_, actions) => {
                            if (actions.order) {
                              return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                  {
                                    amount: {
                                      value: price, // Usar el precio dinámico
                                      currency_code: "USD"
                                    },
                                    description: "Acceso a Flasti",
                                  },
                                ],
                              });
                            }
                            return Promise.reject(new Error("No se pudo crear la orden"));
                          }}
                          onApprove={async (_, actions) => {
                            if (actions.order) {
                              const details = await actions.order.capture();
                              console.log("Pago completado. ID de transacción: " + details.id);
                              // Redirigir al usuario a la página de registro segura
                              window.location.href = "https://flasti.com/secure-registration-portal-7f9a2b3c5d8e";
                            }
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

              {selectedPaymentMethod !== "paypal" && selectedPaymentMethod !== "hotmart" && (
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
    <CheckoutFomoWrapper>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
        <CheckoutContent />
      </Suspense>
    </CheckoutFomoWrapper>
  );
};

export default CheckoutPage;
