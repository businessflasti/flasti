'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Award,
  BarChart2,
  CreditCard
} from "lucide-react";
import Link from 'next/link';

export default function NivelesComisionesPage() {
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
      icon: TrendingUp
    },
    {
      id: 'retiros-pagos',
      title: 'Retiros y pagos',
      icon: CreditCard
    },
    {
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: BarChart2
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
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Niveles y comisiones</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                En Flasti, tu capacidad de generar ingresos aumenta a medida que avanzas en nuestro sistema de niveles. Esta guía te explicará cómo funcionan los niveles, las comisiones asociadas y cómo puedes subir de nivel para maximizar tus ganancias.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Sistema de niveles de Flasti</h2>
              <p className="text-foreground/80 mb-4">
                Flasti cuenta con un sistema de niveles diseñado para recompensar a los afiliados más activos y exitosos. A medida que generas más ventas, avanzas a niveles superiores que ofrecen mayores porcentajes de comisión.
              </p>

              <div className="my-8 space-y-4">
                {/* Nivel 1 */}
                <div className="bg-card/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold">Nivel 1 - Iniciado</h3>
                  </div>
                  <div className="p-4">
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li><strong>Comisión:</strong> 50% por cada venta</li>
                      <li><strong>Requisitos:</strong> Nivel inicial para todos los afiliados</li>
                      <li><strong>Beneficios adicionales:</strong> Acceso a materiales básicos de marketing</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Ejemplo:</strong> Por cada venta de Flasti AI ($7), recibes $3.50 de comisión. Por cada venta de Flasti Images ($5), recibes $2.50.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nivel 2 */}
                <div className="bg-card/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold">Nivel 2 - Avanzado</h3>
                  </div>
                  <div className="p-4">
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li><strong>Comisión:</strong> 60% por cada venta</li>
                      <li><strong>Requisitos:</strong> Alcanzar $20 en ganancias acumuladas</li>
                      <li><strong>Beneficios adicionales:</strong> Acceso a materiales avanzados de marketing y soporte prioritario</li>
                    </ul>
                    <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Ejemplo:</strong> Por cada venta de Flasti AI ($7), recibes $4.20 de comisión. Por cada venta de Flasti Images ($5), recibes $3.00.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nivel 3 */}
                <div className="bg-card/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold">Nivel 3 - Experto</h3>
                  </div>
                  <div className="p-4">
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li><strong>Comisión:</strong> 70% por cada venta</li>
                      <li><strong>Requisitos:</strong> Alcanzar $30 en ganancias acumuladas</li>
                      <li><strong>Beneficios adicionales:</strong> Acceso a materiales exclusivos, soporte VIP y acceso anticipado a nuevas aplicaciones</li>
                    </ul>
                    <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Ejemplo:</strong> Por cada venta de Flasti AI ($7), recibes $4.90 de comisión. Por cada venta de Flasti Images ($5), recibes $3.50.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Concéntrate en generar ventas consistentes para alcanzar rápidamente el Nivel 3, donde obtendrás las comisiones más altas por cada venta.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo se calculan las comisiones</h2>
              <p className="text-foreground/80 mb-4">
                Las comisiones en Flasti se calculan de manera sencilla:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Cada aplicación tiene un precio fijo (Flasti AI: $7, Flasti Images: $5)</li>
                <li>Tu comisión se calcula multiplicando el precio por tu porcentaje de comisión según tu nivel</li>
                <li>Las comisiones se acumulan automáticamente en tu balance</li>
                <li>Puedes solicitar el retiro de tus ganancias en cualquier momento, sin monto mínimo</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen del panel de comisiones en el dashboard]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Panel de comisiones en el dashboard de Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo subir de nivel</h2>
              <p className="text-foreground/80 mb-4">
                Para avanzar en el sistema de niveles de Flasti:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Genera ventas consistentes:</strong> Comparte tus enlaces de afiliado regularmente</li>
                <li><strong>Diversifica tus canales:</strong> Promociona en diferentes plataformas para llegar a más audiencia</li>
                <li><strong>Implementa estrategias efectivas:</strong> Utiliza las técnicas de marketing recomendadas</li>
                <li><strong>Monitorea tu progreso:</strong> Revisa regularmente tu dashboard para ver cuánto te falta para el siguiente nivel</li>
                <li><strong>Consulta con tu tutor:</strong> Pide consejos personalizados a tu tutor designado</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Los niveles se basan en ganancias acumuladas, no en el balance actual. Esto significa que puedes retirar tus ganancias sin afectar tu nivel.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Seguimiento de tu progreso</h2>
              <p className="text-foreground/80 mb-4">
                Puedes monitorear tu progreso y nivel actual de varias formas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Dashboard principal:</strong> Tu nivel actual se muestra en la parte superior de tu dashboard</li>
                <li><strong>Sección de niveles:</strong> Accede a información detallada en la sección "Niveles" de tu dashboard</li>
                <li><strong>Estadísticas:</strong> Revisa tus ganancias acumuladas en la sección "Estadísticas"</li>
                <li><strong>Notificaciones:</strong> Recibirás una notificación cuando subas de nivel</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Beneficios adicionales por nivel</h2>
              <p className="text-foreground/80 mb-4">
                Además de mayores comisiones, cada nivel ofrece beneficios adicionales:
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Nivel 1 - Iniciado</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Acceso a materiales básicos de marketing</li>
                <li>Soporte estándar</li>
                <li>Tutoriales básicos</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Nivel 2 - Avanzado</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Todo lo del Nivel 1</li>
                <li>Materiales avanzados de marketing</li>
                <li>Soporte prioritario</li>
                <li>Sesiones mensuales con tu tutor</li>
                <li>Plantillas personalizables para promoción</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Nivel 3 - Experto</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Todo lo del Nivel 2</li>
                <li>Materiales exclusivos de marketing</li>
                <li>Soporte VIP con respuesta garantizada en 2 horas</li>
                <li>Sesiones quincenales con tu tutor</li>
                <li>Acceso anticipado a nuevas aplicaciones</li>
                <li>Reconocimiento en el programa de afiliados</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Preguntas frecuentes sobre niveles y comisiones</h2>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">¿Puedo bajar de nivel?</h3>
              <p className="text-foreground/80 mb-4">
                No, una vez que alcanzas un nivel, lo mantienes permanentemente, independientemente de tu actividad posterior.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">¿Cuánto tiempo tarda en actualizarse mi nivel?</h3>
              <p className="text-foreground/80 mb-4">
                La actualización de nivel es automática e instantánea una vez que alcanzas el umbral de ganancias requerido.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">¿Las comisiones se pagan inmediatamente?</h3>
              <p className="text-foreground/80 mb-4">
                Sí, las comisiones se acreditan en tu balance inmediatamente después de cada venta confirmada.
              </p>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Flasti ofrece tres niveles de afiliación con comisiones crecientes (50%, 60% y 70%)</li>
                  <li>Avanzas de nivel al alcanzar umbrales específicos de ganancias acumuladas</li>
                  <li>Cada nivel ofrece beneficios adicionales además de mayores comisiones</li>
                  <li>Una vez que alcanzas un nivel, lo mantienes permanentemente</li>
                  <li>Puedes monitorear tu progreso en tu dashboard</li>
                  <li>Las comisiones se acreditan inmediatamente después de cada venta</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                El sistema de niveles de Flasti está diseñado para recompensar tu dedicación y éxito como afiliado. Cuanto más te esfuerces en promocionar nuestras aplicaciones, mayores serán tus recompensas y beneficios.
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
