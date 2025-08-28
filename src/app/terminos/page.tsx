"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Suspense } from "react";

// Metadata se maneja en layout.tsx cuando se usa 'use client'

export default function TerminosPage() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <Suspense fallback={<div className="container-custom py-16 md:py-24">Cargando...</div>}>
        <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            Términos y Condiciones
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              Bienvenido a Flasti. Al acceder o utilizar nuestra plataforma web y servicios, aceptás estos Términos y Condiciones.
              Te recomendamos leerlos con atención para entender cómo funciona nuestra plataforma y cuál es tu experiencia como usuario.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">1. Definiciones</h2>
            <ul className="space-y-3">
              <li>
                <strong>Servicio:</strong> Se refiere a la plataforma web de Flasti y a todas las funcionalidades y contenidos que ofrecemos.
              </li>
              <li>
                <strong>Usuario, Usted, Tu:</strong> Se refiere a la persona que accede o utiliza el Servicio.
              </li>
              <li>
                <strong>Nosotros, Nos, Nuestro:</strong> Se refiere a Flasti.
              </li>
              <li>
                <strong>Contenido:</strong> Son los textos, datos, materiales, recursos y herramientas que podés visualizar o utilizar en Flasti.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">2. Uso del Servicio</h2>
            <p>
              Flasti te ofrece herramientas para generar ingresos a través de microtareas en línea y otras oportunidades digitales. Al usar nuestro servicio, aceptás:
            </p>
            <ul className="space-y-3 mt-4">
              <li>Brindar información real y actualizada al registrarte.</li>
              <li>Mantener la seguridad de tu cuenta y tu contraseña.</li>
              <li>Usar Flasti de forma responsable y respetuosa con los demás.</li>
              <li>No realizar actividades que interfieran con el funcionamiento del sitio.</li>
              <li>No compartir ni publicar contenido que sea ofensivo o inapropiado.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">3. Cuentas y Membresías</h2>
            <p>
              Algunas funciones de Flasti requieren crear una cuenta o adquirir una membresía. Si lo hacés:
            </p>
            <ul className="space-y-3 mt-4">
              <li>Asegurate de proporcionar datos de pago válidos.</li>
              <li>Los pagos realizados se consideran finales, según nuestras políticas.</li>
              <li>Te avisaremos si hay cambios en precios o condiciones.</li>
              <li>Sos responsable de las actividades que se realicen desde tu cuenta.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">4. Propiedad del Contenido</h2>
            <p>
              El contenido que ves en la plataforma es propiedad de Flasti o de quienes nos brindan licencia para usarlo. Está protegido por leyes de derechos de autor.
            </p>
            <p className="mt-3">
              Podés usar el contenido dentro de la plataforma para tu aprendizaje y beneficio personal, pero no está permitido reproducirlo, distribuirlo ni utilizarlo con fines comerciales sin permiso.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">5. Contenido del Usuario</h2>
            <p>
              En algunas secciones podrás compartir comentarios, subir materiales o participar en foros.
            </p>
            <ul className="space-y-3 mt-4">
              <li>Sos responsable del contenido que publiques.</li>
              <li>Asegurate de tener los derechos necesarios para compartir ese contenido.</li>
              <li>Al subir contenido, nos permitís mostrarlo en Flasti para que otros usuarios puedan verlo si corresponde.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">6. Funcionamiento del Servicio</h2>
            <p>
              Trabajamos constantemente para que Flasti funcione de manera segura, rápida y estable. Sin embargo, puede haber momentos en los que el servicio no esté disponible temporalmente por mantenimiento o mejoras.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">7. Cambios en la Plataforma</h2>
            <p>
              Podemos hacer cambios en Flasti para mejorar tu experiencia. Si realizamos ajustes importantes, te lo haremos saber con anticipación.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">8. Legislación Aplicable</h2>
            <p>
              Estos Términos se interpretan según las leyes del país donde Flasti tiene su sede principal.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">9. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en <a href="mailto:access@flasti.com" className="text-primary hover:text-white">access@flasti.com</a>.
            </p>

            <p className="text-sm text-foreground/60 mt-12 pt-6 border-t border-white/10">
              Última actualización: 5 de abril de 2024
            </p>
          </div>
        </div>
      </div>
      </Suspense>
    </MainLayout>
  );
}
