"use client";

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

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExitIntentPopup from "@/components/checkout/ExitIntentPopup";
import { loadMercadoPago } from "./mercadoPago";
import MercadoPagoLogo from "@/components/icons/MercadoPagoLogo";
import Image from "next/image";
import CheckoutFomoWrapper from '@/components/checkout/CheckoutFomoWrapper';
import analyticsService from '@/lib/analytics-service';
import facebookPixelService from '@/lib/facebook-pixel-service';
import unifiedTrackingService from '@/lib/unified-tracking-service';
import FacebookPixelDebug from '@/components/debug/FacebookPixelDebug';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PayPalButtonCheckout from "@/components/checkout/PayPalButton";
import { CountryPriceService } from '@/lib/country-price-service';
import { CheckIcon, Zap, Infinity, AlertTriangle, Sparkles, Shield, HeadphonesIcon, Gift, Wallet, Globe } from "lucide-react";
import Script from "next/script";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import PayPalLogo from "@/components/icons/PayPalLogo";
import PayPalIcon from "@/components/icons/PayPalIcon";
import WorldIcon from "@/components/icons/WorldIcon";

const CheckoutContent = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Constante para el máximo número de intentos
  const MAX_HOTMART_LOAD_ATTEMPTS = 3;

  // Estado para rastrear el estado de carga de Hotmart
  const [isHotmartLoading, setIsHotmartLoading] = useState(false);
  const [isHotmartLoaded, setIsHotmartLoaded] = useState(false);
  const [hotmartLoadAttempts, setHotmartLoadAttempts] = useState(0);

  // Estado para el precio base
  const [price] = useState(5.9); // Precio base en USD (actualizado a $5.90)
  
  // Estados para descuentos (mantenidos por compatibilidad pero siempre en falso)
  const [discountApplied] = useState(false);
  const [finalDiscountApplied] = useState(false);

  // Función para configurar el observador de altura dinámica
  const setupDynamicHeightObserver = useCallback((): void => {
    const hotmartContainer = document.querySelector('#inline_checkout');
    if (!hotmartContainer) return;

    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const iframe = entry.target.querySelector('iframe');
        if (iframe) {
          iframe.style.height = 'auto';
          iframe.style.minHeight = '1500px';
          iframe.style.maxHeight = 'none';
        }
      });
    });

    observer.observe(hotmartContainer);
  }, []);

  // Función para configurar la expansión por scroll
  const setupHotmartScrollExpansion = useCallback((containerId: string): void => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iframe = container.querySelector('iframe');
    if (!iframe) return;

    let currentHeight = 1500; // Altura inicial
    const INCREMENT = 500; // Incremento en píxeles

    const expandOnScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const iframeBottom = iframe.getBoundingClientRect().bottom + window.scrollY;

      if (scrollPosition > iframeBottom - 200) { // 200px antes del final
        currentHeight += INCREMENT;
        iframe.style.minHeight = `${currentHeight}px`;
      }
    };

    window.addEventListener('scroll', expandOnScroll);
  }, []);

  // Función simplificada para reintentar la carga de Hotmart
  const retryHotmartLoad = useCallback(() => {
    if (hotmartLoadAttempts < MAX_HOTMART_LOAD_ATTEMPTS) {
      setHotmartLoadAttempts(prev => prev + 1);
      setIsHotmartLoading(true);
    }
  }, [hotmartLoadAttempts]);

  const loadHotmartScript = useCallback((): HTMLScriptElement | void => {
    if (isHotmartLoading) return; // Evitar cargas múltiples simultáneas

    console.log("Cargando Hotmart con precio base:", { price });

    setIsHotmartLoading(true);

    // Eliminar cualquier script anterior si existe
    const existingScript = document.getElementById('hotmart-script');
    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    // Limpiar el contenedor de checkout sin mostrar mensaje de carga
    const checkoutContainer = document.getElementById('inline_checkout');
    if (checkoutContainer) {
      checkoutContainer.innerHTML = '';
      checkoutContainer.style.backgroundColor = '#1a1a1a';
      checkoutContainer.style.minHeight = '0px';
      checkoutContainer.style.opacity = '0';
      checkoutContainer.style.borderRadius = '12px';
      checkoutContainer.style.overflow = 'hidden';
    }

    // Crear y cargar el nuevo script
    const script = document.createElement("script");
    script.id = 'hotmart-script';
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;

    script.onload = () => {
      if (window.checkoutElements) {
        try {
          // Usar oferta con precio base
          const offerCode = "5h87lps7"; // Oferta normal (precio: $10 USD)

          const elements = window.checkoutElements.init("inlineCheckout", {
            offer: offerCode,
          });

          elements.mount("#inline_checkout");

          // Configurar observador para altura dinámica
          setTimeout(() => {
            setupDynamicHeightObserver();
          }, 1000);

          // Mostrar el formulario suavemente una vez cargado
          setTimeout(() => {
            const checkoutContainer = document.getElementById('inline_checkout');
            if (checkoutContainer) {
              checkoutContainer.style.minHeight = 'auto';
              checkoutContainer.style.opacity = '1';
              checkoutContainer.style.borderRadius = '12px';
              checkoutContainer.style.overflow = 'hidden';
            }
          }, 500);

          setIsHotmartLoaded(true);
          setIsHotmartLoading(false);
          setHotmartLoadAttempts(0);

          // Configurar expansión por scroll para el formulario normal
          setTimeout(() => {
            setupHotmartScrollExpansion('inline_checkout');
          }, 1500);

          unifiedTrackingService.trackHotmartFormLoaded(offerCode);

        } catch (error) {
          console.error("Error al inicializar Hotmart:", error);
          unifiedTrackingService.trackHotmartError(
            'initialization_error',
            error instanceof Error ? error.message : 'Unknown error'
          );
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
  }, [isHotmartLoading, price, setupDynamicHeightObserver, setupHotmartScrollExpansion]);

  const [clientCountryCode, setClientCountryCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = localStorage.getItem('flastiUserCountry');
      if (code && code.length === 2) {
        setClientCountryCode(code);
      } else {
        setClientCountryCode(null);
      }
    }
  }, []);

  // Detectar país y obtener precio
  useEffect(() => {
    const detectCountryAndPrice = async () => {
      try {
        let countryCode = 
          localStorage.getItem('flastiUserCountry') ||
          localStorage.getItem('userCountry') ||
          null;

        if (!countryCode) {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          countryCode = data.country_code;
          
          if (countryCode) {
            localStorage.setItem('flastiUserCountry', countryCode);
            localStorage.setItem('userCountry', countryCode);
          }
        }

        setIsArgentina(countryCode === 'AR');

        if (countryCode) {
          const countryPriceData = await CountryPriceService.getCountryPrice(countryCode);
          
          if (countryPriceData) {
            setCountryPrice({
              countryCode: countryPriceData.country_code,
              price: countryPriceData.price,
              currencySymbol: countryPriceData.currency_symbol,
              currencyCode: countryPriceData.currency_code
            });
          }
        }
      } catch (error) {
        console.error('Error al detectar país o obtener precio:', error);
      }
    };

    if (typeof window !== 'undefined') {
      detectCountryAndPrice();
    }
  }, []);
  // Estado para precios por país
  const [countryPrice, setCountryPrice] = useState<{
    countryCode: string;
    price: number;
    currencySymbol: string;
    currencyCode: string;
  }>({
    countryCode: '',
    price: 5.90,
    currencySymbol: '$',
    currencyCode: 'USD'
  });

  // Función para formatear el precio según el país
  const formatPrice = (price: number, countryCode: string) => {
    if (countryCode === 'CO' || countryCode === 'PY') {
      return price.toFixed(3);
    }
    if (price % 1 === 0) {
      return price.toFixed(0);
    }
    return price.toFixed(2);
  };

  // Países que usan USD nativamente (no mostrar conversión)
  const usdNativeCountries = ['US', 'PR', 'EC', 'SV', 'PA'];

  // Inicializar con 'hotmart' para que la sección "Moneda local" esté abierta por defecto
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>("hotmart");
  const [isHotmartPreloaded, setIsHotmartPreloaded] = useState(false);
  const [isArgentina, setIsArgentina] = useState(false);
  const [isCountryKnown, setIsCountryKnown] = useState(false);    // Estados para los popups
    const [showExitPopup, setShowExitPopup] = useState(false);
    // Estados para el contador
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showCountdown, setShowCountdown] = useState(true);
  const totalSeconds = useRef((17 * 60 * 60) + (47 * 60)); // 17 horas y 47 minutos en segundos
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Estados para el formulario de PayPal
  const [paypalFormData, setPaypalFormData] = useState({
    fullName: '',
    email: ''
  });
  const [paypalFormErrors, setPaypalFormErrors] = useState({
    fullName: '',
    email: ''
  });
  const [paypalFormTouched, setPaypalFormTouched] = useState({
    fullName: false,
    email: false
  });
  const [isPaypalFormValid, setIsPaypalFormValid] = useState(false);
  const [isSubmittingPaypalForm, setIsSubmittingPaypalForm] = useState(false);

  // Estados para el formulario de Mercado Pago
  const [mercadoPagoFormData, setMercadoPagoFormData] = useState({
    fullName: '',
    email: ''
  });
  const [mercadoPagoFormErrors, setMercadoPagoFormErrors] = useState({
    fullName: '',
    email: ''
  });
  const [mercadoPagoFormTouched, setMercadoPagoFormTouched] = useState({
    fullName: false,
    email: false
  });
  const [isMercadoPagoFormValid, setIsMercadoPagoFormValid] = useState(false);
  const [isSubmittingMercadoPagoForm, setIsSubmittingMercadoPagoForm] = useState(false);

  // Estado para controlar si Mercado Pago está precargado
  const [isMercadoPagoPreloaded, setIsMercadoPagoPreloaded] = useState(false);

  // Estado para controlar si PayPal está precargado
  const [isPayPalPreloaded, setIsPayPalPreloaded] = useState(false);

  // Referencia para rastrear si el usuario ya ha visto el popup
  const hasSeenPopup = useRef(false);

  useEffect(() => {
    // Recargar el formulario de Hotmart cuando cambie el método de pago o el precio
    if (selectedPaymentMethod === "hotmart" && !isArgentina) {
      loadHotmartScript();
    }
  }, [selectedPaymentMethod, price, isArgentina, loadHotmartScript]);

  // Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar el formulario de PayPal
  const validatePaypalForm = useCallback(() => {
    const errors = { fullName: '', email: '' };
    let isValid = true;

    // Validar nombre completo
    if (!paypalFormData.fullName.trim()) {
      errors.fullName = 'El nombre completo es obligatorio';
      isValid = false;
    } else if (paypalFormData.fullName.trim().length < 2) {
      errors.fullName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validar email
    if (!paypalFormData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!validateEmail(paypalFormData.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido';
      isValid = false;
    }

    setPaypalFormErrors(errors);
    setIsPaypalFormValid(isValid);
    return isValid;
  }, [paypalFormData]);

  // Efecto para validar el formulario cuando cambian los datos
  useEffect(() => {
    const wasValid = isPaypalFormValid;
    validatePaypalForm();

    // Formulario PayPal completado (sin tracking de Yandex)
    if (!wasValid && isPaypalFormValid && paypalFormData.fullName && paypalFormData.email) {

      // Guardar lead en Supabase cuando el formulario se completa
      saveCheckoutLead().then(result => {
        if (result.success) {
          console.log('Lead guardado al completar formulario');
        }
      });
    }
  }, [paypalFormData, validatePaypalForm, isPaypalFormValid]);

  // Función para validar el formulario de Mercado Pago
  const validateMercadoPagoForm = useCallback(() => {
    const errors = { fullName: '', email: '' };
    let isValid = true;

    // Validar nombre completo
    if (!mercadoPagoFormData.fullName.trim()) {
      errors.fullName = 'El nombre completo es obligatorio';
      isValid = false;
    } else if (mercadoPagoFormData.fullName.trim().length < 2) {
      errors.fullName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validar email
    if (!mercadoPagoFormData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!validateEmail(mercadoPagoFormData.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido';
      isValid = false;
    }

    setMercadoPagoFormErrors(errors);
    setIsMercadoPagoFormValid(isValid);
    return isValid;
  }, [mercadoPagoFormData]);

  // Función para guardar datos de Mercado Pago en Supabase
  const saveMercadoPagoCheckoutLead = async (transactionData?: any) => {
    try {
      console.log('🟠 Intentando guardar lead de MercadoPago...');
      console.log('📝 Datos del formulario:', mercadoPagoFormData);
      
      const leadData = {
        name: mercadoPagoFormData.fullName.trim(),
        email: mercadoPagoFormData.email.trim().toLowerCase(),
        payment_method: 'mercadopago',
        amount: parseFloat(price.toString()),
        country: null,
        user_id: user?.id || null,
        status: transactionData ? 'completed' : 'pending'
      };

      console.log('📤 Enviando lead:', leadData);

      const response = await fetch('/api/checkout/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', result);

      if (result.success) {
        console.log('✅ Lead de Mercado Pago guardado exitosamente:', result.lead_id);
        return { success: true, data: result };
      } else {
        console.error('❌ Error al guardar lead de Mercado Pago:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Error inesperado al guardar lead de Mercado Pago:', error);
      return { success: false, error };
    }
  };

  // Efecto para validar el formulario de Mercado Pago cuando cambian los datos
  useEffect(() => {
    const wasValid = isMercadoPagoFormValid;
    validateMercadoPagoForm();

    // Formulario MercadoPago completado (sin tracking de Yandex)
    if (!wasValid && isMercadoPagoFormValid && mercadoPagoFormData.fullName && mercadoPagoFormData.email) {

      // Guardar lead en Supabase cuando el formulario se completa
      saveMercadoPagoCheckoutLead().then(result => {
        if (result.success) {
          console.log('Lead de Mercado Pago guardado al completar formulario');
        }
      });
    }
  }, [mercadoPagoFormData, validateMercadoPagoForm, isMercadoPagoFormValid]);

  // Función para manejar cambios en el formulario
  const handlePaypalFormChange = (field: 'fullName' | 'email', value: string) => {
    setPaypalFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Marcar el campo como tocado cuando el usuario empieza a escribir
    if (value.length > 0 && !paypalFormTouched[field]) {
      setPaypalFormTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  // Función para manejar cuando el usuario sale del campo (onBlur)
  const handlePaypalFormBlur = (field: 'fullName' | 'email') => {
    setPaypalFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Función para manejar cambios en el formulario de Mercado Pago
  const handleMercadoPagoFormChange = (field: 'fullName' | 'email', value: string) => {
    setMercadoPagoFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Marcar el campo como tocado cuando el usuario empieza a escribir
    if (value.length > 0 && !mercadoPagoFormTouched[field]) {
      setMercadoPagoFormTouched(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  // Función para manejar cuando el usuario sale del campo (onBlur) de Mercado Pago
  const handleMercadoPagoFormBlur = (field: 'fullName' | 'email') => {
    setMercadoPagoFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Función para mostrar feedback visual del formulario
  const showFormValidationFeedback = (formType: 'paypal' | 'mercadopago') => {
    const formSelector = formType === 'paypal'
      ? '.paypal-form-container'
      : '.mercadopago-form-container';

    const formElement = document.querySelector(formSelector);
    if (formElement) {
      // Agregar clase de error
      formElement.classList.add('form-validation-error');

      // Remover la clase después de 500ms
      setTimeout(() => {
        formElement.classList.remove('form-validation-error');
      }, 500);
    }
  };

  // Función para manejar el pago con Mercado Pago
  const handleMercadoPagoPayment = async () => {
    // Validar formulario antes de proceder
    if (!isMercadoPagoFormValid) {
      showFormValidationFeedback('mercadopago');
      return;
    }

    try {
      // Deshabilitar el botón y mostrar loading
      setIsSubmittingMercadoPagoForm(true);

  // Precio base en ARS (actualizado a ARS 5900)
  const amountARS = 5900;

      // Crear preferencia de pago
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Acceso completo a Flasti – Microtareas ilimitadas',
          unitPrice: amountARS,
          currency: 'ARS',
          quantity: 1
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago');
      }

      const data = await response.json();

      // Guardar datos del formulario antes de redirigir
      await saveMercadoPagoCheckoutLead();

      // Redirigir a Mercado Pago
      window.location.href = data.init_point;

    } catch (error) {
      console.error('Error al procesar pago:', error);
      setIsSubmittingMercadoPagoForm(false);

      // En caso de error, redirigir a registro
      window.location.href = "https://flasti.com/register";
    }
  };

  // Función para guardar datos en Supabase
  const saveCheckoutLead = async (transactionData?: any) => {
    try {
      console.log('🔵 Intentando guardar lead de PayPal...');
      console.log('📝 Datos del formulario:', paypalFormData);
      
      // Usar los datos del formulario de PayPal
      const leadData = {
        name: paypalFormData.fullName.trim(),
        email: paypalFormData.email.trim().toLowerCase(),
        payment_method: 'paypal',
        amount: parseFloat(price.toString()),
        country: null,
        user_id: user?.id || null,
        status: transactionData ? 'completed' : 'pending'
      };

      console.log('📤 Enviando lead:', leadData);

      const response = await fetch('/api/checkout/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();
      console.log('📥 Respuesta del servidor:', result);

      if (result.success) {
        console.log('✅ Lead de PayPal guardado exitosamente:', result.lead_id);
        return { success: true, data: result };
      } else {
        console.error('❌ Error al guardar lead de PayPal:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Error inesperado al guardar lead de PayPal:', error);
      return { success: false, error };
    }
  };

  // La función loadMercadoPago ahora se importa desde "./mercadoPago"

  // Función para precargar Hotmart en segundo plano
  const preloadHotmartScript = useCallback(() => {
    if (isHotmartPreloaded || isHotmartLoading) return; // Evitar cargas múltiples

    console.log('🚀 Precargando Hotmart en segundo plano...');
    setIsHotmartLoading(true);

    // Crear un contenedor oculto para precargar Hotmart
    let hiddenContainer = document.getElementById('hotmart-hidden-container');
    if (!hiddenContainer) {
      hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'hotmart-hidden-container';
      hiddenContainer.style.position = 'absolute';
      hiddenContainer.style.left = '-9999px';
      hiddenContainer.style.top = '-9999px';
      hiddenContainer.style.visibility = 'hidden';
      hiddenContainer.style.pointerEvents = 'none';
      hiddenContainer.style.width = '100%';
      hiddenContainer.style.maxWidth = '600px';
      hiddenContainer.style.height = '600px';
      document.body.appendChild(hiddenContainer);
    }

    // Crear el contenedor interno para el checkout
    const checkoutContainer = document.createElement('div');
    checkoutContainer.id = 'inline_checkout_preload';
    checkoutContainer.style.width = '100%';
    checkoutContainer.style.maxWidth = '600px';
    checkoutContainer.innerHTML = '';
    hiddenContainer.appendChild(checkoutContainer);

    // Crear y cargar el script de Hotmart
    const script = document.createElement("script");
    script.id = 'hotmart-preload-script';
    script.src = "https://checkout.hotmart.com/lib/hotmart-checkout-elements.js";
    script.async = true;

    script.onload = () => {
      if (window.checkoutElements) {
        try {
          // Usar la oferta por defecto para precarga
          let offerCode = "5h87lps7"; // Oferta normal (precio completo: $10 USD)

          // Verificar si hay descuentos aplicados desde localStorage
          const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
          const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

          // Solo usamos la oferta base

          const elements = window.checkoutElements.init("inlineCheckout", {
            offer: offerCode,
          });

          elements.mount("#inline_checkout_preload");

          // Configurar observador para altura dinámica en precarga
          setTimeout(() => {
            setupDynamicHeightObserver();
          }, 1000);

          // Aplicar estilos para ancho completo - AGRESIVO
          setTimeout(() => {
            const applyFullWidthStyles = () => {
              const hotmartContainer = document.querySelector('#inline_checkout_preload');
              if (hotmartContainer) {
                // Aplicar estilos al contenedor principal
                hotmartContainer.style.width = '100%';
                hotmartContainer.style.maxWidth = '100%';
                hotmartContainer.style.minWidth = '100%';
                hotmartContainer.style.margin = '0';
                hotmartContainer.style.padding = '0';

                // Aplicar estilos a TODOS los elementos internos
                const allElements = hotmartContainer.querySelectorAll('*');
                allElements.forEach(el => {
                  if (el.style) {
                    el.style.width = '100%';
                    el.style.maxWidth = '100%';
                    el.style.minWidth = '100%';
                    el.style.boxSizing = 'border-box';
                  }
                });

                // ALTURA COMPLETA HASTA EL FINAL - SIN CORTAR
                const iframes = hotmartContainer.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                  iframe.style.width = '100%';
                  iframe.style.border = 'none';
                  iframe.style.display = 'block';

                  // ALTURA AUTOMÁTICA COMPLETA - NO CORTAR
                  iframe.style.height = 'auto';
                  iframe.style.minHeight = '1500px'; // ALTURA GENEROSA
                  iframe.style.maxHeight = 'none';

                  // SIN SCROLL INTERNO - VER TODO
                  iframe.style.overflow = 'visible';
                  iframe.style.overflowY = 'visible';
                  iframe.setAttribute('scrolling', 'no');

                  console.log('📏 Iframe COMPLETO HASTA EL FINAL');
                });

                console.log('✅ Estilos de ancho completo aplicados a Hotmart precargado');
              }
            };

            // Aplicar inmediatamente y luego cada 500ms por 3 segundos
            applyFullWidthStyles();
            const styleInterval = setInterval(applyFullWidthStyles, 500);
            setTimeout(() => clearInterval(styleInterval), 3000);
          }, 1000);

          setIsHotmartPreloaded(true);
          setIsHotmartLoading(false);

          // Configurar expansión por scroll para el formulario precargado
          setTimeout(() => {
            setupHotmartScrollExpansion('inline_checkout_preload');
          }, 1500);

          console.log(`✅ Hotmart precargado exitosamente con oferta: ${offerCode}`);
        } catch (error) {
          console.error("Error al precargar Hotmart:", error);
          setIsHotmartLoading(false);
        }
      } else {
        console.error("checkoutElements no está disponible para precarga");
        setIsHotmartLoading(false);
      }
    };

    script.onerror = () => {
      console.error("Error al cargar el script de precarga de Hotmart");
      setIsHotmartLoading(false);
    };

    document.body.appendChild(script);
  }, [isHotmartPreloaded, isHotmartLoading]);

  // Función simplificada - ya no necesitamos expansión porque inicia completo
  // Estas funciones se movieron al inicio del componente
  // Las funciones de manejo de altura dinámica se movieron al inicio del componente


  // Recargar el formulario de Hotmart cuando cambie el método de pago
  useEffect(() => {
    if (selectedPaymentMethod === "hotmart" && !isArgentina) {
      loadHotmartScript();
    }
  }, [selectedPaymentMethod, discountApplied, finalDiscountApplied, price, isArgentina, loadHotmartScript]);

  // Este código fue movido al useCallback de loadHotmartScript arriba

  // Este código fue eliminado para evitar referencias circulares

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
      // Precio base en ARS
  const amountARS = 5900; // ARS 5.900 precio base

      // Obtener el preferenceId desde nuestro endpoint
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Acceso completo a Flasti – Microtareas ilimitadas',
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

  // Efecto para precargar Hotmart automáticamente
  useEffect(() => {
    if (typeof window !== 'undefined' && !isArgentina) {
      console.log('🚀 Precargando Hotmart para usuarios no argentinos...');

      // Esperar un poco para que la página se cargue completamente
      setTimeout(() => {
        preloadHotmartScript();
      }, 2000);
    }
  }, [isArgentina, preloadHotmartScript]);

  // Efecto para precargar COMPLETAMENTE Mercado Pago cuando detectamos usuario argentino
  useEffect(() => {
    if (isArgentina && typeof window !== 'undefined') {
      console.log('🚀 Precargando COMPLETAMENTE Mercado Pago para usuario argentino...');

      setTimeout(() => {
        // Crear un contenedor oculto para precargar el botón completo
        let hiddenContainer = document.getElementById('mp-hidden-container');
        if (!hiddenContainer) {
          hiddenContainer = document.createElement('div');
          hiddenContainer.id = 'mp-hidden-container';
          hiddenContainer.style.position = 'absolute';
          hiddenContainer.style.left = '-9999px';
          hiddenContainer.style.top = '-9999px';
          hiddenContainer.style.visibility = 'hidden';
          hiddenContainer.style.pointerEvents = 'none';
          document.body.appendChild(hiddenContainer);
        }

        // Cargar el botón COMPLETO en el contenedor oculto
        loadMercadoPago(null, null, 'mp-hidden-container');

        // Marcar como precargado después de un tiempo
        setTimeout(() => {
          setIsMercadoPagoPreloaded(true);
          console.log('✅ Botón de Mercado Pago COMPLETAMENTE precargado');
        }, 3000);

      }, 1500);
    }
  }, [isArgentina, loadMercadoPago]);



  // Efecto para mostrar/ocultar el botón precargado cuando se selecciona la sección
  useEffect(() => {
    const targetContainer = document.getElementById('mp-wallet-container');

    if (selectedPaymentMethod === "hotmart" && isArgentina) {
      if (!targetContainer) {
        console.error('❌ Contenedor mp-wallet-container no encontrado en el DOM cuando se esperaba.');
        return;
      }

      // 1. Limpiar el contenedor visible.
      targetContainer.innerHTML = '';
      console.log('🧼 Contenedor mp-wallet-container limpiado.');

      // 2. Mostrar el loader minimalista.
      const minimalistLoader = document.createElement('div');
      minimalistLoader.className = 'animate-pulse text-white/60 text-center py-3 text-xs font-light tracking-wide';
      minimalistLoader.textContent = 'Conectando con MercadoPago...';
      targetContainer.appendChild(minimalistLoader);
      console.log('⏳ Loader minimalista mostrado en mp-wallet-container.');

      // 3. Llamar a loadMercadoPago para que genere el botón funcional en el contenedor visible.
      // Esta función se encargará de su propio loader y de reemplazar el contenido.
      console.log('🚀 Llamando a loadMercadoPago para generar el botón en mp-wallet-container...');
      loadMercadoPago(null, null, 'mp-wallet-container');
    }
    // Cuando selectedPaymentMethod !== "hotmart" (y esArgentina es true),
    // el div mp-wallet-container es eliminado del DOM por la lógica del JSX,
    // por lo que no es necesario limpiarlo explícitamente aquí.
  }, [selectedPaymentMethod, isArgentina, loadMercadoPago]);

  // Efecto para mostrar/ocultar PayPal precargado cuando se selecciona la sección
  useEffect(() => {
    if (selectedPaymentMethod === "paypal") {
      console.log('📦 Mostrando PayPal precargado...');

      const preloadedContainer = document.getElementById('paypal-preloaded-container');
      const targetContainer = document.querySelector('.paypal-buttons-container');

      if (preloadedContainer && targetContainer) {
        // Limpiar el contenedor objetivo
        targetContainer.innerHTML = '';

        // Hacer visible el contenedor precargado moviéndolo a posición visible
        preloadedContainer.style.position = 'static';
        preloadedContainer.style.left = 'auto';
        preloadedContainer.style.top = 'auto';
        preloadedContainer.style.visibility = 'visible';
        preloadedContainer.style.pointerEvents = 'auto';

        // Mover el contenedor completo al lugar visible
        targetContainer.appendChild(preloadedContainer);

        console.log('✅ PayPal visible INMEDIATAMENTE');
      }
    } else if (selectedPaymentMethod !== "paypal") {
      // Cuando se cierra PayPal, moverlo de vuelta y ocultarlo
      console.log('📦 Ocultando PayPal...');

      const preloadedContainer = document.getElementById('paypal-preloaded-container');
      const targetContainer = document.querySelector('.paypal-buttons-container');

      if (preloadedContainer && targetContainer && targetContainer.contains(preloadedContainer)) {
        // Mover de vuelta al body y ocultarlo
        document.body.appendChild(preloadedContainer);

        // Restaurar estilos de ocultación
        preloadedContainer.style.position = 'absolute';
        preloadedContainer.style.left = '-9999px';
        preloadedContainer.style.top = '-9999px';
        preloadedContainer.style.visibility = 'hidden';
        preloadedContainer.style.pointerEvents = 'none';

        console.log('✅ PayPal ocultado y listo para próxima apertura');
      }
    }
  }, [selectedPaymentMethod]);

  // Efecto para mostrar/ocultar PayPal precargado cuando se selecciona la sección
  useEffect(() => {
    if (selectedPaymentMethod === "paypal" && isPayPalPreloaded) {
      console.log('📦 Mostrando PayPal precargado...');

      const hiddenPayPalContainer = document.getElementById('paypal-hidden-container');
      const targetPayPalContainer = document.querySelector('.paypal-buttons-container');

      if (hiddenPayPalContainer && targetPayPalContainer) {
        // El contenedor de PayPal ya está renderizado en el DOM
        // Solo necesitamos asegurarnos de que esté visible
        console.log('✅ PayPal visible INMEDIATAMENTE');
      }
    }
  }, [selectedPaymentMethod, isPayPalPreloaded]);

  // Este efecto ya no es necesario porque precargamos cuando detectamos que es argentino

  // Ya no necesitamos mover contenedores porque cargamos directamente en el contenedor principal

  // Efecto para mostrar/ocultar Hotmart precargado cuando se selecciona la sección
  useEffect(() => {
    if (selectedPaymentMethod === "hotmart" && !isArgentina && isHotmartPreloaded) {
      console.log('📦 Mostrando Hotmart precargado...');

      const hiddenContainer = document.getElementById('hotmart-hidden-container');
      const targetContainer = document.getElementById('inline_checkout');

      if (hiddenContainer && targetContainer && hiddenContainer.children.length > 0) {
        // Limpiar el contenedor objetivo y preparar para transición suave
        targetContainer.innerHTML = '';
        targetContainer.style.minHeight = '0px';
        targetContainer.style.opacity = '0';
        targetContainer.style.borderRadius = '12px';
        targetContainer.style.overflow = 'hidden';

        // CLONAR (no mover) todo el contenido del contenedor oculto al visible
        Array.from(hiddenContainer.children).forEach(child => {
          const clonedChild = child.cloneNode(true);
          // Cambiar el ID del contenedor clonado para evitar duplicados
          if (clonedChild.id === 'inline_checkout_preload') {
            clonedChild.id = 'inline_checkout_active';
          }
          targetContainer.appendChild(clonedChild);
        });

        // Mostrar suavemente después de clonar
        setTimeout(() => {
          targetContainer.style.minHeight = 'auto';
          targetContainer.style.opacity = '1';
        }, 300);

        // Aplicar estilos de ancho completo al formulario clonado
        setTimeout(() => {
          const applyFullWidthToCloned = () => {
            const clonedContainer = document.querySelector('#inline_checkout_active');
            if (clonedContainer) {
              // Aplicar estilos al contenedor clonado
              clonedContainer.style.width = '100%';
              clonedContainer.style.maxWidth = '100%';
              clonedContainer.style.minWidth = '100%';
              clonedContainer.style.margin = '0';
              clonedContainer.style.padding = '0';

              // Aplicar estilos a todos los elementos internos
              const allElements = clonedContainer.querySelectorAll('*');
              allElements.forEach(el => {
                if (el.style) {
                  el.style.width = '100%';
                  el.style.maxWidth = '100%';
                  el.style.minWidth = '100%';
                  el.style.boxSizing = 'border-box';
                }
              });

              // ALTURA COMPLETA HASTA EL FINAL - SIN CORTAR
              const iframes = clonedContainer.querySelectorAll('iframe');
              iframes.forEach(iframe => {
                iframe.style.width = '100%';
                iframe.style.border = 'none';
                iframe.style.display = 'block';

                // ALTURA AUTOMÁTICA COMPLETA - NO CORTAR
                iframe.style.height = 'auto';
                iframe.style.minHeight = '1500px'; // ALTURA GENEROSA
                iframe.style.maxHeight = 'none';

                // SIN SCROLL INTERNO - VER TODO
                iframe.style.overflow = 'visible';
                iframe.style.overflowY = 'visible';
                iframe.setAttribute('scrolling', 'no');

                console.log('📏 Iframe COMPLETO HASTA EL FINAL');
              });

              console.log('✅ Estilos de ancho completo aplicados al formulario clonado');
            }
          };

          // Aplicar inmediatamente y repetir para asegurar
          applyFullWidthToCloned();
          const clonedStyleInterval = setInterval(applyFullWidthToCloned, 500);
          setTimeout(() => clearInterval(clonedStyleInterval), 3000);

          // Configurar expansión por scroll para el formulario clonado
          setTimeout(() => {
            setupHotmartScrollExpansion('inline_checkout_active');
          }, 500);
        }, 100);

        console.log('✅ Hotmart clonado y visible INMEDIATAMENTE');
      } else if (selectedPaymentMethod === "hotmart" && !isArgentina) {
        // Fallback: cargar normalmente si la precarga falló
        console.log('⚠️ Precarga de Hotmart falló, cargando normalmente...');
        loadHotmartScript();
      }
    } else if (selectedPaymentMethod !== "hotmart") {
      // Limpiar el contenedor cuando se cierra la sección
      const targetContainer = document.getElementById('inline_checkout');
      if (targetContainer) {
        targetContainer.innerHTML = '';
      }
    }
  }, [selectedPaymentMethod, isArgentina, isHotmartPreloaded, loadHotmartScript]);

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
          // Si no es de Argentina, recargar Hotmart con el nuevo precio
          console.log('Aplicando descuento y recargando Hotmart...');

          // Limpiar la precarga anterior
          setIsHotmartPreloaded(false);
          const hiddenContainer = document.getElementById('hotmart-hidden-container');
          if (hiddenContainer) {
            hiddenContainer.innerHTML = '';
          }

          // Precargar nuevamente con el descuento
          setTimeout(() => {
            preloadHotmartScript();
          }, 500);

          // Si la sección está abierta, mostrar el formulario actualizado
          if (selectedPaymentMethod === "hotmart") {
            loadHotmartScript();
          }
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
          // Si no es de Argentina, recargar Hotmart con el descuento final
          console.log('Aplicando descuento final y recargando Hotmart...');

          // Limpiar la precarga anterior
          setIsHotmartPreloaded(false);
          const hiddenContainer = document.getElementById('hotmart-hidden-container');
          if (hiddenContainer) {
            hiddenContainer.innerHTML = '';
          }

          // Precargar nuevamente con el descuento final
          setTimeout(() => {
            preloadHotmartScript();
          }, 500);

          // Si la sección está abierta, mostrar el formulario actualizado
          if (selectedPaymentMethod === "hotmart") {
            loadHotmartScript();
          }
        }
      }

      console.log("Descuento final aplicado: $5.00 USD");
      }, 100); // Esperar 100ms antes de recargar
    }
  }, [finalDiscountApplied, selectedPaymentMethod, loadHotmartScript, isArgentina, preloadMercadoPagoPreference, setSelectedPaymentMethod]);

  // Efecto para tracking inicial de la página de checkout
  useEffect(() => {
    // 2. InitiateCheckout - Disparar cuando se visita la página checkout
    unifiedTrackingService.trackInitiateCheckout();
  }, []);



  // Efecto para tracking cuando se completa información de pago de PayPal
  useEffect(() => {
    if (isPaypalFormValid) {
      // Este evento ahora se dispara al seleccionar el método de pago
      /* unifiedTrackingService.trackAddPaymentInfo({
        content_name: 'Flasti Access',
        content_category: 'platform_access',
        value: parseFloat(price),
        currency: 'USD',
        payment_method: 'paypal'
      }); */
    }
  }, [isPaypalFormValid, price]);

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
      } finally {
        setIsCountryKnown(true);
      }
    };

    // Detectar el país solo en el cliente
    if (typeof window !== 'undefined') {
      detectCountry();
    }
  }, []);

  // Nota: seleccionamos 'hotmart' por defecto arriba para mostrar Moneda local al cargar.

  // Se eliminó el efecto de popup y sistema de descuentos

  // Efecto para el contador


  const paypalOptions = {
    "client-id": "Aa2g70kJsc_YkhVb6tRb-rI-Ot46EY1Jlt6fmVQeKmkUcZESdOpCHmjUEq7kg9vExa1hialDQadTH-oQ",
    currency: "USD",
    intent: "capture",
    components: "buttons",
    locale: "es_ES",
    "disable-funding": "credit,card,sofort", // Mantener si es necesario deshabilitar métodos específicos
    clientId: "Aa2g70kJsc_YkhVb6tRb-rI-Ot46EY1Jlt6fmVQeKmkUcZESdOpCHmjUEq7kg9vExa1hialDQadTH-oQ", // Añadido para compatibilidad
  };

  return (
    <>
      <div className="min-h-screen mobile-smooth-scroll pb-16 md:pb-8 pt-16 md:pt-0 relative" style={{ background: "#0A0A0A" }}>
        
      {/* Eliminado Exit Intent Popup */}

      <div className="container-custom py-2 md:py-6 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="w-full">
            <div className="mb-4 lg:mb-8">
              <h1 className="text-2xl font-bold mb-2 text-white">Información de pago</h1>
              <p className="text-white/70 text-sm">Todas las transacciones son seguras y encriptadas</p>
            </div>

            {/* Opciones de pago */}
            <div className="space-y-4">

              {/* Moneda local - Hotmart o Mercado Pago */}
              <Card 
                className={`bg-white/[0.03] backdrop-blur-xl border overflow-hidden rounded-3xl mobile-card transition-opacity duration-300 relative ${selectedPaymentMethod === "hotmart" ? "border-white" : "border-white/10"}`}
                style={{ 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transform: 'translate3d(0, 0, 0)',
                  contain: 'layout style paint'
                }}
              >
                {/* Brillo superior glassmorphism */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                <div
                  className="p-4 cursor-pointer flex items-center justify-between mobile-touch-friendly mobile-touch-feedback"
                  onClick={() => {
                    // Mantener siempre abierto, no permitir cerrar
                    if (selectedPaymentMethod !== "hotmart") {
                      setSelectedPaymentMethod("hotmart");
                      // 3. AddPaymentInfo - Disparar cuando se abre sección Moneda Local
                      unifiedTrackingService.trackAddPaymentInfo(isArgentina ? 'mercadopago' : 'hotmart');

                      // Track específico de Hotmart si no es Argentina
                      if (!isArgentina) {
                        let offerCode = "5h87lps7";
                        if (finalDiscountApplied) {
                          offerCode = "5h87lps7";
                        } else if (discountApplied) {
                          offerCode = "yegwjf6i";
                        }
                        unifiedTrackingService.trackHotmartCheckoutStarted(
                          offerCode,
                          parseFloat(price),
                          'USD'
                        );
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium text-white md:pl-3">
                        {isArgentina ? 'Moneda local' : 'Desbloquea al instante de forma rápida y segura'}
                      </h3>

                      <div className="grid grid-cols-10 md:flex md:flex-nowrap gap-1 mt-3 w-full pr-2 md:pl-3">
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
                          <p className="text-sm text-white/70 mt-3 md:pl-3">
                            Tu transacción es procesada de forma segura en tu divisa local.
                          </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-[#3a3a5a] flex items-center justify-center">
                    {selectedPaymentMethod === "hotmart" && <CheckIcon className="h-4 w-4 text-white" />}
                  </div>
                </div>

                {selectedPaymentMethod === "hotmart" && (
                  <div className="p-6 border-t border-white/10" style={{ background: '#121212' }}>
                    {!isArgentina && (
                      <div className="w-full">
                        <div className="mb-3 p-3 rounded-xl" style={{ background: '#202020' }}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex flex-col">
                              <span className="text-sm text-white font-semibold">Total</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-white flex items-center gap-2">
                                  <span>$ 5.90 USD</span>
                                  {countryPrice.countryCode && 
                                   !usdNativeCountries.includes(countryPrice.countryCode) && 
                                   countryPrice.countryCode !== 'VE' && 
                                   countryPrice.currencyCode !== 'USD' && (
                                    <>
                                      <span className="text-white/40">≈</span>
                                      <span className="text-sm">
                                        {countryPrice.currencySymbol}{formatPrice(countryPrice.price, countryPrice.countryCode)} {countryPrice.currencyCode}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-3xl whitespace-nowrap">
                                  Microtareas ilimitadas
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] text-white/60 text-center md:text-left md:pl-3">
                              El precio se muestra en USD y se cobra automáticamente en su moneda local
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#202020] backdrop-blur-sm">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <h3 className="font-medium text-white">Selecciona tu método de pago</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>

                          <div className="flex items-center justify-center mb-4">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-[#121212]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                              <span className="text-[10px] text-white/60">No es necesario tener cuenta PayPal para abonar con tarjeta</span>
                            </div>
                          </div>

                          <div className="w-full">
                            <PayPalButtonCheckout />
                          </div>
                        </div>
                      </div>
                    )}
                      {isArgentina ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-medium mb-1 text-white">Pago en pesos argentinos</h3>
                              <p className="text-sm text-white/70">
                                <span className="sm:inline block">Desbloquea al instante</span>
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

                          <div className="flex justify-between items-center mb-3 p-3 rounded-lg" style={{ background: '#202020' }}>
                            <div className="flex flex-col">
                              <span className="text-sm text-white">Total</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-white">
                                  {isArgentina ? (
                                    <span className="text-lg">AR$ 5.900</span>
                                  ) : (
                                    <span>$ 5.90 USD</span>
                                  )}
                                </div>
                                <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-3xl whitespace-nowrap">
                                  Microtareas ilimitadas
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Formulario de datos para Mercado Pago */}
                          <div id="mercadopago-form-block" className="mercadopago-form-container mb-3 space-y-4 p-4 rounded-lg transition-all duration-300" style={{ background: '#202020' }}>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-white">Ingresa tus datos</h3>
                                <p className="text-xs text-white/60">Necesarios para desbloquear tu acceso</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mercadopago-fullname" className="text-sm font-medium text-white flex items-center gap-1">
                                Nombre completo
                                <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                id="mercadopago-fullname"
                                type="text"
                                placeholder=""
                                value={mercadoPagoFormData.fullName}
                                onChange={(e) => handleMercadoPagoFormChange('fullName', e.target.value)}
                                onBlur={() => handleMercadoPagoFormBlur('fullName')}
                                className={`border-0 text-white placeholder:text-white/50 focus:ring-0 transition-colors ${
                                  mercadoPagoFormTouched.fullName && mercadoPagoFormErrors.fullName ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                                style={{ background: '#121212' }}
                                disabled={isSubmittingMercadoPagoForm}
                              />
                              {mercadoPagoFormTouched.fullName && mercadoPagoFormErrors.fullName && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {mercadoPagoFormErrors.fullName}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mercadopago-email" className="text-sm font-medium text-white flex items-center gap-1">
                                Correo electrónico
                                <span className="text-red-400">*</span>
                              </Label>
                              <Input
                                id="mercadopago-email"
                                type="email"
                                placeholder=""
                                value={mercadoPagoFormData.email}
                                onChange={(e) => handleMercadoPagoFormChange('email', e.target.value)}
                                onBlur={() => handleMercadoPagoFormBlur('email')}
                                className={`border-0 text-white placeholder:text-white/50 focus:ring-0 transition-colors ${
                                  mercadoPagoFormTouched.email && mercadoPagoFormErrors.email ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                                style={{ background: '#121212' }}
                                disabled={isSubmittingMercadoPagoForm}
                              />
                              {mercadoPagoFormTouched.email && mercadoPagoFormErrors.email && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {mercadoPagoFormErrors.email}
                                </p>
                              )}
                            </div>

                            {!isMercadoPagoFormValid && (mercadoPagoFormTouched.fullName || mercadoPagoFormTouched.email) && (mercadoPagoFormData.fullName || mercadoPagoFormData.email) && (
                              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span>Por favor corrige los errores para continuar</span>
                              </div>
                            )}

                            {isMercadoPagoFormValid && (
                              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>¡Perfecto! Ya puedes proceder con el pago</span>
                              </div>
                            )}
                          </div>

                          {/* Botón de Mercado Pago - Oficial */}
                          <div
                            className="relative mb-1"
                            onClick={(e) => {
                              if (!isMercadoPagoFormValid) {
                                // Prevenir la acción por defecto y la propagación del evento
                                e.preventDefault();
                                e.stopPropagation();

                                // Replicar el efecto de PayPal para Mercado Pago
                                const formBlock = document.querySelector('#mercadopago-form-block');
                                if (formBlock) {
                                  formBlock.classList.remove('border-[#2a2a4a]'); // Asume que esta es la clase de borde normal
                                  formBlock.classList.add('border-red-500', 'border-2');

                                  // Agregar animación de pulse
                                  formBlock.classList.add('animate-pulse');

                                  // Remover el efecto después de 0.5 segundos
                                  setTimeout(() => {
                                    formBlock.classList.remove('border-red-500', 'border-2', 'animate-pulse');
                                    formBlock.classList.add('border-[#2a2a4a]'); // Restaura el borde normal
                                  }, 500);
                                }
                              }
                            }}
                          >
                            <div
                              id="mp-wallet-container"
                              className={`mercadopago-container transition-all duration-300 ${!isMercadoPagoFormValid ? 'pointer-events-none' : ''}`}
                            >
                              {/* El botón oficial de Mercado Pago aparecerá aquí */}
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
                      ) : null}
                    </div>
                )}
              </Card>

              {/* PayPal - OCULTO */}
              <Card 
                className={`hidden bg-white/[0.03] backdrop-blur-xl border overflow-hidden rounded-3xl mobile-card transition-opacity duration-300 relative ${selectedPaymentMethod === "paypal" ? "border-white" : "border-white/10"}`}
                style={{ 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transform: 'translate3d(0, 0, 0)',
                  contain: 'layout style paint'
                }}
              >
                {/* Brillo superior glassmorphism */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                <div
                  className="p-4 cursor-pointer flex items-center justify-between mobile-touch-friendly mobile-touch-feedback"
                  onClick={() => {
                    // Si ya está seleccionado, deseleccionarlo
                    if (selectedPaymentMethod === "paypal") {
                      setSelectedPaymentMethod(null);
                    } else {
                      setSelectedPaymentMethod("paypal");
                      // 3. AddPaymentInfo - Disparar cuando se abre sección PayPal
                      unifiedTrackingService.trackAddPaymentInfo('paypal');
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.03] backdrop-blur-xl flex items-center justify-center border border-white/10">
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
                    {selectedPaymentMethod === "paypal" && <CheckIcon className="h-4 w-4 text-white" />}
                  </div>
                </div>

                {selectedPaymentMethod === "paypal" && (
                  <div className="p-6 border-t border-white/10" style={{ background: '#121212' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium mb-1 text-white">Pago con PayPal</h3>
                        <p className="text-sm text-white/70">
                          <span className="sm:inline block">Desbloquea al instante</span>
                          <span className="sm:inline block"> de forma rápida y segura.</span>
                        </p>
                      </div>
                      <div className="text-white">
                        <PayPalIcon className="h-8 w-8" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3 p-3 rounded-lg" style={{ background: '#202020' }}>
                      <div className="flex flex-col">
                        <span className="text-sm text-white">Total</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">$ 5.90 USD</span>
                          <span className="text-[9px] sm:text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-3xl whitespace-nowrap">
                            Microtareas ilimitadas
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Formulario de datos para PayPal */}
                      <div id="paypal-form-block" className="paypal-form-container mb-3 space-y-4 p-4 rounded-lg transition-all duration-300" style={{ background: '#202020' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">Ingresa tus datos</h3>
                            <p className="text-xs text-white/60">Necesarios para desbloquear tu acceso</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paypal-fullname" className="text-sm font-medium text-white flex items-center gap-1">
                            Nombre completo
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="paypal-fullname"
                            type="text"
                            placeholder=""
                            value={paypalFormData.fullName}
                            onChange={(e) => handlePaypalFormChange('fullName', e.target.value)}
                            onBlur={() => handlePaypalFormBlur('fullName')}
                            className="border-0 text-white placeholder:text-white/50 focus:ring-0 transition-colors"
                            style={{ background: '#121212' }}
                            disabled={isSubmittingPaypalForm}
                          />
                          {paypalFormTouched.fullName && paypalFormErrors.fullName && (
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {paypalFormErrors.fullName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="paypal-email" className="text-sm font-medium text-white flex items-center gap-1">
                            Correo electrónico
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="paypal-email"
                            type="email"
                            placeholder=""
                            value={paypalFormData.email}
                            onChange={(e) => handlePaypalFormChange('email', e.target.value)}
                            onBlur={() => handlePaypalFormBlur('email')}
                            className="border-0 text-white placeholder:text-white/50 focus:ring-0 transition-colors"
                            style={{ background: '#121212' }}
                            disabled={isSubmittingPaypalForm}
                          />
                          {paypalFormTouched.email && paypalFormErrors.email && (
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {paypalFormErrors.email}
                            </p>
                          )}
                        </div>

                        {!isPaypalFormValid && (paypalFormTouched.fullName || paypalFormTouched.email) && (paypalFormData.fullName || paypalFormData.email) && (
                          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-[#2a2a4a]">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>Por favor corrige los errores para continuar</span>
                          </div>
                        )}

                        {isPaypalFormValid && (
                          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-3 rounded-lg border border-[#2a2a4a]">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>¡Perfecto! Ya puedes proceder con el pago</span>
                          </div>
                        )}
                      </div>

                      {/* Botones de PayPal - Simple y limpio */}
                      <div
                        className="relative"
                        onClick={(e) => {
                          if (!isPaypalFormValid) {
                            e.preventDefault();
                            e.stopPropagation();

                            // Marcar el formulario en rojo por 0.5 segundos
                            const formBlock = document.querySelector('#paypal-form-block');
                            if (formBlock) {
                              formBlock.classList.remove('border-[#2a2a4a]');
                              formBlock.classList.add('border-red-500', 'border-2');

                              // Agregar animación de pulse
                              formBlock.classList.add('animate-pulse');

                              // Remover el efecto después de 0.5 segundos
                              setTimeout(() => {
                                formBlock.classList.remove('border-red-500', 'border-2', 'animate-pulse');
                                formBlock.classList.add('border-[#2a2a4a]');
                              }, 500);
                            }

                            return false;
                          }
                        }}
                      >
                        <div className={`paypal-buttons-container transition-all duration-300 ${!isPaypalFormValid ? 'pointer-events-none' : ''}`}>
                          <PayPalScriptProvider options={paypalOptions}>
                            <PayPalButtons
                          style={{ layout: "vertical", label: "pay", tagline: false, shape: "rect" }}
                          fundingSource="paypal"
                          createOrder={(_, actions) => {
                            // Validar formulario antes de crear la orden
                            if (!isPaypalFormValid) {
                              showFormValidationFeedback('paypal');
                              return Promise.reject(new Error("Formulario incompleto"));
                            }

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
                              try {
                                setIsSubmittingPaypalForm(true);

                                const details = await actions.order.capture();
                                console.log("Pago completado. ID de transacción: " + details.id);

                                // Compra completada - El tracking Purchase se hace en payment-confirmation-9d4e7b2a8f1c6e3b

                                // Guardar datos en Supabase
                                const saveResult = await saveCheckoutLead(details);
                                if (saveResult.success) {
                                  console.log('Datos del cliente guardados exitosamente');
                                } else {
                                  console.error('Error al guardar datos del cliente:', saveResult.error);
                                }

                                // Enviar email de bienvenida
                                try {
                                  console.log('Enviando email de bienvenida...');
                                  const emailResponse = await fetch('/api/send-welcome-email', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      email: paypalFormData.email,
                                      fullName: paypalFormData.fullName,
                                      transactionId: details.id
                                    }),
                                  });

                                  const emailResult = await emailResponse.json();

                                  if (emailResult.success) {
                                    console.log('Email de bienvenida enviado exitosamente');

                                    // Email enviado exitosamente (sin tracking de Yandex)
                                  } else {
                                    console.error('Error al enviar email de bienvenida:', emailResult.error);

                                    // Error en envío de email (sin tracking de Yandex)
                                  }
                                } catch (emailError) {
                                  console.error('Error inesperado al enviar email:', emailError);

                                  // Error inesperado en email (sin tracking de Yandex)
                                }

                                // Compra completada (sin tracking de Yandex)

                                // Redirigir al usuario a la página de éxito de pago
                                window.location.href = "/payment-confirmation-9d4e7b2a8f1c6e3b";
                              } catch (error) {
                                console.error('Error en el proceso de pago:', error);
                                setIsSubmittingPaypalForm(false);
                              }
                            }
                          }}
                          />
                          </PayPalScriptProvider>
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-xs text-white/70 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        Pago 100% seguro, protegemos tus datos.
                      </div>
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

              {/* Mensaje sobre el proceso después del pago */}
              <div className="mt-6 p-4 rounded-xl border-2 border-dashed backdrop-blur-sm relative overflow-hidden" style={{ backgroundColor: 'rgba(140, 206, 152, 0.05)', borderColor: '#28A745' }}>
                {/* Decoración de fondo sutil */}
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-[#28A745]/5 blur-xl"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-[#28A745]/5 blur-xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-[#28A745]/20 flex items-center justify-center border border-[#28A745]/30">
                      <svg className="w-3.5 h-3.5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-sm text-white">¿Qué hago después del pago?</h4>
                  </div>
                  <p className="text-sm text-white leading-relaxed pl-8">
                    Después de completar tu pago no tendrás que preocuparte por nada: todas tus microtareas se habilitarán automáticamente, otorgándote acceso inmediato e ilimitado a ellas, que se renuevan diariamente para ofrecerte nuevas oportunidades desde tu panel personal.
                  </p>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>

    {/* Componente de debug para Facebook Pixel - solo visible en desarrollo */}
    {process.env.NODE_ENV === 'development' && (
      <FacebookPixelDebug isVisible={true} />
    )}
    </>
  );  }; // Fin de CheckoutContent

export default function CheckoutPage() {
  return (
    <CheckoutFomoWrapper>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
        <CheckoutContent />
      </Suspense>
    </CheckoutFomoWrapper>
  );
};
