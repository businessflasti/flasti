'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  Target, 
  Trophy,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FloatingCards() {
  const cards = [
    {
      title: 'Simulador de Ganancias',
      description: 'Calcula cuánto puedes ganar como afiliado',
      icon: <Calculator className="h-5 w-5" />,
      href: '/dashboard/simulador',
      color: '#ec4899',
      position: { top: '120px', right: '20px' },
      rotation: '-3deg',
      isNew: true
    },
    {
      title: 'Generador de Contenido IA',
      description: 'Crea contenido persuasivo con IA',
      icon: <Sparkles className="h-5 w-5" />,
      href: '/dashboard/generador-contenido',
      color: '#9333ea',
      position: { top: '180px', left: '20px' },
      rotation: '2deg',
      isHot: true
    },
    {
      title: 'Objetivos Personales',
      description: 'Establece y alcanza tus metas',
      icon: <Target className="h-5 w-5" />,
      href: '/dashboard/objetivos',
      color: '#f59e0b',
      position: { bottom: '120px', right: '30px' },
      rotation: '3deg'
    },
    {
      title: 'Logros Desbloqueados',
      description: '3 nuevos logros disponibles',
      icon: <Trophy className="h-5 w-5" />,
      href: '/dashboard/logros',
      color: '#10b981',
      position: { bottom: '180px', left: '30px' },
      rotation: '-2deg',
      count: 3
    },
    {
      title: 'Impulsa tus Enlaces',
      description: 'Promociona tus enlaces con créditos',
      icon: <Zap className="h-5 w-5" />,
      href: '/dashboard/impulso',
      color: '#0ea5e9',
      position: { top: '50%', right: '40px' },
      rotation: '-1deg',
      isNew: true
    }
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute z-10 hidden lg:block"
          style={{ ...card.position }}
        >
          <Link href={card.href}>
            <div
              className="w-64 p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              style={{ rotate: card.rotation }}
            >
              <Card>
                <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: card.color }}></div>
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-full" 
                    style={{ backgroundColor: `${card.color}20`, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <div className="font-medium">{card.title}</div>
                    <div className="text-xs text-foreground/70">{card.description}</div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <div 
                    className="text-xs flex items-center gap-1 font-medium"
                    style={{ color: card.color }}
                  >
                    <span>Acceder</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                {card.isNew && (
                  <Badge 
                    className="absolute top-2 right-2 bg-green-500 text-[10px] px-1 py-0 h-4"
                  >
                    NUEVO
                  </Badge>
                )}

                {card.isHot && (
                  <Badge 
                    className="absolute top-2 right-2 bg-red-500 text-[10px] px-1 py-0 h-4"
                  >
                    HOT
                  </Badge>
                )}

                {card.count && (
                  <Badge 
                    className="absolute top-2 right-2 bg-blue-500 text-[10px] px-1 py-0 h-4 min-w-[16px]"
                  >
                    {card.count}
                  </Badge>
                )}
              </Card>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
