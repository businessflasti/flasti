"use client";

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [isHotmartPreloaded, setIsHotmartPreloaded] = useState(false);
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

    // Si el formulario se vuelve válido por primera vez, hacer tracking
    if (!wasValid && isPaypalFormValid && paypalFormData.fullName && paypalFormData.email) {
      analyticsService.trackEvent('paypal_form_completed', {
        full_name: paypalFormData.fullName,
        email: paypalFormData.email,
        timestamp: new Date().toISOString()
      });

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
      const leadData = {
        full_name: mercadoPagoFormData.fullName.trim(),
        email: mercadoPagoFormData.email.trim().toLowerCase(),
        payment_method: 'mercadopago',
        amount: parseFloat(price) * 1150, // Convertir USD a ARS aproximadamente
        currency: 'ARS',
        transaction_id: transactionData?.id || null,
        status: transactionData ? 'completed' : 'form_submitted',
        created_at: new Date().toISOString(),
        metadata: {
          discount_applied: discountApplied,
          final_discount_applied: finalDiscountApplied,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
        }
      };

      const { data, error } = await supabase
        .from('checkout_leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error al guardar lead de Mercado Pago en Supabase:', error);
        return { success: false, error };
      }

      console.log('Lead de Mercado Pago guardado exitosamente:', data);

      // Tracking: Lead guardado
      analyticsService.trackEvent('checkout_lead_saved', {
        lead_id: data.id,
        email: leadData.email,
        payment_method: 'mercadopago',
        amount: leadData.amount
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error inesperado al guardar lead de Mercado Pago:', error);
      return { success: false, error };
    }
  };

  // Efecto para validar el formulario de Mercado Pago cuando cambian los datos
  useEffect(() => {
    const wasValid = isMercadoPagoFormValid;
    validateMercadoPagoForm();

    // Si el formulario se vuelve válido por primera vez, hacer tracking
    if (!wasValid && isMercadoPagoFormValid && mercadoPagoFormData.fullName && mercadoPagoFormData.email) {
      analyticsService.trackEvent('mercadopago_form_completed', {
        full_name: mercadoPagoFormData.fullName,
        email: mercadoPagoFormData.email,
        timestamp: new Date().toISOString()
      });

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

      // Obtener el precio actual
      let amountARS = 11500;
      if (finalDiscountApplied) {
        amountARS = 5750;
      } else if (discountApplied) {
        amountARS = 9200;
      }

      // Crear preferencia de pago
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
      window.location.href = "https://flasti.com/secure-registration-portal-7f9a2b3c5d8e";
    }
  };

  // Función para guardar datos en Supabase
  const saveCheckoutLead = async (transactionData?: any) => {
    try {
      const leadData = {
        full_name: paypalFormData.fullName.trim(),
        email: paypalFormData.email.trim().toLowerCase(),
        payment_method: 'paypal',
        amount: parseFloat(price),
        currency: 'USD',
        transaction_id: transactionData?.id || null,
        status: transactionData ? 'completed' : 'form_submitted',
        created_at: new Date().toISOString(),
        metadata: {
          discount_applied: discountApplied,
          final_discount_applied: finalDiscountApplied,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
        }
      };

      const { data, error } = await supabase
        .from('checkout_leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error al guardar lead en Supabase:', error);
        return { success: false, error };
      }

      console.log('Lead guardado exitosamente:', data);

      // Tracking: Lead guardado
      analyticsService.trackEvent('checkout_lead_saved', {
        lead_id: data.id,
        email: leadData.email,
        payment_method: 'paypal',
        amount: leadData.amount
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error inesperado al guardar lead:', error);
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
    checkoutContainer.innerHTML = '<div class="animate-pulse text-white/70">Precargando Hotmart...</div>';
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
          let offerCode = "6j1ga51i"; // Oferta normal (precio completo: $10 USD)

          // Verificar si hay descuentos aplicados desde localStorage
          const finalDiscountApplied = localStorage.getItem('flastiFinalDiscountApplied') === 'true';
          const discountApplied = localStorage.getItem('flastiDiscountApplied') === 'true';

          if (finalDiscountApplied) {
            offerCode = "5h87lps7"; // Oferta con descuento final (precio: $5 USD)
          } else if (discountApplied) {
            offerCode = "yegwjf6i"; // Oferta con descuento inicial (precio: $8 USD)
          }

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
  const setupHotmartScrollExpansion = useCallback((containerId: string) => {
    console.log(`✅ Hotmart ${containerId} configurado para mostrar completo desde el inicio`);
  }, []);

  // Función para configurar observador de altura dinámica
  const setupDynamicHeightObserver = useCallback(() => {
    // Buscar tanto el contenedor principal como el de precarga
    const container = document.getElementById('inline_checkout') ||
                     document.getElementById('inline_checkout_preload') ||
                     document.getElementById('inline_checkout_active');
    if (!container) return;

    console.log('🔍 Configurando observador de altura dinámica para Hotmart...');

    // Observador de mutaciones para detectar cambios en el DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Asegurar que el contenedor no tenga restricciones de altura
          const iframes = container.querySelectorAll('iframe');
          iframes.forEach((iframe) => {
            // Permitir que el iframe se expanda naturalmente
            iframe.style.height = 'auto';
            iframe.style.minHeight = 'auto';
            iframe.style.maxHeight = 'none';
            iframe.style.overflow = 'visible';
          });

          // Asegurar que el contenedor principal no tenga restricciones
          container.style.height = 'auto';
          container.style.minHeight = 'auto';
          container.style.maxHeight = 'none';
          container.style.overflow = 'visible';

          console.log('📏 Altura dinámica ajustada automáticamente');
        }
      });
    });

    // Observar cambios en el contenedor y sus hijos
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Observador de redimensionamiento para detectar cambios de tamaño
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          console.log('📐 Formulario redimensionado:', entry.contentRect.height + 'px');
          // El contenedor se ajustará automáticamente
        });
      });

      // Observar el contenedor principal
      resizeObserver.observe(container);

      // También observar iframes cuando aparezcan
      const checkForIframes = () => {
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          resizeObserver.observe(iframe);
        });
      };

      // Verificar iframes cada segundo durante los primeros 10 segundos
      let checkCount = 0;
      const intervalId = setInterval(() => {
        checkForIframes();
        checkCount++;
        if (checkCount >= 10) {
          clearInterval(intervalId);
        }
      }, 1000);
    }

    console.log('✅ Observador de altura dinámica configurado correctamente');
  }, []);

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
      checkoutContainer.innerHTML = '';
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
          let offerCode = "6j1ga51i"; // Oferta normal (precio completo: $10 USD)

          if (finalDiscountApplied) {
            offerCode = "5h87lps7"; // Oferta con descuento final (precio: $5 USD)
          } else if (discountApplied) {
            offerCode = "yegwjf6i"; // Oferta con descuento inicial (precio: $8 USD)
          }

          const elements = window.checkoutElements.init("inlineCheckout", {
            offer: offerCode,
          });

          elements.mount("#inline_checkout");

          // Configurar observador para altura dinámica
          setTimeout(() => {
            setupDynamicHeightObserver();
          }, 1000);

          // Aplicar estilos para ancho completo - AGRESIVO
          setTimeout(() => {
            const applyFullWidthStyles = () => {
              const hotmartContainer = document.querySelector('#inline_checkout');
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

                console.log('✅ Estilos de ancho completo aplicados a Hotmart normal');
              }
            };

            // Aplicar inmediatamente y luego cada 500ms por 3 segundos
            applyFullWidthStyles();
            const styleInterval = setInterval(applyFullWidthStyles, 500);
            setTimeout(() => clearInterval(styleInterval), 3000);
          }, 1000);

          setIsHotmartLoaded(true);
          setIsHotmartLoading(false);
          setHotmartLoadAttempts(0); // Reiniciar los intentos cuando se carga con éxito

          // Configurar expansión por scroll para el formulario normal
          setTimeout(() => {
            setupHotmartScrollExpansion('inline_checkout');
          }, 1500);

          // Track que Hotmart se cargó exitosamente
          unifiedTrackingService.trackHotmartFormLoaded(offerCode);

          console.log(`Hotmart cargado exitosamente con oferta: ${offerCode}`);
        } catch (error) {
          console.error("Error al inicializar Hotmart:", error);

          // Track error de Hotmart
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
        // Limpiar el contenedor objetivo
        targetContainer.innerHTML = '';

        // CLONAR (no mover) todo el contenido del contenedor oculto al visible
        Array.from(hiddenContainer.children).forEach(child => {
          const clonedChild = child.cloneNode(true);
          // Cambiar el ID del contenedor clonado para evitar duplicados
          if (clonedChild.id === 'inline_checkout_preload') {
            clonedChild.id = 'inline_checkout_active';
          }
          targetContainer.appendChild(clonedChild);
        });

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
    // Tracking: Usuario accede a la página de checkout
    analyticsService.trackEvent('checkout_page_view', {
      page: 'checkout',
      timestamp: new Date().toISOString()
    });
  }, []);

  // Efecto para tracking inicial de la página
  useEffect(() => {
    // Track página de checkout vista con servicio unificado
    unifiedTrackingService.trackPageView('Checkout Page', {
      content_category: 'checkout',
      value: parseFloat(price),
      currency: 'USD'
    });
  }, [price]);

  // Efecto para tracking cuando se completa información de pago
  useEffect(() => {
    if (isMercadoPagoFormValid) {
      unifiedTrackingService.trackAddPaymentInfo({
        content_name: 'Flasti Access',
        content_category: 'platform_access',
        value: parseFloat(price),
        currency: isArgentina ? 'ARS' : 'USD',
        payment_method: 'mercadopago'
      });
    }
  }, [isMercadoPagoFormValid, price, isArgentina]);

  // Efecto para tracking cuando se completa información de pago de PayPal
  useEffect(() => {
    if (isPaypalFormValid) {
      unifiedTrackingService.trackAddPaymentInfo({
        content_name: 'Flasti Access',
        content_category: 'platform_access',
        value: parseFloat(price),
        currency: 'USD',
        payment_method: 'paypal'
      });
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

    // Función para detectar cuando el usuario intenta cerrar la pestaña o navegar hacia atrás
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      showPopup();

      // Mensaje estándar de confirmación (no personalizable en navegadores modernos)
      e.preventDefault();
      // Usar el método moderno para mostrar un diálogo de confirmación
      return '';
    };

    // Función para detectar cuando el usuario presiona el botón de retroceso
    const handlePopState = () => {
      // Prevenir la navegación hacia atrás
      window.history.pushState(null, '', window.location.pathname);

      // Mostrar el popup
      showPopup();
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
        const isVerticalSwipe = Math.abs(diffY) > Math.abs(diffX);

        // SOLO activar el popup si:
        // 1. Es un deslizamiento horizontal (no vertical)
        // 2. El deslizamiento es hacia la derecha (gesto para ir hacia atrás)
        // 3. El deslizamiento horizontal es significativo (>80px)
        // 4. El deslizamiento vertical es mínimo (<30px) para evitar scroll
        // 5. El toque inicia cerca del borde izquierdo de la pantalla (<50px)
        if (
          isHorizontalSwipe &&
          diffX > 80 &&
          Math.abs(diffY) < 30 &&
          touchStartX < 50 &&
          !isVerticalSwipe
        ) {
          showPopup();
          document.removeEventListener('touchmove', handleTouchMove);
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
      // Agregar un estado a la historia para poder detectar cuando el usuario intenta retroceder
      window.history.pushState(null, '', window.location.pathname);

      // Configurar el temporizador para mostrar el popup automáticamente después de 10 minutos
      autoShowTimer = setTimeout(() => {
        showPopup();
      }, 10 * 60 * 1000); // 10 minutos en milisegundos

      // Agregar event listeners
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('touchstart', handleTouchStart, { passive: true });

      // Limpiar event listeners y temporizador al desmontar
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
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
    <>
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
                      // Track inicio de checkout con servicio unificado
                      unifiedTrackingService.trackInitiateCheckout({
                        content_name: 'Flasti Access',
                        content_category: 'platform_access',
                        value: parseFloat(price),
                        currency: isArgentina ? 'ARS' : 'USD',
                        payment_method: isArgentina ? 'mercadopago' : 'hotmart'
                      });

                      // Track específico de Hotmart si no es Argentina
                      if (!isArgentina) {
                        let offerCode = "6j1ga51i";
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
                    <div id="inline_checkout" className="w-full"></div>
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

                          {/* Formulario de datos para Mercado Pago */}
                          <div id="mercadopago-form-block" className="mercadopago-form-container mb-3 space-y-4 p-4 bg-[#0a0a12] rounded-lg border border-[#2a2a4a] transition-all duration-300">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-white">Ingresa tus datos</h3>
                                <p className="text-xs text-white/60">Necesarios para completar tu acceso</p>
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
                                placeholder="Ej: Juan Pérez"
                                value={mercadoPagoFormData.fullName}
                                onChange={(e) => handleMercadoPagoFormChange('fullName', e.target.value)}
                                onBlur={() => handleMercadoPagoFormBlur('fullName')}
                                className={`bg-[#0f0f1a] border-[#2a2a4a] text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                                  mercadoPagoFormTouched.fullName && mercadoPagoFormErrors.fullName ? 'border-red-500 focus:border-red-500' : ''
                                }`}
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
                                placeholder="ejemplo@correo.com"
                                value={mercadoPagoFormData.email}
                                onChange={(e) => handleMercadoPagoFormChange('email', e.target.value)}
                                onBlur={() => handleMercadoPagoFormBlur('email')}
                                className={`bg-[#0f0f1a] border-[#2a2a4a] text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                                  mercadoPagoFormTouched.email && mercadoPagoFormErrors.email ? 'border-red-500 focus:border-red-500' : ''
                                }`}
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
                      // Track inicio de checkout con PayPal usando servicio unificado
                      unifiedTrackingService.trackInitiateCheckout({
                        content_name: 'Flasti Access',
                        content_category: 'platform_access',
                        value: parseFloat(price),
                        currency: 'USD',
                        payment_method: 'paypal'
                      });
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

                    <div className="flex justify-between items-center mb-3 p-3 bg-[#0f0f1a] rounded-lg border border-[#2a2a4a]">
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

                    <div>
                      {/* Formulario de datos para PayPal */}
                      <div id="paypal-form-block" className="paypal-form-container mb-3 space-y-4 p-4 bg-[#0a0a12] rounded-lg border border-[#2a2a4a] transition-all duration-300">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">Ingresa tus datos</h3>
                            <p className="text-xs text-white/60">Necesarios para completar tu acceso</p>
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
                            placeholder="Ej: Juan Pérez"
                            value={paypalFormData.fullName}
                            onChange={(e) => handlePaypalFormChange('fullName', e.target.value)}
                            onBlur={() => handlePaypalFormBlur('fullName')}
                            className={`bg-[#0f0f1a] border-[#2a2a4a] text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                              paypalFormTouched.fullName && paypalFormErrors.fullName ? 'border-red-500 focus:border-red-500' : ''
                            }`}
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
                            placeholder="ejemplo@correo.com"
                            value={paypalFormData.email}
                            onChange={(e) => handlePaypalFormChange('email', e.target.value)}
                            onBlur={() => handlePaypalFormBlur('email')}
                            className={`bg-[#0f0f1a] border-[#2a2a4a] text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-blue-500 transition-colors ${
                              paypalFormTouched.email && paypalFormErrors.email ? 'border-red-500 focus:border-red-500' : ''
                            }`}
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
                          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            <span>Por favor corrige los errores para continuar</span>
                          </div>
                        )}

                        {isPaypalFormValid && (
                          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
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

                                // Track compra completada con servicio unificado
                                unifiedTrackingService.trackPurchase({
                                  transaction_id: details.id || 'paypal_transaction',
                                  value: parseFloat(price),
                                  currency: 'USD',
                                  payment_method: 'paypal',
                                  content_name: 'Acceso a Flasti'
                                });

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

                                    // Tracking: Email enviado exitosamente
                                    analyticsService.trackEvent('welcome_email_sent', {
                                      user_email: paypalFormData.email,
                                      user_name: paypalFormData.fullName,
                                      transaction_id: details.id,
                                      timestamp: new Date().toISOString()
                                    });
                                  } else {
                                    console.error('Error al enviar email de bienvenida:', emailResult.error);

                                    // Tracking: Error en envío de email
                                    analyticsService.trackEvent('welcome_email_failed', {
                                      user_email: paypalFormData.email,
                                      user_name: paypalFormData.fullName,
                                      transaction_id: details.id,
                                      error: emailResult.error,
                                      timestamp: new Date().toISOString()
                                    });
                                  }
                                } catch (emailError) {
                                  console.error('Error inesperado al enviar email:', emailError);

                                  // Tracking: Error inesperado en email
                                  analyticsService.trackEvent('welcome_email_error', {
                                    user_email: paypalFormData.email,
                                    user_name: paypalFormData.fullName,
                                    transaction_id: details.id,
                                    error: emailError instanceof Error ? emailError.message : 'Error desconocido',
                                    timestamp: new Date().toISOString()
                                  });
                                }

                                // Tracking: Compra completada en Yandex Metrica
                                const purchaseAmount = parseFloat(price);
                                analyticsService.trackPurchase(
                                  details.id || 'paypal_transaction',
                                  purchaseAmount,
                                  'USD',
                                  [{
                                    id: 'flasti-access',
                                    name: 'Acceso a Flasti',
                                    category: 'Platform Access',
                                    price: purchaseAmount,
                                    quantity: 1
                                  }]
                                );

                                // Tracking: Evento de conversión
                                analyticsService.trackGoal('purchase_completed', {
                                  order_price: purchaseAmount,
                                  currency: 'USD',
                                  payment_method: 'paypal',
                                  transaction_id: details.id,
                                  customer_name: paypalFormData.fullName,
                                  customer_email: paypalFormData.email
                                });

                                // Redirigir al usuario a la página de registro segura
                                window.location.href = "https://flasti.com/secure-registration-portal-7f9a2b3c5d8e";
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
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border-2 border-dashed border-blue-400/30 backdrop-blur-sm relative overflow-hidden">
                {/* Decoración de fondo sutil */}
                <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-blue-400/5 blur-xl"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-purple-400/5 blur-xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-sm text-blue-400">¿Cómo inicio sesión?</h4>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pl-8">
                    Después de completar el pago, serás llevado automáticamente a la página de registro, donde podrás crear tu cuenta y acceder de inmediato a tu panel personal. También recibirás un correo de bienvenida en tu bandeja de entrada con todos los detalles de tu acceso.
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
