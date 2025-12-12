"use client";

import React, { memo, Suspense, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Footer from "@/components/layout/Footer";
import DashboardHeader from "@/components/layout/DashboardHeader";
import AffiliateTracker from "@/components/affiliate/AffiliateTracker";
import { usePathname } from 'next/navigation';
import DirectTawkToScript from "@/components/chat/DirectTawkToScript";
import { ToastProvider } from "@/contexts/ToastContext";
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
}

// Estilo global para prevenir scroll horizontal
const globalStyle = `
  body {
    overflow-x: hidden;
  }
`;

const MainLayoutComponent = ({ children, disableChat = false }: MainLayoutProps) => {
  const pathname = usePathname();
  const isInternalPage = pathname?.startsWith('/dashboard');
  const isContactPage = pathname === '/contacto';
  const isHomePage = pathname === '/';
  const isCheckoutPage = pathname === '/dashboard/checkout';
  // No mostrar el chat en páginas del dashboard
  const shouldShowChat = !disableChat && !isInternalPage;

  // Refs para medir la altura del header y exponerla como variable CSS
  const headerWrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const setHeaderHeight = () => {
      const headerHeight = headerWrapperRef.current?.offsetHeight ?? 64;
      if (containerRef.current) {
        containerRef.current.style.setProperty('--dashboard-header-height', `${headerHeight}px`);
      } else {
        document.documentElement.style.setProperty('--dashboard-header-height', `${headerHeight}px`);
      }
    };

    // Inicial y en cambios de tamaño/orientación
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    window.addEventListener('orientationchange', setHeaderHeight);
    return () => {
      window.removeEventListener('resize', setHeaderHeight);
      window.removeEventListener('orientationchange', setHeaderHeight);
    };
  }, [isInternalPage]);

  return (
    <ToastProvider>
      {/* Header normal para páginas externas - STICKY */}
      {!isInternalPage && (
        <Header />
      )}

      <style jsx global>{globalStyle}</style>
      <div
        ref={containerRef}
        className={`min-h-screen flex flex-col relative ${(isInternalPage || isContactPage) ? '' : 'gradient-background'}`}
        style={(isInternalPage || isContactPage) ? { background: '#F5F3F3' } : {}}
      >
        {/* Encabezado para dashboard */}
        {isInternalPage && (
          <div className="sticky top-0 z-40 w-full" ref={headerWrapperRef}>
            <DashboardHeader />
          </div>
        )}

        {/* Contenido principal */}
        <main
          className={`flex-grow relative hardware-accelerated overflow-x-hidden mobile-main-scroll`}
          style={isInternalPage ? { 
            background: '#F5F3F3',
            paddingTop: '0',
            position: 'relative',
            zIndex: 1
          } : {}}
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
