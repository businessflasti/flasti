'use client';

import React, { useState, useEffect } from 'react';
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
  Bell, 
  User, 
  LogOut, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  Send,
  Check,
  DollarSign,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBalanceVisibility } from '@/contexts/BalanceVisibilityContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/logo';

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
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
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
  
  // Notificaciones
  const notifications = [
    {
      id: 1,
      title: 'Nueva comisión recibida',
      time: 'Hace 5 min',
      icon: <DollarSign size={16} />,
      color: '#22c55e'
    },
    {
      id: 2,
      title: 'Nuevo nivel desbloqueado',
      time: 'Hace 2 horas',
      icon: <Crown size={16} />,
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Actualización de plataforma',
      time: 'Hace 1 día',
      icon: <Bell size={16} />,
      color: '#8b5cf6'
    }
  ];
  
  // Beneficios VIP
  const vipBenefits = [
    'Comisiones aumentadas en un 10%',
    'Soporte prioritario 24/7',
    'Acceso anticipado a nuevas apps'
  ];
  
  // Manejar clic en el sidebar
  const handleSidebarItemClick = (id: string) => {
    setActiveTab(id);
  };
  
  // Alternar expansión del sidebar
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };
  
  return (
    <div className="casino-layout">
      {/* Sidebar */}
      <div className={`casino-sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-logo">
          <Logo />
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
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
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
            className="mt-auto mx-auto mb-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? (
              <ChevronLeft size={24} className="text-foreground/60" />
            ) : (
              <ChevronRight size={24} className="text-foreground/60" />
            )}
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="casino-header">
        <div className="header-left">
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu size={24} />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown size={16} className="text-primary" />
              </div>
              <span className="font-medium">Flasti Dashboard</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
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
          
          <div className="user-profile">
            <div className="user-avatar">
              {profile?.photoURL ? (
                <Image 
                  src={profile.photoURL} 
                  alt={profile.displayName || 'Usuario'} 
                  width={36} 
                  height={36} 
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
              )}
            </div>
            <span className="hidden md:block">{profile?.displayName || 'Usuario'}</span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut size={20} />
          </Button>
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
            <span>VIP Program</span>
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
        
        {/* Chat y soporte */}
        <div className="chat-support">
          <div className="chat-support-title">
            <MessageSquare size={20} />
            <span>Chat de Soporte</span>
          </div>
          
          <div className="chat-messages">
            {/* Aquí irían los mensajes del chat */}
          </div>
          
          <div className="chat-input">
            <input type="text" placeholder="Escribe un mensaje..." />
            <button>
              <Send size={16} />
            </button>
          </div>
        </div>
        
        {/* Notificaciones */}
        <div className="notifications">
          <div className="notifications-title">
            <span>Notificaciones</span>
            <span className="text-xs text-foreground/60">Ver todas</span>
          </div>
          
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div 
                  className="notification-icon"
                  style={{ backgroundColor: `${notification.color}20`, color: notification.color }}
                >
                  {notification.icon}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
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
