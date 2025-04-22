'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Target,
  BarChart2,
  DollarSign,
  Users
} from "lucide-react";
import Link from 'next/link';

export default function OptimizarGananciasPage() {
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
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: Target
    },
    {
      id: 'niveles-comisiones',
      title: 'Niveles y comisiones',
      icon: DollarSign
    },
    {
      id: 'redes-sociales',
      title: 'Promoción en redes sociales',
      icon: Users
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
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Cómo optimizar tus ganancias</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Maximizar tus ganancias como afiliado de Flasti requiere una combinación de estrategias efectivas, análisis de datos y mejora continua. Esta guía te proporcionará técnicas avanzadas para optimizar tus resultados y aumentar tus ingresos.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Análisis de tu rendimiento actual</h2>
              <p className="text-foreground/80 mb-4">
                Antes de implementar nuevas estrategias, es importante entender tu situación actual:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Revisa tus estadísticas:</strong> Analiza tus datos de conversión, clics y ganancias</li>
                <li><strong>Identifica patrones:</strong> ¿Qué días, horarios o canales generan mejores resultados?</li>
                <li><strong>Evalúa tus canales:</strong> Determina qué plataformas están funcionando mejor</li>
                <li><strong>Analiza tu audiencia:</strong> Comprende quién está respondiendo mejor a tus promociones</li>
                <li><strong>Establece una línea base:</strong> Define tus métricas actuales para medir mejoras futuras</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen del panel de estadísticas en el dashboard]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Panel de estadísticas en el dashboard de Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización de tu audiencia objetivo</h2>
              <p className="text-foreground/80 mb-4">
                Refinar tu audiencia objetivo puede aumentar significativamente tus conversiones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Segmentación precisa:</strong> Identifica nichos específicos dentro de tu audiencia general</li>
                <li><strong>Personalización del mensaje:</strong> Adapta tu comunicación según las necesidades de cada segmento</li>
                <li><strong>Enfoque en calidad:</strong> Concéntrate en atraer personas realmente interesadas, no solo en cantidad</li>
                <li><strong>Investigación de audiencia:</strong> Aprende más sobre los intereses y comportamientos de tu público</li>
                <li><strong>Prueba diferentes segmentos:</strong> Experimenta con distintos grupos para encontrar los más receptivos</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Es mejor tener una audiencia pequeña pero altamente interesada que una audiencia grande pero indiferente. Concéntrate en la calidad de tus prospectos, no solo en la cantidad.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización de contenido</h2>
              <p className="text-foreground/80 mb-4">
                El contenido que creas para promocionar tus enlaces es crucial para tu éxito:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Pruebas A/B:</strong> Compara diferentes títulos, imágenes y llamadas a la acción</li>
                <li><strong>Storytelling:</strong> Utiliza historias para conectar emocionalmente con tu audiencia</li>
                <li><strong>Contenido educativo:</strong> Enseña a tu audiencia algo valioso relacionado con las aplicaciones</li>
                <li><strong>Demostraciones prácticas:</strong> Muestra resultados reales y casos de uso concretos</li>
                <li><strong>Formatos variados:</strong> Combina texto, imágenes, videos y otros formatos</li>
                <li><strong>Actualización regular:</strong> Mantén tu contenido fresco y relevante</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización de canales</h2>
              <p className="text-foreground/80 mb-4">
                No todos los canales funcionarán igual de bien para ti. Optimiza tu enfoque:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Identifica tus canales más efectivos:</strong> Concentra tus esfuerzos donde obtienes mejores resultados</li>
                <li><strong>Abandona lo que no funciona:</strong> No pierdas tiempo en canales con bajo rendimiento</li>
                <li><strong>Optimiza cada canal:</strong> Adapta tu estrategia a las particularidades de cada plataforma</li>
                <li><strong>Explora nuevos canales:</strong> Prueba regularmente nuevas plataformas y formatos</li>
                <li><strong>Integra tus canales:</strong> Crea una estrategia coherente entre diferentes plataformas</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización de conversión</h2>
              <p className="text-foreground/80 mb-4">
                Mejorar tu tasa de conversión es clave para aumentar tus ganancias:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Llamadas a la acción claras:</strong> Indica exactamente qué quieres que haga tu audiencia</li>
                <li><strong>Reducción de fricciones:</strong> Elimina obstáculos en el proceso de compra</li>
                <li><strong>Creación de urgencia:</strong> Utiliza técnicas como ofertas por tiempo limitado</li>
                <li><strong>Prueba social:</strong> Muestra testimonios y casos de éxito</li>
                <li><strong>Garantías:</strong> Destaca las garantías y política de devolución</li>
                <li><strong>Seguimiento:</strong> Implementa estrategias para recuperar prospectos interesados</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Incluso pequeñas mejoras en tu tasa de conversión pueden tener un gran impacto en tus ganancias totales. Un aumento del 1% en conversiones puede significar un incremento significativo en tus ingresos mensuales.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización de tiempo y recursos</h2>
              <p className="text-foreground/80 mb-4">
                Maximiza la eficiencia de tus esfuerzos:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Automatización:</strong> Utiliza herramientas para programar publicaciones y seguimientos</li>
                <li><strong>Reutilización de contenido:</strong> Adapta el mismo contenido para diferentes plataformas</li>
                <li><strong>Priorización:</strong> Enfócate en actividades de alto impacto</li>
                <li><strong>Planificación:</strong> Crea un calendario de marketing para organizar tus esfuerzos</li>
                <li><strong>Delegación:</strong> Considera subcontratar tareas repetitivas o técnicas</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias avanzadas para maximizar ganancias</h2>
              <p className="text-foreground/80 mb-4">
                Implementa estas técnicas para llevar tus resultados al siguiente nivel:
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">1. Estrategia de embudo de conversión</h3>
              <p className="text-foreground/80 mb-4">
                Crea un proceso estructurado para guiar a tus prospectos desde el conocimiento inicial hasta la compra:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Conciencia:</strong> Crea contenido que atraiga a tu audiencia objetivo</li>
                <li><strong>Interés:</strong> Proporciona información valiosa sobre las aplicaciones</li>
                <li><strong>Consideración:</strong> Muestra casos de uso y beneficios específicos</li>
                <li><strong>Acción:</strong> Presenta una oferta clara con tu enlace de afiliado</li>
                <li><strong>Retención:</strong> Mantén el contacto para futuras promociones</li>
              </ol>

              <h3 className="text-lg font-semibold mt-6 mb-3">2. Creación de paquetes de valor añadido</h3>
              <p className="text-foreground/80 mb-4">
                Ofrece recursos adicionales exclusivos para quienes compren a través de tu enlace:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Guías complementarias sobre cómo usar las aplicaciones</li>
                <li>Plantillas o recursos adicionales</li>
                <li>Tutoriales exclusivos</li>
                <li>Acceso a un grupo privado de soporte</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">3. Estrategia de contenido pilar</h3>
              <p className="text-foreground/80 mb-4">
                Crea contenido extenso y detallado que puedas fragmentar en múltiples piezas más pequeñas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Desarrolla una guía completa sobre un tema relacionado con las aplicaciones</li>
                <li>Divide esta guía en artículos, publicaciones, videos, etc.</li>
                <li>Distribuye estas piezas en diferentes canales</li>
                <li>Dirige todo el tráfico hacia tu contenido principal con tu enlace de afiliado</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">4. Optimización para SEO</h3>
              <p className="text-foreground/80 mb-4">
                Si tienes un blog o sitio web, optimiza tu contenido para motores de búsqueda:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Investiga palabras clave relacionadas con IA y generación de imágenes</li>
                <li>Crea contenido optimizado para estas palabras clave</li>
                <li>Mejora la estructura y velocidad de tu sitio</li>
                <li>Construye enlaces hacia tu contenido</li>
                <li>Actualiza regularmente tu contenido para mantenerlo relevante</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Medición y mejora continua</h2>
              <p className="text-foreground/80 mb-4">
                El proceso de optimización nunca termina:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Establece KPIs claros:</strong> Define métricas específicas para medir tu éxito</li>
                <li><strong>Monitorea regularmente:</strong> Revisa tus estadísticas al menos semanalmente</li>
                <li><strong>Analiza tendencias:</strong> Busca patrones y cambios en tus resultados</li>
                <li><strong>Experimenta constantemente:</strong> Prueba nuevas estrategias y enfoques</li>
                <li><strong>Aprende de los resultados:</strong> Ajusta tu estrategia según lo que funciona</li>
                <li><strong>Mantente actualizado:</strong> Aprende nuevas técnicas y tendencias del marketing de afiliación</li>
              </ol>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Analiza tu rendimiento actual para identificar áreas de mejora</li>
                  <li>Refina tu audiencia objetivo para aumentar la relevancia</li>
                  <li>Optimiza tu contenido mediante pruebas y mejora continua</li>
                  <li>Concéntrate en los canales más efectivos para tu estrategia</li>
                  <li>Mejora tu tasa de conversión con llamadas a la acción claras</li>
                  <li>Implementa estrategias avanzadas como embudos de conversión</li>
                  <li>Mide tus resultados y ajusta constantemente tu enfoque</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Recuerda que optimizar tus ganancias es un proceso continuo que requiere paciencia, análisis y adaptación. No te desanimes si no ves resultados inmediatos; con persistencia y mejora constante, lograrás aumentar significativamente tus ingresos como afiliado de Flasti.
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
