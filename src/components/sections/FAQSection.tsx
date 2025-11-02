"use client";

import { useState, useEffect } from "react";
import AdBlock from "@/components/ui/AdBlock";
import { ChevronDown, ChevronUp, Heart, Zap, Rocket, Award, Star, Gift, Sparkles, Key, Coins, ShieldCheck } from "lucide-react";
import { optimizeFAQs } from "@/utils/faq-optimizer";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
  inversionAnswerUSD_EN,
  inversionAnswerUSD_PT,
  inversionAnswerARS_EN,
  inversionAnswerARS_PT
} from "./FAQSectionTranslations";
import React from "react";

// Definir las respuestas para la pregunta de inversión
const inversionAnswerUSD = "Hemos diseñado diferentes planes para adaptarnos a distintas necesidades y presupuestos. Nuestra opción más accesible comienza en un único pago de $3.90 USD (el equivalente en tu moneda local se mostrará al finalizar el pago), una inversión que muchos de nuestros usuarios recuperan en su primera semana de uso.\n\n⚡ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO!\n\nSolo $3.90 USD en lugar de $19.50 USD (80% OFF)\n\n💥 ¡Paga una sola vez y accede a Flasti de por vida usando PayPal o tu moneda local! 💥\n\n🚨 EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE $19.50 USD EN CUALQUIER MOMENTO\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n💡 Recuerda: Este precio tiene un 80% de descuento y es solo por tiempo limitado. ¡Estás ahorrando $15.60 USD por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const inversionAnswerARS = "Hemos diseñado diferentes planes para adaptarnos a distintas necesidades y presupuestos. Nuestra opción más accesible comienza en un único pago de AR$ 1.000, una inversión que muchos de nuestros usuarios recuperan en su primera semana de uso.\n\n⚡ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO!\n\nSolo AR$ 1.000 en lugar de AR$ 5.000 (80% OFF)\n\n💥 ¡Paga una sola vez y accede a Flasti de por vida usando Mercado Pago o PayPal! 💥\n\n🚨 EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE AR$ 5.000 EN CUALQUIER MOMENTO\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n💡 Recuerda: Este precio tiene un 80% de descuento y es solo por tiempo limitado. ¡Estás ahorrando AR$ 4.000 por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const faqs = [
  {
    icon: <Heart className="h-5 w-5" />,
    question: "¿Por qué debería unirme a Flasti?",
    answer: "Flasti te ofrece una plataforma única que combina inteligencia artificial con microtareas, permitiéndote generar ingresos desde cualquier lugar. Nuestra tecnología simplifica tareas complejas, maximizando tus ganancias con menos esfuerzo y tiempo invertido."
  },
  {
    icon: <Zap className="h-5 w-5" />,
    question: "¿Qué son las microtareas en línea?",
    answer: "Las microtareas son tareas digitales sencillas y rápidas que puedes completar desde tu dispositivo. En Flasti, utilizamos IA para automatizar gran parte del proceso, permitiéndote completar más tareas en menos tiempo y aumentar tus ingresos significativamente."
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    question: "¿Cómo puedo empezar?",
    answer: "Comenzar es muy sencillo: regístrate en nuestra plataforma, completa tu perfil, selecciona el plan que mejor se adapte a tus necesidades, y comienza a realizar microtareas asistidas por IA. Nuestro sistema te guiará paso a paso desde el primer momento."
  },
  {
    icon: <Award className="h-5 w-5" />,
    question: "¿Cuánto dinero puedo ganar?",
    answer: "Tus ganancias dependerán del tiempo que dediques y tu nivel de compromiso. Nuestros usuarios más activos reportan ingresos de entre $30,000 y $50,000 pesos mensuales. La ventaja de Flasti es que la IA te permite multiplicar tu productividad, aumentando significativamente tu potencial de ingresos."
  },
  {
    icon: <Star className="h-5 w-5" />,
    question: "¿Necesito experiencia previa para empezar?",
    answer: "¡Absolutamente no! Flasti está diseñado para ser accesible para todos, independientemente de tu experiencia técnica. Nuestra plataforma intuitiva y nuestros tutoriales detallados te guiarán en cada paso del camino. La IA hace el trabajo pesado por ti."
  },
  {
    icon: <Gift className="h-5 w-5" />,
    question: "¿Qué beneficios adicionales recibo al unirme?",
    answer: "Además de la plataforma, recibirás acceso a nuestra comunidad exclusiva, tutoriales avanzados, soporte personalizado, actualizaciones constantes de nuevas funcionalidades de IA, y la posibilidad de participar en nuestro programa de referidos para aumentar aún más tus ingresos."
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    question: "¿Es un único pago de por vida?",
    answer: "Sí, ofrecemos planes con un único pago que te da acceso de por vida a la plataforma. Esto incluye todas las actualizaciones futuras y nuevas funcionalidades que vayamos implementando, sin costos adicionales ni suscripciones mensuales."
  },
  {
    icon: <Key className="h-5 w-5" />,
    question: "¿Por cuánto tiempo tendré acceso a Flasti?",
    answer: "Una vez que adquieres tu membresía, tendrás acceso de por vida a la plataforma. Esto significa que podrás seguir generando ingresos indefinidamente, aprovechando todas las mejoras y nuevas funcionalidades que implementemos en el futuro."
  },
  {
    icon: <Coins className="h-5 w-5" />,
    question: "¿Cuál es la inversión para acceder a Flasti?",
    // La respuesta se establecerá dinámicamente según el país del usuario
    answer: inversionAnswerUSD
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    question: "¿Cuánto tiempo tengo de garantía para mi dinero?",
    answer: "Ofrecemos una garantía de satisfacción de 30 días. Si por alguna razón no estás satisfecho con la plataforma durante este período, te reembolsaremos el 100% de tu inversión, sin preguntas ni complicaciones."
  }
];

// Add a pulse animation
const pulseAnimation = `
  @keyframes gentle-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t, language } = useLanguage();
  const [isArgentina, setIsArgentina] = useState(false);

  // Detectar si el usuario es de Argentina
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Intentar obtener la ubicación del usuario desde localStorage primero
        const savedCountry = localStorage.getItem('userCountry');
        if (savedCountry) {
          setIsArgentina(savedCountry === 'AR');
          return;
        }

        // Si no hay información en localStorage, intentar detectar por IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const isAR = data.country_code === 'AR';

        // Guardar el resultado en localStorage para futuras visitas
        localStorage.setItem('userCountry', isAR ? 'AR' : 'OTHER');
        setIsArgentina(isAR);
      } catch (error) {
        console.error('Error al detectar país:', error);
        // En caso de error, asumir que no es de Argentina
        setIsArgentina(false);
      }
    };

    if (typeof window !== 'undefined') {
      detectCountry();
    }
  }, []);

  // Optimizar las FAQs para que abran/cierren más rápido
  useEffect(() => {
    // Aplicar optimización después de que el componente se monte
    optimizeFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    // Cerrar todas las preguntas antes de abrir la nueva
    setOpenIndex((prevIndex) => {
      if (index === prevIndex) {
        return null;  // Si hacemos clic en la misma pregunta, la cerramos
      } else {
        return index; // Abrir la nueva pregunta y cerrar cualquier otra
      }
    });
  };

  return (
    <section 
      className="py-24 relative overflow-hidden bg-[#101010]"
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden'
      }}
    >
      <style jsx global>{pulseAnimation}</style>
      {/* Forzar borde azul en hover de acordeones FAQ */}
      <style jsx global>{`
        .glass-card {
          border: none !important;
          border-width: 0 !important;
          outline: none !important;
        }
        .glass-card:hover, .glass-card:focus, .glass-card.active, .glass-card.open {
          border: none !important;
          border-width: 0 !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs text-primary uppercase tracking-wider font-medium mb-2 inline-block">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">{t('todoLoQueNecesitasSaber')}</h2>
          <TextGenerateEffect 
            words={t('faqSubtitle')}
            className="text-foreground/70 max-w-2xl mx-auto text-lg md:text-xl"
          />
        </div>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          style={{
            contain: 'layout style',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden relative rounded-3xl transition-opacity duration-300 bg-[#0A0A0A] border-none !border-0"
              style={{
                transform: 'translate3d(0, 0, 0)',
                contain: 'layout style paint'
              }}
            >
              <button
                className="w-full p-6 flex items-center justify-between text-left"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 transition-opacity duration-300" style={{ animation: openIndex === index ? 'gentle-pulse 2s infinite' : 'none' }}>
                    <div className="text-[#101010] transition-opacity duration-300">{faq.icon && React.cloneElement(faq.icon, { color: '#101010' })}</div>
                  </div>
                  <span className="font-medium transition-opacity duration-200">{faq.question}</span>
                </div>
                <div className="text-primary">
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div
                className={`px-6 pb-6 pt-0 text-foreground/70 text-sm transition-all ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
                data-faq-content="true"
              >
                <div className="pt-2">
                  {index === 8 ? (
                    isArgentina ? (
                      language === 'en' ? inversionAnswerARS_EN :
                      language === 'pt-br' ? inversionAnswerARS_PT :
                      inversionAnswerARS
                    ) : (
                      language === 'en' ? inversionAnswerUSD_EN :
                      language === 'pt-br' ? inversionAnswerUSD_PT :
                      inversionAnswerUSD
                    )
                  ) : faq.answer}
                </div>
              </div>

              {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div> */}
            </div>
          ))}
        </div>

        {/* Bloque de anuncio 1 */}
        <div className="max-w-5xl mx-auto mt-16 flex justify-center">
          <AdBlock
            adClient="ca-pub-8330194041691289"
            adSlot="1375086377"
            className="flex justify-center"
            style={{ width: 300, height: 250 }}
            fixedSize
          />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
