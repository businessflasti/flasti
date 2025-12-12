"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";


const howItWorksImages = [
  "/images/principal/paso1-web.webp",
  "/images/principal/paso2.webp",
  "/images/principal/paso3.webp"
];

const HowItWorksSection = React.memo(() => {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCardClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      router.push('/register');
    }
  };

  const steps = [
    {
      number: 1,
      title: t('registrateAhora'),
      description: t('registrateDesc'),
      image: howItWorksImages[0],
      color: 'from-yellow-400 to-amber-500',
      badge: 'Registro',
      icon: '✓'
    },
    {
      number: 2,
      title: 'Completa microtareas',
      description: t('microtareasDesc'),
      image: howItWorksImages[1],
      color: 'from-blue-400 to-cyan-500',
      badge: 'Trabajo',
      icon: '✓'
    },
    {
      number: 3,
      title: t('recogeTusRecompensas'),
      description: t('recogeTusRecompensasDesc'),
      image: howItWorksImages[2],
      color: 'from-green-400 to-emerald-500',
      badge: 'Retiro',
      icon: '✓'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#F6F3F3]">

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
            {t('comoFunciona')}
          </h2>
          <p className="max-w-2xl mx-auto text-center text-lg md:text-xl" style={{ color: '#6B7280' }}>
            {t('soloNecesitas')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative ${step.number === 1 ? 'cursor-pointer' : ''}`}
              onClick={() => handleCardClick(step.number)}
            >
              {/* Tarjeta principal optimizada */}
              <div className="relative bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-2xl">
                
                {/* Número del paso - Esquina superior izquierda */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg" style={{ backgroundColor: '#0D50A4', color: '#FFFFFF' }}>
                    {step.number}
                  </div>
                </div>

                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    className="w-full h-full object-contain p-4 transition-transform duration-500" 
                    alt={step.title} 
                    src={step.image}
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 relative z-10" style={{ backgroundColor: '#F3F3F3' }}>
                  <h3 className="text-xl font-bold mb-3 transition-all duration-300" style={{ color: '#111827' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B7280' }}>
                    {step.description}
                  </p>

                  {/* Badge con glassmorphism */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300" style={{ backgroundColor: '#0D50A4', color: '#FFFFFF' }}>
                      <span>{step.badge}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                        {step.icon}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea conectora (solo entre tarjetas en desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-0.5 z-0" style={{ backgroundColor: '#E5E7EB' }}></div>
              )}
            </div>
          ))}
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
});

export default HowItWorksSection;
