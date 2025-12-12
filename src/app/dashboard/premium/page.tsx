'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Shield, HeadphonesIcon, Infinity, Gift, Wallet, ChevronDown, ChevronUp, UserRound, DollarSign, MapPin, Key, Star, Info, Lock, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from 'next/navigation';
import { CountryPriceService } from '@/lib/country-price-service';
import CountryFlag from '@/components/ui/CountryFlag';
import ModernTestimonialsSection from '@/components/sections/ModernTestimonialsSection';
import WeeklyTopRanking from '@/components/dashboard/WeeklyTopRanking';

const PremiumPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0);
  const [countryPrice, setCountryPrice] = useState<{
    countryCode: string;
    price: number;
    currencySymbol: string;
    currencyCode: string;
  }>({
    countryCode: '',
    price: 3.90,
    currencySymbol: '$',
    currencyCode: 'USD'
  });
  const [isArgentina, setIsArgentina] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [countryName, setCountryName] = useState('');

  // Mapeo de códigos de país a nombres completos
  const countryNames: { [key: string]: string } = {
    'AR': 'Argentina',
    'US': 'Estados Unidos',
    'MX': 'México',
    'CO': 'Colombia',
    'CL': 'Chile',
    'PE': 'Perú',
    'EC': 'Ecuador',
    'VE': 'Venezuela',
    'BO': 'Bolivia',
    'PY': 'Paraguay',
    'UY': 'Uruguay',
    'BR': 'Brasil',
    'ES': 'España',
    'GT': 'Guatemala',
    'HN': 'Honduras',
    'SV': 'El Salvador',
    'NI': 'Nicaragua',
    'CR': 'Costa Rica',
    'PA': 'Panamá',
    'DO': 'República Dominicana',
    'CU': 'Cuba',
    'PR': 'Puerto Rico'
  };

  // Función para formatear el precio según el país
  const formatPrice = (price: number, countryCode: string) => {
    // Solo Colombia y Paraguay usan 3 decimales
    if (countryCode === 'CO' || countryCode === 'PY') {
      return price.toFixed(3);
    }
    // Otros países: mostrar sin decimales si es número entero, sino 2 decimales
    if (price % 1 === 0) {
      return price.toFixed(0);
    }
    return price.toFixed(2);
  };
  
  // Función para detectar país y obtener precio
  const detectCountryAndPrice = async () => {
      try {
        // Intentar obtener el país desde múltiples fuentes (prioridad)
        let countryCode = 
          localStorage.getItem('flastiUserCountry') ||  // Premium específico
          localStorage.getItem('userCountry') ||        // Dashboard general
          null;

        console.log('🌍 Premium: País desde localStorage:', countryCode);

        // Si no hay país guardado, detectar mediante API
        if (!countryCode) {
          console.log('🌍 Premium: Detectando país via API...');
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          countryCode = data.country_code;
          
          if (countryCode) {
            // Guardar en ambas claves para sincronización
            localStorage.setItem('flastiUserCountry', countryCode);
            localStorage.setItem('userCountry', countryCode);
            console.log('🌍 Premium: País detectado y guardado:', countryCode);
          }
        } else {
          // Sincronizar ambas claves si solo existe una
          if (!localStorage.getItem('flastiUserCountry')) {
            localStorage.setItem('flastiUserCountry', countryCode);
          }
          if (!localStorage.getItem('userCountry')) {
            localStorage.setItem('userCountry', countryCode);
          }
        }

        // Establecer si el usuario es de Argentina
        setIsArgentina(countryCode === 'AR');

        if (countryCode) {
          console.log('🌍 Premium: Obteniendo precio para:', countryCode);
          
          // Establecer nombre del país
          setCountryName(countryNames[countryCode] || countryCode);
          
          // Obtener precio específico para el país
          const countryPriceData = await CountryPriceService.getCountryPrice(countryCode);
          
          if (countryPriceData) {
            console.log('💰 Premium: Precio obtenido:', countryPriceData);
            setCountryPrice({
              countryCode: countryPriceData.country_code,
              price: countryPriceData.price,
              currencySymbol: countryPriceData.currency_symbol,
              currencyCode: countryPriceData.currency_code
            });
          } else {
            console.log('⚠️ Premium: No se encontró precio para:', countryCode);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Premium: Error al detectar país o obtener precio:', error);
        // Mantener valores por defecto en USD
        setIsInitialized(true);
      }
    };

  // Detectar país y obtener precio correspondiente
  useEffect(() => {

    if (typeof window !== 'undefined') {
      detectCountryAndPrice();
    }

    // Escuchar cambios en localStorage para sincronización entre páginas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userCountry' || e.key === 'flastiUserCountry') {
        console.log('🔄 Premium: Cambio detectado en localStorage:', e.key, '→', e.newValue);
        if (e.newValue && e.newValue !== 'null') {
          detectCountryAndPrice();
        }
      }
    };

    // Listener para cambios en localStorage desde otras pestañas/páginas
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Efecto adicional para re-detectar cuando la página se vuelve visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Premium: Página visible, re-verificando país...');
        // Pequeño delay para asegurar que localStorage esté actualizado
        setTimeout(() => {
          const currentCountry = localStorage.getItem('userCountry') || localStorage.getItem('flastiUserCountry');
          if (currentCountry && currentCountry !== countryPrice.countryCode) {
            console.log('🔄 Premium: País cambió, actualizando precio...');
            detectCountryAndPrice();
          }
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [countryPrice.countryCode]);

  // Actualizar hora local cada segundo
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formatear hora
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // Formatear fecha
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      
      setCurrentDate(`${dayName} ${day} ${monthName}`);
    };

    // Actualizar inmediatamente
    updateDateTime();

    // Actualizar cada minuto
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Función para navegar al checkout
  const handleCheckoutNavigation = () => {
    window.location.href = '/dashboard/checkout';
  };

  // Función para volver al dashboard - URL completa para evitar caché
  const handleGoBack = () => {
    window.location.href = 'https://flasti.com/dashboard';
  };

  return (
    <div className="min-h-screen pt-16 md:pt-8 pb-16 md:pb-8 px-4 relative overflow-hidden" style={{ backgroundColor: '#F6F3F3' }}>
      
      {/* Layout responsive: Desktop 2 columnas, Móvil 1 columna */}
      <div className="max-w-7xl mx-auto relative z-10" style={{ contain: 'layout style' }}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          
          {/* Columna izquierda: Imagen/FAQ (Desktop) - Abajo (Móvil) */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            {/* Bloque de imagen del dashboard - Solo visible en desktop */}
            <div className="hidden lg:block mb-4">
              <div className="rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                {/* Badge de ubicación y punto verde - Solo móvil - Arriba de la imagen */}
                <div className="md:hidden flex justify-between items-center mb-3">
                  {countryPrice.countryCode && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md whitespace-nowrap" style={{ backgroundColor: '#F3F3F3' }}>
                      <CountryFlag countryCode={countryPrice.countryCode} size="sm" />
                      <span className="font-semibold text-[10px]" style={{ color: '#111827' }}>
                        {countryPrice.countryCode}
                      </span>
                      <span className="text-[10px]" style={{ color: '#9CA3AF' }}>•</span>
                      <span className="text-[10px]" style={{ color: '#6B7280' }}>
                        {currentDate || 'Cargando...'}
                      </span>
                    </div>
                  )}
                  {/* Punto verde decorativo */}
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
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
                  <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                    ¡Felicitaciones! Ya ha completado 2 microtareas.
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Su panel tiene más microtareas disponibles para usted el dia de hoy. Complete la activación para continuar generando ingresos de forma ilimitada.
                  </p>
                </div>
                
              </div>
            </div>

            {/* FAQ Section fuera de la tarjeta principal */}
            <div className="space-y-4 mb-6 lg:mb-4">
              {/* FAQ 1 - Pago único (ahora primera) */}
              <div className="overflow-hidden relative rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 0 ? null : 0)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#0D50A4' }}>
                      <Info className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium leading-relaxed flex items-center" style={{ color: '#111827' }}>¿A qué se destina el pago único?</span>
                  </div>
                  <div style={{ color: '#111827' }}>
                    {activeQuestion === 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-sm transition-all duration-300 ${activeQuestion === 0 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t pl-11" style={{ borderColor: '#E5E7EB' }}>
                    <span style={{ color: '#6B7280' }}>El registro a la plataforma es gratuito. No obstante, se solicita un pago único para desbloquear <strong style={{ color: '#111827', fontWeight: 700 }}>todas las microtareas de forma ilimitada</strong>. Esta activación nos permite cubrir los costos operativos y de verificación necesarios para mantener un entorno seguro, estable y exclusivo para nuestros usuarios. Este pago es definitivo y otorga acceso de por vida a todas las microtareas.</span>
                  </div>
                </div>
              </div>

              {/* FAQ 2 - Cuánto dinero (ahora segunda) */}
              <div className="overflow-hidden relative rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 1 ? null : 1)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: '#0D50A4' }}>
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium leading-relaxed flex items-center mt-1" style={{ color: '#111827' }}>¿Cuánto dinero puedo ganar?</span>
                  </div>
                  <div style={{ color: '#111827' }}>
                    {activeQuestion === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-sm transition-all duration-300 ${activeQuestion === 1 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t pl-11" style={{ borderColor: '#E5E7EB' }}>
                    <span style={{ color: '#6B7280' }}>
                      Nuestra plataforma compensa las microtareas completadas con pagos que oscilan <strong style={{ color: '#111827', fontWeight: 700 }}>entre $0.50 USD y $10 USD</strong>. Usted tiene la flexibilidad de elegir la microtarea de su interés, visualizando su compensación antes de comenzar. Las actividades incluyen opciones populares como: mirar un video, probar un juego, descargar una aplicación, completar un registro, calificar un producto o servicio, escribir una reseña corta, llenar un formulario, revisar un contenido (texto, imagen o audio) entre muchas otras.
                    </span>
                    
                    {/* Weekly Top Ranking */}
                    <div className="mt-6 -ml-11">
                      <WeeklyTopRanking variant="light" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pregunta original 2 */}
              <div className="overflow-hidden relative rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 2 ? null : 2)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5" style={{ backgroundColor: '#0D50A4' }}>
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium leading-relaxed" style={{ color: '#111827' }}>¿Hay microtareas disponibles para mi ubicación?</span>
                  </div>
                  <div style={{ color: '#111827' }}>
                    {activeQuestion === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-sm transition-all duration-300 ${activeQuestion === 2 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t pl-11" style={{ borderColor: '#E5E7EB' }}>
                    <span style={{ color: '#6B7280' }}>Sí, nuestro <strong style={{ color: '#111827', fontWeight: 700 }}>sistema de geolocalización avanzada</strong> ya ha detectado y confirmado su país para asignarle microtareas específicas para su región. La plataforma está completamente operativa para usted ahora mismo, lo que le garantiza un flujo constante de oportunidades diarias adaptadas a su contexto particular.</span>
                  </div>
                </div>
              </div>

              {/* Pregunta original 3 */}
              <div className="overflow-hidden relative rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 3 ? null : 3)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5" style={{ backgroundColor: '#0D50A4' }}>
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium leading-relaxed" style={{ color: '#111827' }}>¿Qué cubre la garantía de 7 días?</span>
                  </div>
                  <div style={{ color: '#111827' }}>
                    {activeQuestion === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-sm transition-all duration-300 ${activeQuestion === 3 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t pl-11" style={{ borderColor: '#E5E7EB' }}>
                    <span style={{ color: '#6B7280' }}>Usted cuenta con una <strong style={{ color: '#111827', fontWeight: 700 }}>Garantía Incondicional de 7 Días</strong>. Estamos seguros de la calidad de nuestro servicio, por lo que su pago está completamente protegido. Si la plataforma no cumple con sus expectativas, usted puede solicitar el reembolso del <strong style={{ color: '#111827', fontWeight: 700 }}>100% de su dinero</strong> dentro de los primeros 7 días. El proceso es directo y no requiere justificaciones ni formularios adicionales.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Pricing (Desktop) - Arriba (Móvil) */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            {/* Bloque de imagen solo visible en móvil - ARRIBA del pricing */}
            <div className="lg:hidden mb-6">
              <div className="rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                {/* Imagen del dashboard */}
                <div className="relative mb-4 rounded-2xl overflow-hidden">
                  <img 
                    src="/images/premium.png" 
                    alt="Vista previa del dashboard premium" 
                    className="w-full h-auto object-contain rounded-2xl"
                  />
                  {/* Overlay gradient para mejor legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                
                {/* Texto descriptivo */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold" style={{ color: '#111827' }}>
                    ¡Felicitaciones! Ya ha completado 2 microtareas.
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Su panel tiene más microtareas disponibles para usted el dia de hoy. Complete la activación para continuar generando ingresos de forma ilimitada.
                  </p>
                </div>
                
              </div>
            </div>



            <div className="max-w-2xl mx-auto lg:mx-0">
        {/* Contenido del pricing - Extraído del modal */}
        <Card className="overflow-hidden relative h-full rounded-3xl" style={{ backgroundColor: '#FFFFFF' }}>




          <div className="p-8 relative z-10">       


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
                <h3 className="text-lg transition-all duration-300" style={{ color: '#111827' }}>Acceso Total | Desbloquee todas sus Microtareas</h3>

              </div>
            </div>

            <div className="mb-8 p-6 rounded-3xl" style={{ backgroundColor: '#F3F3F3' }}>
              {/* Versión móvil - Diseño más compacto */}
              <div className="md:hidden">
                {isArgentina ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ color: '#111827' }}>
                        {!isInitialized ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                        )}
                      </span>
                      <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold" style={{ color: '#111827' }}>
                          {!isInitialized ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                          )}
                        </span>
                        <span className="text-sm ml-1" style={{ color: '#6B7280' }}>{countryPrice.currencyCode}</span>
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
                        <div className="flex items-center">
                          <span className="text-4xl font-bold" style={{ color: '#111827' }}>
                            {!isInitialized ? (
                              <span className="animate-pulse">...</span>
                            ) : (
                              `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                            )}
                          </span>
                          <span className="text-sm ml-1" style={{ color: '#6B7280' }}>{countryPrice.currencyCode}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center w-full">
                        <div className="flex items-center">
                          <span className="text-4xl font-bold" style={{ color: '#111827' }}>
                            {!isInitialized ? (
                              <span className="animate-pulse">...</span>
                            ) : (
                              `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                            )}
                          </span>
                          <span className="text-sm ml-1" style={{ color: '#6B7280' }}>{countryPrice.currencyCode}</span>
                        </div> 
                        <div className="flex items-center gap-1 ml-3">
                          <span className="text-xs font-bold text-white bg-[#16a34a] px-2 py-0.5 rounded-full shadow-sm shadow-[#16a34a]/20 border border-[#16a34a]/30">Microtareas ilimitadas</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs md:text-sm mt-2" style={{ color: '#6B7280' }}>
                Pago único - Sin suscripciones ni cargos recurrentes
              </p>


            </div>       
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 lg:mb-4">
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: '#111827' }}>Acceso Inmediato</h4>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Continúa generando ingresos sin demoras.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Infinity className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: '#111827' }}>Acceso de por vida</h4>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Sin límites de tiempo ni renovaciones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: '#111827' }}>Garantía de 7 días</h4>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Devolución total, sin preguntas ni condiciones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED3C65] via-[#D63456] to-[#C02C47] flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm" style={{ color: '#111827' }}>Soporte 24/7</h4>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Asistencia personalizada paso a paso.</p>
                </div>
              </div>
            </div>



            <Button 
              onClick={handleCheckoutNavigation}
              className="w-full py-7 text-xl md:text-2xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500 text-white flex items-center justify-center gap-3 focus:outline-none focus:ring-0 rounded-3xl transition-all duration-300"
            >
              DESBLOQUEAR AHORA
            </Button>




          </div>
        </Card>
            </div>
            
            {/* Bloque de Testimonios - Debajo del pricing en MÓVIL */}
            <div className="mt-6 lg:hidden">
              <Card className="overflow-hidden rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="p-4 md:p-6">
                  {/* Título compacto */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg md:text-xl font-bold mb-1" style={{ color: '#111827' }}>
                      Testimonios de la Comunidad
                    </h2>
                    <p className="text-xs md:text-sm" style={{ color: '#6B7280' }}>
                      Conoce las experiencias de quienes ya activaron su acceso
                    </p>
                  </div>

                  {/* Slider de testimonios */}
                  <TestimonialsSlider />
                </div>
              </Card>
            </div>
            
            {/* Bloque de Testimonios - Debajo del pricing en desktop */}
            <div className="mt-4 hidden lg:block">
              <Card className="overflow-hidden rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="p-4 md:p-6">
                  {/* Título compacto */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg md:text-xl font-bold mb-1" style={{ color: '#111827' }}>
                      Testimonios de la Comunidad
                    </h2>
                    <p className="text-xs md:text-sm" style={{ color: '#6B7280' }}>
                      Conoce las experiencias de quienes ya activaron su acceso
                    </p>
                  </div>

                  {/* Slider de testimonios */}
                  <TestimonialsSlider />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

// Componente del slider de testimonios integrado
const TestimonialsSlider = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: t("testimonial1Name"),
      avatar: "/images/testimonials/profi1.jpg",
      content: t("testimonial1Content"),
      paymentMethod: "paypal",
    },
    {
      id: 2,
      name: t("testimonial2Name"),
      avatar: "/images/testimonials/profi2.jpg",
      content: t("testimonial2Content"),
      paymentMethod: "bank",
    },
    {
      id: 3,
      name: t("testimonial3Name"),
      avatar: "/images/testimonials/profi3.jpg",
      content: t("testimonial3Content"),
      paymentMethod: "paypal",
    },
    {
      id: 4,
      name: t("testimonial4Name"),
      avatar: "/images/testimonials/profi4.jpg",
      content: t("testimonial4Content"),
      paymentMethod: "verified",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Manejar gestos táctiles para deslizar
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative">
      {/* Tarjeta de testimonio - Compacta */}
      <div 
        className="rounded-xl p-4 md:p-5"
        style={{ backgroundColor: '#F3F3F3' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center md:items-start">
          {/* Avatar y nombre - Compacto */}
          <div className="flex-shrink-0 flex md:flex-col items-center md:items-center gap-2 md:gap-1">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden">
              <Image
                src={currentTestimonial.avatar}
                alt={currentTestimonial.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-sm md:text-base whitespace-nowrap" style={{ color: '#111827' }}>{currentTestimonial.name}</h3>
            </div>
          </div>

          {/* Contenido del testimonio - Texto completo */}
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm leading-relaxed italic" style={{ color: '#6B7280' }}>
              "{currentTestimonial.content}"
            </p>
          </div>
        </div>
      </div>

      {/* Controles de navegación - Compactos */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={prevSlide}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: '#E5E7EB', color: '#111827' }}
          aria-label="Anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Indicadores - Compactos */}
        <div className="flex gap-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-[#0D50A4] scale-125"
                  : "bg-gray-300"
              }`}
              aria-label={`Ir a testimonio ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: '#E5E7EB', color: '#111827' }}
          aria-label="Siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PremiumPage;