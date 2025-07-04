"use client";

import { useState, useEffect } from "react";
import AdBlock from "@/components/ui/AdBlock";
import { ChevronDown, ChevronUp, Heart, Zap, Rocket, Award, Star, Gift, Sparkles, Key, Coins, ShieldCheck } from "lucide-react";
import { optimizeFAQs } from "@/utils/faq-optimizer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  inversionAnswerUSD_EN,
  inversionAnswerUSD_PT,
  inversionAnswerARS_EN,
  inversionAnswerARS_PT
} from "./FAQSectionTranslations";

// Definir las respuestas para la pregunta de inversión
const inversionAnswerUSD = "Hemos diseñado diferentes planes para adaptarnos a distintas necesidades y presupuestos. Nuestra opción más accesible comienza en un único pago de $10 USD (el equivalente en tu moneda local se mostrará al finalizar el pago), una inversión que muchos de nuestros usuarios recuperan en su primera semana de uso.\n\n⚡ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO!\n\nSolo $10 USD en lugar de $50 USD (80% OFF)\n\n💥 ¡Paga una sola vez y accede a Flasti de por vida usando PayPal o tu moneda local! 💥\n\n🚨 EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE $50 USD EN CUALQUIER MOMENTO\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n💡 Recuerda: Este precio tiene un 80% de descuento y es solo por tiempo limitado. ¡Estás ahorrando $40 USD por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const inversionAnswerARS = "Hemos diseñado diferentes planes para adaptarnos a distintas necesidades y presupuestos. Nuestra opción más accesible comienza en un único pago de AR$ 11.500, una inversión que muchos de nuestros usuarios recuperan en su primera semana de uso.\n\n⚡ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO!\n\nSolo AR$ 11.500 en lugar de AR$ 57.500 (80% OFF)\n\n💥 ¡Paga una sola vez y accede a Flasti de por vida usando Mercado Pago o PayPal! 💥\n\n🚨 EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE AR$ 57.500 EN CUALQUIER MOMENTO\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n💡 Recuerda: Este precio tiene un 80% de descuento y es solo por tiempo limitado. ¡Estás ahorrando AR$ 46.000 por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const faqs = [
  {
    icon: <Heart className="h-5 w-5" />,
    question: "¿Por qué debería unirme a Flasti?",
    answer: "Flasti te ofrece una plataforma única que combina inteligencia artificial con microtrabajos, permitiéndote generar ingresos desde cualquier lugar. Nuestra tecnología simplifica tareas complejas, maximizando tus ganancias con menos esfuerzo y tiempo invertido."
  },
  {
    icon: <Zap className="h-5 w-5" />,
    question: "¿Qué son los microtrabajos en línea?",
    answer: "Los microtrabajos son tareas digitales sencillas y rápidas que puedes completar desde tu dispositivo. En Flasti, utilizamos IA para automatizar gran parte del proceso, permitiéndote completar más tareas en menos tiempo y aumentar tus ingresos significativamente."
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    question: "¿Cómo puedo empezar?",
    answer: "Comenzar es muy sencillo: regístrate en nuestra plataforma, completa tu perfil, selecciona el plan que mejor se adapte a tus necesidades, y comienza a realizar microtrabajos asistidos por IA. Nuestro sistema te guiará paso a paso desde el primer momento."
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
    // Si estamos en móvil y estamos abriendo una pregunta (no cerrando)
    if (typeof window !== 'undefined' && window.innerWidth < 768 && openIndex !== index) {
      // Esperar a que se actualice el estado y luego hacer scroll
      setOpenIndex(index);

      // Esperar a que se complete la transición de apertura
      setTimeout(() => {
        // Obtener el elemento de la pregunta
        const faqElement = document.querySelectorAll('.glass-card')[index];
        if (faqElement) {
          // Calcular la posición para centrar el elemento en la pantalla
          const elementRect = faqElement.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

          // Hacer scroll suave hacia la posición calculada
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 50); // Pequeño retraso para permitir que el DOM se actualice
    } else {
      // En escritorio o al cerrar, simplemente alternar
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <style jsx global>{pulseAnimation}</style>
      {/* Forzar borde azul en hover de acordeones FAQ */}
      <style jsx global>{`
        .glass-card {
          border-color: #3c66ce !important;
        }
        .glass-card:hover, .glass-card:focus, .glass-card.active, .glass-card.open {
          border-color: #3c66ce !important;
          box-shadow: 0 0 0 2px #3c66ce33 !important;
        }
      `}</style>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs text-primary uppercase tracking-wider font-medium mb-2 inline-block">FAQ</span>
          <h2 className="text-3xl font-bold text-gradient mb-4">{t('todoLoQueNecesitasSaber')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('faqSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-primary/30 transition-all bg-[#0A0A0A]"
            >
              <button
                className="w-full p-6 flex items-center justify-between text-left group"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4a162a] flex items-center justify-center mr-3 border border-white/10 transition-all duration-300 group-hover:scale-110" style={{ animation: openIndex === index ? 'gentle-pulse 2s infinite' : 'none' }}>
                    <div className="text-white transition-all duration-300 group-hover:scale-110">{faq.icon && React.cloneElement(faq.icon, { color: 'white' })}</div>
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors duration-200">{faq.question}</span>
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
                <div className="pt-2 border-t border-white/10">
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
        <div className="max-w-5xl mx-auto mt-16">
          <AdBlock
            adClient="ca-pub-8330194041691289"
            adSlot="9339785426"
          />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
