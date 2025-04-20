'use client';

import React, { ReactNode } from 'react';
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { LeaderboardProvider } from '@/contexts/LeaderboardContext';
import { GoalsProvider } from '@/contexts/GoalsContext';
import { ThemesProvider } from '@/contexts/ThemesContext';

interface GamificationProvidersProps {
  children: ReactNode;
}

export default function GamificationProviders({ children }: GamificationProvidersProps) {
  return (
    <ThemesProvider>
      <AchievementsProvider>
        <LeaderboardProvider>
          <GoalsProvider>
            {children}
          </GoalsProvider>
        </LeaderboardProvider>
      </AchievementsProvider>
    </ThemesProvider>
  );
}
