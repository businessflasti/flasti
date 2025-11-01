import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { usePathname, useRouter } from 'next/navigation';
import CountryFlag from '@/components/ui/CountryFlag';
import Stories from '@/components/ui/Stories';
import { supabase } from '@/lib/supabase';
import { useElementVisibility } from '@/hooks/useElementVisibility';
import ThemedLogo from '@/components/themes/ThemedLogo';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Hook de visibilidad para elementos del header
  const { isVisible } = useElementVisibility('header');
  
  // Ocultar balance solo en la página principal del dashboard
  const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/';
  // Detectar si estamos en la página de checkout
  const isCheckoutPage = pathname === '/dashboard/checkout';
  // Detectar si estamos en la página de premium
  const isPremiumPage = pathname === '/dashboard/premium';
  // Detectar si estamos en la página de usuarios admin
  const isAdminUsersPage = pathname === '/dashboard/admin/users';
  // Detectar si estamos en la página de country-prices
  const isCountryPricesPage = pathname === '/dashboard/admin/country-prices';

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
  const userName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : (profile?.name || user?.user_metadata?.full_name || '');
  const initials = getInitials(userEmail, userName);
  const avatarColor = getAvatarColor(userEmail || userName || 'default');

  const [detectedCountry, setDetectedCountry] = useState<string>('--');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
  const [stories, setStories] = useState<any[]>([]);

  // Actualizar fecha y hora cada minuto
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Formatear fecha
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      
      // Formatear hora
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      setCurrentDateTime({
        date: `${dayName} ${day} ${monthName}`,
        time: `${hours}:${minutes}`
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Detectar país del usuario - Sincronizado con dashboard
  useEffect(() => {
    const updateCountry = () => {
      const country = localStorage.getItem('userCountry');
      if (country && country !== 'GLOBAL' && country !== '--') {
        setDetectedCountry(country);
      }
    };

    // Actualizar inmediatamente
    updateCountry();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userCountry') {
        updateCountry();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También verificar periódicamente por si cambia en la misma pestaña
    const interval = setInterval(updateCountry, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Función para obtener el nombre completo del país
  const getCountryName = (code: string) => {
    if (!code || code === '--' || code === 'GLOBAL') return '';
    try {
      const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
      return regionNames.of(code);
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Cargar historias desde la base de datos
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

    return (
      <header
        className="w-full flex items-center px-3 sm:px-6 bg-[#0B1017] sticky top-0 z-40"
        style={{ minHeight: 64 }}
      >

        <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
          {/* Logo y título/balance */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-1 justify-start ml-2 sm:ml-4 md:ml-0">
            {/* Logo en todas las versiones - Controlable */}
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
            {/* Mostrar título en dashboard principal, "Información de pago" en checkout, "Upgrade Premium" en premium, botón volver en admin users, botón guardar en country-prices, balance en otras páginas - Controlable */}
            {isVisible('page_title') && isMainDashboard ? (
              <div className="text-left -ml-2 md:ml-0">
                <div className="text-base sm:text-base md:text-xl font-bold text-white leading-tight ml-2 md:ml-0">
                  Panel personal
                </div>

              </div>
            ) : isVisible('page_title') && isCheckoutPage ? (
              <div className="text-left">
                <div className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight">
                  Medios de pago
                </div>
              </div>
            ) : isCountryPricesPage ? (
              <button 
                onClick={() => {
                  const event = new CustomEvent('saveCountryPrices');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 touch-manipulation select-none ml-2 md:ml-0"
                aria-label="Guardar precios"
                type="button"
              >
                <svg 
                  className="w-4 h-4 text-white pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="text-sm font-bold text-white pointer-events-none">
                  Guardar
                </span>
              </button>
            ) : isPremiumPage || isAdminUsersPage ? (
              <button 
                onClick={() => router.push('/dashboard/admin')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161b22]/80 backdrop-blur-xl hover:bg-[#21262d] active:bg-[#151515] transition-all duration-200 group touch-manipulation select-none ml-2 md:ml-0 border-0 shadow-lg"
                aria-label="Volver al panel admin"
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
            ) : isVisible('balance_display') ? (
              <div className="user-balance flex items-center justify-center">
                <div className="user-balance-amount text-sm sm:text-lg font-bold text-white text-center">
                  <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Badges en el centro - Desktop */}
          {!isMobile && (
            <>
              {/* Espaciador flexible izquierdo */}
              <div className="hidden md:block flex-[0.5]"></div>
              
              {/* Contenedor de badges */}
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                {/* Badge de ubicación - Izquierda - Controlable */}
                {isVisible('country_badge') && !isCheckoutPage && (
                  <div>
                    {detectedCountry && detectedCountry !== '--' && detectedCountry !== 'GLOBAL' ? (
                      <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-md bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-lg whitespace-nowrap">
                        <CountryFlag countryCode={detectedCountry} size="md" />
                        <span className="text-white font-bold text-xs">
                          {detectedCountry}
                        </span>
                        {getCountryName(detectedCountry) && (
                          <span className="text-white/70 text-xs">
                            {getCountryName(detectedCountry)}
                          </span>
                        )}
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/70 text-xs">
                          {currentDateTime.date}
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#161b22]/80 backdrop-blur-xl border-0 shadow-lg whitespace-nowrap">
                        <span className="text-white/50 text-xs">Detectando ubicación...</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Badge de Testimonios - Derecha (todas las páginas excepto checkout) - Controlable */}
                {isVisible('stories') && !isCheckoutPage && stories.length > 0 && (
                  <Stories stories={stories} />
                )}
              </div>
              
              {/* Espaciador flexible derecho */}
              <div className="hidden md:block flex-[0.5]"></div>
            </>
          )}
          
          <div className="flex items-center gap-3 sm:gap-6 mr-4 md:mr-8 justify-end flex-shrink-0">
            {/* Badge de Testimonios - Móvil en todas las páginas excepto checkout - Controlable */}
            {isVisible('stories') && isMobile && !isCheckoutPage && stories.length > 0 && (
              <Stories stories={stories} />
            )}
            
            {/* Menú hamburguesa solo en móvil - Controlable */}
            {isVisible('menu_button') && isMobile && (
              <button
                className="lg:hidden flex items-center justify-center focus:outline-none transition hover:opacity-80"
                aria-label="Abrir menú"
                onClick={onMenuClick}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="2" rx="1" fill="#fff" />
                  <rect x="3" y="11" width="18" height="2" rx="1" fill="#fff" />
                  <rect x="3" y="16" width="18" height="2" rx="1" fill="#fff" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
    );
}
