"use client";

import { Shield, Lightbulb, Lock, TrendingUp, Target, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { language, t } = useLanguage();
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Overlays decorativos ELIMINADOS */}
      <div className="container-custom relative z-10">
        <div className="bg-[#232323] border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-white font-outfit">
            {language === 'es' && (
              <>Sobre nosotros</>
            )}
            {language === 'en' && (
              <>About us</>
            )}
            {language === 'pt-br' && (
              <>Sobre nós</>
            )}
          </h2>

          <p className="text-foreground/70 text-sm max-w-2xl mx-auto mb-8">
            {t('ctaDescription')}
          </p>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto mt-6">
            {/* Tarjeta 1 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Shield className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('confianza')}</h3>
              <p className="text-[10px] text-foreground/70">{t('relacionesTransparentes')}</p>
            </div>
            {/* Tarjeta 2 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lightbulb className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('innovacion')}</h3>
              <p className="text-[10px] text-foreground/70">{t('mejoraConstante')}</p>
            </div>
            {/* Tarjeta 3 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Lock className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('seguridad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('proteccionDatos')}</p>
            </div>
            {/* Tarjeta 4 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <TrendingUp className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('crecimiento')}</h3>
              <p className="text-[10px] text-foreground/70">{t('plataformaGlobal')}</p>
            </div>
            {/* Tarjeta 5 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Target className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('resultados')}</h3>
              <p className="text-[10px] text-foreground/70">{t('beneficiosTangibles')}</p>
            </div>
            {/* Tarjeta 6 */}
            <div className="bg-[#101010] p-3 rounded-xl border border-white/10 text-center">
              <div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mx-auto mb-2 border border-white/10">
                <Rocket className="text-white h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold mb-1 text-white font-outfit">{t('oportunidad')}</h3>
              <p className="text-[10px] text-foreground/70">{t('futuroProspero')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
