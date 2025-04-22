'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Target,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart2,
  Share2,
  Users,
  TrendingUp
} from "lucide-react";
import Link from 'next/link';

export default function EstrategiasMarketingPage() {
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
      id: 'redes-sociales',
      title: 'Promoción en redes sociales',
      icon: Share2
    },
    {
      id: 'optimizar-ganancias',
      title: 'Cómo optimizar tus ganancias',
      icon: TrendingUp
    },
    {
      id: 'enlaces-afiliado',
      title: 'Cómo usar tus enlaces de afiliado',
      icon: Target
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
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Estrategias de marketing efectivas</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Implementar estrategias de marketing efectivas es clave para maximizar tus ganancias como afiliado de Flasti. Esta guía te presentará las mejores tácticas para promocionar tus enlaces y aumentar tus conversiones.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Fundamentos del marketing de afiliación</h2>
              <p className="text-foreground/80 mb-4">
                Antes de profundizar en estrategias específicas, es importante entender los principios básicos del marketing de afiliación:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Valor antes que venta:</strong> Proporciona información útil antes de intentar vender</li>
                <li><strong>Confianza:</strong> Construye credibilidad con tu audiencia</li>
                <li><strong>Relevancia:</strong> Promociona productos que realmente beneficien a tu audiencia</li>
                <li><strong>Transparencia:</strong> Sé honesto sobre tu condición de afiliado</li>
                <li><strong>Consistencia:</strong> Mantén una presencia regular en tus canales</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  El marketing de afiliación más efectivo es aquel donde genuinamente crees en el producto que promocionas. Tu entusiasmo auténtico será percibido por tu audiencia.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Conoce a tu audiencia</h2>
              <p className="text-foreground/80 mb-4">
                El primer paso para una estrategia efectiva es entender a quién te diriges:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Identifica tu audiencia objetivo:</strong> ¿Quién se beneficiaría más de las aplicaciones de Flasti?</li>
                <li><strong>Comprende sus necesidades:</strong> ¿Qué problemas resuelven estas aplicaciones para ellos?</li>
                <li><strong>Conoce sus hábitos:</strong> ¿Dónde pasan tiempo online? ¿Qué tipo de contenido consumen?</li>
                <li><strong>Adapta tu mensaje:</strong> Personaliza tu comunicación según las características de tu audiencia</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen representativa de segmentación de audiencia]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Segmentación de audiencia para marketing efectivo</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estrategias de contenido</h2>
              <p className="text-foreground/80 mb-4">
                El contenido de calidad es la base de cualquier estrategia de marketing efectiva:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Tutoriales y guías:</strong> Crea contenido que muestre cómo usar las aplicaciones de Flasti</li>
                <li><strong>Casos de uso:</strong> Comparte ejemplos reales de cómo las aplicaciones resuelven problemas</li>
                <li><strong>Comparativas:</strong> Muestra las ventajas de Flasti frente a otras alternativas</li>
                <li><strong>Testimonios:</strong> Comparte tu experiencia personal con las aplicaciones</li>
                <li><strong>Contenido educativo:</strong> Enseña conceptos relacionados con IA y generación de imágenes</li>
                <li><strong>Preguntas frecuentes:</strong> Responde a dudas comunes sobre las aplicaciones</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Canales de promoción</h2>
              <p className="text-foreground/80 mb-4">
                Diversifica tus canales para llegar a más audiencia:
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">1. Redes sociales</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Instagram:</strong> Ideal para mostrar resultados visuales de Flasti Images</li>
                <li><strong>Twitter:</strong> Perfecto para compartir consejos rápidos y enlaces</li>
                <li><strong>Facebook:</strong> Útil para contenido más detallado y grupos de interés</li>
                <li><strong>LinkedIn:</strong> Excelente para alcanzar profesionales y empresas</li>
                <li><strong>TikTok:</strong> Efectivo para tutoriales cortos y demostraciones</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">2. Email marketing</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Construye una lista de suscriptores interesados en IA y tecnología</li>
                <li>Envía newsletters con consejos útiles y enlaces de afiliado</li>
                <li>Crea secuencias de emails educativos que culminen en una promoción</li>
                <li>Segmenta tu lista para enviar contenido más relevante</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">3. Blogs y sitios web</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Crea artículos detallados sobre IA y generación de imágenes</li>
                <li>Optimiza tu contenido para SEO para atraer tráfico orgánico</li>
                <li>Incluye banners y enlaces contextuales a las aplicaciones de Flasti</li>
                <li>Crea landing pages específicas para diferentes audiencias</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">4. YouTube y video marketing</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Crea tutoriales paso a paso sobre cómo usar las aplicaciones</li>
                <li>Comparte demostraciones de resultados en tiempo real</li>
                <li>Realiza comparativas visuales con otras herramientas</li>
                <li>Incluye tus enlaces de afiliado en la descripción de los videos</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">5. Mensajería directa</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Comparte tus enlaces con contactos que podrían beneficiarse de las aplicaciones</li>
                <li>Crea grupos de WhatsApp o Telegram centrados en IA o diseño</li>
                <li>Ofrece ayuda personalizada a quienes muestren interés</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  No bombardees a tus contactos con mensajes promocionales. Asegúrate de que tu comunicación sea relevante y aporte valor.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Técnicas de persuasión efectivas</h2>
              <p className="text-foreground/80 mb-4">
                Implementa estas técnicas para aumentar tus conversiones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Escasez:</strong> "Oferta por tiempo limitado" o "Plazas limitadas"</li>
                <li><strong>Urgencia:</strong> "Últimos días" o "La oferta termina pronto"</li>
                <li><strong>Prueba social:</strong> Comparte testimonios y casos de éxito</li>
                <li><strong>Autoridad:</strong> Posiciónate como experto en el tema</li>
                <li><strong>Reciprocidad:</strong> Ofrece contenido gratuito valioso antes de promocionar</li>
                <li><strong>Compromiso:</strong> Invita a pequeñas acciones antes de la compra</li>
                <li><strong>Afinidad:</strong> Conecta a nivel personal con tu audiencia</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Optimización y análisis</h2>
              <p className="text-foreground/80 mb-4">
                Para mejorar continuamente tus resultados:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Monitorea tus estadísticas:</strong> Revisa regularmente tu dashboard de Flasti</li>
                <li><strong>Identifica patrones:</strong> ¿Qué canales generan más conversiones?</li>
                <li><strong>Prueba A/B:</strong> Experimenta con diferentes mensajes y formatos</li>
                <li><strong>Ajusta tu estrategia:</strong> Refuerza lo que funciona y modifica lo que no</li>
                <li><strong>Mantente actualizado:</strong> Aprende nuevas técnicas y tendencias</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Calendario de marketing</h2>
              <p className="text-foreground/80 mb-4">
                Organiza tus esfuerzos de marketing con un calendario:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Planificación semanal:</strong> Programa tus publicaciones en redes sociales</li>
                <li><strong>Planificación mensual:</strong> Organiza la creación de contenido más extenso</li>
                <li><strong>Fechas especiales:</strong> Aprovecha eventos y temporadas para promociones específicas</li>
                <li><strong>Seguimiento:</strong> Reserva tiempo para analizar resultados y ajustar estrategias</li>
              </ul>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Conoce a tu audiencia y adapta tu mensaje a sus necesidades</li>
                  <li>Crea contenido de valor que muestre los beneficios de las aplicaciones</li>
                  <li>Diversifica tus canales de promoción</li>
                  <li>Implementa técnicas de persuasión efectivas</li>
                  <li>Analiza tus resultados y optimiza continuamente</li>
                  <li>Organiza tus esfuerzos con un calendario de marketing</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Recuerda que el marketing efectivo es un proceso continuo de aprendizaje y mejora. No te desanimes si no ves resultados inmediatos; con persistencia y optimización constante, lograrás aumentar tus conversiones y maximizar tus ganancias como afiliado de Flasti.
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
