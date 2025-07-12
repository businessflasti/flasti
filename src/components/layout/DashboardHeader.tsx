import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

      return (
        <header className="w-full flex items-center px-6 bg-[#101010] border-b border-white/10" style={{ minHeight: 28 }}>
          <div className="flex items-center justify-between w-full">
            {/* Logo y balance en escritorio, desplazados para no quedar tapados por la sidebar */}
            <div className="flex items-center gap-4 lg:ml-56">
              <a href="/dashboard" className="flex items-center">
                <Image src="/logo/isotipo.svg" alt="Logo Flasti" width={36} height={36} priority className="h-9 w-9" />
              </a>
              {/* Balance solo en escritorio */}
              <div className="user-balance hidden md:block text-right">
                <div className="user-balance-amount text-lg font-bold text-white">
                  <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
                </div>
                <div className="user-balance-usd text-xs text-[#b0b0b0]">
                  {profile?.balance?.toFixed(2) ?? '0.00'} CR
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 lg:mr-16 md:mr-8">
              {/* Usuario, no tan a la derecha */}
              <div className="user-profile flex items-center gap-3">
                <div className="user-avatar w-9 h-9 rounded-full overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile?.name || user?.email?.split('@')[0] || 'Usuario'} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/images/default-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-white">{profile?.name || user?.email?.split('@')[0] || 'Usuario'}</span>
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
