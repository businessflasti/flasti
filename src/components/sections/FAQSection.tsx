'use client';

import React, { useState, memo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Wallet, Key, DollarSign, MapPin, Shield } from 'lucide-react';

const faqs = [
  {
    icon: Wallet,
    question: '¿Cómo y cuándo puedo retirar mis ganancias?',
    answer: 'Una vez activada tu cuenta, podrás solicitar tus retiros de forma inmediata a través de los métodos disponibles en tu panel (PayPal o transferencia bancaria en tu divisa local). Al ser un usuario con Acceso Completo, tus solicitudes se procesan con prioridad, garantizando que recibas tus fondos en menos de 24 horas.',
  },
  {
    icon: Key,
    question: '¿A qué se destina el pago único de activación?',
    answer: 'El pago único se utiliza para habilitar tu Cuenta Profesional y desbloquear todas las microtareas de forma ilimitada. Esto nos permite verificar tu identidad, prevenir cuentas duplicadas y, lo más importante, cubrir los costos de procesamiento que permiten que tus retiros se realicen en menos de 24 horas. Este pago se realiza una sola vez y te otorga acceso de por vida sin suscripciones ni cargos recurrentes.',
  },
  {
    icon: DollarSign,
    question: '¿Cuánto dinero puedo ganar?',
    answer: 'Nuestra plataforma compensa las microtareas completadas con pagos que oscilan entre $0.50 USD y $10 USD. Tú tienes la flexibilidad de elegir la microtarea de tu interés, visualizando tu compensación antes de comenzar. Las actividades incluyen opciones populares como: mirar un video, probar un juego, descargar una aplicación, completar un registro, calificar un producto o servicio, escribir una reseña corta, llenar un formulario, revisar un contenido (texto, imagen o audio) entre muchas otras.',
  },
  {
    icon: MapPin,
    question: '¿Hay microtareas disponibles para mi ubicación?',
    answer: 'Sí, nuestro sistema de geolocalización avanzada ya ha detectado y confirmado tu país para asignarte microtareas específicas para tu región. La plataforma está completamente operativa para ti ahora mismo, lo que te garantiza un flujo constante de oportunidades diarias adaptadas a tu contexto particular.',
  },
  {
    icon: Shield,
    question: '¿Qué cubre la garantía de 7 días?',
    answer: 'Cuentas con una Garantía de Satisfacción de 7 días. Si por alguna razón sientes que la plataforma no es para ti, puedes solicitar el reembolso del 100% de tu dinero. Queremos que pruebes el sistema con riesgo cero: si no estás conforme, te devolvemos tu inversión de activación sin preguntas ni procesos complicados.',
  },
];

function FAQSection() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(0);

  return (
    <div className="w-full py-20 md:py-28 px-4" style={{ backgroundColor: '#202020' }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Título Principal */}
        <h2 className="text-center font-bold leading-[1.1] mb-16 md:mb-20">
          <span className="block text-[2.5rem] sm:text-5xl md:text-5xl text-white">
            Preguntas frecuentes
          </span>
        </h2>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isActive = activeQuestion === index;
            
            return (
              <div 
                key={index} 
                className="overflow-hidden rounded-2xl shadow-sm"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                <button
                  className="w-full py-5 px-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setActiveQuestion(isActive ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#0D50A4' }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span 
                      className="font-semibold text-base sm:text-lg text-white"
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-white">
                    {isActive ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>

                <div
                  className={`px-5 pb-5 transition-all duration-300 ${
                    isActive ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div 
                    className="pt-3 border-t pl-14"
                    style={{ borderColor: '#333' }}
                  >
                    <p 
                      className="text-base leading-relaxed text-gray-400"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default memo(FAQSection);