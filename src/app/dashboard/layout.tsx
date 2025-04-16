'use client';

import MainLayout from '@/components/layout/MainLayout';
import { UserLevelProvider } from '@/contexts/UserLevelContext';
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OnboardingModal from '@/components/dashboard/OnboardingModal';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ProtectedRoute>
        <MainLayout>
          <BalanceVisibilityProvider>
            <UserLevelProvider>
              <Suspense fallback={
                <div className="min-h-screen w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                {children}
              </Suspense>
              <OnboardingModal />
            </UserLevelProvider>
          </BalanceVisibilityProvider>
        </MainLayout>
      </ProtectedRoute>
    </Suspense>
  );
}