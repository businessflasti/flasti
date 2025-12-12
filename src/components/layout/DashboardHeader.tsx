import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { usePathname, useRouter } from 'next/navigation';
import Stories from '@/components/ui/Stories';
import { supabase } from '@/lib/supabase';
import { useElementVisibility } from '@/hooks/useElementVisibility';
import { FiUser, FiLogOut, FiSettings, FiDollarSign, FiClock, FiHome, FiAward, FiMessageCircle, FiChevronRight, FiEdit2 } from "react-icons/fi";

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut, updateAvatar } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const { isVisible } = useElementVisibility('header');
  
  const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/';
  const isCheckoutPage = pathname === '/dashboard/checkout';
  const isPremiumPage = pathname === '/dashboard/premium';
  const isAdminUsersPage = pathname === '/dashboard/admin/users';
  const isCountryPricesPage = pathname === '/dashboard/admin/country-prices';

  const getAvatarColor = () => '#85C1E9';

  const userEmail = user?.email || profile?.email || '';
  const firstName = profile?.first_name || '';
  const fullName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Usuario';
  const avatarColor = getAvatarColor();
  const hasCustomAvatar = profile?.avatar_url;
  const isPremium = profile?.is_premium;

  const [stories, setStories] = useState<any[]>([]);

  // Cerrar menú al hacer clic fuera (verificar tanto el botón como el panel)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideButton = menuRef.current && !menuRef.current.contains(target);
      const isOutsidePanel = menuPanelRef.current && !menuPanelRef.current.contains(target);
      
      // Solo cerrar si el clic está fuera de AMBOS: el botón y el panel
      if (isOutsideButton && isOutsidePanel) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Bloquear scroll del body cuando el menú está abierto en móvil
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobile]);

  // Handler para logout
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsMenuOpen(false);
    
    try { await signOut(); } catch (e) { console.error(e); }
    
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    }
  }, [isLoggingOut, signOut]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Cargar historias
  useEffect(() => {
    const loadStories = async () => {
      const { data } = await supabase
        .from('stories')
        .select('*')
        .order('order', { ascending: true });
      
      if (data) {
        setStories(data);
      }
    };
    loadStories();
  }, []);



  // Handler para subir avatar
  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona una imagen válida');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }
    
    try {
      const timestamp = Date.now();
      const fileName = `avatar-${user.id}-${timestamp}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '0', upsert: true });
      if (error) { alert(`Error: ${error.message}`); return; }
      
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      if (!urlData?.publicUrl) { alert('No se pudo obtener la URL'); return; }
      
      const { error: updateError } = await updateAvatar(`${urlData.publicUrl}?t=${timestamp}`);
      if (updateError) { alert(`Error: ${updateError.message}`); return; }
      
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert(`Error: ${error.message || 'Intenta de nuevo'}`);
    }
    
    if (e.target) e.target.value = '';
  }, [user, updateAvatar]);

  return (
    <>
      <header
        className="w-full flex items-center px-3 sm:px-6 sticky top-0 z-40"
        style={{ 
          minHeight: 64,
          background: '#F5F3F3'
        }}
      >
        <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
          {/* Logo y título/balance */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-1 justify-start ml-2 sm:ml-4 md:ml-0">
            {isVisible('logo') && (
              <a href="/dashboard" className="flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/logo/isotipo-web.png" 
                  alt="Flasti" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </a>
            )}
            
            {isVisible('page_title') && isMainDashboard ? (
              <div className="text-left -ml-2 md:ml-0">
                <div className="text-base sm:text-base md:text-xl font-bold text-gray-900 leading-tight ml-2 md:ml-0">
                  Panel de control
                </div>
              </div>
            ) : isVisible('page_title') && isCheckoutPage ? (
              <div className="text-left">
                <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">
                  Medios de pago
                </div>
              </div>
            ) : isCountryPricesPage ? (
              <button 
                onClick={() => {
                  const event = new CustomEvent('saveCountryPrices');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 transition-all duration-200 touch-manipulation select-none ml-2 md:ml-0 shadow-lg"
                aria-label="Guardar precios"
                type="button"
              >
                <svg className="w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="text-sm font-bold text-white pointer-events-none">Guardar</span>
              </button>
            ) : isPremiumPage || isAdminUsersPage ? (
              <button 
                onClick={() => window.location.href = 'https://flasti.com/dashboard'}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/80 active:bg-white transition-all duration-200 group touch-manipulation select-none ml-2 md:ml-0 shadow-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                aria-label="Volver al dashboard"
                type="button"
              >
                <svg className="w-4 h-4 text-gray-700 transition-colors duration-200 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium text-gray-700 transition-colors duration-200 pointer-events-none">Volver</span>
              </button>
            ) : isVisible('balance_display') ? (
              <div className="user-balance flex items-center justify-center">
                <div className="user-balance-amount text-sm sm:text-lg font-bold text-gray-900 text-center">
                  <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Badges en el centro - Desktop */}
          {!isMobile && (
            <>
              <div className="hidden md:block flex-[0.5]"></div>
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                {isVisible('stories') && !isCheckoutPage && stories.length > 0 && (
                  <Stories stories={stories} />
                )}
              </div>
              <div className="hidden md:block flex-[0.5]"></div>
            </>
          )}
          
          <div className="flex items-center gap-3 sm:gap-4 mr-2 md:mr-8 justify-end flex-shrink-0">
            {isVisible('stories') && isMobile && !isCheckoutPage && stories.length > 0 && (
              <Stories stories={stories} />
            )}
            
            {/* Nombre + Avatar con menú desplegable */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isMenuOpen 
                    ? 'bg-transparent md:rounded-b-none md:relative md:z-[60]' 
                    : 'hover:bg-white/60'
                }`}
                style={isMenuOpen && !isMobile ? { 
                  borderBottomLeftRadius: 0, 
                  borderBottomRightRadius: 0,
                  marginBottom: -2
                } : undefined}
              >
                {firstName && !(isMenuOpen && !isMobile) && (
                  <span className={`text-sm font-medium ${isMenuOpen ? 'text-gray-900' : 'text-gray-800'}`}>
                    {firstName}
                  </span>
                )}
                
                {!(isMenuOpen && !isMobile) && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm ring-2 ring-white">
                    {hasCustomAvatar ? (
                      <Image 
                        src={profile.avatar_url}
                        alt="Avatar" 
                        width={32} 
                        height={32} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: '#F3F3F3' }}
                      >
                        <FiUser className="w-4 h-4 text-gray-900" />
                      </div>
                    )}
                  </div>
                )}
                
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-[#0D50A4]' : 'text-gray-500'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* Menú flotante estilo app nativa */}
      {isMenuOpen && (
        <>
          {/* Overlay - solo en móvil (sin onClick, el handleClickOutside se encarga) */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"
              style={{ animation: 'fadeIn 0.2s ease-out', zIndex: 9998 }}
            />
          )}
          
          {/* Panel del menú */}
          <div 
            ref={menuPanelRef}
            className="fixed inset-x-0 bottom-0 md:absolute md:inset-auto md:right-2 md:top-[56px] md:w-80"
            style={{ animation: isMobile ? 'slideUp 0.3s ease-out' : 'fadeIn 0.15s ease-out', zIndex: 9999 }}
          >
            <div 
              className="md:rounded-2xl md:rounded-tr-none rounded-t-3xl overflow-hidden shadow-xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto"
              style={{ 
                background: '#F5F3F3'
              }}
            >


              {/* Sección de perfil de usuario */}
              <div className="px-5 py-4 md:px-4 md:py-3">
                {/* Input oculto para subir avatar */}
                <input 
                  type="file" 
                  id="menu-avatar-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload} 
                />
                
                <div className="flex items-center gap-4 md:gap-3">
                  {/* Avatar grande con funcionalidad de subir foto */}
                  <button
                    onClick={() => document.getElementById('menu-avatar-upload')?.click()}
                    className="relative w-20 h-20 md:w-16 md:h-16 rounded-full flex-shrink-0 cursor-pointer group"
                  >
                    <div className="w-full h-full rounded-full overflow-hidden shadow-lg ring-4 ring-white md:ring-2">
                      {hasCustomAvatar ? (
                        <Image 
                          key={`menu-avatar-${refreshKey}`}
                          src={`${profile.avatar_url}?t=${refreshKey}`}
                          alt="Avatar" 
                          width={80} 
                          height={80} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: '#F3F3F3' }}
                        >
                          <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Overlay hover - debe estar antes del badge para que la sombra quede detrás */}
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    {/* Badge "Subir foto" */}
                    {!hasCustomAvatar && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-md z-10" style={{ backgroundColor: '#0D50A4' }}>
                        Subir foto
                      </div>
                    )}
                  </button>
                  
                  {/* Info del usuario */}
                  <div className="flex-1">
                    <h3 className="text-lg md:text-base font-bold" style={{ color: '#111827' }}>{fullName}</h3>
                    
                    {/* Botón editar perfil */}
                    <a 
                      href="/dashboard/perfil"
                      className="mt-2 md:mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 md:px-2 md:py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm hover:shadow transition-shadow no-underline"
                      style={{ textDecoration: 'none' }}
                    >
                      <FiEdit2 className="w-3 h-3" />
                      Editar Perfil
                    </a>
                  </div>
                </div>
              </div>

              {/* Grupo principal de navegación */}
              <div className="px-5 pb-3 md:px-4 md:pb-2">
                <div 
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    background: '#FFFFFF'
                  }}
                >
                  <MenuLink 
                    icon={<FiHome />}
                    iconBg="#F6F3F3"
                    iconColor="#111827"
                    label="Inicio"
                    href="/dashboard"
                    isActive={pathname === '/dashboard'}
                  />
                  <MenuLink 
                    icon={<FiAward />}
                    iconBg="#F6F3F3"
                    iconColor="#111827"
                    label="Recompensas"
                    href="/dashboard/rewards-history"
                    isActive={pathname === '/dashboard/rewards-history'}
                    isLast
                  />
                </div>
              </div>

              {/* Grupo secundario */}
              <div className="px-5 pb-3 md:px-4 md:pb-2">
                <div 
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    background: '#FFFFFF'
                  }}
                >
                  <MenuLink 
                    icon={<FiDollarSign />}
                    iconBg="#F6F3F3"
                    iconColor="#111827"
                    label="Solicitar Retiro"
                    href="/dashboard/withdrawals"
                    isActive={pathname === '/dashboard/withdrawals'}
                  />
                  <MenuLink 
                    icon={<FiClock />}
                    iconBg="#F6F3F3"
                    iconColor="#111827"
                    label="Historial de Retiros"
                    href="/dashboard/withdrawals-history"
                    isActive={pathname === '/dashboard/withdrawals-history'}
                  />
                  <MenuLink 
                    icon={<FiMessageCircle />}
                    iconBg="#F6F3F3"
                    iconColor="#111827"
                    label="Soporte"
                    href="/dashboard/support"
                    isActive={pathname === '/dashboard/support'}
                    isLast
                  />
                </div>
              </div>

              {/* Botón cerrar sesión */}
              <div className="px-5 pb-6 md:px-4 md:pb-3">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full p-4 md:p-3 rounded-2xl flex items-center gap-3 md:gap-2 shadow-sm hover:bg-gray-50 transition-colors"
                  style={{ background: '#FFFFFF' }}
                >
                  <div className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center" style={{ background: '#F6F3F3' }}>
                    {isLoggingOut ? (
                      <FiSettings className="w-5 h-5 md:w-4 md:h-4 text-red-500 animate-spin" />
                    ) : (
                      <FiLogOut className="w-5 h-5 md:w-4 md:h-4 text-red-500" />
                    )}
                  </div>
                  <span className="font-medium text-gray-700 md:text-sm">
                    {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 md:px-4 md:pb-3">
                <p className="text-center text-xs text-gray-400">
                  © {new Date().getFullYear()} Flasti LLC
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(100%);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

// Componente MenuLink - usa enlaces nativos para navegación confiable
function MenuLink({ 
  icon, 
  iconBg, 
  iconColor = '#fff',
  label, 
  href, 
  isActive = false,
  isLast = false 
}: { 
  icon: React.ReactNode;
  iconBg: string;
  iconColor?: string;
  label: string;
  href: string;
  isActive?: boolean;
  isLast?: boolean;
}) {
  return (
    <a 
      href={href}
      className={`w-full px-4 py-3.5 md:px-3 md:py-2.5 flex items-center gap-3 md:gap-2 hover:bg-gray-50 transition-colors cursor-pointer no-underline ${
        !isLast ? 'border-b border-gray-100' : ''
      } ${isActive ? 'bg-gray-50' : ''}`}
      style={{ display: 'flex', textDecoration: 'none' }}
    >
      <div 
        className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ backgroundColor: iconBg }}
      >
        <span className="text-lg md:text-base" style={{ color: iconColor }}>{icon}</span>
      </div>
      <span className="flex-1 text-left font-medium md:text-sm text-gray-800">{label}</span>
      <FiChevronRight className="w-5 h-5 md:w-4 md:h-4 text-gray-400" />
    </a>
  );
}
