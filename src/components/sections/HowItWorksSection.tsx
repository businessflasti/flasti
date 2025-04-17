"use client";

import { ArrowRight, UserPlus, Smartphone, Wallet } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const { language, t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t('registrateAhora'),
      description: t('registrateDesc'),
      icon: "/icons/register-icon.svg"
    },
    {
      number: 2,
      title: t('microtrabajosEnLinea'),
      description: t('microtrabajosDesc'),
      icon: "/icons/work-icon.svg"
    },
    {
      number: 3,
      title: t('recogeTusRecompensas'),
      description: t('recogeTusRecompensasDesc'),
      icon: "/icons/reward-icon.svg"
    }
  ];
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          {/* Título superior eliminado */}
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black">{t('comoFunciona')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('soloNecesitas')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card group overflow-hidden relative p-8 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

              <div className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] text-white text-sm font-medium py-1 px-3 rounded-full mb-6">
                {t('paso')} {step.number}
              </div>

              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mb-6 border border-white/10 relative">
                <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
                  {/* Placeholder for actual icons */}
                  <div className="text-[#ec4899]">
                    {step.number === 1 && <UserPlus size={32} />}
                    {step.number === 2 && <Smartphone size={32} />}
                    {step.number === 3 && <Wallet size={32} />}
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute -right-[100px] top-1/2 transform -translate-y-1/2 hidden md:block">
                    <ArrowRight className="text-[#ec4899] w-8 h-8" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
                {step.title}
              </h3>

              <p className="text-foreground/70 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
