'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Componentes del dashboard
import QuickStats from '@/components/dashboard-new/QuickStats';
import LevelProgress from '@/components/dashboard-new/LevelProgress';
import BalanceCard from '@/components/dashboard-new/BalanceCard';
import TutorBlock from '@/components/dashboard-new/TutorBlock';
import OnboardingTour from '@/components/dashboard-new/OnboardingTour';
import LocationBadge from '@/components/dashboard-new/LocationBadge';
import DashboardNav from '@/components/dashboard-new/DashboardNav';

// Estilos y animaciones
import './animations.css';

export default function DashboardNew() {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    // Dar tiempo para que se cargue la autenticación
    const authCheckTimeout = setTimeout(() => {
      if (!loading && !user) {
        toast.error(t('debesIniciarSesion'));
        router.push('/login');
      }
    }, 1000);

    return () => clearTimeout(authCheckTimeout);
  }, [user, loading, router, t]);

  // Efecto para animación de carga de página
  useEffect(() => {
    if (!loading && user) {
      // Pequeño retraso para asegurar que los componentes estén listos
      const loadTimeout = setTimeout(() => {
        setIsPageLoaded(true);
      }, 100);

      return () => clearTimeout(loadTimeout);
    }
  }, [loading, user]);

  // Si está cargando, mostrar pantalla de carga
  if (loading || !isPageLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 particles-bg">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold">{t('cargandoDashboard')}</h2>
        <p className="text-foreground/60 mt-2">{t('preparandoTodo')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background particles-bg hardware-accelerated">
      {/* Navegación del dashboard */}
      <DashboardNav />

      {/* Onboarding para nuevos usuarios */}
      <OnboardingTour />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 animate-fadeIn hardware-accelerated">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {t('hola')}, {profile?.email?.split('@')[0] || t('usuario')}! 👋
            </h1>
            <p className="text-foreground/60">
              {t('bienvenidoATuPanel')}
            </p>
          </div>

          <div className="mt-4 md:mt-0 animate-fadeInUp delay-200">
            <LocationBadge />
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <QuickStats />

        {/* Bloques principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bloque de balance */}
          <div className="lg:col-span-1 animate-fadeInUp delay-100">
            <BalanceCard />
          </div>

          {/* Bloque de tutor */}
          <div className="lg:col-span-2 animate-fadeInUp delay-200">
            <TutorBlock />
          </div>
        </div>

        {/* Progreso de nivel */}
        <div className="animate-fadeInUp delay-300">
          <LevelProgress />
        </div>

        {/* Sección de enlaces rápidos */}
        <div className="mt-8 animate-fadeInUp delay-400">
          <h2 className="text-xl font-semibold mb-4">{t('accionesRapidas')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Enlaces rápidos */}
            {[
              { title: t('verAplicaciones'), icon: '📱', href: '/dashboard/apps' },
              { title: t('generarEnlaces'), icon: '🔗', href: '/dashboard/links' },
              { title: t('verEstadisticas'), icon: '📊', href: '/dashboard/stats' },
              { title: t('configurarPerfil'), icon: '⚙️', href: '/dashboard/profile' }
            ].map((link, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover-lift cursor-pointer hardware-accelerated"
                onClick={() => router.push(link.href)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{link.icon}</div>
                  <span>{link.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
