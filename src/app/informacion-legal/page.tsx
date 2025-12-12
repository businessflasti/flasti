"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Suspense } from "react";

// Metadata se maneja en layout.tsx cuando se usa 'use client'

export default function InformacionLegalPage() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <Suspense fallback={<div className="container-custom py-16 md:py-24">Cargando...</div>}>
        <div 
          className="min-h-screen"
          style={{
            backgroundColor: '#F6F3F3',
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout style paint',
            backfaceVisibility: 'hidden'
          }}
        >
          <div 
            className="container-custom py-16 md:py-24"
            style={{
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#111827' }}>
                Información Legal
              </h1>

              <div 
                className="p-8 md:p-10 rounded-3xl relative overflow-hidden transition-opacity duration-300"
                style={{
                  backgroundColor: '#FFFFFF',
                  transform: 'translate3d(0, 0, 0)',
                  contain: 'layout style paint'
                }}
              >
                <div className="relative z-10 prose prose-lg max-w-none" style={{ color: '#6B7280' }}>
            <p>
              En Flasti, asumimos un compromiso firme con la transparencia, el cumplimiento normativo y el uso responsable de nuestra plataforma. Esta sección ofrece información general sobre el marco legal que rige el uso de nuestros servicios.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: '#111827' }}>Propiedad Intelectual</h2>
            <p>
              Todos los contenidos, funcionalidades, marcas, diseños, textos, imágenes, aplicaciones y recursos disponibles en nuestra plataforma están protegidos por derechos de propiedad intelectual. Queda estrictamente prohibido el uso no autorizado, reproducción, distribución o modificación de cualquier parte de Flasti sin el consentimiento previo por escrito.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: '#111827' }}>Uso Responsable</h2>
            <p>
              El acceso y uso de Flasti debe realizarse de manera responsable, respetando tanto los términos de uso como la integridad de la plataforma y de su comunidad. Nos reservamos el derecho de limitar o suspender el acceso a los servicios ante cualquier uso indebido o comportamiento que vulnere nuestras políticas.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: '#111827' }}>Documentos Relacionados</h2>
            <p>
              Para más información sobre nuestras condiciones, podés consultar nuestros <a href="/terminos" style={{ color: '#0D50A4' }}>Términos de Uso</a> y nuestra <a href="/privacidad" style={{ color: '#0D50A4' }}>Política de Privacidad</a>.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: '#111827' }}>Contacto Legal</h2>
            <p>
              Ante cualquier duda o consulta legal, podés contactarnos directamente a <a href="mailto:access@flasti.com" style={{ color: '#0D50A4' }}>access@flasti.com</a>.
            </p>

                  <p className="text-sm mt-12 pt-6 border-t" style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}>
                    Última actualización: 17 de octubre de 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </MainLayout>
  );
}