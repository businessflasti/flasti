"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, GraduationCap, Clock, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BenefitsSection = () => {
  const { t } = useLanguage();

  const benefits = [
    // Los bloques "Completa nuevos microtrabajos" y "Aprovecha Flasti AI" se movieron a FeatureCardsSection
    // Menú "Aprende a usar IA" eliminado
    {
      id: 4,
      icon: <GraduationCap className="text-yellow-500" size={24} />,
      title: t('sinExperiencia'),
      description: t('empiezaSin')
    }
  ];
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl hardware-accelerated"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl hardware-accelerated"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          {/* Etiqueta "Beneficios" eliminada */}
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black">{t('accedeFlasti')} <span className="text-white">Flasti</span> {t('comienzaGanar')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('milesPersonas')}
          </p>
        </div>

        {/* Todos los bloques en una sola fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto animate-on-visible">
          {/* 1. Gana dinero real */}
          <Card className="glass-card group overflow-hidden relative p-4 md:p-5">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center mb-3 md:mb-4 mx-auto border border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                <DollarSign className="text-blue-500" size={24} />
              </div>
            </div>

            <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-gradient transition-all duration-300 text-center">
              {t('ganaDinero')}
            </h3>

            <p className="text-foreground/70 text-xs md:text-sm text-center">
              {t('generaIngresosMicrotrabajos')}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </Card>

          {/* 2. Sin experiencia */}
          {benefits.map((benefit) => (
            <Card key={benefit.id} className="glass-card group overflow-hidden relative p-4 md:p-5">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center mb-3 md:mb-4 mx-auto border border-white/10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                  {benefit.icon}
                </div>
              </div>

              <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-gradient transition-all duration-300 text-center">
                {benefit.title}
              </h3>

              <p className="text-foreground/70 text-xs md:text-sm text-center">
                {benefit.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </Card>
          ))}

          {/* 3. Desde tu casa */}
          <Card className="glass-card group overflow-hidden relative p-4 md:p-5">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center mb-3 md:mb-4 mx-auto border border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                <Home className="text-green-500" size={24} />
              </div>
            </div>

            <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-gradient transition-all duration-300 text-center">
              {t('desdeCasa')}
            </h3>

            <p className="text-foreground/70 text-xs md:text-sm text-center">
              {t('usaCelularComputadora')}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </Card>

          {/* 4. Horario flexible */}
          <Card className="glass-card group overflow-hidden relative p-4 md:p-5">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent"></div>

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/40 flex items-center justify-center mb-3 md:mb-4 mx-auto border border-white/10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                <Clock className="text-purple-500" size={24} />
              </div>
            </div>

            <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-gradient transition-all duration-300 text-center">
              {t('sinHorarios')}
            </h3>

            <p className="text-foreground/70 text-xs md:text-sm text-center">
              {t('trabajaCualquierHora')}
            </p>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;