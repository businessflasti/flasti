"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, TrendingUp, Clock, Shield, CheckCircle, Activity, CreditCard, Wallet, User, ArrowUpRight, Gift, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

    // Obtener la ubicación del usuario
    const fetchLocation = async () => {
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
        setLocationData({
          country: 'Global',
          countryCode: 'global',
          city: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          loading: false,
          error: true
        });
      }
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
          <span className="text-foreground/60">Detectando ubicación...</span>
        </div>
      ) : locationData.error ? (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#9333ea]" />
          <span className="text-foreground/80">Acceso Global</span>
          <span className="text-foreground/60 border-l border-foreground/20 pl-2">{locationData.time}</span>
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

  useEffect(() => {
    const duration = 2000; // 2 segundos para la animación
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      // Función de easing para que la animación sea más natural
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * value));

      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Componente de texto rotativo con efecto de tipeo
const RotatingText = () => {
  const words = [
    { text: "ingresos reales", color: "from-[#9333ea] to-[#ec4899]" },
    { text: "dinero extra", color: "from-[#ec4899] to-[#facc15]" },
    { text: "libertad financiera", color: "from-[#facc15] to-[#9333ea]" },
    { text: "oportunidades", color: "from-[#9333ea] via-[#ec4899] to-[#facc15]" }
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[40px] md:h-[60px] overflow-hidden relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-full text-center"
        >
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${words[index].color} font-bold animate-gradient-shift`}>
            {words[index].text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Componente simulador de notificaciones
const NotificationSimulator = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const notificationTypes = [
    {
      type: "earnings",
      title: "Nueva ganancia",
      messages: [
        "Juan acaba de ganar $25.50",
        "María recibió $32.10 por referidos",
        "Carlos ganó $18.75 con Flasti AI",
        "Ana generó $41.20 con Flasti Images",
        "Roberto obtuvo $15.30 por comisiones"
      ],
      icon: <DollarSign className="h-4 w-4 text-white" />
    },
    {
      type: "withdrawal",
      title: "Retiro exitoso",
      messages: [
        "Pedro retiró $120 a su cuenta",
        "Laura recibió $85 en su billetera",
        "Miguel retiró $200 a PayPal",
        "Sofía cobró $150 a su cuenta bancaria",
        "Daniel recibió $95 en su billetera digital"
      ],
      icon: <Wallet className="h-4 w-4 text-white" />
    }
  ];

  useEffect(() => {
    // Generar notificaciones aleatorias cada cierto tiempo
    const generateNotification = () => {
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
      
      const newNotification = {
        id: Date.now(),
        type: randomType.type,
        title: randomType.title,
        message: randomMessage,
        icon: randomType.icon,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    };

    // Generar la primera notificación después de 3 segundos
    const firstTimer = setTimeout(() => {
      generateNotification();
    }, 3000);

    // Generar notificaciones aleatorias cada 5-10 segundos
    const interval = setInterval(() => {
      generateNotification();
    }, Math.random() * 5000 + 5000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  // Alternar visibilidad del panel de notificaciones en móvil
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground/80">Actividad en tiempo real</h3>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-green-500">En vivo</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-3 bg-card/40 backdrop-blur-sm border border-white/5 rounded-3xl p-3"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'earnings' ? 'bg-[#9333ea]' : 'bg-[#facc15]'
                }`}>
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-foreground/50">{notification.time}</span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-6 text-foreground/50 text-sm">
              Las notificaciones aparecerán aquí...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="pt-20 pb-24 relative overflow-hidden">
      {/* Estilos personalizados */}
      <style jsx global>{customStyles}</style>

      {/* Fondo con efecto de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/95 z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-[#ec4899]/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-[10%] w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl animate-pulse-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Insignia de localización */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <LocationBadge />
          </motion.div>

          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              <span className="block">Genera</span>
              <RotatingText />
              <span className="block mt-2">con <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] animate-gradient-shift">Flasti</span></span>
            </h1>

            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mt-6">
              Aprovecha el poder de internet y empieza ahora mismo a generar ingresos
            </p>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-10 mt-8"
          >
            <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-3xl px-6 py-4 text-center">
              <p className="text-3xl font-bold mb-1 text-[#ec4899]">
                <AnimatedCounter value={500000} prefix="+" />
              </p>
              <p className="text-sm text-foreground/60">Usuarios activos</p>
            </div>

            <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-3xl px-6 py-4 text-center">
              <p className="text-3xl font-bold mb-1 text-[#9333ea]">
                <AnimatedCounter value={250000} prefix="$" />
              </p>
              <p className="text-sm text-foreground/60">Generados por usuarios</p>
            </div>
          </motion.div>

          {/* Visualización avanzada de la plataforma con simulador de notificaciones */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative mt-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda - Imagen de la plataforma */}
              <div className="lg:col-span-2 relative">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Imagen principal del dashboard */}
                  <Image
                    src="/dashboard-preview.webp"
                    alt="Flasti Dashboard"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />

                  {/* Elementos flotantes sobre la imagen */}
                  <div className="absolute inset-0">
                    {/* Bloque flotante 1 - Ganancias */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="absolute top-10 right-10 backdrop-blur-xl rounded-3xl shadow-xl z-30 animate-float"
                      style={{ animationDelay: '0.3s', animationDuration: '4s' }}
                    >
                      <div className="bg-gradient-to-br from-[#9333ea]/90 to-[#9333ea]/70 border border-white/10 p-3 rounded-3xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-white/70">Ganancias totales</div>
                            <div className="text-lg font-bold text-white">$1,250.00</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bloque flotante 2 - Estadísticas */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                      className="absolute top-1/3 -left-5 backdrop-blur-xl rounded-3xl shadow-xl z-30 animate-float overflow-hidden"
                      style={{ animationDelay: '0.7s', animationDuration: '5s' }}
                    >
                      <div className="bg-gradient-to-br from-primary/90 to-primary/70 border border-white/10 p-3 rounded-3xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-white/70">Crecimiento</span>
                              <span className="text-xs font-medium text-green-400">+24%</span>
                            </div>
                            <div className="mt-1 h-2 bg-white/10 rounded-full w-32 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full w-3/4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bloque flotante 3 - Retiro */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                      className="absolute bottom-10 right-1/4 backdrop-blur-xl rounded-3xl shadow-xl z-30 animate-float"
                      style={{ animationDelay: '1s', animationDuration: '4.5s' }}
                    >
                      <div className="bg-gradient-to-br from-[#facc15]/90 to-[#facc15]/70 border border-white/10 p-3 rounded-3xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                            <Wallet className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-xs text-white/70">Último retiro</div>
                            <div className="text-lg font-bold text-white">$350.00</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Simulador de notificaciones */}
              <div className="relative">
                <div className="glass-card h-full rounded-3xl border border-white/10 p-4 backdrop-blur-md">
                  <NotificationSimulator />
                </div>
              </div>
            </div>

            {/* Indicador de usuarios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="mt-6 flex justify-center"
            >
              <div className="flex items-center gap-2 bg-card/40 backdrop-blur-sm border border-white/5 rounded-full px-4 py-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden flex items-center justify-center bg-[#9333ea]">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden flex items-center justify-center bg-[#ec4899]">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden flex items-center justify-center bg-[#facc15]">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold">+500.000 usuarios confían en Flasti</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
