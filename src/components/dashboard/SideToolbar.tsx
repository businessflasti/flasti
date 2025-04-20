'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  Link2, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Lightbulb,
  Zap,
  Star,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function SideToolbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const tools = [
    { 
      icon: <Calculator size={20} />, 
      label: 'Simulador', 
      href: '/dashboard/simulador', 
      color: '#ec4899',
      description: 'Calcula tus ganancias potenciales'
    },
    { 
      icon: <Sparkles size={20} />, 
      label: 'Generador IA', 
      href: '/dashboard/generador-contenido', 
      color: '#9333ea',
      description: 'Crea contenido con inteligencia artificial',
      isNew: true
    },
    { 
      icon: <Link2 size={20} />, 
      label: 'Editor Enlaces', 
      href: '/dashboard/editor-enlaces', 
      color: '#0ea5e9',
      description: 'Personaliza tus enlaces de afiliado'
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Análisis', 
      href: '/dashboard/analisis', 
      color: '#22c55e',
      description: 'Analiza el rendimiento de tus enlaces'
    },
    { 
      icon: <Lightbulb size={20} />, 
      label: 'Tips', 
      href: '/dashboard/tips', 
      color: '#f59e0b',
      description: 'Consejos para aumentar tus conversiones',
      isHot: true
    },
    { 
      icon: <Zap size={20} />, 
      label: 'Impulso', 
      href: '/dashboard/impulso', 
      color: '#8b5cf6',
      description: 'Promociona tus enlaces con créditos',
      isNew: true
    },
    { 
      icon: <Star size={20} />, 
      label: 'Favoritos', 
      href: '/dashboard/favoritos', 
      color: '#f43f5e',
      description: 'Accede rápido a tus enlaces favoritos'
    },
    { 
      icon: <Gift size={20} />, 
      label: 'Recompensas', 
      href: '/dashboard/recompensas', 
      color: '#10b981',
      description: 'Canjea puntos por beneficios exclusivos',
      isHot: true
    },
  ];

  return (
    <motion.div 
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-gray-800 rounded-r-xl shadow-lg transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-2">
        <button 
          onClick={toggleExpand}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
        >
          {isExpanded ? (
            <ChevronLeft size={14} className="text-white" />
          ) : (
            <ChevronRight size={14} className="text-white" />
          )}
        </button>

        <div className="flex flex-col gap-4 py-2">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <motion.div 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer relative"
                whileHover={{ x: 5 }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                >
                  {tool.icon}
                </div>
                
                {isExpanded && (
                  <div className="overflow-hidden">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs text-foreground/70 truncate">{tool.description}</div>
                  </div>
                )}

                {tool.isNew && (
                  <Badge 
                    className="absolute top-0 right-0 bg-green-500 text-[10px] px-1 py-0 h-4"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    NUEVO
                  </Badge>
                )}

                {tool.isHot && (
                  <Badge 
                    className="absolute top-0 right-0 bg-red-500 text-[10px] px-1 py-0 h-4"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    HOT
                  </Badge>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
