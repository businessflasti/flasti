'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronRight,
  Share2,
  DollarSign,
  Settings
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function PrimerosPasosPage() {
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
      id: 'retiros-pagos',
      title: 'Retiros y pagos',
      icon: DollarSign
    },
    {
      id: 'configuracion-perfil',
      title: 'Configuración de tu perfil',
      icon: Settings
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
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Primeros pasos con Flasti</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Bienvenido a Flasti, la plataforma que te permite generar ingresos de manera sencilla y efectiva. Esta guía te ayudará a dar tus primeros pasos y comenzar a ganar dinero lo antes posible.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">1. Configura tu cuenta</h2>
              <p className="text-foreground/80 mb-4">
                Lo primero que debes hacer es completar la configuración de tu cuenta. Esto incluye:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Verificar tu dirección de correo electrónico</li>
                <li>Completar tu perfil con información personal</li>
                <li>Configurar tu método de pago preferido (PayPal o cuenta bancaria)</li>
                <li>Establecer una contraseña segura</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Utiliza una contraseña única y segura para tu cuenta de Flasti. Recomendamos combinar letras mayúsculas, minúsculas, números y símbolos.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">2. Explora tu dashboard</h2>
              <p className="text-foreground/80 mb-4">
                Tu dashboard es el centro de control de tu actividad en Flasti. Desde aquí podrás:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ver tus estadísticas de ganancias</li>
                <li>Acceder a tus enlaces de afiliado</li>
                <li>Explorar las aplicaciones disponibles para promocionar</li>
                <li>Solicitar retiros de tus ganancias</li>
                <li>Acceder a recursos y materiales de marketing</li>
                <li>Contactar con soporte</li>
              </ul>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen del dashboard de Flasti]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Vista general del dashboard de Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">3. Obtén tus enlaces de afiliado</h2>
              <p className="text-foreground/80 mb-6">
                Los enlaces de afiliado son la herramienta principal para generar ingresos. Cada enlace está vinculado a tu cuenta y te permite ganar comisiones cuando alguien realiza una compra a través de él.
              </p>
              <p className="text-foreground/80 mb-4">
                Para obtener tus enlaces:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la sección "Mis Enlaces" en tu dashboard</li>
                <li>Selecciona la aplicación que deseas promocionar</li>
                <li>Haz clic en "Generar Enlace"</li>
                <li>Copia el enlace generado</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  No modifiques manualmente tus enlaces de afiliado, ya que esto podría hacer que no se registren correctamente tus comisiones.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">4. Comparte tus enlaces</h2>
              <p className="text-foreground/80 mb-4">
                Ahora que tienes tus enlaces, es momento de compartirlos. Puedes hacerlo a través de:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Redes sociales (Facebook, Instagram, Twitter, etc.)</li>
                <li>Mensajería instantánea (WhatsApp, Telegram, etc.)</li>
                <li>Email</li>
                <li>Tu sitio web o blog</li>
                <li>Foros y comunidades online</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">5. Monitorea tus resultados</h2>
              <p className="text-foreground/80 mb-4">
                Es importante que monitorees regularmente tus resultados para optimizar tus estrategias:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Revisa tus estadísticas diariamente</li>
                <li>Identifica qué enlaces generan más conversiones</li>
                <li>Analiza en qué plataformas obtienes mejores resultados</li>
                <li>Ajusta tus estrategias según los datos obtenidos</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">6. Solicita tus pagos</h2>
              <p className="text-foreground/80 mb-6">
                Una vez que hayas generado ganancias, podrás solicitar tus pagos:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la sección "Retiros" en tu dashboard</li>
                <li>Selecciona el método de pago que configuraste</li>
                <li>Ingresa el monto que deseas retirar</li>
                <li>Confirma la solicitud</li>
              </ol>
              <p className="text-foreground/80 mb-6">
                Los pagos se procesan cada 15 días y se envían en un plazo de 1-3 días hábiles.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">7. Mejora tu nivel</h2>
              <p className="text-foreground/80 mb-4">
                En Flasti, puedes subir de nivel a medida que generas más ganancias:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Nivel 1:</strong> Comisión del 50%</li>
                <li><strong>Nivel 2:</strong> Comisión del 60% (se desbloquea al alcanzar $20 en ganancias)</li>
                <li><strong>Nivel 3:</strong> Comisión del 70% (se desbloquea al alcanzar $30 en ganancias)</li>
              </ul>
              <p className="text-foreground/80 mb-6">
                Cuanto mayor sea tu nivel, mayores serán tus comisiones por cada venta.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">8. Utiliza los recursos disponibles</h2>
              <p className="text-foreground/80 mb-4">
                Flasti te ofrece diversos recursos para maximizar tus ganancias:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Materiales de marketing</li>
                <li>Guías y tutoriales</li>
                <li>Soporte personalizado</li>
                <li>Comunidad de afiliados</li>
              </ul>
              <p className="text-foreground/80 mb-6">
                Aprovecha estos recursos para mejorar tus estrategias y aumentar tus ganancias.
              </p>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Configura tu cuenta completamente</li>
                  <li>Explora tu dashboard para familiarizarte con la plataforma</li>
                  <li>Obtén tus enlaces de afiliado personalizados</li>
                  <li>Comparte tus enlaces en diferentes plataformas</li>
                  <li>Monitorea tus resultados regularmente</li>
                  <li>Solicita tus pagos cuando generes ganancias</li>
                  <li>Mejora tu nivel para aumentar tus comisiones</li>
                  <li>Utiliza los recursos disponibles para optimizar tus estrategias</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                ¡Felicidades! Ahora estás listo para comenzar a generar ingresos con Flasti. Recuerda que nuestro equipo de soporte está disponible para ayudarte en cualquier momento.
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
