"use client";

import { Shield, Lightbulb, Lock, TrendingUp, Target, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


const CTASection = () => {
  const { language, t } = useLanguage();
  
  const values = [
    { icon: Shield, title: t('confianza'), desc: t('relacionesTransparentes'), color: 'from-blue-400 to-cyan-500' },
    { icon: Lightbulb, title: t('innovacion'), desc: t('mejoraConstante'), color: 'from-yellow-400 to-yellow-500' },
    { icon: Lock, title: t('seguridad'), desc: t('proteccionDatos'), color: 'from-green-400 to-emerald-500' },
    { icon: TrendingUp, title: t('crecimiento'), desc: t('plataformaGlobal'), color: 'from-purple-400 to-fuchsia-500' },
    { icon: Target, title: t('resultados'), desc: 'Resultados comprobados', color: 'from-red-400 to-rose-500' },
    { icon: Rocket, title: t('oportunidad'), desc: t('futuroProspero'), color: 'from-orange-400 to-orange-600' },
  ];

  return (
    <section className="pt-6 pb-24 lg:py-16 relative overflow-hidden bg-[#0A0A0A]">

      <div className="container-custom relative z-10">
        {/* Layout Centrado */}
        <div className="flex justify-center items-start">
          
          {/* Contenido Centrado */}
          <div className="w-full max-w-2xl">
            <div className="mb-6 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
                {language === 'es' ? 'Sobre nosotros' : language === 'en' ? 'About us' : 'Sobre nós'}
              </h3>
              <p className="text-lg md:text-xl text-white/70">
                {language === 'es' ? 'Conocé la visión que impulsa nuestro trabajo' : language === 'en' ? 'Discover the vision that drives our work' : 'Conheça a visão que impulsiona nosso trabalho'}
              </p>
            </div>
            
            <div className="bg-[#121212] p-6 min-h-[28rem] md:min-h-[40rem] rounded-3xl shadow-2xl">
              <p className="text-white/60 text-sm md:text-base mb-6 text-center leading-relaxed">
                {t('ctaDescription')}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                {values.map((value, index) => (
                  <div key={index} className="group">
                    <div className="bg-gradient-to-br from-white to-gray-50 p-5 md:p-6 text-center flex flex-col items-center justify-center rounded-3xl shadow-lg">
                      <div className={`w-10 h-10 bg-gradient-to-br ${value.color} flex items-center justify-center mb-3 rounded-2xl shadow-lg transition-transform duration-300`}>
                        <value.icon className="text-white h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold mb-2 !text-[#101010] transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-xs text-[#101010]/70 leading-relaxed">
                        {value.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-github {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-github {
          animation: pulse-github 10s ease-in-out infinite;
        }

        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CTASection;
