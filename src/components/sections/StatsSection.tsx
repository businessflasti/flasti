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
      className="bg-[#E75333] py-28 px-6"
    >
      <div className="container-custom max-w-[1200px] mb-16 text-center">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex justify-center">
            <div className="bg-[#232323] py-1 px-2 rounded-full shadow-md">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <img src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile1.jpg" alt={t('usuario1')} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <img src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile2.jpg" alt={t('usuario2')} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <img src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile3.jpg" alt={t('usuario3')} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <div
              ref={(el) => { statsRef.current[i] = el; }}
              data-target={stat.number}
              className="text-5xl md:text-6xl font-extrabold mx-auto"
              style={{ color: '#FFFFFF' }}
            >
              {stat.display}
            </div>
            <p className="mt-2 text-base md:text-lg text-center" style={{ color: '#FFFFFF' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
