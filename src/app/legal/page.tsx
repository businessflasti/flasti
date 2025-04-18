import MainLayout from "@/components/layout/MainLayout";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flasti | Información Legal",
  description: "Información legal y marco normativo de la plataforma Flasti.",
};

export default function LegalPage() {
  return (
    <MainLayout showHeader={true}>
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
            Información Legal
          </h1>

          <div className="prose prose-invert prose-lg max-w-none">
            <p>
              En Flasti, asumimos un compromiso firme con la transparencia, el cumplimiento normativo y el uso responsable de nuestra plataforma. Esta sección ofrece información general sobre el marco legal que rige el uso de nuestros servicios.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Propiedad Intelectual</h2>
            <p>
              Todos los contenidos, funcionalidades, marcas, diseños, textos, imágenes, aplicaciones y recursos disponibles en nuestra plataforma están protegidos por derechos de propiedad intelectual. Queda estrictamente prohibido el uso no autorizado, reproducción, distribución o modificación de cualquier parte de Flasti sin el consentimiento previo por escrito.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Uso Responsable</h2>
            <p>
              El acceso y uso de Flasti debe realizarse de manera responsable, respetando tanto los términos de uso como la integridad de la plataforma y de su comunidad. Nos reservamos el derecho de limitar o suspender el acceso a los servicios ante cualquier uso indebido o comportamiento que vulnere nuestras políticas.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Documentos Relacionados</h2>
            <p>
              Para más información sobre nuestras condiciones, podés consultar nuestros <Link href="/terminos" className="text-primary hover:text-accent">Términos de Uso</Link> y nuestra <Link href="/privacidad" className="text-primary hover:text-accent">Política de Privacidad</Link>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Contacto Legal</h2>
            <p>
              Ante cualquier duda o consulta legal, podés contactarnos directamente a <a href="mailto:access@flasti.com" className="text-primary hover:text-accent">access@flasti.com</a>.
            </p>

            <p className="text-sm text-foreground/60 mt-12 pt-6 border-t border-white/10">
              Última actualización: 17 de octubre de 2023
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
