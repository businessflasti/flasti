'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Settings,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  User,
  Lock,
  Mail,
  CreditCard
} from "lucide-react";
import Link from 'next/link';

export default function ConfiguracionPerfilPage() {
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
      id: 'seguridad-cuenta',
      title: 'Seguridad de tu cuenta',
      icon: Lock
    },
    {
      id: 'retiros-pagos',
      title: 'Retiros y pagos',
      icon: CreditCard
    },
    {
      id: 'tutor-designado',
      title: 'Tu tutor designado',
      icon: User
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
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Configuración de tu perfil</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                Mantener tu perfil actualizado y correctamente configurado es esencial para aprovechar al máximo tu experiencia en Flasti. Esta guía te mostrará cómo gestionar todos los aspectos de tu perfil.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Acceder a la configuración de tu perfil</h2>
              <p className="text-foreground/80 mb-4">
                Para acceder a la configuración de tu perfil:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Inicia sesión en tu cuenta de Flasti</li>
                <li>Haz clic en "Mi Perfil" en el menú lateral</li>
                <li>Selecciona la pestaña "Configuración"</li>
              </ol>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la página de configuración de perfil]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Página de configuración de perfil en Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Información personal</h2>
              <p className="text-foreground/80 mb-4">
                En la sección de información personal, puedes actualizar:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Nombre completo:</strong> Tu nombre y apellidos</li>
                <li><strong>Nombre de usuario:</strong> El nombre que se mostrará en tu perfil</li>
                <li><strong>Correo electrónico:</strong> Tu dirección de email principal</li>
                <li><strong>Número de teléfono:</strong> Para verificación y recuperación de cuenta</li>
                <li><strong>País:</strong> Tu ubicación geográfica</li>
                <li><strong>Idioma preferido:</strong> El idioma en que verás la plataforma</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">💡 Consejo:</p>
                <p className="text-sm text-foreground/80">
                  Mantén tu información de contacto actualizada para recibir notificaciones importantes sobre tus ganancias, pagos y actualizaciones de la plataforma.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Foto de perfil</h2>
              <p className="text-foreground/80 mb-4">
                Para cambiar o actualizar tu foto de perfil:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Haz clic en la imagen de perfil actual o en el botón "Cambiar foto"</li>
                <li>Selecciona una nueva imagen desde tu dispositivo</li>
                <li>Ajusta el recorte de la imagen si es necesario</li>
                <li>Haz clic en "Guardar"</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Tu foto de perfil se mostrará en formato circular. Para obtener mejores resultados, utiliza una imagen cuadrada con buena resolución.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cambiar contraseña</h2>
              <p className="text-foreground/80 mb-4">
                Para cambiar tu contraseña:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la pestaña "Seguridad" en la configuración de tu perfil</li>
                <li>Haz clic en "Cambiar contraseña"</li>
                <li>Ingresa tu contraseña actual</li>
                <li>Ingresa y confirma tu nueva contraseña</li>
                <li>Haz clic en "Guardar cambios"</li>
              </ol>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">🔒 Recomendación de seguridad:</p>
                <p className="text-sm text-foreground/80">
                  Utiliza una contraseña única y segura que incluya letras mayúsculas, minúsculas, números y símbolos. Evita usar la misma contraseña que utilizas en otros servicios.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Configuración de métodos de pago</h2>
              <p className="text-foreground/80 mb-4">
                Para configurar o actualizar tus métodos de pago:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la pestaña "Métodos de pago" en la configuración de tu perfil</li>
                <li>Selecciona "Añadir método de pago" o "Editar" un método existente</li>
                <li>Elige entre PayPal o transferencia bancaria</li>
                <li>Completa la información requerida:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground/80">
                    <li>Para PayPal: Tu dirección de correo electrónico de PayPal</li>
                    <li>Para transferencia bancaria: Nombre del banco, número de cuenta, código SWIFT/BIC, etc.</li>
                  </ul>
                </li>
                <li>Haz clic en "Guardar"</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Preferencias de notificaciones</h2>
              <p className="text-foreground/80 mb-4">
                Puedes personalizar qué notificaciones recibes y cómo las recibes:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la pestaña "Notificaciones" en la configuración de tu perfil</li>
                <li>Configura tus preferencias para cada tipo de notificación:
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-foreground/80">
                    <li>Ventas y comisiones</li>
                    <li>Pagos procesados</li>
                    <li>Actualizaciones de la plataforma</li>
                    <li>Consejos y recursos</li>
                    <li>Mensajes de tu tutor</li>
                  </ul>
                </li>
                <li>Selecciona cómo quieres recibir cada notificación (email, SMS, o ambos)</li>
                <li>Haz clic en "Guardar preferencias"</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Configuración de idioma</h2>
              <p className="text-foreground/80 mb-4">
                Flasti está disponible en varios idiomas. Para cambiar el idioma de la plataforma:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a la pestaña "Preferencias" en la configuración de tu perfil</li>
                <li>Selecciona tu idioma preferido del menú desplegable (Español, Inglés o Portugués)</li>
                <li>Haz clic en "Guardar preferencias"</li>
              </ol>
              <p className="text-foreground/80 mb-4">
                También puedes cambiar rápidamente el idioma utilizando el selector de idioma en la parte superior del dashboard.
              </p>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Accede a la configuración de tu perfil desde "Mi Perfil" en el menú lateral</li>
                  <li>Mantén actualizada tu información personal</li>
                  <li>Personaliza tu foto de perfil</li>
                  <li>Configura una contraseña segura</li>
                  <li>Añade tus métodos de pago preferidos</li>
                  <li>Personaliza tus preferencias de notificaciones</li>
                  <li>Selecciona tu idioma preferido</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                Mantener tu perfil actualizado y correctamente configurado te ayudará a tener una experiencia más fluida y personalizada en Flasti. Si tienes alguna dificultad con la configuración de tu perfil, no dudes en contactar con nuestro equipo de soporte.
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
