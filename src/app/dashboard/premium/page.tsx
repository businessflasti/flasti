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
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

const PremiumPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { activeTheme } = useSeasonalTheme();
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
    router.push('/dashboard/checkout');
  };

  // Función para volver al dashboard
  const handleGoBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] pt-16 md:pt-8 pb-16 md:pb-8 px-4 relative overflow-hidden">
      {/* Guirnalda temática */}
      {activeTheme === 'halloween' && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10" stroke="#2a2a2a" strokeWidth="2" fill="none" opacity="0.6" />
            {[...Array(25)].map((_, i) => {
              const x = (i * 48) + 24;
              const y = 10 + Math.sin(i * 0.5) * 8;
              const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                  <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
          <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
            {[...Array(10)].map((_, i) => {
              const x = (i * 40) + 20;
              const y = 8 + Math.sin(i * 0.5) * 5;
              const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-mobile-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                  <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>
      )}
      
      {activeTheme === 'christmas' && (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
            <path d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10" stroke="#2a2a2a" strokeWidth="2" fill="none" opacity="0.6" />
            {[...Array(25)].map((_, i) => {
              const x = (i * 48) + 24;
              const y = 10 + Math.sin(i * 0.5) * 8;
              const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                  <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
          <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
            {[...Array(10)].map((_, i) => {
              const x = (i * 40) + 20;
              const y = 8 + Math.sin(i * 0.5) * 5;
              const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
              const color = colors[i % colors.length];
              return (
                <g key={`light-mobile-${i}`}>
                  <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                  <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                </g>
              );
            })}
          </svg>
        </div>
      )}
      


      {/* Layout responsive: Desktop 2 columnas, Móvil 1 columna */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          
          {/* Columna izquierda: Imagen/FAQ (Desktop) - Abajo (Móvil) */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            {/* Bloque de imagen del dashboard - Solo visible en desktop */}
            <div className="hidden lg:block mb-4">
              <div className="border border-white/10 rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: '#0F1319' }}>
                {/* Badge de ubicación y punto verde - Solo móvil - Arriba de la imagen */}
                <div className="md:hidden flex justify-between items-center mb-3">
                  {countryPrice.countryCode && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-sm whitespace-nowrap">
                      <CountryFlag countryCode={countryPrice.countryCode} size="sm" />
                      <span className="text-white font-semibold text-[10px]">
                        {countryPrice.countryCode}
                      </span>
                      <span className="text-white/40 text-[10px]">•</span>
                      <span className="text-white/70 text-[10px]">
                        {currentDate || 'Cargando...'}
                      </span>
                    </div>
                  )}
                  {/* Punto verde decorativo */}
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
                  <h3 className="text-xl font-bold text-white">
                    ¡Desbloquea ya todas tus microtareas y comienza a ganar dinero ahora mismo!
                  </h3>
                  <p className="text-sm text-gray-400">
                    No pierdas ni un segundo más: tus primeras microtareas de hoy ya están asignadas exclusivamente para ti. Desbloquéalas todas ahora y comienza a generar ingresos sin esperas ni complicaciones
                  </p>
                </div>
                
              </div>
            </div>

            {/* FAQ Section fuera de la tarjeta principal */}
            <div className="space-y-4 mb-6 lg:mb-4">
              {/* Cuarta pregunta expandible - NUEVA (ahora primera) */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 0 ? null : 0)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10 flex-shrink-0">
                      <div className="text-[#101010]">
                        <DollarSign className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white leading-relaxed flex items-center mt-1">¿Cuánto dinero puedo ganar?</span>
                  </div>
                  <div className="text-white">
                    {activeQuestion === 0 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${activeQuestion === 0 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>
                      Puedes generar un ingreso estable para tu día a día o simplemente obtener un ingreso adicional en tu tiempo libre.

                      <br />
                      <br />
                      <strong>• Elige cómo y cuánto ganar</strong>

                      <br />
                      <br />
                      Nuestra plataforma te recompensa por cada microtarea completada, con pagos de $1 hasta $20 USD, según la tarea que elijas. Algunas de las microtareas que encontrarás son: mirar un video, probar un juego, descargar una aplicación, completar un registro, calificar un producto o servicio, escribir una reseña corta, llenar un formulario, revisar un contenido (texto, imagen o audio) y muchas más que puedes empezar a realizar ahora mismo.

                      <br />
                      <br />
                      Con solo completar una microtarea, recuperas tu inversión y seguirás generando ganancias. Tú decides hasta dónde llegar, elige tu camino y empieza a ganar
                    </span>
                    
                    {/* Weekly Top Ranking */}
                    <div className="mt-6 -ml-11">
                      <WeeklyTopRanking />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pregunta original 1 */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 1 ? null : 1)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10 flex-shrink-0">
                      <div className="text-[#101010]">
                        <Info className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white leading-relaxed flex items-center">¿Por qué debo hacer un pago único para desbloquear las microtareas?</span>
                  </div>
                  <div className="text-white">
                    {activeQuestion === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${activeQuestion === 1 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>El acceso a la plataforma es gratuito, sin embargo, debido a abusos reiterados y accesos no autorizados por parte de algunos usuarios, se implementó este pago único para desbloquear y trabajar con microtareas. Esta medida funciona como un filtro necesario que garantiza un entorno profesional, seguro y exclusivo, destinado únicamente a quienes están verdaderamente comprometidos a trabajar con seriedad, responsabilidad y compromiso en nuestra plataforma. Este pago es definitivo y otorga acceso de por vida a todas las microtareas, las cuales se renuevan diariamente para brindarte nuevas oportunidades de forma constante. Estamos totalmente seguros de la efectividad de nuestro sistema comprobado y de tu capacidad para aprovecharlo, por lo que sabemos que recuperarás y superarás tu inversión rápidamente, incluso en estas mismas primeras horas, tal como lo están logrando numerosos usuarios satisfechos en este preciso momento.</span>
                  </div>
                </div>
              </div>

              {/* Pregunta original 2 */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 2 ? null : 2)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10 flex-shrink-0 mt-0.5">
                      <div className="text-[#101010]">
                        <MapPin className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white leading-relaxed">¿Puedo empezar a trabajar desde mi ubicación actual ahora?</span>
                  </div>
                  <div className="text-white">
                    {activeQuestion === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${activeQuestion === 2 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="pt-3 pb-1 border-t border-white/10 pl-11">
                    <span style={{ color: '#AEAEB0' }}>Sí, ahora mismo puedes completar microtareas desde tu ubicación actual. Nuestro sistema detectó automáticamente tu país y te asignó tareas específicas diseñadas para ser realizadas exclusivamente desde tu región. Esto garantiza que siempre tengas oportunidades diarias adaptadas a tu contexto particular. Estamos comprometidos a brindarle apoyo desde este primer momento y a ayudarle a maximizar las posibilidades que ofrece nuestra plataforma.</span>
                  </div>
                </div>
              </div>

              {/* Pregunta original 3 */}
              <div className="overflow-hidden relative rounded-3xl border-0 transition-all bg-white/[0.03] backdrop-blur-xl border border-white/10">
                <button
                  className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left focus:outline-none focus:ring-0 border-0"
                  onClick={() => setActiveQuestion(activeQuestion === 3 ? null : 3)}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 border border-white/10 flex-shrink-0 mt-0.5">
                      <div className="text-[#101010]">
                        <Shield className="h-4 w-4 text-[#101010]" />
                      </div>
                    </div>
                    <span className="font-medium text-white leading-relaxed">¿Cómo me respalda la garantía?</span>
                  </div>
                  <div className="text-white">
                    {activeQuestion === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                <div
                  className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-300 ${activeQuestion === 3 ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
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
              <div className="border border-white/10 rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: '#0F1319 !important', background: '#0F1319 !important' }}>
                {/* Badge de ubicación y punto verde - Móvil - Arriba de la imagen */}
                <div className="flex justify-between items-center mb-3">
                  {countryPrice.countryCode && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.03] backdrop-blur-xl border-0 shadow-sm whitespace-nowrap">
                      <CountryFlag countryCode={countryPrice.countryCode} size="sm" />
                      <span className="text-white font-semibold text-[10px]">
                        {countryPrice.countryCode}
                      </span>
                      <span className="text-white/40 text-[10px]">•</span>
                      <span className="text-white/70 text-[10px]">
                        {currentDate || 'Cargando...'}
                      </span>
                    </div>
                  )}
                  {/* Punto verde decorativo */}
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
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
                  <h3 className="text-xl font-bold text-white">
                    ¡Desbloquea ya todas tus microtareas y comienza a ganar dinero ahora mismo!
                  </h3>
                  <p className="text-sm text-gray-400">
                    No pierdas ni un segundo más: tus primeras microtareas de hoy ya están asignadas exclusivamente para ti. Desbloquéalas todas ahora y comienza a generar ingresos sin esperas ni complicaciones
                  </p>
                </div>
                
              </div>
            </div>



            <div className="max-w-2xl mx-auto lg:mx-0">
        {/* Contenido del pricing - Extraído del modal */}
        <Card 
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden relative h-full rounded-3xl transition-all duration-700"
          style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
        >
          {/* Brillo superior glassmorphism */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>




          <div className="p-8 relative z-10">       


            <div className="flex items-center mb-6">
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center mr-4">
                <Lock className="w-7 h-7 text-white drop-shadow-lg" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
              </div>
              <div>
                <h3 className="text-lg text-white group-hover:text-white transition-all duration-300">Desbloquea todas tus microtareas ahora</h3>

              </div>
            </div>

            <div className="mb-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative">
              {/* Versión móvil - Diseño más compacto */}
              <div className="md:hidden">
                {isArgentina ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">
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
                        <span className="text-2xl font-bold">
                          {!isInitialized ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                          )}
                        </span>
                        <span className="text-sm ml-1 text-muted-foreground">{countryPrice.currencyCode}</span>
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
                          <span className="text-4xl font-bold">
                            {!isInitialized ? (
                              <span className="animate-pulse">...</span>
                            ) : (
                              `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                            )}
                          </span>
                          <span className="text-sm ml-1 text-muted-foreground">{countryPrice.currencyCode}</span>
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
                          <span className="text-4xl font-bold">
                            {!isInitialized ? (
                              <span className="animate-pulse">...</span>
                            ) : (
                              `${countryPrice.currencySymbol}${formatPrice(countryPrice.price, countryPrice.countryCode)}`
                            )}
                          </span>
                          <span className="text-sm ml-1 text-muted-foreground">{countryPrice.currencyCode}</span>
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
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 lg:mb-4">
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Acceso inmediato</h4>
                  <p className="text-xs text-white/70">Comienza a generar ingresos ahora mismo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Infinity className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Acceso de por vida</h4>
                  <p className="text-xs text-white/70">Sin límites de tiempo ni renovaciones</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Garantía de 7 días</h4>
                  <p className="text-xs text-white/70">Devolución del 100% si no estás satisfecho</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="text-white drop-shadow-lg" size={18} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">Soporte 24/7</h4>
                  <p className="text-xs text-white/70">Asistencia personalizada paso a paso</p>
                </div>
              </div>
            </div>



            <Button 
              onClick={handleCheckoutNavigation}
              className="w-full py-7 text-xl md:text-2xl font-black bg-[#FF4500] hover:bg-[#FF5722] text-white flex items-center justify-center gap-3 focus:outline-none focus:ring-0 rounded-3xl transform hover:scale-105 transition-all duration-300"
            >
              QUIERO DESBLOQUEAR YA
            </Button>




          </div>
        </Card>
            </div>
            
            {/* Bloque de Testimonios - Debajo del pricing en MÓVIL */}
            <div className="mt-6 lg:hidden">
              <Card className="bg-white/[0.03] backdrop-blur-xl border-0 overflow-hidden relative rounded-2xl">
                <div className="p-4 md:p-6">
                  {/* Título compacto */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                      Miles de usuarios ya están ganando dinero
                    </h2>
                    <p className="text-white/60 text-xs md:text-sm">
                      Conoce las experiencias de aquellos que ya empezaron
                    </p>
                  </div>

                  {/* Slider de testimonios */}
                  <TestimonialsSlider />
                </div>
              </Card>
            </div>
            
            {/* Bloque de Testimonios - Debajo del pricing en desktop */}
            <div className="mt-4 hidden lg:block">
              <Card className="bg-white/[0.03] backdrop-blur-xl border-0 overflow-hidden relative rounded-2xl">
                <div className="p-4 md:p-6">
                  {/* Título compacto */}
                  <div className="text-center mb-4">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                      Miles de usuarios ya están ganando dinero
                    </h2>
                    <p className="text-white/60 text-xs md:text-sm">
                      Conoce las experiencias de aquellos que ya empezaron
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
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-5"
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
              <h3 className="font-semibold text-white text-sm md:text-base whitespace-nowrap">{currentTestimonial.name}</h3>
            </div>
          </div>

          {/* Contenido del testimonio - Texto completo */}
          <div className="flex-1 min-w-0">
            <p className="text-white/75 text-xs md:text-sm leading-relaxed italic">
              "{currentTestimonial.content}"
            </p>
          </div>
        </div>
      </div>

      {/* Controles de navegación - Compactos */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={prevSlide}
          className="w-7 h-7 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] flex items-center justify-center text-white transition-all"
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
                  ? "bg-green-500 scale-125"
                  : "bg-white/20"
              }`}
              aria-label={`Ir a testimonio ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-7 h-7 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] flex items-center justify-center text-white transition-all"
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