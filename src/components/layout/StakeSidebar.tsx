"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gift,
  Users,
  Crown,
  FileText,
  MessageSquare,
  Award,
  X,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
}

interface StakeSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const sidebarItems: SidebarItem[] = [
  { id: 'promotions', label: 'Promociones', icon: Gift, href: '/promotions' },
  { id: 'affiliate', label: 'Afiliado', icon: Users, href: '/affiliate' },
  { id: 'vip', label: 'Club VIP', icon: Crown, href: '/vip' },
  { id: 'blog', label: 'Blog', icon: FileText, href: '/blog' },
  { id: 'forum', label: 'Foro', icon: MessageSquare, href: '/forum' },
  { id: 'sponsors', label: 'Patrocinios', icon: Award, href: '/sponsors' },
];

export default function StakeSidebar({ isOpen = false, onClose }: StakeSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0A0A0A]/90 lg:hidden z-40"
          onClick={onClose}
          aria-hidden="true"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#121212]
          border-r border-white/10 z-50
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
        `}
        style={{
          transform: isOpen ? 'translate3d(0, 0, 0)' : undefined,
          backfaceVisibility: 'hidden',
          contain: 'layout style paint'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#2A3F4F]/50">
            <span className="stake-text-primary font-semibold">Menú</span>
            <button
              onClick={onClose}
              className="stake-text-secondary hover:stake-text-primary transition-colors p-1"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`
                    stake-sidebar-item
                    ${active ? 'stake-sidebar-item-active' : ''}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="stake-badge stake-badge-casino text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Section (Optional) */}
          <div className="p-4 border-t border-[#2A3F4F]/50">
            <div className="stake-bg-secondary rounded-stake-lg p-3">
              <p className="stake-text-primary text-sm font-semibold mb-1">
                ¿Necesitas ayuda?
              </p>
              <p className="stake-text-tertiary text-xs mb-3">
                Nuestro equipo está disponible 24/7
              </p>
              <Link
                href="/support"
                className="block text-center stake-button-secondary text-sm py-2"
              >
                Contactar Soporte
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
