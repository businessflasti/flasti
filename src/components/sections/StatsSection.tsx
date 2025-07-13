import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const StatsSection = () => {
  const { t } = useLanguage();
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const stats = [
    { number: 24000000, display: '24M+', label: t('generadosPorUsuarios') },
    { number: 1300000, display: '1.3M+', label: t('microtrabajosCompletados') },
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
      ref={sectionRef}
      className="bg-[#101010] text-white py-20 px-6"
    >
      <div className="container-custom max-w-[1200px] mb-16 text-center">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex justify-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile1.jpg" alt={t('usuario1')} className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile2.jpg" alt={t('usuario2')} className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile3.jpg" alt={t('usuario3')} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight">
            {t('gananciaColectiva')}
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto text-center mt-4 text-base md:text-lg font-normal">
            {(() => {
              const { language } = useLanguage();
              if (language === 'es') return 'Un microtrabajo suma, hacerlo juntos multiplica';
              if (language === 'en') return 'One microtask adds up, doing it together multiplies';
              return 'Uma microtarefa soma, fazer juntos multiplica';
            })()}
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <div
              ref={(el) => { statsRef.current[i] = el; }}
              data-target={stat.number}
              className="text-5xl md:text-6xl font-extrabold text-white mx-auto"
            >
              {stat.display}
            </div>
            <p className="mt-2 text-base md:text-lg text-white/80 text-center">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
