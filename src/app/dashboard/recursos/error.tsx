'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcionalmente registrar el error en un servicio de reporte
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-xl p-6 space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gradient">Algo salió mal</h2>
          <p className="text-muted-foreground">
            Lo sentimos, ha ocurrido un error al cargar los recursos.
          </p>
          <Button
            onClick={reset}
            className="glow-effect mt-4"
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}