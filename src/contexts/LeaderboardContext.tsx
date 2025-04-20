'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Leaderboard, leaderboardService } from '@/lib/leaderboard-service';

interface LeaderboardContextType {
  weeklyLeaderboard: Leaderboard | null;
  monthlyLeaderboard: Leaderboard | null;
  userWeeklyRank: { rank: number; total: number } | null;
  userMonthlyRank: { rank: number; total: number } | null;
  loading: boolean;
  refreshLeaderboards: () => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<Leaderboard | null>(null);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<Leaderboard | null>(null);
  const [userWeeklyRank, setUserWeeklyRank] = useState<{ rank: number; total: number } | null>(null);
  const [userMonthlyRank, setUserMonthlyRank] = useState<{ rank: number; total: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadLeaderboards();
    }
  }, [user]);

  const loadLeaderboards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Actualizar las clasificaciones con datos recientes
      await leaderboardService.updateLeaderboards();
      
      // Obtener clasificaciones
      const weekly = await leaderboardService.getLeaderboard('weekly');
      const monthly = await leaderboardService.getLeaderboard('monthly');
      
      setWeeklyLeaderboard(weekly);
      setMonthlyLeaderboard(monthly);
      
      // Obtener posición del usuario
      if (user) {
        const weeklyRank = await leaderboardService.getUserRank(user.id, 'weekly');
        const monthlyRank = await leaderboardService.getUserRank(user.id, 'monthly');
        
        setUserWeeklyRank(weeklyRank);
        setUserMonthlyRank(monthlyRank);
      }
    } catch (error) {
      console.error('Error al cargar clasificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboards = async () => {
    await loadLeaderboards();
  };

  const value = {
    weeklyLeaderboard,
    monthlyLeaderboard,
    userWeeklyRank,
    userMonthlyRank,
    loading,
    refreshLeaderboards
  };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard debe ser usado dentro de un LeaderboardProvider');
  }
  return context;
}
