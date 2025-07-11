'use client';

import { useEffect } from 'react';
import CasinoLayout from './casino-layout';
import CasinoContent from './casino-content';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserLevelProvider } from '@/contexts/UserLevelContext';
import { BalanceVisibilityProvider } from '@/contexts/BalanceVisibilityContext';
// import OnboardingModal from '@/components/dashboard/OnboardingModal';
import analyticsService from '@/lib/analytics-service';

// Importar estilos
import './casino-theme.css';

export default function CasinoDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redireccionar si no está autenticado y tracking de acceso al dashboard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Tracking: Usuario accede al dashboard
      analyticsService.trackDashboardAccess();
      analyticsService.setUserParams({
        user_id: user.id,
        dashboard_access_time: new Date().toISOString()
      });
    }
  }, [user, loading, router]);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#101010]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold">Cargando dashboard</h2>
        <p className="text-foreground/60 mt-2">Preparando todo para ti...</p>
      </div>
    );
  }

  // Si no hay usuario y no está cargando, no renderizar nada (se redireccionará)
  if (!user && !loading) {
    return null;
  }

  return (
    <BalanceVisibilityProvider>
      <UserLevelProvider>
        <CasinoLayout>
          {/* <ChangelogBanner /> eliminado */}
          {/* <TipsBanner /> eliminado */}
          <CasinoContent />
        </CasinoLayout>
        {/* <OnboardingModal /> eliminado */}
      </UserLevelProvider>
    </BalanceVisibilityProvider>
  );
}
