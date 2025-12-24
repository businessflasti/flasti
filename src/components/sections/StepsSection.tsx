'use client';

import React, { memo } from 'react';
import Image from 'next/image';

const steps = [
  {
    number: '1',
    title: 'Validación de identidad',
    descriptionType: 'step1',
    badgeType: 'completed',
    videoSrc: '/video/paso1.mp4',
  },
  {
    number: '2',
    title: 'Activa tu Acceso Completo',
    descriptionType: 'step2',
    badgeType: 'action',
    videoSrc: '/video/paso2.mp4',
  },
  {
    number: '3',
    title: 'Continúa generando ingresos',
    descriptionType: 'step3',
    badgeType: 'locked',
    videoSrc: '/video/paso3.mp4',
  },
];

function StepsSection() {
  return (
    <div className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#202020' }}>
      {/* Título Principal */}
      <h2 className="text-center font-bold leading-[1.1] mb-16 md:mb-20">
        <span className="inline-block text-[2.5rem] sm:text-5xl md:text-5xl text-white">
          ¿Qué sigue ahora?
        </span>
      </h2>
      
      {/* Pasos */}
      <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            
            return (
              <div 
                key={step.number} 
                className={`flex flex-col md:flex-row md:items-center md:justify-between md:gap-12 lg:gap-20 ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Contenido de texto */}
                <div className="flex-1">
                  {/* Número grande */}
                  <span 
                    className="text-7xl sm:text-8xl md:text-9xl font-bold mb-4 md:mb-6 block"
                    style={{ color: '#0D50A4' }}
                  >
                    {step.number}
                  </span>
                  
                  {/* Título */}
                  <h3 
                    className="font-bold mb-4 text-2xl sm:text-3xl md:text-3xl text-white"
                  >
                    {step.title}
                  </h3>
                  
                  {/* Descripción */}
                  <p 
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{ color: '#6B7280' }}
                  >
                    {step.descriptionType === 'step1' && 'Has completado 3 microtareas con éxito y tu saldo ha sido acreditado correctamente. Tu cuenta ha demostrado actividad legítima.'}
                    {step.descriptionType === 'step2' && 'El sistema desbloqueará instantáneamente todas las microtareas de forma ilimitada y la función de retiros inmediatos.'}
                    {step.descriptionType === 'step3' && '¡Todo listo! Continúa generando ingresos de forma ilimitada completando microtareas sin restricciones, y transfiere tus fondos a tu cuenta.'}
                  </p>

                  {/* Badge gamificado - Completado */}
                  {step.badgeType === 'completed' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 animate-pulse">
                      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-400 font-semibold text-sm">Estado: Completado</span>
                    </div>
                  )}

                  {/* Badge gamificado - Acción requerida */}
                  {step.badgeType === 'action' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 animate-pulse">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-amber-400 font-semibold text-sm">Estado: Acción requerida</span>
                    </div>
                  )}

                  {/* Badge gamificado - Bloqueado */}
                  {step.badgeType === 'locked' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/20">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400 font-semibold text-sm">Estado: Bloqueado hasta completar paso 2</span>
                    </div>
                  )}
                </div>

                {/* Video del paso */}
                <div className="mt-10 md:mt-0 w-full md:w-[500px] lg:w-[550px] flex-shrink-0">
                  <div 
                    className="rounded-3xl p-1.5 sm:p-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                      border: '1px solid #2B2B2B'
                    }}
                  >
                    <div 
                      className="rounded-2xl overflow-hidden"
                      style={{ backgroundColor: '#1A1A1A' }}
                    >
                      <video
                        src={step.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-auto min-h-[200px] sm:min-h-[280px] md:min-h-[300px] object-cover"
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  </div>
                  
                  {/* Badge de métodos de retiro - Solo para paso 3 */}
                  {step.badgeType === 'locked' && (
                    <div className="mt-5 flex justify-center">
                      <div 
                        className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                        style={{ 
                          backgroundColor: '#ffffff',
                          border: '1px solid #2B2B2B'
                        }}
                      >
                        <Image 
                          src="/images/paypal.webp" 
                          alt="PayPal" 
                          width={100} 
                          height={32}
                          className="h-8 w-auto"
                        />
                        <div className="w-px h-6 bg-gray-300"></div>
                        <Image 
                          src="/images/TB.webp" 
                          alt="Transferencia Bancaria" 
                          width={100} 
                          height={32}
                          className="h-8 w-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
}


export default memo(StepsSection);