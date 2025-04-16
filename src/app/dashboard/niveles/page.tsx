'use client';

import { Card } from '@/components/ui/card';
import { useUserLevel } from '@/contexts/UserLevelContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Star, Crown, ArrowRight, Check } from 'lucide-react';
import BackButton from '@/components/ui/back-button';

export default function NivelesPage() {
  const { level, commission, balance, getNextLevelThreshold } = useUserLevel();
  const { t } = useLanguage();

  const levels = [
    {
      level: 1,
      icon: <Trophy className="text-[#facc15]" size={24} />,
      title: 'Nivel Inicial',
      commission: 50,
      threshold: 0,
      description: 'Comienza tu viaje como afiliado',
      bgGradient: 'from-[#facc15]/20 to-[#f97316]/20',
      iconBg: 'bg-[#facc15]/10'
    },
    {
      level: 2,
      icon: <Star className="text-[#9333ea]" size={24} />,
      title: 'Nivel Intermedio',
      commission: 60,
      threshold: 20,
      description: 'Aumenta tus ganancias con mayor comisión',
      bgGradient: 'from-[#9333ea]/20 to-[#ec4899]/20',
      iconBg: 'bg-[#9333ea]/10'
    },
    {
      level: 3,
      icon: <Crown className="text-[#ec4899]" size={24} />,
      title: 'Nivel Experto',
      commission: 70,
      threshold: 30,
      description: 'Disfruta de la máxima comisión por ventas',
      bgGradient: 'from-[#ec4899]/20 to-[#f97316]/20',
      iconBg: 'bg-[#ec4899]/10'
    }
  ];

  const nextThreshold = getNextLevelThreshold();

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 relative min-h-screen">
      <BackButton />
      {/* Elementos decorativos futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
        <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#9333ea] animate-ping"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12 mt-20 sm:mt-0">
          <h1 className="text-3xl font-bold mb-4 text-gradient">Sistema de Niveles</h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Aumenta tus ganancias subiendo de nivel. Cuanto más alto sea tu nivel, mayor será tu comisión por cada venta.
          </p>
        </div>

        {/* Estado actual */}
        <Card className="glass-card p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tu Nivel Actual</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient">{level}</span>
              {levels[level - 1].icon}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Comisión actual:</span>
              <span className="font-semibold text-gradient">{commission}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Balance acumulado:</span>
              <span className="font-semibold text-gradient">${balance} USD</span>
            </div>
            {nextThreshold && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Próximo nivel en:</span>
                  <span className="font-semibold text-gradient">${nextThreshold} USD</span>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9333ea] to-[#ec4899] transition-all duration-500"
                      style={{
                        width: `${Math.min((balance / nextThreshold) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-foreground/50">
                    <span>${balance} USD</span>
                    <span>${nextThreshold} USD</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Lista de niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {levels.map((levelInfo) => (
            <Card
              key={levelInfo.level}
              className={`glass-card p-6 relative overflow-hidden group ${
                level === levelInfo.level ? 'ring-2 ring-[#9333ea]' : ''
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.bgGradient} opacity-30`}></div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${levelInfo.iconBg}`}>
                  {levelInfo.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{levelInfo.title}</h2>
                  <p className="text-sm text-foreground/70">Nivel {levelInfo.level}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-foreground/80">{levelInfo.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" />
                  <span>Comisión del {levelInfo.commission}%</span>
                </div>
                {levelInfo.threshold > 0 && (
                  <div className="flex items-center gap-2">
                    <ArrowRight size={18} />
                    <span>Alcanza ${levelInfo.threshold} USD en balance</span>
                  </div>
                )}
              </div>

              {level === levelInfo.level && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#9333ea]/20 rounded-full text-xs">
                  Nivel Actual
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}