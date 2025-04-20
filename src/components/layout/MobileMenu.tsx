"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, X, AppWindow, User, Trophy, LogOut, Sun, Moon, Monitor, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
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
                  <div className="h-full w-full flex items-center justify-center overflow-hidden">
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: 'center' }}
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

            <Link
              href="/dashboard/perfil"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>

            <Link
              href="/dashboard/niveles"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <Trophy size={20} />
              <span>Niveles</span>
            </Link>
          </nav>

          {/* Theme selector */}
          <div className="mt-8 border-t border-border/20 pt-6">
            <h4 className="text-sm font-medium text-foreground/70 mb-3 px-4">Tema</h4>
            <div className="space-y-1">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${theme === 'light' ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 text-foreground/60 hover:text-primary'}`}
                onClick={() => {
                  setTheme('light');
                  toggleMenu();
                }}
              >
                <Sun size={20} />
                <span>Claro</span>
              </button>

              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 text-foreground/60 hover:text-primary'}`}
                onClick={() => {
                  setTheme('dark');
                  toggleMenu();
                }}
              >
                <Moon size={20} />
                <span>Oscuro</span>
              </button>

              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${theme === 'system' ? 'bg-primary/10 text-primary' : 'hover:bg-primary/10 text-foreground/60 hover:text-primary'}`}
                onClick={() => {
                  setTheme('system');
                  toggleMenu();
                }}
              >
                <Monitor size={20} />
                <span>Sistema</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-auto">
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground/60 hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};