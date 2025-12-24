'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { CountryPriceService } from '@/lib/country-price-service';
import PayPalButtonCheckout from '@/components/checkout/PayPalButton';
import { loadMercadoPago } from '@/app/dashboard/checkout/mercadoPago';

declare global {
  interface Window {
    checkoutElements?: {
      init: (type: string, options: any) => { mount: (selector: string) => void };
    };
    MercadoPago?: any;
  }
}

interface CheckoutSectionProps {
  isVisible: boolean;
  onClose: () => void;
  useBalance: boolean;
  balanceDiscount: number;
  finalPriceUSD: number;
}

export default function CheckoutSection({ 
  isVisible, onClose, useBalance, balanceDiscount, finalPriceUSD 
}: CheckoutSectionProps) {
  const { user } = useAuth();
  const [isArgentina, setIsArgentina] = useState(false);
  const [isCountryDetected, setIsCountryDetected] = useState(false);
  const [paypalKey, setPaypalKey] = useState(0);
  const prevUseBalanceRef = useRef(useBalance);

  const [countryPrice, setCountryPrice] = useState<{
    countryCode: string;
    price: number;
    currencySymbol: string;
    currencyCode: string;
  }>({ countryCode: '', price: 10.00, currencySymbol: '$', currencyCode: 'USD' });

  const usdNativeCountries = ['US', 'PR', 'EC', 'SV', 'VE'];

  const formatPrice = (price: number, countryCode: string) => {
    if (countryCode === 'CO' || countryCode === 'PY') {
      return price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  };

  // Detectar país
  useEffect(() => {
    const detectCountry = async () => {
      try {
        let countryCode = localStorage.getItem('flastiUserCountry') || localStorage.getItem('userCountry') || null;
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
        setIsCountryDetected(true);
      } catch (error) {
        setIsCountryDetected(true);
      }
    };
    if (typeof window !== 'undefined') detectCountry();
  }, []);

  // Cargar botones de pago cuando se detecta el país
  useEffect(() => {
    if (isVisible && isCountryDetected) {
      if (isArgentina) {
        loadMercadoPago(null, null, 'mp-wallet-container-upgrade');
      }
    }
  }, [isVisible, isCountryDetected, isArgentina]);

  // Recargar botones cuando cambia useBalance
  useEffect(() => {
    if (prevUseBalanceRef.current !== useBalance && isVisible && isCountryDetected) {
      if (isArgentina) {
        loadMercadoPago(null, null, 'mp-wallet-container-upgrade');
      } else {
        // Forzar re-render del componente PayPal
        setPaypalKey(prev => prev + 1);
      }
    }
    prevUseBalanceRef.current = useBalance;
  }, [useBalance, isVisible, isCountryDetected, isArgentina]);

  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-500 ease-out overflow-hidden ${isVisible ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}>
      <div className="rounded-3xl p-6 md:p-8" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Información de pago</h3>
          <p className="text-sm text-gray-400">Todas las transacciones son seguras y encriptadas</p>
        </div>

        {/* Bloque Total */}
        <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: '#252525' }}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Total</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <div className="font-bold flex items-center gap-2 text-white">
                  <span>$ {finalPriceUSD.toFixed(2)} USD</span>
                  {countryPrice.countryCode && 
                   !usdNativeCountries.includes(countryPrice.countryCode) && 
                   countryPrice.currencyCode !== 'USD' && (
                    <>
                      <span className="text-gray-400">≈</span>
                      <span className="text-sm text-gray-400">
                        {countryPrice.currencySymbol}{formatPrice(countryPrice.price, countryPrice.countryCode)} {countryPrice.currencyCode}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-600">
            {!usdNativeCountries.includes(countryPrice.countryCode) && countryPrice.currencyCode !== 'USD' && (
              <p className="text-[10px] text-center md:text-left md:pl-3 text-gray-400">
                El precio se muestra en USD y se cobra automáticamente en su divisa local.
              </p>
            )}
          </div>
        </div>

        {/* Contenido */}
        {!isCountryDetected ? (
          <div className="flex items-center justify-center py-8">
            <div 
              className="w-8 h-8 border-2 border-white/10 rounded-full animate-spin"
              style={{ borderTopColor: '#ffffff' }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#252525' }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="font-medium text-white">Selecciona tu método de pago</h3>
              </div>
              {!isArgentina && (
                <div className="flex items-center justify-center mb-4">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-xl" style={{ backgroundColor: '#1a1a1a' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span className="text-[10px] text-gray-400">No es necesario tener cuenta PayPal para abonar con tarjeta</span>
                  </div>
                </div>
              )}
              
              <div className="w-full">
                {isArgentina ? (
                  <>
                    <div id="mp-wallet-container-upgrade"></div>
                    <div className="flex justify-center mt-4">
                      <Image
                        src="/images/pagospay.svg"
                        alt="Métodos de pago"
                        width={200}
                        height={40}
                        className="h-auto w-[180px] opacity-80"
                      />
                    </div>
                    <div className="flex items-center justify-center text-xs mt-4 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Pago 100% seguro, protegemos tus datos.
                    </div>
                  </>
                ) : (
                  <PayPalButtonCheckout key={paypalKey} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}