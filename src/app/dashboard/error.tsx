'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Registrar el error en la consola
    console.error('Dashboard error:', error);
  }, [error]);

  const handleReset = async () => {
    setIsLoading(true);
    try {
      // Verificar si hay una sesión activa
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Si hay sesión, intentar reiniciar la página
        reset();
      } else {
        // Si no hay sesión, redirigir al login
        router.push('/login');
      }
    } catch (err) {
      console.error('Error al verificar sesión:', err);
      // En caso de error, intentar reiniciar de todos modos
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-card rounded-xl p-8 space-y-6 text-center border border-primary/10">
          <h2 className="text-3xl font-bold text-gradient">Algo salió mal</h2>
          <p className="text-muted-foreground">
            Lo sentimos, ha ocurrido un error al cargar el dashboard. Estamos trabajando para solucionarlo.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleReset}
              className="glow-effect w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Cargando...
                </>
              ) : (
                'Intentar de nuevo'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
              disabled={isLoading}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}