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
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // Registrar el error en la consola con más detalles
    console.error('Dashboard error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Guardar detalles del error para mostrarlos al usuario si es necesario
    setErrorDetails(error.message);

    // Intentar recuperarse automáticamente en el primer error
    if (retryCount === 0) {
      handleReset();
    }
  }, [error]);

  const handleReset = async () => {
    setIsLoading(true);
    setRetryCount(prev => prev + 1);

    try {
      // Esperar un momento antes de intentar de nuevo para dar tiempo a que se estabilice la conexión
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si hay una sesión activa
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error al verificar sesión:', sessionError);
        throw sessionError;
      }

      if (data.session) {
        console.log('Sesión activa encontrada, intentando reiniciar la página...');

        // Intentar cargar el perfil del usuario para verificar que todo está bien
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error al cargar perfil:', profileError);
          // Si hay un error que no sea "no encontrado", podría ser un problema de conexión
          throw profileError;
        }

        // Si todo está bien, reiniciar la página
        reset();
      } else {
        // Si no hay sesión, redirigir al login
        console.log('No hay sesión activa, redirigiendo al login...');
        router.push('/login');
      }
    } catch (err) {
      console.error('Error durante el proceso de recuperación:', err);
      // Mostrar el error al usuario
      setErrorDetails(err instanceof Error ? err.message : 'Error de conexión con el servidor');
      // No reintentar automáticamente para evitar bucles infinitos
      setIsLoading(false);
    } finally {
      if (isLoading) setIsLoading(false);
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

          {errorDetails && retryCount > 1 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm text-red-600 dark:text-red-400 mt-4 text-left">
              <p className="font-medium mb-1">Detalles del error:</p>
              <p className="break-words">{errorDetails}</p>
            </div>
          )}

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