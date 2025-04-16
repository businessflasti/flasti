"use client";

import { useUserLevel } from '@/contexts/UserLevelContext';
import { Trophy, Star, Crown } from 'lucide-react';
import Link from 'next/link';

export function UserLevelBadge() {
  const { level, commission, getNextLevelThreshold } = useUserLevel();
  const nextThreshold = getNextLevelThreshold();

  const levelIcons = {
    1: <Trophy className="text-[#facc15]" size={16} />,
    2: <Star className="text-[#9333ea]" size={16} />,
    3: <Crown className="text-[#ec4899]" size={16} />
  };

  return (
    <Link href="/dashboard/niveles" className="hover:opacity-80 transition-opacity">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card/30 rounded-full border border-border/50 cursor-pointer hover:bg-card/50 transition-colors">
        <div className="flex items-center gap-1.5">
          {levelIcons[level]}
          <span className="text-sm font-medium">Nivel {level}</span>
        </div>
        <div className="h-4 w-px bg-border/50" />
        <span className="text-sm text-foreground/70">{commission}%</span>
        {nextThreshold && (
          <div className="text-xs text-foreground/50 hidden md:block">
            Siguiente: ${nextThreshold} USD
          </div>
        )}
      </div>
    </Link>
  );
}