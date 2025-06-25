'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Trophy, 
  Crown, 
  Palette, 
  ChevronDown,
  ChevronUp,
  Rocket,
  Award,
  Medal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TopToolbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const gamificationTools = [
    { 
      icon: <Target size={20} />, 
      label: 'Objetivos', 
      href: '/dashboard/objetivos', 
      color: '#f59e0b',
      description: 'Establece y alcanza tus metas'
    },
    { 
      icon: <Trophy size={20} />, 
      label: 'Logros', 
      href: '/dashboard/logros', 
      color: '#10b981',
      description: 'Desbloquea logros y gana puntos',
      count: 3
    },
    { 
      icon: <Crown size={20} />, 
      label: 'Clasificación', 
      href: '/dashboard/clasificacion', 
      color: '#f43f5e',
      description: 'Compite con otros afiliados'
    },
    { 
      icon: <Palette size={20} />, 
      label: 'Temas', 
      href: '/dashboard/temas', 
      color: '#8b5cf6',
      description: 'Personaliza la apariencia'
    },
    { 
      icon: <Rocket size={20} />, 
      label: 'Misiones', 
      href: '/dashboard/misiones', 
      color: '#ec4899',
      description: 'Completa misiones diarias',
      count: 2
    },
    { 
      icon: <Award size={20} />, 
      label: 'Insignias', 
      href: '/dashboard/insignias', 
      color: '#0ea5e9',
      description: 'Colecciona insignias exclusivas'
    },
    { 
      icon: <Medal size={20} />, 
      label: 'Nivel', 
      href: '/dashboard/nivel', 
      color: '#22c55e',
      description: 'Sube de nivel y desbloquea beneficios'
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div 
        className="p-2 flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-primary/10">
            <Trophy size={18} className="text-primary" />
          </div>
          <span className="font-medium">Gamificación</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Nivel 3
          </Badge>
          {isExpanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 p-2">
            {gamificationTools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <div 
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-center relative"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                  >
                    {tool.icon}
                  </div>
                  <div className="font-medium text-sm">{tool.label}</div>
                  <div className="text-xs text-foreground/70 line-clamp-1">{tool.description}</div>
                  
                  {tool.count && (
                    <Badge 
                      className="absolute top-0 right-0 bg-red-500 text-[10px] px-1 py-0 h-4 min-w-[16px]"
                      style={{ transform: 'translate(25%, -25%)' }}
                    >
                      {tool.count}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
