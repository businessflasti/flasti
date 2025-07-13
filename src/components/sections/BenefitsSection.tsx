"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, GraduationCap, Clock, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BenefitsSection = () => {
  const { t, language } = useLanguage();

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
      {/* Elementos decorativos del fondo ELIMINADOS */}
      {/* <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl hardware-accelerated"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl hardware-accelerated"></div>
      </div> */}

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          {/* Etiqueta "Beneficios" eliminada */}
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black text-center">
            {language === 'es' ? 'Comienza a trabajar' :
             language === 'en' ? 'Start working' :
             'Comece a trabalhar'}
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-center">
            {t('milesPersonas')}
          </p>
        </div>

        {/* Todos los bloques en una sola fila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto animate-on-visible text-left">
          {/* 1. Gana dinero real */}
          <Card className="flex flex-col items-start bg-[#232323] border border-white/10 rounded-3xl overflow-hidden shadow-lg p-0 max-w-[350px] mx-auto">
            <div className="w-full h-48 bg-[#232323] overflow-hidden rounded-t-3xl">
              <img src="/promos/ben1.webp" alt="Gana dinero" className="object-cover object-top w-full h-full rounded-t-3xl" />
            </div>
            <div className="flex-1 flex flex-col items-start justify-center p-5 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-left font-outfit tracking-tight w-full flex items-center">{t('ganaDinero')}</h3>
              <p className="text-foreground/70 text-sm text-left font-light mb-0 w-full flex items-center">{t('generaIngresosMicrotrabajos')}</p>
            </div>
          </Card>

          {/* 2. Sin experiencia */}
          <Card className="flex flex-col items-start bg-[#232323] border border-white/10 rounded-3xl overflow-hidden shadow-lg p-0 max-w-[350px] mx-auto">
            <div className="w-full h-48 bg-[#232323] overflow-hidden rounded-t-3xl">
              <img src="/promos/ben2.webp" alt="Sin experiencia" className="object-cover object-top w-full h-full rounded-t-3xl" />
            </div>
            <div className="flex-1 flex flex-col items-start justify-center p-5 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-left font-outfit tracking-tight w-full flex items-center">{t('sinExperiencia')}</h3>
              <p className="text-foreground/70 text-sm text-left font-light mb-0 w-full flex items-center">{t('empiezaSin')}</p>
            </div>
          </Card>

          {/* 3. Desde tu casa */}
          <Card className="flex flex-col items-start bg-[#232323] border border-white/10 rounded-3xl overflow-hidden shadow-lg p-0 max-w-[350px] mx-auto">
            <div className="w-full h-48 bg-[#232323] overflow-hidden rounded-t-3xl">
              <img src="/promos/ben3.webp" alt="Desde casa" className="object-cover object-top w-full h-full rounded-t-3xl" />
            </div>
            <div className="flex-1 flex flex-col items-start justify-center p-5 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-left font-outfit tracking-tight w-full flex items-center">{t('desdeCasa')}</h3>
              <p className="text-foreground/70 text-sm text-left font-light mb-0 w-full flex items-center">{t('usaCelularComputadora')}</p>
            </div>
          </Card>

          {/* 4. Horario flexible */}
          <Card className="flex flex-col items-start bg-[#232323] border border-white/10 rounded-3xl overflow-hidden shadow-lg p-0 max-w-[350px] mx-auto">
            <div className="w-full h-48 bg-[#232323] overflow-hidden rounded-t-3xl">
              <img src="/promos/ben4.webp" alt="Sin horarios" className="object-cover object-top w-full h-full rounded-t-3xl" />
            </div>
            <div className="flex-1 flex flex-col items-start justify-center p-5 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-left font-outfit tracking-tight w-full flex items-center">{t('sinHorarios')}</h3>
              <p className="text-foreground/70 text-sm text-left font-light mb-0 w-full flex items-center">{t('trabajaCualquierHora')}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;