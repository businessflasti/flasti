"use client";

import { Shield, Lightbulb, Lock, TrendingUp, Target, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CTANewsBentoGrid } from "@/components/ui/cta-news-bento-grid";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const CTASection = () => {
  const { language, t } = useLanguage();
  return (
    <section className="pt-12 pb-24 lg:py-16 relative">
      {/* Fondo de gradiente animado extendido que se extiende más allá de la sección */}
      <div 
        className="absolute pointer-events-none will-change-transform" 
        style={{ 
          top: '-40vh', 
          left: '-25vw', 
          right: '-25vw', 
          bottom: '-40vh',
          zIndex: 1,
          transform: 'translateZ(0)' // Hardware acceleration
        }}
      >
        <BackgroundGradientAnimation
          gradientBackgroundStart="transparent"
          gradientBackgroundEnd="transparent"
          firstColor="60, 102, 205"
          secondColor="234, 64, 133"
          thirdColor="60, 102, 205"
          size="60%"
          blendingValue="multiply"
          interactive={false}
          containerClassName="w-full h-full will-change-transform"
          className="opacity-18"
        />
        {/* Máscara de desvanecimiento para ocultar el corte superior */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #101010 0%, transparent 15%, transparent 85%, #101010 100%)',
            zIndex: 1
          }}
        />
      </div>
      <div className="container-custom relative z-30">
        {/* Layout Desktop: Izquierda + Derecha | Móvil: Arriba + Abajo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-start">
          
          {/* Lado Izquierdo - Contenido Actual */}
          <div className="w-full">
            <div className="mb-6 text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {language === 'es' ? 'Sobre nosotros' : language === 'en' ? 'About us' : 'Sobre nós'}
              </h3>
              <p className="text-foreground/70 text-lg md:text-xl">
                {language === 'es' ? 'Conocé la visión que impulsa nuestro trabajo' : language === 'en' ? 'Discover the vision that drives our work' : 'Conheça a visão que impulsiona nosso trabalho'}
              </p>
            </div>
            <div className="bg-[#232323] p-6 min-h-[28rem] md:min-h-[40rem] rounded-3xl">
              <p className="text-foreground/70 text-sm md:text-base mb-6 text-center lg:text-left leading-relaxed">
                {t('ctaDescription')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto h-full flex-1">
                {/* Tarjeta 1 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <Shield className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('confianza')}</h3>
                  <p className="text-xs text-[#101010]/70 leading-relaxed">{t('relacionesTransparentes')}</p>
                </div>
                
                {/* Tarjeta 2 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <Lightbulb className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('innovacion')}</h3>
                  <p className="text-xs text-[#101010]/70">{t('mejoraConstante')}</p>
                </div>
                
                {/* Tarjeta 3 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <Lock className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('seguridad')}</h3>
                  <p className="text-xs text-[#101010]/70">{t('proteccionDatos')}</p>
                </div>
                
                {/* Tarjeta 4 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <TrendingUp className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('crecimiento')}</h3>
                  <p className="text-xs text-[#101010]/70">{t('plataformaGlobal')}</p>
                </div>
                
                {/* Tarjeta 5 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <Target className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('resultados')}</h3>
                  <p className="text-xs text-[#101010]/70">Resultados comprobados</p>
                </div>
                
                {/* Tarjeta 6 */}
                <div className="bg-white p-5 md:p-6 text-center lg:text-left flex flex-col items-center lg:items-start justify-center rounded-3xl">
                  <div className="w-10 h-10 bg-[#232323] flex items-center justify-center lg:mx-0 mb-3 rounded-3xl">
                    <Rocket className="text-white h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 !text-[#101010] font-outfit" style={{color: '#101010'}}>{t('oportunidad')}</h3>
                  <p className="text-xs text-[#101010]/70">{t('futuroProspero')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho - Grid de Novedades */}
          <div className="w-full">
            <div className="mt-20 md:mt-0 mb-6 text-center lg:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {language === 'es' ? 'Últimas Novedades' : language === 'en' ? 'Latest News' : 'Últimas Novidades'}
              </h3>
              <p className="text-foreground/70 text-lg md:text-xl">
                {language === 'es' ? 'Mantente al día con las últimas actualizaciones' : 
                 language === 'en' ? 'Stay up to date with the latest updates' : 
                 'Mantenha-se atualizado com as últimas atualizações'}
              </p>
            </div>
            <CTANewsBentoGrid />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
