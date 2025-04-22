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
  LogOut,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Menu,
  X,
  Lightbulb,
  Megaphone,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { LanguageSelector } from '@/components/LanguageSelector';

// Importar estilos
import './casino-theme.css';
import './mobile-menu-fix.css';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const router = useRouter();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Inicializar el estado
    checkIfMobile();

    // Establecer un valor inicial para asegurar que se muestre correctamente
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setSidebarExpanded(false);
    }

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // El menú desplegable de perfil ha sido eliminado

  // Navegación del sidebar
  const sidebarItems = [
    { id: 'home', icon: <Home size={20} />, label: t('inicio'), href: '/dashboard', color: '#6e8efb' },
    { id: 'profile', icon: <User size={20} />, label: 'Mi Perfil', href: '/dashboard/perfil', color: '#8b5cf6' },
    { id: 'links', icon: <Link2 size={20} />, label: t('misEnlaces'), href: '/dashboard/links', color: '#ec4899' },
    { id: 'stats', icon: <BarChart2 size={20} />, label: t('estadisticas'), href: '/dashboard/stats', color: '#9333ea' },
    { id: 'apps', icon: <AppWindow size={20} />, label: t('apps'), href: '/dashboard/aplicaciones', color: '#0ea5e9' },
    { id: 'resources', icon: <BookOpen size={20} />, label: t('recursos'), href: '/dashboard/recursos', color: '#22c55e' },
    { id: 'withdraw', icon: <Wallet size={20} />, label: t('retiros'), href: '/dashboard/paypal', color: '#f59e0b' },
    { id: 'help', icon: <HelpCircle size={20} />, label: t('ayuda'), href: '/dashboard/centro-ayuda', color: '#8b5cf6' },
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



  // Consejos de marketing de afiliados
  const marketingTips = [
    { id: 1, tip: 'Comparte tu enlace en redes sociales con una historia personal sobre cómo usas la app.' },
    { id: 2, tip: 'Crea tutoriales mostrando cómo usar las aplicaciones para resolver problemas específicos.' },
    { id: 3, tip: 'Utiliza los recursos promocionales disponibles en la sección "Recursos".' },
    { id: 4, tip: 'Enfócate en los beneficios que obtendrán tus referidos, no solo en tu comisión.' },
    { id: 5, tip: 'Personaliza tus mensajes según la audiencia a la que te diriges.' },
    { id: 6, tip: 'Combina promociones en diferentes plataformas para maximizar tu alcance.' },
    { id: 7, tip: 'Analiza tus estadísticas para identificar qué estrategias funcionan mejor.' }
  ];

  // Estado para el consejo actual
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Cambiar al siguiente consejo cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % marketingTips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Manejar clic en el sidebar
  const handleSidebarItemClick = (id: string) => {
    setActiveTab(id);
  };

  // Alternar expansión del sidebar (solo en móvil)
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
    // En escritorio, el sidebar siempre está expandido
  };

  return (
    <div className="casino-layout">
      {/* Sidebar */}
      <div className={`casino-sidebar ${sidebarExpanded || mobileMenuOpen ? 'expanded' : ''}`}>
        <div className="sidebar-logo">
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="flex flex-col items-center w-full bg-gradient-to-br from-[rgba(20,20,25,0.95)] to-[rgba(40,40,50,0.95)] py-4 px-5 rounded-xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#facc15]/20 flex items-center justify-center border border-[#facc15]/30">
                  <Trophy size={20} className="text-[#facc15]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs uppercase tracking-wider">Nivel</span>
                  <span className="text-white text-lg font-bold">1</span>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent my-2"></div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/30">
                  <DollarSign size={20} className="text-[#22c55e]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs uppercase tracking-wider">Comisión</span>
                  <span className="text-white text-lg font-bold">50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* El botón de toggle del sidebar se ha eliminado en escritorio */}
      </div>

      {/* Header */}
      <div className="casino-header">
        <div className="header-left">
          {/* Versión móvil */}
          {isMobile && (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mobile-menu-button mr-3">
                <Menu size={24} />
              </Button>
              <Logo showTextWhenExpanded={false} />
            </div>
          )}

          {/* Versión desktop */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              <Logo showTextWhenExpanded={true} />
            </div>
          )}
        </div>

        {/* Espacio central en móvil */}
        {isMobile && (
          <div className="flex-1"></div>
        )}

        <div className="header-right">
          <div className="flex items-center gap-3">
            <LanguageSelector />

            <div className="user-balance hidden md:block">
              <div className="user-balance-amount">
                {isBalanceVisible ? (
                  <>
                    <span>${profile?.balance || '0.00'} USDC</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-60 hover:opacity-100 transition-opacity"
                      onClick={toggleBalanceVisibility}
                    >
                      <Eye size={10} className="text-white/60" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span>****</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-60 hover:opacity-100 transition-opacity"
                      onClick={toggleBalanceVisibility}
                    >
                      <EyeOff size={10} className="text-white/60" />
                    </Button>
                  </>
                )}
              </div>
              <div className="user-balance-usd">
                {isBalanceVisible ? `$${profile?.balance || '0.00'} USD` : '****'}
              </div>
            </div>

            <div className="user-profile relative">
              <div className="flex items-center gap-3">
                <div className="user-avatar relative">
                  {profile?.avatar_url ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img
                        src={profile.avatar_url}
                        alt={profile?.name || user?.email?.split('@')[0] || 'Usuario'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img src="/images/default-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background transform translate-x-1/2 translate-y-1/2 animate-pulse"></div>
                </div>
                <span className="hidden md:block">{profile?.name || user?.email?.split('@')[0] || 'Usuario'}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-primary/10 transition-colors text-foreground/70 hover:text-foreground"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú desplegable de perfil eliminado */}

      {/* Overlay para menú móvil */}
      {isMobile && (
        <div
          className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="casino-main">
        {children}

        {/* Consejos de Marketing (movido al final) */}
        <div className="marketing-tips-container mb-6">
          <div className="marketing-tips-title">
            <Lightbulb size={20} />
            <span>Consejo del Día</span>
          </div>

          <div className="marketing-tips-content">
            <div className="marketing-tip-icon">
              <Megaphone size={16} />
            </div>
            <div className="marketing-tip-text">
              {marketingTips[currentTipIndex].tip}
            </div>
          </div>

          <div className="marketing-tips-navigation">
            {marketingTips.map((tip, index) => (
              <div
                key={tip.id}
                className={`tip-indicator ${index === currentTipIndex ? 'active' : ''}`}
                onClick={() => setCurrentTipIndex(index)}
              ></div>
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
