"use client";

import { memo, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AffiliateTracker from "@/components/affiliate/AffiliateTracker";
import { usePathname } from 'next/navigation';
import DirectTawkToScript from "@/components/chat/DirectTawkToScript";

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

const MainLayout = ({ children, showHeader = false, disableChat = false }: MainLayoutProps) => {
  const pathname = usePathname();

  // Determinar si estamos en una página interna (dashboard) o externa
  const isInternalPage = pathname?.startsWith('/dashboard');

  // Determinar si estamos en la página de contacto
  const isContactPage = pathname === '/contacto';

  // Solo mostrar el chat en páginas internas (dashboard)
  const shouldShowChat = !disableChat && isInternalPage;

  // Renderizar el componente DirectTawkToScript para manejar el chat
  // El componente se encargará de mostrar u ocultar la burbuja según la página

  return (
    <div className="min-h-screen flex flex-col relative gradient-background overflow-hidden mobile-app-container">
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl animate-float decorative-element hardware-accelerated"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#9333ea]/10 blur-3xl animate-float delay-300 decorative-element hardware-accelerated"></div>
      </div>

      {/* Header con carga optimizada */}
      {showHeader && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-md border-b border-white/10 hardware-accelerated">
          <Navbar />
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
    </div>
  );
};

// Usar memo para evitar renderizados innecesarios
export default memo(MainLayout);
