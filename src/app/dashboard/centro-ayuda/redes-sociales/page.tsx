'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Share2,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Link2
} from "lucide-react";
import Link from 'next/link';

export default function RedesSocialesPage() {
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
      icon: Link2
    },
    {
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: Share2
    },
    {
      id: 'optimizar-ganancias',
      title: 'Cómo optimizar tus ganancias',
      icon: ThumbsUp
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
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Promoción en redes sociales</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Las redes sociales son una herramienta poderosa para promocionar tus enlaces de afiliado y maximizar tus ganancias en Flasti. Esta guía te mostrará las mejores estrategias para cada plataforma.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Por qué las redes sociales son importantes</h2>
              <p className="text-foreground/80 mb-4">
                Las redes sociales ofrecen numerosas ventajas para los afiliados:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Alcance masivo:</strong> Acceso a millones de usuarios potenciales</li>
                <li><strong>Segmentación:</strong> Posibilidad de dirigirte a audiencias específicas</li>
                <li><strong>Costo-efectividad:</strong> Promoción gratuita o con bajo presupuesto</li>
                <li><strong>Interacción directa:</strong> Comunicación inmediata con tu audiencia</li>
                <li><strong>Análisis de resultados:</strong> Métricas para optimizar tus estrategias</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  No es necesario estar en todas las redes sociales. Es mejor concentrarse en 2-3 plataformas donde tu audiencia objetivo esté más activa.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias para Instagram</h2>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mr-3">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-medium">Instagram</h3>
              </div>
              <p className="text-foreground/80 mb-4">
                Instagram es ideal para promociones visuales y atractivas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Stories:</strong> Comparte capturas de pantalla de las aplicaciones con tu enlace</li>
                <li><strong>Publicaciones:</strong> Crea imágenes atractivas que muestren los beneficios</li>
                <li><strong>Reels:</strong> Crea videos cortos demostrando cómo funcionan las aplicaciones</li>
                <li><strong>Bio:</strong> Incluye tu enlace principal en la biografía</li>
                <li><strong>Highlights:</strong> Crea destacados con tutoriales o testimonios</li>
              </ul>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Ejemplo de publicación de Instagram promocionando Flasti]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Ejemplo de publicación efectiva en Instagram</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias para Facebook</h2>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-medium">Facebook</h3>
              </div>
              <p className="text-foreground/80 mb-4">
                Facebook ofrece múltiples formatos para promocionar tus enlaces:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Publicaciones personales:</strong> Comparte tu experiencia con las aplicaciones</li>
                <li><strong>Stories:</strong> Contenido efímero con llamadas a la acción</li>
                <li><strong>Grupos relevantes:</strong> Participa en grupos relacionados con tecnología o ingresos online</li>
                <li><strong>Messenger:</strong> Comparte enlaces directamente con contactos interesados</li>
                <li><strong>Videos en vivo:</strong> Realiza demostraciones en tiempo real</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Al compartir en grupos de Facebook, asegúrate de leer las reglas del grupo. Algunos no permiten enlaces de afiliado o requieren que se indique claramente que es un enlace de afiliado.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias para Twitter</h2>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mr-3">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-medium">Twitter</h3>
              </div>
              <p className="text-foreground/80 mb-4">
                Twitter es perfecto para mensajes concisos y directos:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Tweets regulares:</strong> Comparte beneficios específicos de las aplicaciones</li>
                <li><strong>Hilos:</strong> Crea hilos explicativos sobre cómo usar las aplicaciones</li>
                <li><strong>Hashtags relevantes:</strong> Utiliza hashtags relacionados con IA, imágenes, etc.</li>
                <li><strong>Respuestas:</strong> Responde a preguntas relacionadas con IA o generación de imágenes</li>
                <li><strong>Retweets:</strong> Comparte contenido relevante añadiendo tu enlace</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias para YouTube</h2>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                  <Youtube className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-medium">YouTube</h3>
              </div>
              <p className="text-foreground/80 mb-4">
                YouTube es ideal para tutoriales y demostraciones detalladas:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Tutoriales:</strong> Crea guías paso a paso sobre cómo usar las aplicaciones</li>
                <li><strong>Reviews:</strong> Analiza las funcionalidades y beneficios</li>
                <li><strong>Comparativas:</strong> Compara con otras herramientas similares</li>
                <li><strong>Casos de uso:</strong> Muestra ejemplos prácticos de uso</li>
                <li><strong>Descripción:</strong> Incluye tus enlaces en la descripción del video</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Mejores prácticas para todas las plataformas</h2>
              <p className="text-foreground/80 mb-4">
                Independientemente de la plataforma que utilices, sigue estas recomendaciones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Sé transparente:</strong> Indica claramente que estás compartiendo un enlace de afiliado</li>
                <li><strong>Proporciona valor:</strong> No solo promociones, ofrece información útil</li>
                <li><strong>Sé consistente:</strong> Publica regularmente para mantener el interés</li>
                <li><strong>Interactúa:</strong> Responde a comentarios y preguntas</li>
                <li><strong>Analiza resultados:</strong> Identifica qué tipo de contenido genera más conversiones</li>
                <li><strong>Adapta el mensaje:</strong> Personaliza tu comunicación según la plataforma</li>
                <li><strong>Usa llamadas a la acción claras:</strong> Indica a tu audiencia qué hacer</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Creación de contenido efectivo</h2>
              <p className="text-foreground/80 mb-4">
                Para maximizar el impacto de tus publicaciones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Destaca beneficios:</strong> Enfócate en cómo las aplicaciones resuelven problemas</li>
                <li><strong>Usa imágenes de calidad:</strong> Las publicaciones con imágenes atractivas generan más engagement</li>
                <li><strong>Crea tutoriales:</strong> Muestra paso a paso cómo utilizar las aplicaciones</li>
                <li><strong>Comparte resultados:</strong> Muestra ejemplos de lo que se puede crear con las aplicaciones</li>
                <li><strong>Cuenta historias:</strong> El storytelling genera más conexión emocional</li>
              </ul>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Elige 2-3 plataformas donde tu audiencia objetivo esté más activa</li>
                  <li>Adapta tu estrategia según las características de cada plataforma</li>
                  <li>Crea contenido de valor que muestre los beneficios de las aplicaciones</li>
                  <li>Sé transparente sobre tu condición de afiliado</li>
                  <li>Interactúa con tu audiencia y responde a sus preguntas</li>
                  <li>Analiza tus resultados y optimiza tus estrategias</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Recuerda que la clave del éxito en redes sociales es la consistencia y la autenticidad. Comparte contenido que realmente aporte valor a tu audiencia y las conversiones llegarán de forma natural.
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
