"use client";

import { Wallet, HeadphonesIcon, DollarSign, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeatureCardsSection = () => {
  const { t } = useLanguage();

  const features = [
    // 1. Sin mínimo de retiro
    {
      icon: <Wallet className="h-6 w-6" />,
      iconColor: "text-[#3359b6]",
      gradientFrom: "from-[#3c66ce]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('sinMinimoRetiro'),
      description: t('retiraGananciasSegura')
    },
    // 2. Aprovecha Flasti AI
    {
      icon: <Zap className="h-6 w-6" />,
      iconColor: "text-[#d4386c]",
      gradientFrom: "from-[#3c66ce]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('aprovechaFlastiAI'),
      description: t('trabajaRapido')
    },
    // 3. Completa nuevas microtareas
    {
      icon: <DollarSign className="h-6 w-6" />,
      iconColor: "text-[#3359b6]",
      gradientFrom: "from-[#3c66ce]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('microtareasEnLinea'),
      description: t('generaIngresosTareas')
    },
    // 4. Soporte 24/7
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      iconColor: "text-[#d4386c]",
      gradientFrom: "from-[#3c66ce]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('soporte24_7'),
      description: t('equipoListoAyudarte')
    }
    // Bloque "Nuevas funciones y mejoras" eliminado
    // Los bloques "Gana dinero real", "Horario flexible" y "Desde tu casa" se movieron a BenefitsSection
  ];
  return (
    <section 
      className="py-16 relative overflow-hidden bg-[#0A0A0A]"
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          {/* Título superior eliminado */}
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black hardware-accelerated">{t('ingresaMundo')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('accedeArea')}
          </p>
        </div>

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
          style={{
            contain: 'layout style',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="overflow-hidden relative p-4 md:p-5 rounded-3xl flex flex-col items-center text-center bg-[#121212] transition-opacity duration-300"
              style={{
                transform: 'translate3d(0, 0, 0)',
                contain: 'layout style paint'
              }}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#252525] flex items-center justify-center`}>
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-2 text-foreground text-center">
                {feature.title}
              </h3>

              <p className="text-foreground/70 text-xs md:text-sm text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
