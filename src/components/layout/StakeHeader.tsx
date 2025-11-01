"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Coins, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StakeHeaderProps {
  transparent?: boolean;
  fixed?: boolean;
  onMenuToggle?: () => void;
}

export default function StakeHeader({ 
  transparent = false, 
  fixed = true,
  onMenuToggle 
}: StakeHeaderProps) {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Detect scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={`
        w-full z-50 transition-all duration-stake-normal
        ${fixed ? 'fixed top-0 left-0 right-0' : 'relative'}
        ${isScrolled || !transparent ? 'stake-header-blur' : 'bg-transparent'}
      `}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden stake-text-primary hover:stake-text-secondary transition-colors stake-focus-visible"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 stake-focus-visible">
              <span className="text-2xl font-bold stake-text-primary font-display italic">
                Stake
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="stake-text-secondary hover:stake-text-primary transition-colors font-medium stake-focus-visible"
            >
              Dashboard
            </Link>
          </nav>

          {/* Right: Auth Buttons or User Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 stake-bg-tertiary px-4 py-2 rounded-stake-lg">
                  <Coins className="w-4 h-4 text-[#00C67A]" />
                  <span className="stake-text-primary font-semibold">
                    {isLoading ? '...' : balance.toLocaleString()}
                  </span>
                  <span className="stake-text-secondary text-sm">fichas</span>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 stake-bg-tertiary hover:stake-bg-secondary px-3 py-2 rounded-stake-lg transition-colors stake-focus-visible">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#00C67A] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown className="w-4 h-4 stake-text-secondary hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 stake-bg-secondary border border-[#2A3F4F] rounded-stake-lg shadow-stake-xl"
                  >
                    <div className="px-3 py-2">
                      <p className="stake-text-primary font-semibold text-sm">
                        {user.email}
                      </p>
                      <p className="stake-text-tertiary text-xs mt-1">
                        {balance.toLocaleString()} fichas
                      </p>
                    </div>
                    <DropdownMenuSeparator className="stake-divider" />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 stake-text-secondary hover:stake-text-primary hover:stake-bg-tertiary cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-3 py-2 stake-text-secondary hover:stake-text-primary hover:stake-bg-tertiary cursor-pointer transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="stake-divider" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 stake-text-secondary hover:text-[#FF4757] hover:stake-bg-tertiary cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="stake-text-primary hover:stake-text-secondary hover:stake-bg-tertiary stake-focus-visible"
                  >
                    Iniciar sesión
                  </Button>
                </Link>

                {/* Register Button */}
                <Link href="/register">
                  <Button className="stake-button-primary stake-focus-visible">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
