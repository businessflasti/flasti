'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  User,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  BarChart2,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import Link from 'next/link';

export default function TutorDesignadoPage() {
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Manejar clic en "Contactar con soporte"
  const handleContactSupport = () => {
    // Abrir el chat
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  // Manejar envío de feedback
  const handleFeedback = (isHelpful: boolean) => {
    // Aquí podrías enviar el feedback a tu backend
    console.log(`Artículo marcado como ${isHelpful ? 'útil' : 'no útil'}`);
    setFeedbackSent(true);
  };

  // Artículos relacionados
  const relatedArticles = [
    {
      id: 'optimizar-ganancias',
      title: 'Cómo optimizar tus ganancias',
      icon: BarChart2
    },
    {
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: Lightbulb
    },
    {
      id: 'contactar-soporte',
      title: 'Contactar con soporte',
      icon: MessageSquare
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-5xl mt-20">
      {/* Navegación */}
      <div className="mb-6">
        <Link href="/dashboard/centro-ayuda" className="text-primary flex items-center hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Volver al Centro de Ayuda
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="md:col-span-2">
          <Card className="p-8 bg-card/30 backdrop-blur-sm border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Tu tutor designado</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                En Flasti, cada afiliado cuenta con un tutor personal designado para ayudarte a maximizar tus ganancias y resolver cualquier duda que puedas tener. Esta guía te explicará cómo aprovechar al máximo este valioso recurso.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">¿Qué es un tutor designado?</h2>
              <p className="text-foreground/80 mb-4">
                Un tutor designado es un experto en marketing de afiliación asignado específicamente a tu cuenta. Su objetivo es ayudarte a tener éxito en la plataforma, proporcionándote orientación personalizada, consejos estratégicos y soporte técnico.
              </p>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la sección de tutor en el dashboard]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Sección "Mi tutor" en el dashboard de Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Beneficios de tener un tutor designado</h2>
              <p className="text-foreground/80 mb-4">
                Contar con un tutor personal ofrece numerosas ventajas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Asesoramiento personalizado:</strong> Estrategias adaptadas a tu perfil y objetivos</li>
                <li><strong>Resolución de dudas:</strong> Respuestas rápidas a tus preguntas específicas</li>
                <li><strong>Análisis de rendimiento:</strong> Revisión de tus estadísticas para identificar áreas de mejora</li>
                <li><strong>Consejos de optimización:</strong> Recomendaciones para aumentar tus conversiones</li>
                <li><strong>Motivación:</strong> Apoyo constante para mantener tu enfoque y superar obstáculos</li>
                <li><strong>Acceso a recursos exclusivos:</strong> Materiales y herramientas especiales</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Los afiliados que mantienen comunicación regular con sus tutores suelen generar hasta un 40% más de ingresos que aquellos que no aprovechan este recurso.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo acceder a tu tutor designado</h2>
              <p className="text-foreground/80 mb-4">
                Puedes comunicarte con tu tutor de varias formas:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Desde tu dashboard, localiza la sección "Mi tutor" en la página principal</li>
                <li>Haz clic en el botón "Contactar a mi tutor"</li>
                <li>Se abrirá una ventana de chat donde podrás comunicarte directamente</li>
                <li>También puedes programar una videollamada si necesitas una asesoría más detallada</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cuándo contactar a tu tutor</h2>
              <p className="text-foreground/80 mb-4">
                Tu tutor está disponible para ayudarte en diversas situaciones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Al comenzar:</strong> Para recibir orientación inicial y establecer objetivos</li>
                <li><strong>Cuando tengas dudas:</strong> Sobre la plataforma, enlaces, comisiones, etc.</li>
                <li><strong>Para revisar estrategias:</strong> Análisis de tus tácticas actuales y sugerencias de mejora</li>
                <li><strong>Ante dificultades técnicas:</strong> Problemas con enlaces, pagos o la plataforma</li>
                <li><strong>Para celebrar logros:</strong> Compartir tus éxitos y recibir consejos para el siguiente nivel</li>
                <li><strong>Revisiones periódicas:</strong> Recomendamos contactar a tu tutor al menos una vez al mes</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Los tutores están disponibles de lunes a viernes, de 9:00 a 18:00 (GMT-5). Fuera de este horario, puedes dejar un mensaje y recibirás respuesta al siguiente día hábil.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo aprovechar al máximo a tu tutor</h2>
              <p className="text-foreground/80 mb-4">
                Para obtener el mayor beneficio de tu tutor designado:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Sé específico:</strong> Plantea preguntas concretas y detalladas</li>
                <li><strong>Comparte tus estadísticas:</strong> Permite que tu tutor analice tu rendimiento</li>
                <li><strong>Establece objetivos claros:</strong> Define qué quieres lograr a corto y largo plazo</li>
                <li><strong>Implementa las recomendaciones:</strong> Pon en práctica los consejos recibidos</li>
                <li><strong>Mantén comunicación regular:</strong> No esperes a tener problemas para contactar</li>
                <li><strong>Solicita recursos específicos:</strong> Pide materiales adaptados a tus necesidades</li>
                <li><strong>Da feedback:</strong> Informa sobre los resultados de las estrategias implementadas</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Consejos personalizados de tu tutor</h2>
              <p className="text-foreground/80 mb-4">
                Tu tutor puede ofrecerte asesoramiento en diversas áreas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Optimización de enlaces:</strong> Dónde y cómo compartirlos para maximizar conversiones</li>
                <li><strong>Estrategias de marketing:</strong> Tácticas específicas para tu nicho y audiencia</li>
                <li><strong>Análisis de rendimiento:</strong> Interpretación de tus estadísticas y áreas de mejora</li>
                <li><strong>Creación de contenido:</strong> Ideas para generar material atractivo y persuasivo</li>
                <li><strong>Planificación a largo plazo:</strong> Desarrollo de una estrategia sostenible</li>
                <li><strong>Resolución de problemas:</strong> Soluciones a obstáculos específicos</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Sesiones de revisión de rendimiento</h2>
              <p className="text-foreground/80 mb-4">
                Recomendamos programar sesiones periódicas con tu tutor para revisar tu rendimiento:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Programa una videollamada mensual con tu tutor</li>
                <li>Prepara tus estadísticas y preguntas con antelación</li>
                <li>Durante la sesión, tu tutor analizará:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground/80">
                    <li>Tus métricas de conversión</li>
                    <li>Patrones de comportamiento de tus referidos</li>
                    <li>Efectividad de tus canales de promoción</li>
                    <li>Progreso hacia tus objetivos</li>
                  </ul>
                </li>
                <li>Recibirás un plan de acción personalizado para el siguiente mes</li>
              </ol>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Tu tutor designado es un experto en marketing de afiliación asignado a tu cuenta</li>
                  <li>Puedes contactarlo desde la sección "Mi tutor" en tu dashboard</li>
                  <li>Aprovecha su experiencia para recibir asesoramiento personalizado</li>
                  <li>Mantén comunicación regular para maximizar tus resultados</li>
                  <li>Programa sesiones mensuales de revisión de rendimiento</li>
                  <li>Implementa sus recomendaciones y da seguimiento a los resultados</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Tu tutor designado es uno de los recursos más valiosos que Flasti pone a tu disposición. No dudes en aprovechar su experiencia y conocimientos para impulsar tus ganancias y alcanzar tus objetivos financieros.
              </p>
            </div>

            {/* Feedback */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="text-foreground/70 mb-4">¿Te resultó útil este artículo?</p>
              {!feedbackSent ? (
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => handleFeedback(true)}>
                    <ThumbsUp size={16} className="mr-2" />
                    Sí, fue útil
                  </Button>
                  <Button variant="outline" onClick={() => handleFeedback(false)}>
                    <ThumbsDown size={16} className="mr-2" />
                    No fue útil
                  </Button>
                </div>
              ) : (
                <p className="text-foreground/70">¡Gracias por tu feedback!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Artículos relacionados */}
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-white/5">
            <h3 className="font-semibold mb-4">Artículos relacionados</h3>
            <div className="space-y-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/dashboard/centro-ayuda/${article.id}`}
                  className="flex items-start hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <article.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{article.title}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Soporte */}
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-white/5">
            <h3 className="font-semibold mb-4">¿Necesitas más ayuda?</h3>
            <p className="text-foreground/70 text-sm mb-4">
              Si tienes alguna pregunta o necesitas asistencia personalizada, nuestro equipo de soporte está disponible para ayudarte.
            </p>
            <Button
              className="w-full"
              onClick={handleContactSupport}
            >
              <MessageSquare size={16} className="mr-2" />
              Contactar con soporte
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
