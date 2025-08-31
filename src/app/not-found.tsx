import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] p-4">
      <div className="text-center bg-[#232323] rounded-2xl p-8 shadow-xl max-w-lg w-full">
        <h2 className="text-4xl font-bold mb-4 text-white">404</h2>
        <h3 className="text-xl font-semibold mb-2 text-white">Página no encontrada</h3>
        <p className="mb-6 text-white/85">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-[#3C66CE] text-white hover:opacity-90 transition-opacity">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#101010]"><div className="animate-spin text-white mb-2">⟳</div><p className="ml-2 text-white">Cargando...</p></div>}>
      <NotFoundContent />
    </Suspense>
  );
}
