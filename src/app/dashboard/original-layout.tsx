'use client';

import { UserLevelProvider } from '@/contexts/UserLevelContext';
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GamificationProviders from '@/components/providers/GamificationProviders';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';
import './original-style.css';

export default function OriginalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  // No hacer nada con los temas

  return (
    <ProtectedRoute>
      <BalanceVisibilityProvider>
        <UserLevelProvider>
          <GamificationProviders>
            <div className="original-layout">
              {children}
            </div>
          </GamificationProviders>
        </UserLevelProvider>
      </BalanceVisibilityProvider>
    </ProtectedRoute>
  );
}
