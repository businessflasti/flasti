'use client';

import MainLayout from '@/components/layout/MainLayout';
import { UserLevelProvider } from '@/contexts/UserLevelContext';
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OnboardingModal from '@/components/dashboard/OnboardingModal';
import { Metadata } from 'next';

export const metadata = {
  title: "Flasti | Panel personal",
  description: "Accede a tu panel personal de Flasti para gestionar tus ganancias y actividades.",
};

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
            {children}
            <OnboardingModal />
          </UserLevelProvider>
        </BalanceVisibilityProvider>
      </MainLayout>
    </ProtectedRoute>
  );
}