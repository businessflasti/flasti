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
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] flex items-center justify-center text-white font-bold">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border border-background shadow-sm translate-x-1/4 translate-y-1/2"></span>
            </div>
            <div>
              <h3 className="font-medium">{profile?.name || user?.email?.split('@')[0] || 'Usuario'}</h3>
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