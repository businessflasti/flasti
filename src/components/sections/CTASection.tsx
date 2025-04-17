"use client";

import { Shield, Lightbulb, Lock, TrendingUp, Target, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { language, t } = useLanguage();
  return (
    <section className="py-0 relative overflow-hidden">
      {/* Fondo con efecto de gradiente */}
      <div className="absolute inset-0 gradient-background z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
      </div>

      {/* Efectos de luz de fondo */}
      <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl hardware-accelerated -z-10"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl hardware-accelerated -z-10"></div>

      <div className="container-custom py-16 relative z-10">
        <div className="glass-card border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white dark:text-white light:text-black">
            Conoce a <span className="text-gradient">Flasti</span>
          </h2>

          <p className="text-foreground/70 text-sm max-w-2xl mx-auto mb-8">
            {t('ctaDescription')}
          </p>

          {/* Botones eliminados para hacer el bloque más compacto */}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mt-6">
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Shield className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('confianza')}</h3>
              <p className="text-[10px] text-foreground/70">{t('relacionesTransparentes')}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lightbulb className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('innovacion')}</h3>
              <p className="text-[10px] text-foreground/70">{t('mejoraConstante')}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lock className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('seguridad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('proteccionDatos')}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <TrendingUp className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('crecimiento')}</h3>
              <p className="text-[10px] text-foreground/70">{t('plataformaGlobal')}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Target className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('resultados')}</h3>
              <p className="text-[10px] text-foreground/70">{t('beneficiosTangibles')}</p>
            </div>
            <div className="glass-card p-3 rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5 text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Rocket className="text-[#ec4899] h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black">{t('oportunidad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('futuroProspero')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
