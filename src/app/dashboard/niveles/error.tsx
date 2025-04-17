'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Aquí podrías registrar el error en un servicio de análisis
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 bg-card/60 backdrop-blur-md border-border/40">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Algo salió mal</h2>
          <p className="text-muted-foreground">
            Lo sentimos, ha ocurrido un error al cargar la página de niveles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              onClick={() => reset()}
              className="bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#facc15] hover:opacity-90 transition-opacity"
            >
              Intentar de nuevo
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-border/40 hover:bg-background/50"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}