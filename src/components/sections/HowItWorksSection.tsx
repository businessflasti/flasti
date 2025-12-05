"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <section 
      className="py-24 relative overflow-hidden bg-[#0A0A0A]"
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden'
      }}
    >

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
            {t('comoFunciona')}
          </h2>
          <p className="max-w-2xl mx-auto text-center text-lg md:text-xl text-white/70">
            {t('soloNecesitas')}
          </p>
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
          style={{
            contain: 'layout style',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`relative ${step.number === 1 ? 'cursor-pointer' : ''}`}
              onClick={() => handleCardClick(step.number)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.15,
                ease: "easeOut"
              }}
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
            >
              {/* Tarjeta principal optimizada */}
              <div 
                className="relative bg-[#121212] rounded-3xl overflow-hidden transition-opacity duration-300 shadow-2xl"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                  contain: 'layout style paint'
                }}
              >
                
                {/* Número del paso - Esquina superior izquierda */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-black text-xl shadow-lg">
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
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                </div>

                {/* Contenido */}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 transition-all duration-300">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Badge con glassmorphism */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300">
                      <span>{step.badge}</span>
                      <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-xs">
                        {step.icon}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea conectora con gradiente neón (solo entre tarjetas en desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-0.5 bg-gradient-to-r from-[#6E40FF]/40 to-transparent z-0"></div>
              )}
            </motion.div>
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
