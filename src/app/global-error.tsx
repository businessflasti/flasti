'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error en la consola con detalles
    console.error('Error global en la aplicación:', error);
    console.error('Error stack:', error.stack);
    console.error('Error digest:', error.digest);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Error en la aplicación</h2>
            <p className="mb-4 text-foreground/80">
              Lo sentimos, ha ocurrido un error inesperado en la aplicación.
            </p>
            
            <div className="bg-red-50 p-4 rounded-lg mb-4 text-left">
              <h3 className="font-bold mb-2 text-red-700">Detalles del error:</h3>
              <p className="text-sm text-red-600 break-words">{error.message}</p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={reset}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
