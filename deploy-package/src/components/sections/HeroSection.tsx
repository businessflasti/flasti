"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Clock, Shield, CheckCircle, Activity, CreditCard, Wallet, ArrowUpRight, Gift, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

// Estilos para el scrollbar personalizado y animaciones
const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* Animación para el gradiente de Flasti */
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Animación para elementos flotantes */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  /* Animación para el brillo de los bordes */
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
    50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
    100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
  }

  .bg-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }
`;

// Componente de localización del usuario
const LocationBadge = () => {
  // Usar el hook useLanguage para obtener la función de traducción y el idioma actual
  const { t, language } = useLanguage();
  const [locationData, setLocationData] = useState({
    country: '',
    countryCode: '',
    city: '',
    time: '',
    loading: true,
    error: false
  });

  useEffect(() => {
    // Función para actualizar la hora local cada minuto
    const updateLocalTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLocationData(prev => ({ ...prev, time: timeString }));
    };

    // Obtener la ubicación del usuario con un pequeño retraso para no bloquear la carga inicial
    const fetchLocation = async () => {
      // Primero establecer una ubicación predeterminada para mostrar algo rápidamente
      setLocationData({
        country: 'Global',
        countryCode: 'global',
        city: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loading: false,
        error: false
      });

      // Luego intentar obtener la ubicación real con un pequeño retraso
      setTimeout(async () => {
        try {
          // Usar un servicio de geolocalización por IP
          const response = await fetch('https://ipapi.co/json/');
          if (!response.ok) throw new Error('Error al obtener la ubicación');

          const data = await response.json();

          setLocationData({
            country: data.country_name,
            countryCode: data.country_code.toLowerCase(),
            city: data.city || '',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            loading: false,
            error: false
          });
        } catch (error) {
          console.error('Error fetching location:', error);
          // Ya tenemos una ubicación predeterminada, así que no necesitamos hacer nada más
        }
      }, 500); // Retraso de 500ms para no bloquear la carga inicial
    };

    // Iniciar la obtención de datos
    fetchLocation();
    updateLocalTime();

    // Actualizar la hora cada minuto
    const timeInterval = setInterval(updateLocalTime, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-1.5 text-sm">
      {locationData.loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-foreground/20 animate-pulse"></div>
          <span className="text-foreground/60">{language === 'es' ? 'Detectando ubicación...' : 'Detecting location...'}</span>
        </div>
      ) : locationData.error ? (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#9333ea]" />
          <span className="text-foreground/80">{language === 'es' ? 'Acceso Global' : 'Global Access'}</span>
          {/* No clock shown for global access */}
        </div>
      ) : (
        <>
          <div className="w-5 h-5 overflow-hidden rounded-full flex-shrink-0 border border-white/10">
            <img
              src={`https://flagcdn.com/w40/${locationData.countryCode}.png`}
              alt={locationData.country}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center">
            {locationData.city && (
              <>
                <span className="text-foreground/80">{locationData.city},</span>
                <span className="text-foreground/60 ml-1">{locationData.country}</span>
              </>
            )}
            {!locationData.city && (
              <span className="text-foreground/80">{locationData.country}</span>
            )}
          </div>
          <span className="text-foreground/60 border-l border-foreground/20 pl-2">{locationData.time}</span>
        </>
      )}
    </div>
  );
};

// Componente de contador animado
const AnimatedCounter = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Usar requestAnimationFrame para animaciones más fluidas
    let startTime: number | null = null;
    const duration = 1500; // 1.5 segundos para la animación (más rápido)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Función de easing para que la animación sea más natural
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * value));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  return (
    <span className="font-bold hardware-accelerated">
      {prefix}{count.toLocaleString().replace(/,/g, '.')}{suffix}
    </span>
  );
};

// Componente de texto rotativo con efecto de tipeo
const RotatingText = () => {
  const { language, t } = useLanguage();
  const words = t('rotatingWords');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[50px] md:h-[60px] overflow-hidden relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-full text-center hardware-accelerated"
        >
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${words[index].color} font-bold text-5xl md:text-6xl lg:text-7xl animate-gradient-optimized`}>
            {words[index].text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};



const HeroSection = () => {
  const { language, t } = useLanguage();
  // Estado para los contadores
  const [stats, setStats] = useState({
    generatedAmount: 24962460,
    microtasksCompleted: 1290418
  });

  // Cargar estadísticas desde Supabase
  useEffect(() => {
    async function loadStats() {
      try {
        // Intentar obtener estadísticas de la API
        const response = await fetch('/api/stats');

        if (response.ok) {
          const data = await response.json();
          setStats({
            generatedAmount: data.generated_amount || 24962460,
            microtasksCompleted: data.microtasks_completed || 1290418
          });
        }
      } catch (error) {
        console.error(`${t('errorCargarEstadisticas')}`, error);
        // Si hay un error, mantener los valores predeterminados
      }
    }

    loadStats();

    // Configurar un intervalo para actualizar las estadísticas cada 5 minutos
    // Esto asegura que los usuarios vean los valores actualizados sin necesidad de recargar la página
    const interval = setInterval(loadStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="pt-20 pb-24 relative overflow-hidden">
      {/* Estilos personalizados */}
      <style jsx global>{customStyles}</style>

      {/* Fondo con efecto de gradiente */}
      <div className="absolute inset-0 gradient-background z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
      </div>

      {/* Efectos de luz de fondo - posicionados detrás del título */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-[#ec4899]/10 blur-3xl hardware-accelerated -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Insignia de localización */}
          <div className="flex justify-center mb-6 animate-entry animate-entry-delay-1 hardware-accelerated">
            <LocationBadge />
          </div>

          {/* Título principal */}
          <div className="text-center mb-6 animate-entry animate-entry-delay-2 hardware-accelerated">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              <span className="block">{t('genera')}</span>
              <RotatingText />
              <span className="block mt-2">{t('con')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] animate-gradient-shift">Flasti</span></span>
            </h1>

            <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto mt-6">
              {t('aprovechaPoder')}
            </p>
          </div>

          {/* Estadísticas */}
          <div className="flex flex-row justify-center gap-4 sm:gap-8 mb-10 mt-8 animate-entry animate-entry-delay-3 hardware-accelerated hero-stats-container">
            <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-center flex-1 max-w-[200px] sm:max-w-[220px] md:max-w-[240px]">
              <p className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#4CAF50] flex justify-center">
                <AnimatedCounter value={stats.generatedAmount} prefix="$" />
              </p>
              <p className="text-[10px] sm:text-sm text-foreground/60 whitespace-normal">
                <span className="sm:inline block">{t('generadosPor')}</span>{' '}
                <span className="sm:inline block">{t('usuarios')}</span>
              </p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-center flex-1 max-w-[200px] sm:max-w-[220px] md:max-w-[240px]">
              <p className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-[#facc15] flex justify-center">
                <AnimatedCounter value={stats.microtasksCompleted} />
              </p>
              <p className="text-[10px] sm:text-sm text-foreground/60 whitespace-normal">
                <span className="block sm:inline">{t('microtrabajos')}</span>{' '}
                <span className="block sm:inline">{t('completados')}</span>
              </p>
            </div>
          </div>

          {/* Indicador de usuarios */}
          <div className="mt-6 flex justify-center animate-entry animate-entry-delay-4 hardware-accelerated">
            <div className="flex items-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden transition-all duration-300 hover:scale-110 hover:border-foreground/80 hover:z-10 hover:shadow-lg hover:shadow-foreground/20">
                  <img src="/images/profiles/profile1.jpg" alt={t('usuario1')} className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden transition-all duration-300 hover:scale-110 hover:border-foreground/80 hover:z-10 hover:shadow-lg hover:shadow-foreground/20">
                  <img src="/images/profiles/profile2.jpg" alt={t('usuario2')} className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden transition-all duration-300 hover:scale-110 hover:border-foreground/80 hover:z-10 hover:shadow-lg hover:shadow-foreground/20">
                  <img src="/images/profiles/profile3.jpg" alt={t('usuario3')} className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-sm text-foreground/80">
                <span className="font-semibold">{t('personasFormanParte')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
