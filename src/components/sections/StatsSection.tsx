import React, { useEffect, useRef, useState } from 'react';

const StatsSection = () => {
  // Usamos useRef para los divs de los números
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Números objetivo y formato de visualización
  const stats = [
    { number: 24000000, display: '24M+', label: 'Generados por usuarios' },
    { number: 1300000, display: '1.3M+', label: 'Microtrabajos completados' },
    { number: 100000, display: '100K+', label: 'Ya son parte de nuestra comunidad' },
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

  // Animación de los números de 0 al valor objetivo, pero mostrando el formato custom al finalizar
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
          <div className="flex items-center justify-center gap-3">
            {/* Bloque de comunidad: 3 imágenes de usuarios en la misma línea que la etiqueta */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile1.jpg" alt="Usuario 1" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile2.jpg" alt="Usuario 2" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                <img src="/images/profiles/profile3.jpg" alt="Usuario 3" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="bg-[#1a1a1a] text-white text-base md:text-lg px-3 py-1 rounded-xl ml-3">
              Juntos es mejor
            </span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight">
            Ganancia colectiva
          </h2>
          <p className="text-gray-400 mt-4 text-lg md:text-xl">
            Accede a la plataforma y comienza a generar ingresos con flasti
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
        {stats.map((stat, i) => (
          <div key={i}>
            <div
              ref={el => statsRef.current[i] = el}
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
