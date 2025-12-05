import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';

const StatsSection = () => {
  const { t } = useLanguage();
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const placeholders = [
    "Una microtarea suma, hacerla juntos multiplica",
    "Generá ingresos con lo que ya sabés hacer",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const stats = [
    { number: 24000000, display: '$24M+', label: t('generadosPorUsuarios') },
    { number: 1300000, display: '1.3M+', label: t('microtareasCompletadas') },
    { number: 100000, display: '100K+', label: t('personasFormanParte') },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateNumbers();
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    stats.forEach((stat, i) => {
      const el = statsRef.current[i];
      if (!el) return;
      let count = 0;
      const target = stat.number;
      const speed = 150;
      const increment = target / speed;
      const updateCount = () => {
        if (count < target) {
          count += increment;
          el.innerText = Math.ceil(count).toLocaleString();
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = stat.display;
        }
      };
      updateCount();
    });
  };

  return (
    <section
      id="stats-section"
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-[#0A0A0A]"></div>

      <div className="container-custom max-w-[1200px] mb-16 text-center relative z-10">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#FAD74A] to-[#f5c71a] py-1 px-2 rounded-full border border-yellow-500/40">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-yellow-600/60">
                  <img src="/images/principal/profile1.jpg" alt={t('usuario1')} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-yellow-600/60">
                  <img src="/images/principal/profile2.jpg" alt={t('usuario2')} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-yellow-600/60">
                  <img src="/images/principal/profile3.jpg" alt={t('usuario3')} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-2">
            Regístrate y comienza ahora
          </h2>
          <div className="mt-8 max-w-2xl mx-auto">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center relative z-10">
        {stats.map((stat, i) => {
          
          return (
            <div 
              key={i}
              className="relative"
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
            >
              {/* Tarjeta optimizada */}
              <div 
                className="relative bg-[#121212] rounded-3xl p-8 transition-opacity duration-300 overflow-hidden"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transform: 'translate3d(0, 0, 0)',
                  contain: 'layout style paint'
                }}
              >
                {/* Contenido */}
                <div className="relative z-10">
                  <div
                    ref={(el) => { statsRef.current[i] = el; }}
                    data-target={stat.number}
                    className="text-5xl md:text-6xl font-extrabold mx-auto text-white"
                  >
                    {stat.display}
                  </div>
                  <p className="mt-4 text-base md:text-lg text-white/80 font-medium tracking-wide">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes text-shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .animate-text-shine {
          background: linear-gradient(90deg, #ffffff 0%, #6E40FF 25%, #2DE2E6 50%, #1E90FF 75%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shine 4s linear infinite;
        }

        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
