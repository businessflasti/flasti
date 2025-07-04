"use client";

import React, { memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Footer from "@/components/layout/Footer";
import AffiliateTracker from "@/components/affiliate/AffiliateTracker";
import { usePathname } from 'next/navigation';
import DirectTawkToScript from "@/components/chat/DirectTawkToScript";

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
  showHeader?: boolean;
  disableChat?: boolean;
}

const MainLayoutComponent = ({ children, showHeader = false, disableChat = false }: MainLayoutProps) => {
  const pathname = usePathname();
  const isInternalPage = pathname?.startsWith('/dashboard');
  const isContactPage = pathname === '/contacto';
  const isCheckoutPage = pathname === '/checkout';
  const shouldShowChat = !disableChat && isInternalPage;

  // Renderizado optimizado de decorativos solo en desktop
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  return (
    <div className="min-h-screen flex flex-col relative gradient-background overflow-hidden mobile-app-container">
      {/* Elementos decorativos futuristas solo en desktop */}
      {isDesktop && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl animate-float decorative-element hardware-accelerated"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#9333ea]/10 blur-3xl animate-float delay-300 decorative-element hardware-accelerated"></div>
        </div>
      )}

      {/* Header con carga optimizada */}
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-md border-b border-white/10 hardware-accelerated">
          {/* <Navbar /> */}
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-grow relative z-10 hardware-accelerated">{children}</main>

      {/* Footer y componentes adicionales */}
      <Footer />
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>

      {/* Chat widget - cargado de forma diferida solo cuando es necesario */}
      {shouldShowChat && <DashboardChatWidget />}

      {/* Tawk.to chat script */}
      <DirectTawkToScript showBubble={isContactPage} />

      {/* Notificaciones FOMO - No mostrar en la página de checkout */}
      {!isCheckoutPage && <FomoNotifications />}
    </div>
  );
};

const MainLayout = memo(MainLayoutComponent);
export default MainLayout;
