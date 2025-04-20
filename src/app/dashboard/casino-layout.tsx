'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Link2,
  BarChart2,
  AppWindow,
  BookOpen,
  Wallet,
  HelpCircle,
  Trophy,
  Star,
  Crown,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Check,
  DollarSign,
  Search,
  Menu,
  X,
  Settings,
  CreditCard,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ui/theme-selector';

// Importar estilos
import './casino-theme.css';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const router = useRouter();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Cerrar menú de perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navegación del sidebar
  const sidebarItems = [
    { id: 'home', icon: <Home size={20} />, label: t('inicio'), href: '/dashboard', color: '#6e8efb' },
    { id: 'links', icon: <Link2 size={20} />, label: t('misEnlaces'), href: '/dashboard/links', color: '#ec4899' },
    { id: 'stats', icon: <BarChart2 size={20} />, label: t('estadisticas'), href: '/dashboard/stats', color: '#9333ea' },
    { id: 'apps', icon: <AppWindow size={20} />, label: t('apps'), href: '/dashboard/aplicaciones', color: '#0ea5e9' },
    { id: 'resources', icon: <BookOpen size={20} />, label: t('recursos'), href: '/dashboard/recursos', color: '#22c55e' },
    { id: 'withdraw', icon: <Wallet size={20} />, label: t('retiros'), href: '/dashboard/paypal', color: '#f59e0b' },
    { id: 'help', icon: <HelpCircle size={20} />, label: t('ayuda'), href: '/dashboard/centro-ayuda', color: '#8b5cf6' },
    { id: 'ranking', icon: <Trophy size={20} />, label: t('ranking'), href: '/dashboard/clasificacion', color: '#f43f5e' },
  ];

  // Aplicaciones destacadas para el carrusel
  const featuredApps = [
    {
      id: 1,
      title: 'Flasti Images',
      image: '/apps/flasti-images.jpg',
      clicks: '1.2k',
      commission: '$25'
    },
    {
      id: 2,
      title: 'Flasti AI',
      image: '/apps/flasti-ai.jpg',
      clicks: '950',
      commission: '$30'
    },
    {
      id: 3,
      title: 'Flasti Video',
      image: '/apps/flasti-video.jpg',
      clicks: '750',
      commission: '$20'
    },
    {
      id: 4,
      title: 'Flasti Audio',
      image: '/apps/flasti-audio.jpg',
      clicks: '500',
      commission: '$15'
    },
    {
      id: 5,
      title: 'Flasti PDF',
      image: '/apps/flasti-pdf.jpg',
      clicks: '320',
      commission: '$18'
    },
    {
      id: 6,
      title: 'Flasti Chat',
      image: '/apps/flasti-chat.jpg',
      clicks: '280',
      commission: '$22'
    },
  ];

  // Promociones destacadas
  const promotions = [
    {
      id: 1,
      title: 'Lucky Promo',
      description: 'Gana comisiones extra por cada referido',
      image: '/promos/promo1.jpg',
      color: '#ec4899'
    },
    {
      id: 2,
      title: 'Gift of Fortune',
      description: 'Bonos especiales para afiliados nivel 2',
      image: '/promos/promo2.jpg',
      color: '#9333ea'
    },
    {
      id: 3,
      title: 'Treasure Hunter',
      description: 'Desbloquea recompensas exclusivas',
      image: '/promos/promo3.jpg',
      color: '#0ea5e9'
    }
  ];



  // Beneficios VIP
  const vipBenefits = [
    'Comisiones aumentadas al 90%',
    'Soporte prioritario 24/7',
    'Acceso anticipado a nuevas apps'
  ];

  // Manejar clic en el sidebar
  const handleSidebarItemClick = (id: string) => {
    setActiveTab(id);
  };

  // Alternar expansión del sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  return (
    <div className="casino-layout">
      {/* Overlay para el menú móvil */}
      {isMobile && (
        <div
          className={`mobile-menu-overlay ${mobileSidebarOpen ? 'active' : ''}`}
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`casino-sidebar ${sidebarExpanded ? 'expanded' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <Logo showTextWhenExpanded={sidebarExpanded || isMobile} />
        </div>

        {/* Botón para cerrar el menú móvil */}
        {isMobile && (
          <div className="mobile-menu-close" onClick={() => setMobileSidebarOpen(false)}>
            <X size={18} />
          </div>
        )}

        <div className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleSidebarItemClick(item.id)}
            >
              <div
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <div
                  className="sidebar-nav-item-icon"
                  style={{ backgroundColor: `${item.color}20`, color: item.color, borderRadius: '50%' }}
                >
                  {item.icon}
                </div>
                <span className="sidebar-nav-item-text">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {!isMobile && (
          <div
            className="absolute top-4 right-4 cursor-pointer bg-foreground/5 hover:bg-foreground/10 rounded-full p-1 transition-colors"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? (
              <ChevronLeft size={20} className="text-foreground/80" />
            ) : (
              <ChevronRight size={20} className="text-foreground/80" />
            )}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="casino-header">
        <div className="header-left">
          <div className="flex items-center gap-2">
            {isMobile && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(true)}>
                  <Menu size={24} />
                </Button>
                <Logo showTextWhenExpanded={true} />
              </>
            )}
            {!isMobile && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown size={16} className="text-primary" />
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <LanguageSelector />
          <ThemeSelector variant="icon" size="md" />

          <div className="user-balance">
            <DollarSign size={16} className="text-primary" />
            <span className="user-balance-amount">
              {isBalanceVisible ? `$${profile?.balance || '0.00'}` : '****'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleBalanceVisibility}
            >
              {isBalanceVisible ? (
                <Eye size={14} />
              ) : (
                <EyeOff size={14} />
              )}
            </Button>
          </div>

          <div className="user-profile relative" ref={profileMenuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="user-avatar relative">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile?.name || user?.email?.split('@')[0] || 'Usuario'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold rounded-full">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background translate-x-1/2 translate-y-1/2"></div>
              </div>
              <span className="hidden md:block">{profile?.name || user?.email?.split('@')[0] || 'Usuario'}</span>
            </div>

            {/* Menú desplegable de perfil */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card/95 backdrop-blur-md border border-border/30 z-50 top-full">
                <div className="py-1">
                  <Link href="/dashboard/perfil" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <User size={16} />
                    <span>Mi Perfil</span>
                  </Link>
                  <Link href="/dashboard/paypal" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <CreditCard size={16} />
                    <span>Mis Pagos</span>
                  </Link>
                  <Link href="/dashboard/notificaciones" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <Bell size={16} />
                    <span>Notificaciones</span>
                  </Link>
                  <Link href="/dashboard/configuracion" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                    <Settings size={16} />
                    <span>Configuración</span>
                  </Link>
                  <div className="border-t border-border/20 my-1"></div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/10 transition-colors w-full text-left text-red-500"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="casino-main">
        {children}
      </div>

      {/* Barra lateral derecha */}
      <div className="casino-rightbar">
        {/* Programa VIP */}
        <div className="vip-program">
          <div className="vip-program-title">
            <Crown size={20} />
            <span>Flasti Plus</span>
          </div>

          <div className="vip-level">
            <div className="vip-level-icon">
              <Star size={20} />
            </div>
            <div className="vip-level-info">
              <div className="vip-level-name">Nivel {profile?.level || 1}</div>
              <div className="vip-level-progress">
                <div
                  className="vip-level-progress-bar"
                  style={{ width: `${Math.min(100, ((profile?.balance || 0) / 30) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="vip-benefits">
            {vipBenefits.map((benefit, index) => (
              <div key={index} className="vip-benefits-item">
                <Check size={16} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Eye y EyeOff para la visibilidad del balance
function Eye({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
