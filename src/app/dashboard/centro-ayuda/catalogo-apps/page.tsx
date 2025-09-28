'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Grid,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Image,
  Bot,
  DollarSign,
  Share2
} from "lucide-react";
import Link from 'next/link';

export default function CatalogoAppsPage() {
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
      id: 'enlaces-afiliado',
      title: 'Cómo usar tus enlaces de afiliado',
      icon: Share2
    },
    {
      id: 'niveles-comisiones',
      title: 'Niveles y comisiones',
      icon: DollarSign
    },
    {
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: Grid
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
                <Grid className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Catálogo de aplicaciones</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Flasti ofrece un catálogo de aplicaciones innovadoras que puedes promocionar como afiliado. Esta guía te presentará las aplicaciones disponibles, sus características y cómo promocionarlas efectivamente.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Aplicaciones disponibles</h2>
              <p className="text-foreground/80 mb-4">
                Actualmente, Flasti cuenta con dos aplicaciones principales en su catálogo:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Flasti AI */}
                <div className="bg-card/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Flasti AI</h3>
                    <p className="text-sm text-foreground/70 mb-2">
                      Herramienta de inteligencia artificial para crear contenido, responder preguntas y automatizar tareas.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-primary font-semibold">$3.90 USD</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        50% comisión ($1.95)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flasti Images */}
                <div className="bg-card/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-pink-500/20 to-orange-500/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                      <Image className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Flasti Images</h3>
                    <p className="text-sm text-foreground/70 mb-2">
                      Generador de imágenes con IA que crea ilustraciones de alta calidad a partir de descripciones de texto.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-primary font-semibold">$5 USD</span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        50% comisión ($2.50)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Flasti AI: Características y beneficios</h2>
              <p className="text-foreground/80 mb-4">
                Flasti AI es una potente herramienta de inteligencia artificial con múltiples funcionalidades:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Creación de contenido:</strong> Genera textos de alta calidad para blogs, redes sociales, emails, etc.</li>
                <li><strong>Asistente virtual:</strong> Responde preguntas, ofrece recomendaciones y ayuda en diversas tareas</li>
                <li><strong>Traducción avanzada:</strong> Traduce textos manteniendo el contexto y el tono</li>
                <li><strong>Resumen de textos:</strong> Condensa documentos extensos en resúmenes concisos</li>
                <li><strong>Corrección gramatical:</strong> Mejora la redacción y corrige errores</li>
                <li><strong>Generación de ideas:</strong> Proporciona inspiración para proyectos creativos</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Puntos de venta clave:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/80">
                  <li>Interfaz intuitiva y fácil de usar</li>
                  <li>Resultados de alta calidad en segundos</li>
                  <li>Múltiples funcionalidades en una sola herramienta</li>
                  <li>Ahorro significativo de tiempo y esfuerzo</li>
                  <li>Actualizaciones constantes con nuevas capacidades</li>
                </ul>
              </div>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la interfaz de Flasti AI]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Interfaz principal de Flasti AI</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Flasti Images: Características y beneficios</h2>
              <p className="text-foreground/80 mb-4">
                Flasti Images es un generador de imágenes con IA que ofrece:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Generación de imágenes:</strong> Crea ilustraciones a partir de descripciones de texto</li>
                <li><strong>Múltiples estilos:</strong> Fotografía, ilustración, 3D, pixel art, acuarela, etc.</li>
                <li><strong>Personalización avanzada:</strong> Control sobre aspectos como composición, iluminación y colores</li>
                <li><strong>Alta resolución:</strong> Imágenes de calidad profesional</li>
                <li><strong>Edición posterior:</strong> Herramientas para ajustar las imágenes generadas</li>
                <li><strong>Derechos de uso:</strong> Licencia para utilizar las imágenes en proyectos personales y comerciales</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Puntos de venta clave:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/80">
                  <li>Creación de imágenes únicas sin necesidad de habilidades de diseño</li>
                  <li>Ahorro en costos de diseño y fotografía</li>
                  <li>Resultados rápidos y de alta calidad</li>
                  <li>Versatilidad para diferentes necesidades visuales</li>
                  <li>Interfaz sencilla e intuitiva</li>
                </ul>
              </div>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-pink-500/20 to-orange-500/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la interfaz de Flasti Images]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Interfaz principal de Flasti Images</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo promocionar las aplicaciones</h2>
              <p className="text-foreground/80 mb-4">
                Para promocionar efectivamente las aplicaciones de Flasti:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Conoce el producto:</strong> Familiarízate con todas las funcionalidades y beneficios</li>
                <li><strong>Identifica tu audiencia:</strong> Determina quién podría beneficiarse más de cada aplicación</li>
                <li><strong>Crea contenido relevante:</strong> Desarrolla material que muestre el valor de las aplicaciones</li>
                <li><strong>Comparte ejemplos:</strong> Muestra resultados reales generados con las aplicaciones</li>
                <li><strong>Destaca los beneficios:</strong> Enfócate en cómo las aplicaciones resuelven problemas</li>
                <li><strong>Utiliza múltiples canales:</strong> Promociona en redes sociales, email, sitios web, etc.</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Audiencias objetivo por aplicación</h2>
              <p className="text-foreground/80 mb-4">
                Cada aplicación tiene audiencias específicas que pueden estar más interesadas:
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Flasti AI</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Creadores de contenido y bloggers</li>
                <li>Profesionales de marketing y redes sociales</li>
                <li>Estudiantes y académicos</li>
                <li>Emprendedores y pequeñas empresas</li>
                <li>Escritores y redactores</li>
                <li>Profesionales que necesitan generar informes y documentos</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Flasti Images</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Diseñadores gráficos y creativos</li>
                <li>Creadores de contenido visual</li>
                <li>Profesionales de marketing y publicidad</li>
                <li>Emprendedores que necesitan imágenes para sus productos</li>
                <li>Desarrolladores de sitios web</li>
                <li>Artistas buscando inspiración</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Enlaces y recursos</h2>
              <p className="text-foreground/80 mb-4">
                Para promocionar las aplicaciones, puedes acceder a estos recursos:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Enlaces de afiliado:</strong> Disponibles en la sección "Mis Enlaces" de tu dashboard</li>
                <li><strong>Páginas de destino:</strong> 
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground/80">
                    <li>Flasti AI: <span className="text-primary">https://flasti.com/ai</span></li>
                    <li>Flasti Images: <span className="text-primary">https://flasti.com/images</span></li>
                  </ul>
                </li>
                <li><strong>Materiales promocionales:</strong> Imágenes, descripciones y ejemplos disponibles en tu dashboard</li>
                <li><strong>Guías de usuario:</strong> Documentación detallada sobre cada aplicación</li>
              </ul>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Flasti ofrece dos aplicaciones principales: Flasti AI y Flasti Images</li>
                  <li>Cada aplicación tiene características únicas y audiencias específicas</li>
                  <li>Las comisiones son del 50% del precio de venta ($3.50 para Flasti AI y $2.50 para Flasti Images)</li>
                  <li>Familiarízate con las aplicaciones para promocionarlas efectivamente</li>
                  <li>Utiliza los recursos disponibles en tu dashboard para tus campañas</li>
                  <li>Adapta tu mensaje según la audiencia objetivo de cada aplicación</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                El catálogo de aplicaciones de Flasti está en constante crecimiento. Mantente atento a nuevas adiciones que te permitirán diversificar tus fuentes de ingresos como afiliado.
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
