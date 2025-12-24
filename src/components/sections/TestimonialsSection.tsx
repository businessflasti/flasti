'use client';

import React, { memo, useMemo } from 'react';
import Image from 'next/image';

const testimonialsRow1 = [
  {
    stars: 5,
    text: 'Probe mil apps y esta es la única que me cumplió. Acá ando haciendo un buen extra desde el celu mientras viajo en el bus. Una masa.',
    name: 'Mateo Martínez',
    avatar: '/images/testimonials/profi6.jpg',
  },
  {
    stars: 5,
    text: 'Excelente servicio, ya logré mi primer retiro en casi 3 horas!! Me cuesta ocultar la emoción, estoy muy feliz! Fue fácil y rápido registrarse y las tareas son fáciles de completar, muchísimas gracias!',
    name: 'Juan Rodríguez',
    avatar: '/images/testimonials/profi1.jpg',
  },
  {
    stars: 5,
    text: 'No tenes q esperar mil años para cobrar, hago las tareas, sumo y retiro. Vale l pena la inversion, es la q va si necesitas el dinero rapido, pague una vez y ya retire 4 veces con esta!',
    name: 'Cristian Sánchez',
    avatar: '/images/testimonials/profi8.png',
  },
  {
    stars: 5,
    text: 'Es 100% real. Llevo un par de semanas haciendo microtareas y ya cobré varias veces. La verdad estoy muy contenta porque siempre resuelven mis dudas rápido y con mucha amabilidad. Hasta convencí a mi esposo para que lo intente y los resultados han sido mejores de lo que esperábamos. Gracias',
    name: 'Ana González',
    avatar: '/images/testimonials/profi2.jpg',
  },
  {
    stars: 5,
    text: 'Ya hize dos rretiros a mi cuenta y todo de diez.',
    name: 'Diego Ramírez',
    avatar: '/images/testimonials/profi9.png',
  },
];

const testimonialsRow2 = [
  {
    stars: 5,
    text: 'Recien empiezo y ya desbloquie mis tareas, me encanta, pasé meses buscando algo así.',
    name: 'Santiago Hernández',
    avatar: '/images/testimonials/profi4.jpg',
  },
  {
    stars: 5,
    text: 'No pense que esto funcionara tan bien, recupere mi inversion el mismo dia y hasta gane un extra, puedo decir con total honestidad que nunca imagine que haciendo esto podia ganar dinero por internet, es un alivio saber que aun es posible tener un trabajo digno a pesar de la situacion economica dificil que estamos pasando en el pais, la pagina es confiable y segura, la recomiendo totalmente',
    name: 'Luis López',
    avatar: '/images/testimonials/profi3.jpg',
  },
  {
    stars: 5,
    text: 'Es re practicaa! las actividades se hacen volando y aparecen nuevas todos los días.. una joyita la verdad me ayuda con la platita 💎💎 Mándense de una 🙌',
    name: 'Valentina Flores',
    avatar: '/images/testimonials/profi10.jpg',
  },
  {
    stars: 5,
    text: 'Hice un par de microtareas, pedi el retiro y me llego en el dia, sin vueltas, hacia falta algo como esto que de verdad te deje trabajar y retirar',
    name: 'Ricardo Pérez',
    avatar: '/images/testimonials/profi5.png',
  },
  {
    stars: 5,
    text: 'Pude sacar mi primera plata por internet las tareas son re simples y la plata me llego al toque re recomendadooo',
    name: 'Facundo García',
    avatar: '/images/testimonials/profi7.png',
  },
];

// Memoizado para evitar re-renders innecesarios
const TestimonialCard = memo(({ testimonial }: { testimonial: typeof testimonialsRow1[0] }) => (
  <div 
    className="flex-shrink-0 w-[320px] sm:w-[380px] p-6 rounded-2xl mx-3"
    style={{ backgroundColor: '#1A1A1A' }}
  >
    {/* Estrellas - siempre 5 */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className="text-xl"
          style={{ color: '#FBBF24' }}
        >
          ★
        </span>
      ))}
    </div>
    
    {/* Texto */}
    <p className="text-base sm:text-lg leading-relaxed mb-6 text-white">
      {testimonial.text}
    </p>
    
    {/* Usuario */}
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image 
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-semibold text-white">{testimonial.name}</p>
      </div>
    </div>
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

function TestimonialsSection() {
  // Memoizar arrays duplicados para evitar recrearlos en cada render
  const row1Cards = useMemo(() => 
    [...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1], 
    []
  );
  
  const row2Cards = useMemo(() => 
    [...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2], 
    []
  );

  return (
    <div className="w-full py-20 md:py-28 overflow-hidden px-4" style={{ backgroundColor: '#202020' }}>
      
      {/* Título Principal */}
      <h2 className="text-center font-bold leading-[1.1] mb-16 md:mb-20">
        <span className="block text-[2.5rem] sm:text-5xl md:text-5xl text-white">
          Resultados de
        </span>
        <span className="inline-block text-[2.5rem] sm:text-5xl md:text-5xl mt-2 text-white">
          nuestra comunidad
        </span>
      </h2>
      
      {/* Fila 1 - Movimiento hacia la derecha */}
      <div className="relative mb-6">
        <div 
          className="flex animate-scroll-right gpu-layer"
          style={{ width: 'max-content' }}
        >
          {row1Cards.map((testimonial, index) => (
            <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Fila 2 - Movimiento hacia la izquierda */}
      <div className="relative">
        <div 
          className="flex animate-scroll-left gpu-layer"
          style={{ width: 'max-content' }}
        >
          {row2Cards.map((testimonial, index) => (
            <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Estilos de animación optimizados para GPU */}
      <style jsx>{`
        .gpu-layer {
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        @keyframes scroll-right {
          0% {
            transform: translate3d(-33.33%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        
        @keyframes scroll-left {
          0% {
            transform: translate3d(0%, 0, 0);
          }
          100% {
            transform: translate3d(-33.33%, 0, 0);
          }
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default memo(TestimonialsSection);
