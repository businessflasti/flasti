'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Lock,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Shield,
  AlertTriangle,
  Key,
  Eye
} from "lucide-react";
import Link from 'next/link';

export default function SeguridadCuentaPage() {
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
      id: 'configuracion-perfil',
      title: 'Configuración de tu perfil',
      icon: Shield
    },
    {
      id: 'contactar-soporte',
      title: 'Contactar con soporte',
      icon: MessageSquare
    },
    {
      id: 'retiros-pagos',
      title: 'Retiros y pagos',
      icon: Key
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
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Seguridad de tu cuenta</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-foreground/80 mb-6">
                La seguridad de tu cuenta en Flasti es fundamental para proteger tus datos personales y tus ganancias. Esta guía te proporcionará las mejores prácticas para mantener tu cuenta segura.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-4">Importancia de la seguridad de tu cuenta</h2>
              <p className="text-foreground/80 mb-4">
                Mantener tu cuenta segura es crucial por varias razones:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Protección de datos personales:</strong> Tu cuenta contiene información personal que debe mantenerse privada</li>
                <li><strong>Seguridad de tus ganancias:</strong> Un acceso no autorizado podría comprometer tus ingresos</li>
                <li><strong>Integridad de tus enlaces:</strong> Evita que alguien modifique o use indebidamente tus enlaces de afiliado</li>
                <li><strong>Confianza de tus referidos:</strong> Mantener la seguridad refuerza la confianza de quienes utilizan tus enlaces</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">⚠️ Importante:</p>
                <p className="text-sm text-foreground/80">
                  Flasti nunca te pedirá tu contraseña por email, chat o teléfono. Si recibes una solicitud de este tipo, es un intento de phishing.
                </p>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Creación de contraseñas seguras</h2>
              <p className="text-foreground/80 mb-4">
                Una contraseña fuerte es tu primera línea de defensa:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Longitud:</strong> Utiliza al menos 12 caracteres</li>
                <li><strong>Complejidad:</strong> Combina letras mayúsculas, minúsculas, números y símbolos</li>
                <li><strong>Unicidad:</strong> Usa una contraseña diferente para Flasti que no utilices en otros servicios</li>
                <li><strong>Evita lo obvio:</strong> No uses información personal fácilmente adivinable (fechas de nacimiento, nombres, etc.)</li>
                <li><strong>Sin patrones:</strong> Evita secuencias como "123456" o "qwerty"</li>
              </ul>

              <div className="my-8 rounded-lg overflow-hidden border border-white/10">
                <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                  <p className="text-center text-foreground/60">
                    [Imagen de la página de cambio de contraseña]
                  </p>
                </div>
                <div className="p-3 bg-card/50">
                  <p className="text-sm text-foreground/70 text-center">Página de cambio de contraseña en Flasti</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Cambio regular de contraseña</h2>
              <p className="text-foreground/80 mb-4">
                Para mantener tu cuenta segura, te recomendamos:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Cambiar tu contraseña cada 3-6 meses</li>
                <li>Cambiarla inmediatamente si sospechas que alguien más podría conocerla</li>
                <li>No reutilizar contraseñas antiguas</li>
                <li>Utilizar un gestor de contraseñas para generar y almacenar contraseñas seguras</li>
              </ol>

              <p className="text-foreground/80 mb-4">
                Para cambiar tu contraseña:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a "Mi Perfil" en el menú lateral</li>
                <li>Selecciona la pestaña "Seguridad"</li>
                <li>Haz clic en "Cambiar contraseña"</li>
                <li>Ingresa tu contraseña actual</li>
                <li>Crea y confirma tu nueva contraseña</li>
                <li>Haz clic en "Guardar cambios"</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Verificación de correo electrónico</h2>
              <p className="text-foreground/80 mb-4">
                Verificar tu correo electrónico es esencial para:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Confirmar que eres el propietario legítimo de la cuenta</li>
                <li>Recibir notificaciones importantes sobre tu cuenta</li>
                <li>Recuperar el acceso a tu cuenta si olvidas tu contraseña</li>
                <li>Recibir alertas de seguridad</li>
              </ul>

              <p className="text-foreground/80 mb-4">
                Si aún no has verificado tu correo electrónico:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Ve a "Mi Perfil" > "Configuración"</li>
                <li>Busca la sección de correo electrónico</li>
                <li>Haz clic en "Verificar correo" si aparece como no verificado</li>
                <li>Recibirás un email con un enlace de verificación</li>
                <li>Haz clic en el enlace para completar la verificación</li>
              </ol>

              <h2 className="text-xl font-semibold mt-8 mb-4">Protección contra phishing</h2>
              <p className="text-foreground/80 mb-4">
                El phishing es un intento de obtener información confidencial haciéndose pasar por una entidad de confianza. Para protegerte:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Verifica las URLs:</strong> Asegúrate de que estás en flasti.com antes de iniciar sesión</li>
                <li><strong>Desconfía de emails sospechosos:</strong> Flasti solo te enviará emails desde dominios oficiales</li>
                <li><strong>No hagas clic en enlaces sospechosos:</strong> Si tienes dudas, accede directamente a la plataforma escribiendo la URL</li>
                <li><strong>Nunca compartas tu contraseña:</strong> El equipo de Flasti nunca te la pedirá</li>
                <li><strong>Mantén actualizado tu navegador:</strong> Las actualizaciones suelen incluir parches de seguridad</li>
              </ul>

              <div className="bg-card/50 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm font-medium mb-2">🔍 Cómo identificar emails de phishing:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-foreground/80">
                  <li>Errores gramaticales o de ortografía</li>
                  <li>Solicitudes urgentes o amenazantes</li>
                  <li>Remitentes sospechosos (verifica siempre la dirección de email completa)</li>
                  <li>Enlaces que no apuntan a flasti.com</li>
                  <li>Solicitudes de información personal o financiera</li>
                </ul>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4">Monitoreo de actividad de la cuenta</h2>
              <p className="text-foreground/80 mb-4">
                Revisa regularmente la actividad de tu cuenta para detectar accesos no autorizados:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/80">
                <li>Verifica los inicios de sesión recientes en la sección de seguridad</li>
                <li>Comprueba si hay cambios en tu perfil que no hayas realizado</li>
                <li>Revisa tus enlaces de afiliado para asegurarte de que no han sido modificados</li>
                <li>Monitorea tus solicitudes de retiro para detectar actividades sospechosas</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-4">Qué hacer si sospechas que tu cuenta ha sido comprometida</h2>
              <p className="text-foreground/80 mb-4">
                Si crees que alguien ha accedido a tu cuenta sin autorización:
              </p>
              <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/80">
                <li><strong>Cambia tu contraseña inmediatamente</strong></li>
                <li>Verifica y actualiza tu información de contacto</li>
                <li>Revisa tus enlaces de afiliado y asegúrate de que no han sido modificados</li>
                <li>Comprueba si hay solicitudes de retiro no autorizadas</li>
                <li>Contacta con soporte para reportar el incidente</li>
                <li>Revisa otros servicios donde puedas estar usando la misma contraseña</li>
              </ol>

              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
                  <li>Utiliza contraseñas fuertes y únicas para tu cuenta de Flasti</li>
                  <li>Cambia tu contraseña regularmente</li>
                  <li>Verifica tu correo electrónico</li>
                  <li>Protégete contra intentos de phishing</li>
                  <li>Monitorea regularmente la actividad de tu cuenta</li>
                  <li>Actúa rápidamente si sospechas que tu cuenta ha sido comprometida</li>
                </ol>
              </div>

              <p className="text-foreground/80 mb-6">
                La seguridad de tu cuenta es una responsabilidad compartida. Flasti implementa medidas de seguridad avanzadas, pero tu vigilancia y buenas prácticas son fundamentales para mantener tu cuenta protegida.
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
