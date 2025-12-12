'use client';

import MainLayout from '@/components/layout/MainLayout';
import PullToRefresh from '@/components/ui/PullToRefresh';

import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GamificationProviders from '@/components/providers/GamificationProviders';

// Importar estilos para mejorar la experiencia móvil
import '@/styles/mobile-app.css';

// No se puede exportar metadata desde un componente 'use client'
// Los metadatos se manejarán a nivel de configuración global

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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