'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartupHeroSection() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  // URLs de imágenes
  const imageWoman = "https://placehold.co/400x500/0A0A0A/ffffff?text=Professional+AI+Concept";
  const imageCat = "https://placehold.co/400x500/0A0A0A/ffffff?text=Digital+Art+Concept";

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Usar scroll event con passive para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular el desplazamiento de parallax (las tarjetas suben cuando scrolleas)
  const parallaxOffset = scrollY * 0.3;

  return (
    <div className="relative w-full min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-start text-white overflow-hidden">
      {/* --- Capa de Fondo (Imagen Hero - Z0) --- */}
      <div 
        className="absolute inset-0"
        style={{ 
          height: '100%',
          backgroundImage: 'url(/images/hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div 
          className="absolute inset-0 bg-black/70"
        ></div>

        {/* Efecto de Brillo Central (Light Flare) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 filter blur-3xl pointer-events-none"></div>
      </div>

      {/* --- Contenido Principal (Título y Subtítulo - Z20) --- */}
      <div className="relative z-20 max-w-4xl mx-auto text-center pt-12 md:pt-16 lg:pt-20 pb-3 px-4">
        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tighter text-gray-100">
          Genera ingresos hoy
          <span className="block sm:inline"> </span>
          {/* Bloque destacado: Texto oscuro sobre fondo claro */}
          <span className="inline-block px-3 py-1 bg-gray-300 text-[#211400] rounded-lg sm:mt-0 transform -rotate-1">
            no mañana
          </span>
        </h1>

        {/* Subtítulo / Descripción */}
        <p className="text-gray-300 max-w-md mx-auto text-base md:text-lg font-light">
          Completa microtareas simples y comienza a generar ingresos con lo que ya sabes hacer.
        </p>
      </div>

      {/* --- Imágenes Decorativas --- */}
      <div className="relative z-30 w-full flex justify-center items-end mt-12 md:mt-16 lg:mt-20">
        {/* Imagen de la mujer (Izquierda - Z30) */}
        <div 
          className="absolute left-0 md:left-12 lg:left-20 bottom-8 md:bottom-12 lg:bottom-16 w-48 h-60 md:w-64 md:h-80 lg:w-80 lg:h-[420px] hidden md:block z-30"
          style={{ 
            transform: `translate3d(0, -${parallaxOffset}px, 0) rotate(-6deg)`,
            willChange: 'transform'
          }}
        >
          <div className="p-2 bg-[#1a1a1a] rounded-[32px] shadow-2xl">
            <img
              src={imageWoman}
              alt="Usuario Flasti"
              className="w-full h-full object-cover rounded-[24px]"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/400x500/181818/ffffff?text=Usuario";
              }}
            />
          </div>
        </div>

        {/* Tablet/Interfaz Central (Z40) */}
        <div className="relative w-[85%] md:w-[75%] max-w-3xl z-40">
          <div className="p-2 bg-[#1a1a1a] rounded-[32px] shadow-2xl">
            {/* Pantalla (Contenido simulado del dashboard) */}
            <div className="p-4 bg-[#0A0A0A] rounded-[24px]">
              <div className="h-[200px] md:h-[240px] flex items-center justify-center text-center bg-[#181818] rounded-lg px-4">
                <span className="text-center">
                  <span className="text-lg md:text-xl font-semibold block mb-2">Completa microtareas y gana</span>
                  <small className="font-light text-xs md:text-sm text-gray-400 block">
                    Plataforma unificada para generar ingresos online.
                  </small>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Imagen del gato (Derecha - Z30) */}
        <div 
          className="absolute right-0 md:right-12 lg:right-20 bottom-8 md:bottom-12 lg:bottom-16 w-48 h-60 md:w-64 md:h-80 lg:w-80 lg:h-[420px] hidden md:block z-30"
          style={{ 
            transform: `translate3d(0, -${parallaxOffset}px, 0) rotate(6deg)`,
            willChange: 'transform'
          }}
        >
          <div className="p-2 bg-[#1a1a1a] rounded-[32px] shadow-2xl">
            <img
              src={imageCat}
              alt="Usuario Flasti"
              className="w-full h-full object-cover rounded-[24px]"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/400x500/181818/ffffff?text=Usuario";
              }}
            />
          </div>
        </div>
      </div>

      {/* Degradado final oscuro */}
      <div 
        className="absolute bottom-0 w-full h-48 pointer-events-none" 
        style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 100%)' }}
      ></div>
    </div>
  );
}
