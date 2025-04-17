"use client";

import { Users, Briefcase, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TrustedBySection = () => {
  const { t } = useLanguage();

  const stats = [
    // 1. +$250,000 generados por usuarios
    { value: "+$250,000", label: t('generadosPorUsuarios'), icon: <TrendingUp className="h-5 w-5" /> },
    // 2. +5,000 usuarios activos
    { value: "+5,000", label: "Usuarios activos", icon: <Users className="h-5 w-5" /> },
    // 3. +1,200 microtrabajos completados
    { value: "+1,200", label: t('microtrabajosCompletados'), icon: <Briefcase className="h-5 w-5" /> }
  ];
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-[#9333ea]/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-[#ec4899]/5 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black">Ingresa a un mundo de oportunidades</h2>
          <p className="text-foreground/60 max-w-3xl mx-auto">
            Personas de todo el mundo ya están ganando dinero completando microtrabajos en línea
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center border border-white/10 mx-auto mb-4">
                <span className="text-[#ec4899]">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
