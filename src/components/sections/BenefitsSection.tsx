'use client';

import React, { memo } from 'react';

const benefits = [
  {
    icon: (
      <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
      </svg>
    ),
    title: 'Acceso ilimitado',
    description: 'Elimina las pausas. Olvida el mensaje de "no hay microtareas disponibles". Como miembro exclusivo, tienes prioridad absoluta en la plataforma, garantizándote un flujo constante de trabajo los 7 días de la semana.',
  },
  {
    icon: (
      <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    ),
    title: 'Microtareas de nivel superior',
    description: 'Desbloquea microtareas exclusivas con valores mucho más altos. Realiza las mismas actividades que ya conoces, pero con una compensación superior en cada una.',
  },
  {
    icon: (
      <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
    title: 'Retiros prioritarios',
    description: 'No esperes para disfrutar de tu trabajo. Olvida los periodos de espera. Tú liberas la función de Retiro Inmediato. Envía tus fondos a tu cuenta en el momento que quieras, sin demoras.',
  },
  {
    icon: (
      <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    title: 'Soporte 24/7',
    description: 'No estás solo en el proceso. Cuentas con un canal de atención exclusiva para resolver cualquier duda o sugerencia. Nuestro equipo técnico prioriza tus mensajes para que nunca dejes de generar ingresos.',
  },
];

function BenefitsSection() {
  return (
    <div className="w-full py-20 md:py-28 px-4" style={{ backgroundColor: '#202020' }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Título Principal */}
        <h2 className="text-center font-bold leading-[1.1] mb-16 md:mb-20">
          <span className="inline-block text-[2.5rem] sm:text-5xl md:text-5xl text-white">
            Ventajas exclusivas
          </span>
        </h2>
        
        {/* Lista de beneficios */}
        <div className="space-y-12 md:space-y-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-5 md:gap-6">
              {/* Icono */}
              <div 
                className="flex-shrink-0 mt-1"
                style={{ color: '#0D50A4' }}
              >
                {benefit.icon}
              </div>
              
              {/* Contenido */}
              <div>
                <h3 
                  className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 text-white"
                >
                  {benefit.title}
                </h3>
                <p 
                  className="text-base sm:text-lg leading-relaxed text-gray-400"
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default memo(BenefitsSection);