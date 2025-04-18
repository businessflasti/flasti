"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Home,
  Apps,
  Link as LinkIcon,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import Logo from '@/components/ui/logo';
import LiveNotifications from '@/components/dashboard-new/LiveNotifications';

export default function DashboardNav() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navegación principal
  const navItems = [
    {
      name: t('inicio'),
      href: '/dashboard-new',
      icon: <Home size={20} />
    },
    {
      name: t('aplicaciones'),
      href: '/dashboard-new/apps',
      icon: <Apps size={20} />
    },
    {
      name: t('enlaces'),
      href: '/dashboard-new/links',
      icon: <LinkIcon size={20} />
    },
    {
      name: t('estadisticas'),
      href: '/dashboard-new/stats',
      icon: <BarChart2 size={20} />
    },
    {
      name: t('perfil'),
      href: '/dashboard-new/profile',
      icon: <Settings size={20} />
    }
  ];

  // Manejar cierre de sesión
  const handleLogout = async () => {
    // Simular cierre de sesión
    window.location.href = '/';
  };

  return (
    <header className="w-full py-3 border-b border-border/20 bg-card/70 backdrop-blur-md sticky top-0 z-50 hardware-accelerated">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo y botón de menú móvil */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors md:hidden mobile-touch-friendly hardware-accelerated"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/dashboard-new">
            <Logo />
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors mobile-touch-friendly hardware-accelerated ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-foreground/5 text-foreground/70 hover:text-foreground'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-2">
          {/* Notificaciones */}
          <div className="relative">
            <LiveNotifications />
          </div>

          {/* Botón de cerrar sesión */}
          <button
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors mobile-touch-friendly hardware-accelerated"
            onClick={handleLogout}
          >
            <LogOut size={20} className="text-foreground/70" />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md animate-fadeIn hardware-accelerated">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-4 rounded-lg flex items-center gap-3 transition-colors mobile-touch-friendly hardware-accelerated ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-foreground/5 text-foreground/70 hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="text-lg">{item.name}</span>
                </Link>
              ))}

              <button
                className="p-4 rounded-lg flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors mobile-touch-friendly hardware-accelerated"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="text-lg">{t('cerrarSesion')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
