'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, updateBalance } = useAuth();
  const router = useRouter();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Solo redirigir si no estamos cargando, no hay usuario y no hemos intentado redirigir antes
    if (!loading && !user && !redirectAttempted) {
      console.log('ProtectedRoute: Redirigiendo a /login');
      setRedirectAttempted(true);
      router.push('/login');
    }

    // Si el usuario está autenticado, actualizar su balance
    if (!loading && user) {
      console.log('ProtectedRoute: Actualizando balance del usuario');
      updateBalance();

      // Configurar actualización periódica del balance
      const intervalId = setInterval(() => {
        updateBalance();
      }, 30000); // 30 segundos

      return () => clearInterval(intervalId);
    }
  }, [user, loading, router, redirectAttempted, updateBalance]);

  // Mostrar spinner de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, no renderizar nada
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si hay usuario autenticado, renderizar los hijos directamente
  return children;
}
