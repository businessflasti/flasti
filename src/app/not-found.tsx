import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gradient">404</h2>
          <h3 className="text-xl font-semibold mb-2">Página no encontrada</h3>
          <p className="mb-6 text-foreground/70">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </Suspense>
  );
}
