"use client";

import { Shield, Lightbulb, Lock, TrendingUp, Target, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { language, t } = useLanguage();
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Overlays decorativos ELIMINADOS */}
      {/* <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[160px] bg-[#facc15]/10 blur-3xl rounded-full z-0"></div>
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 w-[180px] h-[90px] bg-[#d4386c]/20 blur-2xl rounded-full z-0"></div>
      <div className="absolute top-1/2 right-1/4 w-[140px] h-[70px] bg-[#ec4899]/20 blur-2xl rounded-full z-0"></div> */}

      <div className="container-custom relative z-10">
        <div className="bg-card/30 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white dark:text-white light:text-black title-google-sans">
            {language === 'es' && (
              <>
                Conoce a <span className="text-white dark:text-white light:text-black">flasti</span>
              </>
            )}
            {language === 'en' && (
              <>
                Meet <span className="text-white dark:text-white light:text-black">flasti</span>
              </>
            )}
            {language === 'pt-br' && (
              <>
                Conheça a <span className="text-white dark:text-white light:text-black">flasti</span>
              </>
            )}
          </h2>

          <p className="text-foreground/70 text-sm max-w-2xl mx-auto mb-8">
            {t('ctaDescription')}
          </p>

          {/* Botones eliminados para hacer el bloque más compacto */}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mt-6">
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Shield className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('confianza')}</h3>
              <p className="text-[10px] text-foreground/70">{t('relacionesTransparentes')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lightbulb className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('innovacion')}</h3>
              <p className="text-[10px] text-foreground/70">{t('mejoraConstante')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lock className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('seguridad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('proteccionDatos')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <TrendingUp className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('crecimiento')}</h3>
              <p className="text-[10px] text-foreground/70">{t('plataformaGlobal')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Target className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('resultados')}</h3>
              <p className="text-[10px] text-foreground/70">{t('beneficiosTangibles')}</p>
            </div>
            <div className="bg-card/30 backdrop-blur-md shadow-xl p-3 rounded-xl border border-white/10 hover:border-[#3c66ce]/30 transition-all hover:shadow-lg hover:shadow-[#3c66ce]/5 text-center group">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Rocket className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white dark:text-white light:text-black title-google-sans title-hover-gradient">{t('oportunidad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('futuroProspero')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
