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
      gradientFrom: "from-[#d4386c]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('sinMinimoRetiro'),
      description: t('retiraGananciasSegura')
    },
    // 2. Aprovecha Flasti AI
    {
      icon: <Zap className="h-6 w-6" />,
      iconColor: "text-[#d4386c]",
      gradientFrom: "from-[#d4386c]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('aprovechaFlastiAI'),
      description: t('trabajaRapido')
    },
    // 3. Completa nuevos microtrabajos
    {
      icon: <DollarSign className="h-6 w-6" />,
      iconColor: "text-[#3359b6]",
      gradientFrom: "from-[#d4386c]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('microtrabajosEnLinea'),
      description: t('generaIngresosTareas')
    },
    // 4. Soporte 24/7
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      iconColor: "text-[#d4386c]",
      gradientFrom: "from-[#d4386c]/20",
      gradientTo: "to-[#3359b6]/20",
      title: t('soporte24_7'),
      description: t('equipoListoAyudarte')
    }
    // Bloque "Nuevas funciones y mejoras" eliminado
    // Los bloques "Gana dinero real", "Horario flexible" y "Desde tu casa" se movieron a BenefitsSection
  ];
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#d4386c]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#3359b6]/5 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-[#d4386c] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-[#3359b6] animate-ping"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          {/* Título superior eliminado */}
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black hardware-accelerated">{t('ingresaMundo')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('accedeArea')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card group overflow-hidden relative p-4 md:p-5 rounded-xl flex flex-col items-center text-center hardware-accelerated"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center mb-3 md:mb-4 mx-auto border border-white/10">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex items-center justify-center`}>
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-2 text-foreground group-hover:text-gradient transition-all duration-300 text-center">
                {feature.title}
              </h3>

              <p className="text-foreground/70 text-xs md:text-sm text-center">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
