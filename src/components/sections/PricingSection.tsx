'use client';

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Zap, Shield, TrendingUp, Wallet, Check } from 'lucide-react';
import Image from 'next/image';
import Script from 'next/script';
import { CountryPriceService } from '@/lib/country-price-service';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutSection from './CheckoutSection';

function PricingSection() {
  const { profile } = useAuth();
  const userBalance = profile?.balance || 0;

  const [countryPrice, setCountryPrice] = useState<{
    countryCode: string;
    price: number;
    currencySymbol: string;
    currencyCode: string;
    usdExchangeRate: number;
  }>({
    countryCode: '',
    price: CountryPriceService.BASE_PRICE_USD,
    currencySymbol: '$',
    currencyCode: 'USD',
    usdExchangeRate: 1
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [useBalance, setUseBalance] = useState(false);
  
  // Estados para la animación
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(CountryPriceService.BASE_PRICE_USD);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estado para mostrar el checkout inline
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);
  
  // Estado para precarga de scripts
  const [scriptsPreloaded, setScriptsPreloaded] = useState(false);

  // Precio base en USD
  const basePriceUSD = CountryPriceService.BASE_PRICE_USD;
  
  // Calcular el descuento (máximo el saldo disponible o el precio total)
  const balanceDiscount = useBalance ? Math.min(userBalance, basePriceUSD) : 0;
  
  // Precio final en USD
  const finalPriceUSD = basePriceUSD - balanceDiscount;
  
  // Precio en moneda local
  const localPrice = basePriceUSD * countryPrice.usdExchangeRate;
  const finalLocalPrice = finalPriceUSD * countryPrice.usdExchangeRate;

  const formatPrice = (price: number, countryCode: string) => {
    if (countryCode === 'CO' || countryCode === 'PY') {
      return price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    if (price % 1 === 0) {
      return price.toFixed(0);
    }
    return price.toFixed(2);
  };

  const formatUSD = (price: number) => {
    return price.toFixed(2);
  };

  useEffect(() => {
    const detectCountryAndPrice = async () => {
      try {
        let countryCode = localStorage.getItem('userCountry') || localStorage.getItem('flastiUserCountry') || null;

        if (!countryCode) {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          countryCode = data.country_code;
          if (countryCode) {
            localStorage.setItem('userCountry', countryCode);
          }
        }

        if (countryCode) {
          const countryPriceData = await CountryPriceService.getCountryPrice(countryCode);
          if (countryPriceData) {
            setCountryPrice({
              countryCode: countryPriceData.country_code,
              price: countryPriceData.price,
              currencySymbol: countryPriceData.currency_symbol,
              currencyCode: countryPriceData.currency_code,
              usdExchangeRate: countryPriceData.usd_exchange_rate || 1
            });
          }
          
          // Precargar script de MercadoPago para Argentina
          if (countryCode === 'AR' && !scriptsPreloaded) {
            const mpScript = document.createElement('script');
            mpScript.src = 'https://sdk.mercadopago.com/js/v2';
            mpScript.async = true;
            mpScript.id = 'mercadopago-preload';
            if (!document.getElementById('mercadopago-preload')) {
              document.head.appendChild(mpScript);
            }
            setScriptsPreloaded(true);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    };

    if (typeof window !== 'undefined') {
      detectCountryAndPrice();
    }
  }, [scriptsPreloaded]);

  // Animación de cuenta regresiva cuando se activa el balance
  const animateCountdown = useCallback((start: number, end: number, duration: number = 800) => {
    const startTime = Date.now();
    const difference = start - end;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function para que sea más dramático al final
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = start - (difference * easeOutQuart);
      setDisplayPrice(currentValue);
      
      if (progress < 1) {
        animationRef.current = setTimeout(animate, 16);
      } else {
        setDisplayPrice(end);
        setIsAnimating(false);
      }
    };
    
    animate();
  }, []);

  // Animación cuando cambia el precio
  const handleBalanceToggle = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    const newUseBalance = !useBalance;
    setUseBalance(newUseBalance);
    
    // Actualizar localStorage inmediatamente
    if (newUseBalance) {
      const discount = Math.min(userBalance, basePriceUSD);
      localStorage.setItem('useBalanceForPayment', 'true');
      localStorage.setItem('balanceDiscountAmount', discount.toString());
      // Activando: mostrar breakdown y animar precio hacia abajo
      setIsAnimating(true);
      setShowBreakdown(true);
      animateCountdown(basePriceUSD, basePriceUSD - discount, 1000);
    } else {
      localStorage.removeItem('useBalanceForPayment');
      localStorage.removeItem('balanceDiscountAmount');
      // Desactivando: ocultar breakdown y restaurar precio
      setIsAnimating(true);
      setShowBreakdown(false);
      animateCountdown(basePriceUSD - Math.min(userBalance, basePriceUSD), basePriceUSD, 400);
    }
  }, [useBalance, basePriceUSD, userBalance, animateCountdown]);

  // Manejar clic en el botón de desbloquear
  const handleUnlockClick = useCallback(() => {
    // Guardar en localStorage si el usuario quiere usar su saldo
    if (useBalance) {
      localStorage.setItem('useBalanceForPayment', 'true');
      localStorage.setItem('balanceDiscountAmount', balanceDiscount.toString());
    } else {
      localStorage.removeItem('useBalanceForPayment');
      localStorage.removeItem('balanceDiscountAmount');
    }
    
    // Mostrar el checkout inline
    setShowCheckout(true);
    
    // Scroll suave hacia el checkout
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [useBalance, balanceDiscount]);

  // Cerrar checkout
  const handleCloseCheckout = useCallback(() => {
    setShowCheckout(false);
  }, []);

  // Determinar si mostrar moneda local (solo si no es USD)
  const showLocalCurrency = countryPrice.currencyCode !== 'USD' && countryPrice.usdExchangeRate > 1;
  
  // Países que usan USD como moneda nativa
  const usdNativeCountries = ['US', 'PR', 'EC', 'SV', 'VE'];
  const isUsdNativeCountry = usdNativeCountries.includes(countryPrice.countryCode);
  
  // Precio local animado
  const displayLocalPrice = displayPrice * countryPrice.usdExchangeRate;

  return (
    <div className="relative w-full py-20 md:py-28 px-4 overflow-hidden" style={{ backgroundColor: '#181818' }}>
      {/* Precarga de PayPal SDK para resto del mundo */}
      {countryPrice.countryCode && countryPrice.countryCode !== 'AR' && (
        <Script
          src="https://www.paypal.com/sdk/js?client-id=Aa2g70kJsc_YkhVb6tRb-rI-Ot46EY1Jlt6fmVQeKmkUcZESdOpCHmjUEq7kg9vExa1hialDQadTH-oQ&currency=USD&disable-funding=paylater,venmo"
          strategy="lazyOnload"
        />
      )}
      
      {/* Efecto de glow/resplandor de fondo */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0D50A4 0%, transparent 70%)' }}
      />
      
      <div className="relative max-w-xl md:max-w-3xl mx-auto z-10">
        
        {/* Título Principal */}
        <h2 className="text-center font-bold leading-[1.1] mb-16 md:mb-20">
          <span className="block text-[2.5rem] sm:text-5xl md:text-5xl text-white">
            Comienza a generar
          </span>
          <span className="inline-block text-[2.5rem] sm:text-5xl md:text-5xl mt-2 text-white">
            sin límites ahora
          </span>
        </h2>
        
        {/* Tarjeta de pricing */}
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
          <div className="p-8 md:p-12 lg:p-14">
            
            {/* Logo y título */}
            <div className="flex items-center mb-6">
              <div className="relative w-14 h-14 rounded-xl flex items-center justify-center mr-4">
                <Image 
                  src="/images/flasti.png" 
                  alt="Flasti" 
                  width={56} 
                  height={56}
                  className="rounded-xl drop-shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-lg text-white">Activa tu cuenta profesional</h3>
                <p className="text-xs text-gray-400">Acceso de por vida | Sin límite de tiempo</p>
              </div>
            </div>

            {/* Precio con animación */}
            <div 
              className="mb-6 p-6 rounded-3xl transition-all duration-500 ease-out"
              style={{ backgroundColor: '#252525' }}
            >
              {/* Precio principal con efecto de rotación */}
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative overflow-hidden h-[44px] sm:h-[52px]">
                    <span 
                      className={`text-3xl sm:text-4xl font-bold text-white inline-block transition-all duration-300 ${
                        isAnimating ? 'animate-pulse' : ''
                      }`}
                      style={{
                        transform: isAnimating ? 'translateY(-2px)' : 'translateY(0)',
                      }}
                    >
                      {!isInitialized ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        `$${formatUSD(displayPrice)} USD`
                      )}
                    </span>
                  </div>
                  {showLocalCurrency && isInitialized && (
                    <span className="text-sm text-gray-400 transition-all duration-300">
                      ≈ {countryPrice.currencySymbol}{formatPrice(displayLocalPrice, countryPrice.countryCode)} {countryPrice.currencyCode}
                    </span>
                  )}
                </div>
              </div>

              {/* Desglose que se expande */}
              <div 
                className={`grid transition-all duration-500 ease-out ${
                  showBreakdown ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div 
                    className={`space-y-2 pt-4 border-t border-gray-600 transition-all duration-300 ${
                      showBreakdown ? 'translate-y-0' : '-translate-y-4'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Subtotal:</span>
                      <span className="text-base text-white/70 font-medium">${formatUSD(basePriceUSD)} USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Saldo aplicado:</span>
                      <span 
                        className="text-base font-semibold transition-all duration-500"
                        style={{ color: '#22C55E' }}
                      >
                        -${formatUSD(balanceDiscount)} USD
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-white font-semibold">Total:</span>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl text-white font-bold">
                          ${formatUSD(finalPriceUSD)} USD
                        </span>
                        {showLocalCurrency && (
                          <p className="text-xs text-gray-400">
                            ≈ {countryPrice.currencySymbol}{formatPrice(finalLocalPrice, countryPrice.countryCode)} {countryPrice.currencyCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              {!showBreakdown && (
                <p className="text-xs sm:text-sm mt-3 text-gray-400 transition-opacity duration-300">
                  Pago único - Sin suscripciones ni cargos recurrentes
                </p>
              )}
            </div>

            {/* Checkbox para usar saldo */}
            {userBalance > 0 && (
              <div className="mb-6">
                <button
                  onClick={handleBalanceToggle}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                    !useBalance ? 'animate-subtle-pulse' : ''
                  }`}
                  style={{ 
                    backgroundColor: useBalance ? 'rgba(13, 80, 164, 0.15)' : '#252525'
                  }}
                >
                  <div 
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ${
                      useBalance ? 'bg-[#0D50A4] scale-110' : 'bg-gray-600'
                    }`}
                  >
                    <Check 
                      className={`w-4 h-4 text-white transition-all duration-300 ${
                        useBalance ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`} 
                    />
                  </div>
                  <span className="text-sm text-white">
                    Usar mi saldo disponible <span className="font-bold text-green-400">${formatUSD(userBalance)}</span><span className="text-xs ml-1 text-green-400/60">USD</span>
                  </span>
                </button>
                
                <style jsx>{`
                  @keyframes subtlePulse {
                    0%, 100% {
                      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
                    }
                    50% {
                      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
                    }
                  }
                  .animate-subtle-pulse {
                    animation: subtlePulse 2.5s ease-in-out infinite;
                  }
                `}</style>
              </div>
            )}

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2A2A2A' }}>
                  <TrendingUp className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Microtareas ilimitadas</h4>
                  <p className="text-xs text-gray-400">Activa las tareas con mayor compensación.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2A2A2A' }}>
                  <Zap className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Acceso inmediato</h4>
                  <p className="text-xs text-gray-400">Continúa generando ingresos sin demoras.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2A2A2A' }}>
                  <Wallet className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Retiros prioritarios</h4>
                  <p className="text-xs text-gray-400">Recibe tus fondos en menos de 24 horas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2A2A2A' }}>
                  <Shield className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Garantía de 7 días</h4>
                  <p className="text-xs text-gray-400">Devolución total, sin preguntas ni condiciones.</p>
                </div>
              </div>
            </div>

            {/* Botón CTA */}
            <button 
              onClick={handleUnlockClick}
              disabled={showCheckout}
              className={`w-full py-5 md:py-6 text-xl md:text-2xl font-black text-white flex items-center justify-center gap-3 md:gap-4 rounded-2xl transition-all duration-300 ${
                showCheckout 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500'
              }`}
            >
              {showCheckout ? (
                <svg className="w-4 h-4 md:w-5 md:h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              ) : (
                <Zap className="w-6 h-6 md:w-8 md:h-8" />
              )}
              {showCheckout ? 'COMPLETA TU PAGO ABAJO' : 'ACTIVAR ACCESO AHORA'}
            </button>
            
            {/* Texto debajo del CTA - Solo para países que no usan USD nativo y cuando no está abierto el checkout */}
            {!isUsdNativeCountry && !showCheckout && (
              <p className="text-center text-xs text-gray-500 mt-4">
                El precio se muestra en USD y se cobra automáticamente en su divisa local
              </p>
            )}

          </div>
        </div>
        
        {/* Checkout Section Inline */}
        <div ref={checkoutRef}>
          <CheckoutSection 
            isVisible={showCheckout}
            onClose={handleCloseCheckout}
            useBalance={useBalance}
            balanceDiscount={balanceDiscount}
            finalPriceUSD={finalPriceUSD}
          />
        </div>
        
        {/* Bloque informativo - Qué hago después del pago */}
        <div 
          className="mt-8 p-5 rounded-2xl border-2 border-dashed backdrop-blur-sm relative overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(76, 168, 70, 0.08)', 
            borderColor: '#4CA846' 
          }}
        >
          {/* Decoración de fondo sutil */}
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(76, 168, 70, 0.15)' }}></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(76, 168, 70, 0.1)' }}></div>
          
          <div className="relative z-10 flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#4CA846' }}
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-base sm:text-lg text-white block mb-2">
                ¿Qué hago después del pago?
              </span>
              <p className="text-base leading-relaxed text-gray-400">
                La activación es automática. Tras el pago, entrarás directamente a tu panel profesional donde encontrarás todas las tareas de nivel superior desbloqueadas de forma ilimitada que se renuevan diariamente, garantizando que siempre tengas trabajo disponible para generar ingresos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PricingSection);
