"use client";

import React, { memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Footer from "@/components/layout/Footer";
import DashboardHeader from "@/components/layout/DashboardHeader";
import AffiliateTracker from "@/components/affiliate/AffiliateTracker";
import { usePathname } from 'next/navigation';
import DirectTawkToScript from "@/components/chat/DirectTawkToScript";
import { ToastProvider } from "@/contexts/ToastContext";
import { Sidebar } from "@/components/ui/sidebar";
import { StickyBannerDemo } from "@/components/ui/sticky-banner-demo";
import Header from "@/components/layout/Header";

// Cargar el componente de notificaciones FOMO de forma diferida
// Solo se cargará en páginas que no sean de checkout, ya que allí se maneja por separado
const FomoNotifications = dynamic(
  () => import("@/components/notifications/FomoNotifications"),
  { ssr: false, loading: () => null }
);

// Cargar el chat widget de forma diferida para mejorar el rendimiento inicial
const DashboardChatWidget = dynamic(
  () => import("@/components/dashboard/DashboardChatWidget"),
  { ssr: false, loading: () => null }
);

interface MainLayoutProps {
  children: React.ReactNode;
  disableChat?: boolean;
  showStickyBanner?: boolean;
}

const MainLayoutComponent = ({ children, disableChat = false, showStickyBanner = false }: MainLayoutProps) => {
  const pathname = usePathname();
  const isInternalPage = pathname?.startsWith('/dashboard');
  const isContactPage = pathname === '/contacto';
  const isHomePage = pathname === '/';
  const isCheckoutPage = pathname === '/dashboard/checkout';
  // No mostrar el chat en páginas del dashboard
  const shouldShowChat = !disableChat && !isInternalPage;

  // Renderizado optimizado de decorativos solo en desktop
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Detectar si es móvil
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <ToastProvider>
      {/* Banner - Solo en páginas principales - NO STICKY */}
      {showStickyBanner && !isInternalPage && (
        <div className="w-full">
          <StickyBannerDemo />
        </div>
      )}
      
      {/* Header normal para páginas externas - STICKY */}
      {!isInternalPage && (
        <Header showStickyBanner={showStickyBanner} />
      )}

      <div
        className={`min-h-screen flex flex-col relative overflow-hidden mobile-app-container${(isInternalPage || isContactPage) ? '' : ' gradient-background'}`}
        style={(isInternalPage || isContactPage) ? { background: '#101010' } : {}}
      >
        {/* Sidebar colapsable solo en dashboard */}
        {isInternalPage && (
          <div className="fixed top-0 left-0 z-40 h-full">
            <Sidebar open={isMobile ? mobileMenuOpen : undefined} setOpen={isMobile ? setMobileMenuOpen : undefined} />
          </div>
        )}



        {/* Nuevo encabezado para dashboard y todas las páginas con sidebar */}
        {isInternalPage && (
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        )}

        {/* Contenido principal */}
        <main
          className={`flex-grow relative z-10 hardware-accelerated ${isInternalPage ? 'ml-0 lg:ml-56 transition-all' : ''}`}
          style={isInternalPage ? { background: '#101010', paddingTop: '0' } : {}}
        >
          {children}
        </main>

        {/* Footer solo fuera del dashboard */}
        {!isInternalPage && <Footer />}
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>

        {/* Chat widget - cargado de forma diferida solo cuando es necesario */}
        {shouldShowChat && <DashboardChatWidget />}

        {/* Tawk.to chat script - No mostrar en páginas del dashboard */}
        {!isInternalPage && <DirectTawkToScript showBubble={isContactPage || isHomePage} />}

        {/* Notificaciones FOMO - No mostrar en la página de checkout */}
        {!isCheckoutPage && <FomoNotifications />}
      </div>
    </ToastProvider>
  );
};

const MainLayout = memo(MainLayoutComponent);
export default MainLayout;
