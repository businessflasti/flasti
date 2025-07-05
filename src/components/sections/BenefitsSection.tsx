"use client";

import { Card } from "@/components/ui/card";
import { DollarSign, GraduationCap, Clock, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FocusCards } from "@/components/ui/focus-cards";
import React from "react";

const BenefitsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          {/* Etiqueta "Beneficios" eliminada */}
          <h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">{t('accedeFlasti')} <span className="text-white">flasti</span> {t('comienzaGanar')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('milesPersonas')}
          </p>
        </div>

        {/* NUEVO: FocusCards visual destacado */}
        <div className="mb-12">
          <FocusCards />
        </div>

        {/* Todos los bloques en una sola fila */}
        {/* BLOQUES DE BENEFICIOS ELIMINADOS POR SOLICITUD */}
      </div>
    </section>
  );
};

export default BenefitsSection;