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
      title: 'Completa microtrabajos',
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
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          {/* Título superior eliminado */}
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">{t('comoFunciona')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('soloNecesitas')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            return (
              <div
                key={index}
                className="bg-card/30 backdrop-blur-md shadow-xl group overflow-hidden relative p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 flex flex-col items-center text-center hardware-accelerated"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

                <div
                  className="text-sm font-medium py-1 px-3 rounded-full mb-6"
                  style={{ background: '#fff', color: '#0a0a0a' }}
                >
                  {t('paso')} {step.number}
                </div>

                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 border border-white/10 relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center">
                    <div className="text-white">
                      {step.number === 1 && <UserPlus size={32} />}
                      {step.number === 2 && <Smartphone size={32} />}
                      {step.number === 3 && <Wallet size={32} />}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 transition-all duration-300">
                  {step.title}
                </h3>

                <p className="text-foreground/70 text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
