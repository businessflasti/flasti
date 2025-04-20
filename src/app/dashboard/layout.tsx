'use client';

import MainLayout from '@/components/layout/MainLayout';
import { UserLevelProvider } from '@/contexts/UserLevelContext';
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OnboardingModal from '@/components/dashboard/OnboardingModal';
import GamificationProviders from '@/components/providers/GamificationProviders';

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
        <BalanceVisibilityProvider>
          <UserLevelProvider>
            <GamificationProviders>
              {children}
              <OnboardingModal />
            </GamificationProviders>
          </UserLevelProvider>
        </BalanceVisibilityProvider>
      </MainLayout>
    </ProtectedRoute>
  );
}