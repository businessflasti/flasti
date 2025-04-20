'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  Link2, 
  BarChart3, 
  Target, 
  Palette, 
  Crown, 
  Trophy, 
  Plus, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <Calculator size={20} />, label: 'Simulador', href: '/dashboard/simulador', color: '#ec4899' },
    { icon: <Sparkles size={20} />, label: 'IA', href: '/dashboard/generador-contenido', color: '#9333ea' },
    { icon: <Link2 size={20} />, label: 'Editor', href: '/dashboard/editor-enlaces', color: '#0ea5e9' },
    { icon: <BarChart3 size={20} />, label: 'Análisis', href: '/dashboard/analisis', color: '#22c55e' },
    { icon: <Target size={20} />, label: 'Objetivos', href: '/dashboard/objetivos', color: '#f59e0b' },
    { icon: <Palette size={20} />, label: 'Temas', href: '/dashboard/temas', color: '#8b5cf6' },
    { icon: <Crown size={20} />, label: 'Ranking', href: '/dashboard/clasificacion', color: '#f43f5e' },
    { icon: <Trophy size={20} />, label: 'Logros', href: '/dashboard/logros', color: '#10b981' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col-reverse items-end gap-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 20, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                    style={{ borderLeft: `3px solid ${item.color}` }}
                  >
                    <div 
                      className="p-1 rounded-full" 
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-[#ec4899] to-[#9333ea] hover:shadow-xl'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-white" />
        )}
      </motion.button>
    </div>
  );
}
