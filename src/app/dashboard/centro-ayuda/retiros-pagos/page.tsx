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
  CreditCard,
  Calendar,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import Link from 'next/link';

export default function RetirosPagosPage() {
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
      id: 'niveles-comisiones',
      title: 'Niveles y comisiones',
      icon: DollarSign
    },
    {
      id: 'optimizar-ganancias',
      title: 'Cómo optimizar tus ganancias',
      icon: CreditCard
    },
    {
      id: 'preguntas-frecuentes',
      title: 'Preguntas frecuentes',
      icon: HelpCircle
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
              <h1 className="text-2xl font-bold">Retiros y pagos</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                En esta guía, aprenderás todo lo que necesitas saber sobre cómo retirar tus ganancias en Flasti, los métodos de pago disponibles y el proceso de pago.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Métodos de pago disponibles</h2>
              <p className="text-foreground/80 mb-4">
                Flasti ofrece dos métodos principales para recibir tus ganancias:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>PayPal:</strong> Método rápido y seguro para recibir pagos en línea</li>
                <li><strong>Transferencia bancaria:</strong> Transferencia directa a tu cuenta bancaria</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  PayPal suele ser la opción más rápida y está disponible en la mayoría de los países. Sin embargo, las transferencias bancarias pueden ser más convenientes para montos mayores.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Configurar tu método de pago</h2>
              <p className="text-foreground/80 mb-4">
                Antes de poder solicitar un retiro, debes configurar tu método de pago preferido:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la sección "Configuración" en tu dashboard</li>
                <li>Selecciona la pestaña "Métodos de pago"</li>
                <li>Haz clic en "Añadir método de pago"</li>
                <li>Selecciona PayPal o Transferencia bancaria</li>
                <li>Completa la información requerida</li>
                <li>Guarda los cambios</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la configuración de métodos de pago]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Configuración de métodos de pago en Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cómo solicitar un retiro</h2>
              <p className="text-foreground/80 mb-4">
                Para solicitar un retiro de tus ganancias:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la sección "Retiros" en tu dashboard</li>
                <li>Selecciona el método de pago que deseas utilizar</li>
                <li>Ingresa el monto que deseas retirar</li>
                <li>Haz clic en "Solicitar retiro"</li>
                <li>Confirma la solicitud</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  No hay monto mínimo para solicitar un retiro. Puedes retirar cualquier cantidad disponible en tu balance.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Calendario de pagos</h2>
              <p className="text-foreground/80 mb-6">
                Los pagos en Flasti se procesan de la siguiente manera:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Frecuencia de procesamiento:</strong> Los pagos se procesan cada 15 días</li>
                <li><strong>Tiempo de recepción:</strong> Una vez procesado, recibirás tu pago en un plazo de 1-3 días hábiles</li>
                <li><strong>Notificaciones:</strong> Recibirás un email cuando tu pago haya sido procesado</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Historial de pagos</h2>
              <p className="text-foreground/80 mb-4">
                Puedes consultar tu historial completo de pagos en cualquier momento:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la sección "Retiros" en tu dashboard</li>
                <li>Selecciona la pestaña "Historial de pagos"</li>
                <li>Aquí podrás ver todos tus retiros anteriores, incluyendo:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground/80">
                    <li>Fecha de solicitud</li>
                    <li>Monto</li>
                    <li>Método de pago</li>
                    <li>Estado (Pendiente, Procesado, Completado)</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Estados de los pagos</h2>
              <p className="text-foreground/80 mb-4">
                Tus solicitudes de retiro pueden tener diferentes estados:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Pendiente:</strong> Tu solicitud ha sido recibida y está en espera de procesamiento</li>
                <li><strong>Procesando:</strong> Tu pago está siendo procesado</li>
                <li><strong>Completado:</strong> El pago ha sido enviado a tu método de pago seleccionado</li>
                <li><strong>Rechazado:</strong> La solicitud ha sido rechazada (se proporcionará un motivo)</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Preguntas frecuentes sobre pagos</h2>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">¿Hay alguna comisión por retirar mis ganancias?</h3>
              <p className="text-foreground/80 mb-4">
                No, Flasti no cobra ninguna comisión por procesar tus retiros. Sin embargo, es posible que PayPal o tu banco apliquen sus propias comisiones por recibir pagos internacionales.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">¿Qué hago si mi pago está retrasado?</h3>
              <p className="text-foreground/80 mb-4">
                Si han pasado más de 3 días hábiles desde que tu pago fue procesado y aún no lo has recibido, te recomendamos:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Verificar que la información de tu método de pago sea correcta</li>
                <li>Revisar tu email por si has recibido alguna notificación</li>
                <li>Contactar con nuestro equipo de soporte</li>
              </ol>

              <h3 className="text-lg font-semibold mt-6 mb-3">¿Puedo cambiar mi método de pago después de solicitar un retiro?</h3>
              <p className="text-foreground/80 mb-4">
                No es posible cambiar el método de pago una vez que has solicitado un retiro. Si necesitas cambiar tu método de pago, deberás esperar a que se complete el retiro actual o cancelarlo (si aún está pendiente) y luego solicitar uno nuevo con el método deseado.
              </p>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Configura tu método de pago preferido (PayPal o transferencia bancaria)</li>
                  <li>Solicita un retiro desde la sección "Retiros" en tu dashboard</li>
                  <li>Los pagos se procesan cada 15 días</li>
                  <li>Recibirás tu pago en 1-3 días hábiles después del procesamiento</li>
                  <li>Puedes consultar el estado de tus pagos en el historial de pagos</li>
                  <li>No hay monto mínimo para solicitar un retiro</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Si tienes alguna pregunta adicional sobre retiros y pagos, no dudes en contactar con nuestro equipo de soporte, quienes estarán encantados de ayudarte.
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
