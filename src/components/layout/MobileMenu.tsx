"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

import { Menu, X, AppWindow, User, Trophy, LogOut, Bell, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { user, profile } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

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

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Menu panel */}
      <div
        className={`fixed top-0 right-0 w-3/4 h-full bg-card/95 backdrop-blur-md border-l border-border/20 p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* User info */}
          <div className="flex items-center gap-3 mb-8 mt-2">
            <div className="relative">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-background">
                {profile?.avatar_url ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="rounded-full"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div 
                    className="h-full w-full rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border border-background shadow-sm translate-x-1/4 translate-y-1/2"></span>
            </div>
            <div>
              <h3 className="font-medium">
                {profile?.first_name 
                  ? `${profile.first_name} ${profile.last_name || ''}`.trim()
                  : (profile?.name || user?.email?.split('@')[0] || '')}
              </h3>
              <p className="text-sm text-foreground/60">Nivel {profile?.level || 1}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
              onClick={toggleMenu}
            >
              <AppWindow size={20} />
              <span>Apps Promocionables</span>
            </Link>

            <a
              href="/dashboard/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <User size={20} />
              <span>Perfil</span>
            </a>

            <Link
              href="/dashboard/niveles"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <Trophy size={20} />
              <span>Niveles</span>
            </Link>

            <a
              href="/dashboard/paypal"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <Wallet size={20} />
              <span>Retiros</span>
            </a>
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <a
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                // Importamos la función signOut del contexto de autenticación
                const { signOut } = useAuth();
                signOut();
              }}
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};