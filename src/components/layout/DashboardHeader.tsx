import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { usePathname } from 'next/navigation';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Ocultar balance solo en la página principal del dashboard
  const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/';

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
        className="w-full flex items-center px-3 sm:px-6 bg-[#101010] border-b border-white/10"
        style={{ minHeight: 64 }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo y título/balance */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:ml-56 w-1/3 sm:w-auto justify-start ml-2 sm:ml-4 md:ml-0">
            <a href="/dashboard" className="flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo/isotipo.svg"
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
            {/* Mostrar título en dashboard principal, balance en otras páginas */}
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
            ) : (
              <div className="user-balance hidden md:flex items-center justify-center">
                <div className="user-balance-amount text-lg font-bold text-white text-center">
                  <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-6 lg:mr-16 md:mr-8 w-2/3 sm:w-auto justify-end">
            {/* Usuario */}
            <div className="user-profile flex items-center gap-2 sm:gap-3">
              <div className="user-avatar w-9 h-9 rounded-full overflow-hidden">
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
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-white truncate max-w-[80px] sm:max-w-none">
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
