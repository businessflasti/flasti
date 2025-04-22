'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Clock,
  HelpCircle,
  CheckCircle
} from "lucide-react";
import Link from 'next/link';

export default function ContactarSoportePage() {
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
      id: 'preguntas-frecuentes',
      title: 'Preguntas frecuentes',
      icon: HelpCircle
    },
    {
      id: 'tutor-designado',
      title: 'Tu tutor designado',
      icon: CheckCircle
    },
    {
      id: 'retiros-pagos',
      title: 'Retiros y pagos',
      icon: Clock
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
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Contactar con soporte</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                En Flasti, nos comprometemos a brindarte el mejor soporte posible. Esta guía te mostrará las diferentes formas de contactar con nuestro equipo de soporte y obtener ayuda rápida y efectiva.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Opciones de soporte disponibles</h2>
              <p className="text-foreground/80 mb-4">
                Ofrecemos varias formas de contacto para adaptarnos a tus necesidades:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Chat en vivo:</strong> Soporte en tiempo real disponible desde tu dashboard</li>
                <li><strong>Correo electrónico:</strong> Para consultas que requieren más detalle</li>
                <li><strong>Centro de ayuda:</strong> Recursos de autoservicio para resolver dudas comunes</li>
                <li><strong>Tutor designado:</strong> Asistencia personalizada para optimizar tus resultados</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Chat en vivo</h2>
              <p className="text-foreground/80 mb-4">
                El chat en vivo es la forma más rápida de obtener ayuda:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Haz clic en el icono de chat ubicado en la esquina inferior derecha de tu dashboard</li>
                <li>Escribe tu consulta en el cuadro de texto</li>
                <li>Un agente de soporte te atenderá en breve</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  El chat en vivo está disponible de lunes a viernes, de 9:00 a 18:00 (GMT-5). Fuera de este horario, puedes dejar un mensaje y te responderemos en cuanto estemos disponibles.
                </p>
              </div>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen del chat en vivo de soporte]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Chat en vivo de soporte de Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Soporte por correo electrónico</h2>
              <p className="text-foreground/80 mb-4">
                Para consultas más detalladas o que requieren documentación:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Envía un correo a <span className="text-primary">soporte@flasti.com</span></li>
                <li>Incluye tu nombre de usuario y una descripción detallada de tu consulta</li>
                <li>Adjunta capturas de pantalla si es necesario para ilustrar el problema</li>
                <li>Recibirás una respuesta en un plazo máximo de 24 horas hábiles</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Para una respuesta más rápida, asegúrate de enviar tu correo desde la dirección de email registrada en tu cuenta de Flasti.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Centro de ayuda</h2>
              <p className="text-foreground/80 mb-4">
                Nuestro Centro de Ayuda contiene respuestas a las preguntas más frecuentes:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Navega por las diferentes categorías de ayuda</li>
                <li>Utiliza la barra de búsqueda para encontrar temas específicos</li>
                <li>Lee los artículos detallados sobre cada tema</li>
                <li>Si no encuentras lo que buscas, contacta con soporte</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Tu tutor designado</h2>
              <p className="text-foreground/80 mb-4">
                Como miembro de Flasti, tienes acceso a un tutor personal que puede ayudarte con:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Estrategias para maximizar tus ganancias</li>
                <li>Consejos personalizados según tu rendimiento</li>
                <li>Resolución de dudas específicas sobre la plataforma</li>
                <li>Orientación para alcanzar tus objetivos de ingresos</li>
              </ul>
              <p className="text-foreground/80 mb-4">
                Para contactar con tu tutor designado, haz clic en el botón "Contactar a mi tutor" en la sección "Mi tutor" de tu dashboard.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Consejos para obtener ayuda más rápida</h2>
              <p className="text-foreground/80 mb-4">
                Para recibir una respuesta más rápida y efectiva:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Sé específico:</strong> Describe tu problema con el mayor detalle posible</li>
                <li><strong>Incluye información relevante:</strong> Tu nombre de usuario, dispositivo, navegador, etc.</li>
                <li><strong>Adjunta capturas de pantalla:</strong> Si es posible, muestra visualmente el problema</li>
                <li><strong>Menciona los pasos que ya has intentado:</strong> Esto evitará sugerencias repetidas</li>
                <li><strong>Sé cortés:</strong> Nuestro equipo está aquí para ayudarte</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Tiempos de respuesta</h2>
              <p className="text-foreground/80 mb-4">
                Nuestros tiempos de respuesta habituales son:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Chat en vivo:</strong> Respuesta inmediata durante el horario de atención</li>
                <li><strong>Correo electrónico:</strong> 24 horas hábiles máximo</li>
                <li><strong>Tutor designado:</strong> 48 horas hábiles máximo</li>
              </ul>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Utiliza el chat en vivo para ayuda inmediata</li>
                  <li>Envía un correo a soporte@flasti.com para consultas detalladas</li>
                  <li>Consulta el Centro de Ayuda para respuestas a preguntas frecuentes</li>
                  <li>Contacta con tu tutor designado para asesoramiento personalizado</li>
                  <li>Sé específico y proporciona toda la información relevante</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                En Flasti, tu éxito es nuestra prioridad. Nuestro equipo de soporte está comprometido a ayudarte a resolver cualquier duda o problema que puedas tener, para que puedas concentrarte en maximizar tus ganancias.
              </p>

              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">¿Listo para contactar con soporte?</h3>
                <p className="text-foreground/80 mb-4">
                  Haz clic en el botón a continuación para iniciar un chat con nuestro equipo de soporte:
                </p>
                <Button
                  className="w-full"
                  onClick={handleContactSupport}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Iniciar chat con soporte
                </Button>
              </div>
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
