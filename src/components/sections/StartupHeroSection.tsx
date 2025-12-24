'use client';

import React, { useEffect, useState, memo, useRef } from 'react';

function StartupHeroSection() {
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Parallax fluido con RAF continuo
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = window.requestAnimationFrame(() => {
          setParallaxOffset(window.scrollY * 0.3);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-4" style={{ backgroundColor: '#202020' }}>
      
      {/* Título Principal */}
      <h1 className="text-center font-bold leading-[1.1] mb-12">
        <span className="block text-[2.5rem] sm:text-5xl md:text-6xl text-white">
          ¡Felicitaciones!
        </span>
        <span className="block text-[2.5rem] sm:text-5xl md:text-6xl mt-2 text-white">
          Ya ha completado
        </span>
        <span className="inline-block text-[2.5rem] sm:text-5xl md:text-6xl mt-1 text-white">
          3 microtareas.
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-center text-base md:text-lg max-w-md mx-auto mb-10" style={{ color: '#6B7280' }}>
        Su panel tiene más microtareas disponibles para usted el dia de hoy. Complete la activación para continuar generando ingresos de forma ilimitada
      </p>

      {/* Tarjetas */}
      <div className="relative w-full flex justify-center items-center h-[280px] md:h-[400px] lg:h-[450px]">
        {/* Tarjeta Izquierda */}
        <div 
          className="absolute w-[30%] max-w-[140px] md:max-w-[200px] lg:max-w-[240px] aspect-[4/5] z-10"
          style={{ 
            left: '10%',
            transform: `translate3d(0, -${parallaxOffset}px, 0) rotate(-8deg)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="p-1 rounded-2xl shadow-xl h-full border border-gray-700 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <img
              src="/images/tareas/completed1.webp"
              alt="Tarea completada"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Tarjeta Central */}
        <div className="relative w-[45%] max-w-[200px] md:max-w-[280px] lg:max-w-[320px] z-20">
          <div className="p-1 rounded-2xl shadow-xl border border-gray-700 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <img
              src="/images/tareas/bloqueada.webp"
              alt="Tarea bloqueada"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Tarjeta Derecha */}
        <div 
          className="absolute w-[30%] max-w-[140px] md:max-w-[200px] lg:max-w-[240px] aspect-[4/5] z-10"
          style={{ 
            right: '10%',
            transform: `translate3d(0, -${parallaxOffset}px, 0) rotate(8deg)`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="p-1 rounded-2xl shadow-xl h-full border border-gray-700 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <img
              src="/images/tareas/completed2.webp"
              alt="Tarea completada"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(StartupHeroSection);
