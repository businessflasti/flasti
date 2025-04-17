import MainLayout from "@/components/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Flasti",
  description: "Política de privacidad y uso de datos de la plataforma Flasti.",
};

export default function PrivacidadPage() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
            Política de Privacidad
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              En Flasti valoramos tu confianza. Por eso, queremos que sepas cómo recopilamos y usamos tu información cuando accedés a nuestra plataforma y servicios.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Información que recopilamos</h2>
            <p>
              Recopilamos datos necesarios para brindarte una mejor experiencia, incluyendo:
            </p>
            <ul className="space-y-3 mt-4">
              <li>
                <strong>Datos personales:</strong> Como tu nombre y correo electrónico cuando los proporcionás.
              </li>
              <li>
                <strong>Información de uso:</strong> Cómo interactuás con la plataforma (por ejemplo, secciones visitadas o funciones utilizadas).
              </li>
              <li>
                <strong>Cookies:</strong> Utilizamos cookies para mejorar tu experiencia y recordar tus preferencias.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Cómo usamos tu información</h2>
            <p>
              Usamos esta información para:
            </p>
            <ul className="space-y-3 mt-4">
              <li>Ofrecerte un servicio funcional, simple y personalizado.</li>
              <li>Enviarte información útil, novedades o soporte cuando lo necesites.</li>
              <li>Analizar el uso de la plataforma para seguir mejorándola.</li>
              <li>Detectar y prevenir errores técnicos o usos indebidos.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Seguridad</h2>
            <p>
              En Flasti utilizamos sistemas de seguridad avanzada con cifrado de extremo a extremo para proteger toda tu información personal.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Tus derechos</h2>
            <p>
              Podés:
            </p>
            <ul className="space-y-3 mt-4">
              <li>Consultar qué datos tenemos sobre vos.</li>
              <li>Actualizar o corregir tu información.</li>
              <li>Solicitar que eliminemos tus datos si ya no usás la plataforma.</li>
            </ul>
            <p className="mt-4">
              Para cualquiera de estos casos, podés escribirnos a <a href="mailto:access@flasti.com" className="text-primary hover:text-accent">access@flasti.com</a>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Política de Cookies</h2>
            <p>
              Usamos cookies para que la experiencia en Flasti sea personalizada y rápida.
            </p>
            <p className="mt-4">
              <strong>Tipos de cookies que usamos:</strong>
            </p>
            <ul className="space-y-3 mt-4">
              <li><strong>Cookies esenciales:</strong> Para que la plataforma funcione correctamente.</li>
              <li><strong>Cookies de rendimiento:</strong> Para entender cómo navegás y mejorar la experiencia.</li>
              <li><strong>Cookies de funcionalidad:</strong> Para recordar tus preferencias.</li>
            </ul>
            <p className="mt-4">
              <strong>Control de cookies:</strong> Podés configurar tu navegador para limitar o bloquear cookies cuando lo desees.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Cambios en esta política</h2>
            <p>
              Si actualizamos algo importante, te lo haremos saber de forma clara. Siempre vas a poder consultar la última versión desde nuestra plataforma.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">¿Dudas?</h2>
            <p>
              Podés escribirnos en cualquier momento a <a href="mailto:access@flasti.com" className="text-primary hover:text-accent">access@flasti.com</a>. Estamos para ayudarte.
            </p>

            <p className="text-sm text-foreground/60 mt-12 pt-6 border-t border-white/10">
              Última actualización: 23 de marzo de 2024
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
