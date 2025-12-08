'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, updateBalance } = useAuth();
  const router = useRouter();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

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

  // Timeout de seguridad: si loading tarda más de 10 segundos, forzar redirección
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('ProtectedRoute: Timeout de carga alcanzado');
        setLoadingTimeout(true);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

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
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: '#101010' }}>
        <div className="max-w-md w-full">
          <div className="rounded-xl p-8 space-y-6 text-center" style={{ backgroundColor: '#1a1a1a' }}>
            <h2 className="text-3xl font-bold text-white">Problema de conexión</h2>
            <p className="text-white">
              La conexión con el servidor está tardando demasiado. Por favor, verifica tu conexión a internet e intenta de nuevo.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  setConnectionError(false);
                  setRetryCount(0);
                  checkConnection();
                }}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-4 rounded-lg border border-gray-600 bg-transparent text-white hover:bg-gray-700 transition-colors"
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

  // Si el timeout de carga se alcanzó y no hay usuario, redirigir a login
  if (loadingTimeout && !user) {
    console.log('ProtectedRoute: Timeout alcanzado sin usuario, redirigiendo a login');
    if (!redirectAttempted) {
      setRedirectAttempted(true);
      router.push('/login');
    }
    return null;
  }

  // Si estamos cargando, mostrar un indicador mínimo (el PageLoader global ya maneja esto)
  if (loading && !loadingTimeout) {
    return null;
  }

  // Si no hay usuario después de cargar, no renderizar nada (ya se redirigió)
  if (!user) {
    return null;
  }

  // Si hay usuario autenticado, renderizar los hijos directamente
  return children;
}
