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
  Link2,
  Copy,
  BarChart2,
  Settings
} from "lucide-react";
import Link from 'next/link';

export default function EnlacesAfiliadoPage() {
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
      icon: BarChart2
    },
    {
      id: 'estrategias-marketing',
      title: 'Estrategias de marketing efectivas',
      icon: Link2
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
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Cómo usar tus enlaces de afiliado</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Los enlaces de afiliado son la herramienta principal para generar ingresos en Flasti. Esta guía te enseñará cómo obtenerlos, compartirlos y maximizar tus ganancias.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">¿Qué son los enlaces de afiliado?</h2>
              <p className="text-foreground/80 mb-4">
                Los enlaces de afiliado son URLs personalizadas que contienen tu identificador único. Cuando alguien hace clic en tu enlace y realiza una compra, el sistema registra automáticamente que la venta provino de ti, y recibes una comisión.
              </p>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Cada enlace es único para ti y para la aplicación específica que estás promocionando. No compartas enlaces de otros afiliados ni modifiques manualmente tus enlaces.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo obtener tus enlaces</h2>
              <p className="text-foreground/80 mb-4">
                Obtener tus enlaces de afiliado es muy sencillo:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Inicia sesión en tu cuenta de Flasti</li>
                <li>Ve a la sección "Mis Enlaces" en el menú lateral</li>
                <li>Selecciona la aplicación que deseas promocionar</li>
                <li>Haz clic en el botón "Generar Enlace"</li>
                <li>¡Listo! Tu enlace de afiliado personalizado aparecerá en pantalla</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la sección "Mis Enlaces"]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Sección "Mis Enlaces" en el dashboard</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo compartir tus enlaces</h2>
              <p className="text-foreground/80 mb-4">
                Hay muchas formas de compartir tus enlaces de afiliado:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Redes sociales:</strong> Comparte tus enlaces en Facebook, Instagram, Twitter, etc.</li>
                <li><strong>Mensajería instantánea:</strong> Envía tus enlaces por WhatsApp, Telegram, Messenger, etc.</li>
                <li><strong>Email:</strong> Incluye tus enlaces en tus correos electrónicos</li>
                <li><strong>Sitio web o blog:</strong> Integra tus enlaces en tu contenido web</li>
                <li><strong>Videos:</strong> Incluye tus enlaces en la descripción de tus videos</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Al compartir tus enlaces, asegúrate de cumplir con las políticas de cada plataforma. Algunas redes sociales tienen restricciones sobre cómo se pueden compartir enlaces de afiliado.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Mejores prácticas para compartir enlaces</h2>
              <p className="text-foreground/80 mb-4">
                Para maximizar la efectividad de tus enlaces, sigue estas recomendaciones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Sé transparente:</strong> Informa a tu audiencia que estás compartiendo un enlace de afiliado</li>
                <li><strong>Proporciona valor:</strong> Explica los beneficios del producto o servicio que estás promocionando</li>
                <li><strong>Personaliza tu mensaje:</strong> Adapta tu comunicación según la plataforma y audiencia</li>
                <li><strong>Usa llamadas a la acción claras:</strong> Indica a tu audiencia qué acción esperas que realicen</li>
                <li><strong>Prueba diferentes enfoques:</strong> Experimenta con distintos mensajes y formatos</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Seguimiento de resultados</h2>
              <p className="text-foreground/80 mb-4">
                Es fundamental monitorear el rendimiento de tus enlaces:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Revisa regularmente la sección "Estadísticas" en tu dashboard</li>
                <li>Analiza qué enlaces generan más clics y conversiones</li>
                <li>Identifica en qué plataformas obtienes mejores resultados</li>
                <li>Ajusta tus estrategias según los datos obtenidos</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Consejos avanzados</h2>
              <p className="text-foreground/80 mb-4">
                Para llevar tus resultados al siguiente nivel:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Acortadores de URL:</strong> Puedes usar acortadores para hacer tus enlaces más limpios y fáciles de compartir</li>
                <li><strong>Pruebas A/B:</strong> Compara diferentes mensajes y formatos para ver cuáles funcionan mejor</li>
                <li><strong>Segmentación:</strong> Dirige tus enlaces a audiencias específicas que puedan estar interesadas en el producto</li>
                <li><strong>Timing:</strong> Comparte tus enlaces en los momentos de mayor actividad de tu audiencia</li>
                <li><strong>Contenido complementario:</strong> Crea contenido que complemente y añada valor a tus enlaces</li>
              </ul>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Obtén tus enlaces de afiliado desde la sección "Mis Enlaces"</li>
                  <li>Comparte tus enlaces en diversas plataformas</li>
                  <li>Sé transparente y proporciona valor al compartir</li>
                  <li>Monitorea el rendimiento de tus enlaces</li>
                  <li>Ajusta tus estrategias según los resultados obtenidos</li>
                  <li>Implementa técnicas avanzadas para maximizar tus conversiones</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Recuerda que la clave del éxito está en la consistencia y en proporcionar valor real a tu audiencia. Cuanto más útil y relevante sea tu contenido, más probabilidades tendrás de generar conversiones a través de tus enlaces de afiliado.
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
