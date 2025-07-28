'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageLoader from '@/components/ui/PageLoader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, updateBalance } = useAuth();
  const router = useRouter();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Función para verificar la conexión con Supabase
  const checkConnection = async () => {
    try {
      // Intentar una consulta simple para verificar la conexión
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

      if (error) {
        console.error('ProtectedRoute: Error de conexión con Supabase:', error);
        setConnectionError(true);
        return false;
      }

      setConnectionError(false);
      return true;
    } catch (err) {
      console.error('ProtectedRoute: Excepción al verificar conexión:', err);
      setConnectionError(true);
      return false;
    }
  };

  // Efecto para manejar problemas de conexión
  useEffect(() => {
    if (connectionError && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`ProtectedRoute: Reintentando conexión (intento ${retryCount + 1})`);
        checkConnection();
        setRetryCount(prev => prev + 1);
      }, 2000 * (retryCount + 1)); // Esperar más tiempo entre cada reintento

      return () => clearTimeout(timer);
    }
  }, [connectionError, retryCount]);

  useEffect(() => {
    // Verificar conexión al cargar el componente
    checkConnection();

    // Solo redirigir si no estamos cargando, no hay usuario y no hemos intentado redirigir antes
    if (!loading && !user && !redirectAttempted && !connectionError) {
      console.log('ProtectedRoute: Redirigiendo a /login');
      setRedirectAttempted(true);
      router.push('/login');
    }

    // Si el usuario está autenticado, actualizar su balance
    if (!loading && user && !connectionError) {
      console.log('ProtectedRoute: Actualizando balance del usuario');
      updateBalance();

      // Configurar actualización periódica del balance
      const intervalId = setInterval(() => {
        // Verificar conexión antes de actualizar balance
        checkConnection().then(isConnected => {
          if (isConnected) {
            updateBalance();
          }
        });
      }, 30000); // 30 segundos

      return () => clearInterval(intervalId);
    }
  }, [user, loading, router, redirectAttempted, updateBalance, connectionError]);

  // Mostrar mensaje de error de conexión
  if (connectionError && retryCount >= 3) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <div className="glass-card rounded-xl p-8 space-y-6 text-center border border-[#3c66ce]/30">
            <h2 className="text-3xl font-bold text-gradient">Problema de conexión</h2>
            <p className="text-muted-foreground">
              La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet e intenta de nuevo.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  setConnectionError(false);
                  setRetryCount(0);
                  checkConnection();
                }}
                className="glow-effect w-full py-2 px-4 rounded-md bg-primary text-white font-medium"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-2 px-4 rounded-md border border-border bg-transparent"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error de conexión después de varios reintentos, mostrar error
  if (connectionError && retryCount >= 3) {
    // El mensaje de error ya se muestra arriba, aquí solo retornamos null
    return null;
  }

  // Si estamos cargando o no hay usuario, no renderizar nada (dejar que PageLoader maneje)
  if (loading || !user) {
    return null;
  }

  // Si hay usuario autenticado, renderizar los hijos directamente
  return children;
}
