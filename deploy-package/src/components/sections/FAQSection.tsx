"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Heart, Zap, Rocket, Award, Star, Gift, Sparkles, Key, Coins, ShieldCheck } from "lucide-react";

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
    answer: "Hemos diseñado diferentes planes para adaptarnos a distintas necesidades y presupuestos. Nuestra opción más accesible comienza en un único pago de $XXX, una inversión que muchos de nuestros usuarios recuperan en su primera semana de uso."
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <style jsx global>{pulseAnimation}</style>
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
        <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
      </div>

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
              className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5"
            >
              <button
                className="w-full p-6 flex items-center justify-between text-left group"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mr-3 border border-white/10 transition-all duration-300 hover:scale-110" style={{ animation: openIndex === index ? 'gentle-pulse 2s infinite' : 'none' }}>
                    <div className="text-[#ec4899] transition-all duration-300 group-hover:scale-110 group-hover:text-[#f97316]">{faq.icon}</div>
                  </div>
                  <span className="font-medium">{faq.question}</span>
                </div>
                <div className="text-primary">
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              <div
                className={`px-6 pb-6 pt-0 text-foreground/70 text-sm transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className="pt-2 border-t border-white/10">
                  {faq.answer}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
