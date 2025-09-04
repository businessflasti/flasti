import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Ocultar balance solo en la página principal del dashboard
  const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/';
  // Detectar si estamos en la página de checkout
  const isCheckoutPage = pathname === '/dashboard/checkout';
  // Detectar si estamos en la página de premium
  const isPremiumPage = pathname === '/dashboard/premium';

  // Función para obtener las iniciales del usuario
  const getInitials = (email: string | undefined, name: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.split('@')[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  // Función para generar un color basado en el email/nombre
  const getAvatarColor = (text: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  const userEmail = user?.email || profile?.email || '';
  const userName = profile?.name || user?.user_metadata?.full_name;
  const initials = getInitials(userEmail, userName);
  const avatarColor = getAvatarColor(userEmail || userName || 'default');

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

    return (
      <header
        className="w-full flex items-center px-3 sm:px-6 bg-[#101010] border-b border-white/10 sticky top-0 z-40"
        style={{ minHeight: 64 }}
      >
        {/* Gradiente azul en el borde inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3C66CD] to-transparent"></div>
        <div className="flex items-center justify-between w-full">
          {/* Logo y título/balance */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-1 justify-start ml-2 sm:ml-4 md:ml-0">
            <a href="/dashboard" className="flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo/isotipo-web.png"
                alt="Logo Flasti"
                width={28}
                height={28}
                priority
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                onError={(e) => {
                  e.currentTarget.src = '/images/default-avatar.png';
                }}
              />
            </a>
            {/* Mostrar título en dashboard principal, "Medios de pago" en checkout, "Upgrade Premium" en premium, balance en otras páginas */}
            {isMainDashboard ? (
              <div className="text-left">
                <div className="text-xs sm:text-sm md:text-lg font-bold text-white leading-tight">
                  Panel personal
                </div>
                <div className="text-xs sm:text-xs text-[#b0b0b0] leading-tight">
                  <span className="md:hidden whitespace-nowrap">Bienvenido</span>
                  <span className="hidden md:inline">Bienvenido de vuelta, {user?.email?.split('@')[0] || 'Usuario'}</span>
                </div>
              </div>
            ) : isCheckoutPage ? (
              <div className="text-left">
                <div className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight">
                  Medios de pago
                </div>
              </div>
            ) : isPremiumPage ? (
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#232323] hover:bg-[#1a1a1a] active:bg-[#151515] transition-all duration-200 group touch-manipulation select-none ml-2 md:ml-0"
                aria-label="Volver atrás"
                type="button"
              >
                <svg 
                  className="w-4 h-4 text-white transition-colors duration-200 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium text-white transition-colors duration-200 pointer-events-none">
                  Volver
                </span>
              </button>
            ) : (
              <div className="user-balance flex items-center justify-center">
                <div className="user-balance-amount text-sm sm:text-lg font-bold text-white text-center">
                  <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-6 mr-4 md:mr-8 justify-end flex-shrink-0">
            {/* Usuario - Siempre visible */}
            <div className="user-profile flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="user-avatar w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-600">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.name || user?.email?.split('@')[0] || 'Usuario'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-avatar.png';
                    }}
                  />
                ) : (
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium text-white truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none">
                {profile?.name || user?.email?.split('@')[0] || 'Usuario'}
              </span>
            </div>
            {/* Menú hamburguesa solo en móvil */}
            {isMobile && (
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-[#232323] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3C66CE] transition hover:bg-[#2d2d2d]"
                aria-label="Abrir menú"
                onClick={onMenuClick}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="16" height="1.7" rx="0.85" fill="#fff" />
                  <rect x="3" y="10" width="16" height="1.7" rx="0.85" fill="#fff" />
                  <rect x="3" y="15" width="16" height="1.7" rx="0.85" fill="#fff" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
    );
}
