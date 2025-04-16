'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">¡Ups! Algo salió mal</h2>
        <p className="mb-6 text-foreground/70">
          Ocurrió un error al cargar esta página. Por favor, inténtalo de nuevo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => reset()}
          >
            Intentar nuevamente
          </Button>
          <Link href="/">
            <Button>
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
