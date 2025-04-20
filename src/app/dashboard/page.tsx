"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, ArrowDown, ArrowUp, PlusCircle, MinusCircle, Building2, CreditCard, Repeat, Clock, ArrowRight, Link2, BarChart2, AppWindow, BookOpen, Wallet, HelpCircle, Trophy, Star, Crown, Check, Bell, User, Sun, Moon, LogOut } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserLevelBadge } from "@/components/layout/UserLevelBadge";
import Logo from "@/components/ui/logo";
import { useBalanceVisibility } from "@/contexts/BalanceVisibilityContext";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useState, useRef, useEffect } from "react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import LocationBadge from "@/components/dashboard/LocationBadge";
import LiveNotifications from "@/components/dashboard/LiveNotifications";
import QuickStats from "@/components/dashboard/QuickStats";
import LevelProgress from "@/components/dashboard/LevelProgress";
import OnboardingTour from "@/components/dashboard/OnboardingTour";

// Importar estilos de animaciones
import "./animations.css";

export default function DashboardPage() {
  const { t } = useLanguage();
  const { isBalanceVisible, toggleBalanceVisibility } = useBalanceVisibility();
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current?.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className="min-h-screen bg-background mobile-smooth-scroll">
        <MobileMenu />
      {/* Header */}
      <header className="w-full py-4 border-b border-border/20 bg-card/70 backdrop-blur-md relative z-10 safe-area-inset-top">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            {/* Espacio para logo */}
            <div className="hidden md:block ml-4"></div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <UserLevelBadge />
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1">
                <p className="font-semibold">{isBalanceVisible ? `$${profile?.balance || '0.00'} USDC` : "****"}</p>
                <button className="text-foreground/60" onClick={toggleBalanceVisibility}>
                  <Eye size={18} />
                </button>
              </div>
              <p className="text-sm text-foreground/60">{isBalanceVisible ? `$${profile?.balance || '0.00'} USD` : "****"}</p>
            </div>

            {/* Espacio para notificaciones */}
            <div className="relative">
              {/* Notificaciones desactivadas para evitar errores */}
            </div>

            {/* Avatar de usuario */}
            <div className="relative">
              <button
                ref={userButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="relative"
              >
                <div className="relative">
                  {profile?.avatar_url ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="min-h-full min-w-full object-cover"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold">
                      {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-background translate-x-1/4 translate-y-1/4"></div>
                </div>
              </button>

              {isUserMenuOpen && (
                <div ref={userMenuRef} className="dropdown-menu right-4 top-20 w-56 py-2">
                  <div className="px-4 py-2 border-b border-border/20">
                    <p className="font-medium">{profile?.name || user?.email}</p>
                    <p className="text-sm text-foreground/60">Nivel {profile?.level || 1}</p>
                  </div>
                  <nav className="space-y-1 p-2">
                    <Link
                      href="/dashboard/aplicaciones"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <AppWindow size={18} />
                      <span>{t('apps')}</span>
                    </Link>
                    <Link
                      href="/dashboard/perfil"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Perfil</span>
                    </Link>
                    <Link
                      href="/dashboard/niveles"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Trophy size={18} />
                      <span>Niveles</span>
                    </Link>
                    <div className="border-t border-border/20 mt-2 pt-2">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
                        onClick={() => {
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                          setIsUserMenuOpen(false);
                        }}
                      >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors mt-2"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[80px] border-r border-border/20 min-h-[calc(100vh-73px)] bg-background hidden sm:flex flex-col items-center py-6 gap-6">
          <Link href="/dashboard" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <AppWindow size={20} />
          </Link>

          <Link href="/dashboard/perfil" className="w-10 h-10 rounded-lg hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <Link href="/dashboard/niveles" className="w-10 h-10 rounded-lg hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
            <Trophy size={20} />
          </Link>

          <Link href="/login" className="w-10 h-10 rounded-lg hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Espacio para móviles */}
          <div className="md:hidden mb-4"></div>

          <div className="max-w-5xl mx-auto">
            {/* Balance Card - Mejorado con animaciones */}
            <div data-tour="balance" className="bg-gradient-to-br from-[#9333ea]/10 via-[#ec4899]/10 to-[#facc15]/10 backdrop-blur-sm rounded-xl p-6 mb-8 border animate-border-glow relative z-0 animate-fadeInUp hover-lift particles-bg hardware-accelerated">
              <h2 className="text-sm text-foreground/60 uppercase font-medium mb-2 animate-fadeInUp delay-100">{t('balance') as string}</h2>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-4xl font-bold animate-countUp delay-200">{isBalanceVisible ? `$${profile?.balance || '0.00'}` : "****"}</h3>
                <span className="text-lg animate-fadeInUp delay-300">USDC</span>
                <button className="text-foreground/60 hover:text-foreground transition-colors icon-glow" onClick={toggleBalanceVisibility}>
                  <Eye size={20} />
                </button>
              </div>

              <p className="text-foreground/70 mb-4 animate-fadeInUp delay-300">{isBalanceVisible ? `$${profile?.balance || '0.00'} USD` : "****"}</p>

              <div className="flex items-center gap-3 mb-4 animate-fadeInUp delay-400">
                <Link href="/dashboard/paypal">
                  <Button
                    className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity flex items-center gap-2 animate-pulse"
                  >
                    <MinusCircle size={18} />
                    Retirar
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-1 text-sm animate-fadeInUp delay-500">
                <span>1 USDC = 1 USD</span>
              </div>
            </div>

            {/* Tutor Asignado - Movido a segunda posición con color azul */}
            <div className="bg-gradient-to-br from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#3b82f6]/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-[#3b82f6]/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-shadow duration-300 animate-fadeInUp delay-100 hardware-accelerated" data-tour="contacto">
              <h2 className="text-sm text-foreground/60 uppercase font-medium mb-4 animate-fadeInUp delay-200">Tu Tutora Asignada</h2>
              <div className="flex items-center gap-6 animate-fadeInUp delay-300">
                <div className="w-20 h-20 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(59,130,246,0.3)] border-2 border-[#3b82f6]/20 animate-scale">
                  <img
                    src="/images/tutors/soporte-maria.png"
                    alt="Tutora María"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 animate-fadeInUp delay-400">María</h3>
                  <p className="text-foreground/70 mb-3 animate-fadeInUp delay-500">Equipo de Flasti</p>
                  <Button
                    className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] hover:opacity-90 transition-opacity mobile-touch-friendly mobile-touch-feedback button-hover-effect"
                    onClick={() => {
                      if (window.Tawk_API && window.Tawk_API.maximize) {
                        window.Tawk_API.maximize();
                      }
                    }}
                  >
                    <span className="animate-fadeInUp delay-600">Iniciar chat</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="quick-stats">
              <QuickStats />
            </div>

            {/* Action Cards - Con animaciones */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              <Link href="/dashboard/links" data-tour="links">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center animate-fadeInUp delay-100 hover-lift mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <Link2 className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">{t('misEnlaces') as string}</h3>
                </Card>
              </Link>

              <Link href="/dashboard/stats" data-tour="stats">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center animate-fadeInUp delay-200 hover-lift mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <BarChart2 className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">{t('estadisticas') as string}</h3>
                </Card>
              </Link>

              <Link href="/dashboard/aplicaciones">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center animate-fadeInUp delay-300 hover-lift mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <AppWindow className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">{t('apps') as string}</h3>
                </Card>
              </Link>

              <Link href="/dashboard/recursos">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center relative animate-fadeInUp delay-400 hover-lift mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <BookOpen className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">{t('recursos') as string}</h3>
                  <span className="absolute top-2 right-2 text-xs bg-[#10b981] text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    NUEVO
                  </span>
                </Card>
              </Link>

              <Link href="/dashboard/paypal" data-tour="paypal">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center relative mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <Wallet className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">{t('retiros') as string}</h3>
                  <span className="absolute top-2 right-2 text-xs bg-primary/80 text-white px-2 py-0.5 rounded-full animate-border-glow shadow-sm">
                    0% Fee
                  </span>
                </Card>
              </Link>

              <Link href="/dashboard/centro-ayuda" data-tour="centro-ayuda">
                <Card className="glass-card p-4 flex flex-col items-center justify-center group hover:border-primary/30 transition-colors text-center h-full mobile-card mobile-touch-feedback">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:animate-scale">
                    <HelpCircle className="text-primary icon-glow" size={22} />
                  </div>
                  <h3 className="font-medium mb-1">Centro de Ayuda</h3>
                </Card>
              </Link>
            </div>


            {/* Progreso de Nivel */}
            <div className="mb-8" data-tour="level">
              <LevelProgress />
            </div>
          </div>
        </div>
      </div>

      {/* Tour de Onboarding desactivado para evitar errores */}
    </div>
  );
}
