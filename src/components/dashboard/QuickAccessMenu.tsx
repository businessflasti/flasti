'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Link2,
  BarChart2,
  AppWindow,
  BookOpen,
  Wallet,
  HelpCircle,
  Plus,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuickAccessMenu() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      icon: <Link2 size={20} />,
      label: t('misEnlaces') as string,
      href: '/dashboard/links',
      color: '#ec4899',
      position: { x: -120, y: -20 }
    },
    {
      icon: <BarChart2 size={20} />,
      label: t('estadisticas') as string,
      href: '/dashboard/stats',
      color: '#9333ea',
      position: { x: -100, y: -80 }
    },
    {
      icon: <AppWindow size={20} />,
      label: t('apps') as string,
      href: '/dashboard/aplicaciones',
      color: '#0ea5e9',
      position: { x: -40, y: -120 }
    },
    {
      icon: <BookOpen size={20} />,
      label: t('recursos') as string,
      href: '/dashboard/recursos',
      color: '#22c55e',
      position: { x: 40, y: -120 }
    },
    {
      icon: <Wallet size={20} />,
      label: t('retiros') as string,
      href: '/dashboard/paypal',
      color: '#f59e0b',
      position: { x: 100, y: -80 }
    },
    {
      icon: <HelpCircle size={20} />,
      label: 'Centro de Ayuda',
      href: '/dashboard/centro-ayuda',
      color: '#8b5cf6',
      position: { x: 120, y: -20 }
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="absolute bottom-0 left-0">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="absolute"
              style={{ bottom: 0, left: 0, opacity: 1, x: item.position.x, y: item.position.y }}
            >
              <Link href={item.href}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color, color: 'white' }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-800 rounded-full shadow-md">
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-[#0ea5e9] to-[#22c55e] hover:shadow-xl'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-white" />
        )}
      </button>
    </div>
  );
}
