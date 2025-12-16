'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PullToRefresh from '@/components/ui/PullToRefresh';

import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GamificationProviders from '@/components/providers/GamificationProviders';

// Importar estilos para mejorar la experiencia móvil
import '@/styles/mobile-app.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Manejar botón atrás del navegador
  useEffect(() => {
    const handlePopState = () => {
      const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/';
      if (isMainDashboard) {
        // Si está en dashboard principal, quedarse ahí y recargar
        window.history.pushState(null, '', '/dashboard');
        window.location.reload();
      } else {
        // Si está en otra página, ir atrás con recarga
        window.location.href = document.referrer || '/dashboard';
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Agregar entrada al historial para capturar el botón atrás
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname]);

  return (
    <ProtectedRoute>
      <MainLayout>
        {/* Pull to Refresh - Solo móvil */}
        <PullToRefresh />
        
        {/* Sidebar ya integrado en MainLayout para rutas internas */}
        <BalanceVisibilityProvider>
          <GamificationProviders>{children}</GamificationProviders>
        </BalanceVisibilityProvider>
      </MainLayout>
    </ProtectedRoute>
  );
}