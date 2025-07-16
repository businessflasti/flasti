"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const howItWorksImages = [
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso1.jpg",
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso2.jpg",
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso3.jpg"
];

const HowItWorksSection = React.memo(() => {
  const { t } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t('registrateAhora'),
      description: t('registrateDesc'),
      image: howItWorksImages[0]
    },
    {
      number: 2,
      title: 'Completa microtrabajos',
      description: t('microtrabajosDesc'),
      image: howItWorksImages[1]
    },
    {
      number: 3,
      title: t('recogeTusRecompensas'),
      description: t('recogeTusRecompensasDesc'),
      image: howItWorksImages[2]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black text-center">{t('comoFunciona')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-center">
            {t('soloNecesitas')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col bg-[#232323] rounded-3xl shadow-lg overflow-hidden border border-white/10 max-w-[350px] mx-auto"
            >
              <div className="relative w-full h-48 md:h-56 bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="object-cover w-full h-full rounded-t-3xl"
                />
                <div className="absolute bottom-3 left-6 z-10">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md border-4 border-[#232323] text-[#232323] font-bold text-lg select-none">
                    {step.number}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start justify-start px-6 pt-8 pb-8 text-left">
                <h3 className="text-xl font-bold text-white mb-3 font-outfit tracking-tight leading-tight text-left">
                  {step.title}
                </h3>
                <p className="text-foreground/70 text-base font-light mb-0 text-left">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorksSection;
