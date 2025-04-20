'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement, achievementsService } from '@/lib/achievements-service';
import { toast } from 'sonner';

interface AchievementsContextType {
  achievements: Achievement[];
  loading: boolean;
  totalPoints: number;
  checkForNewAchievements: () => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userAchievements = await achievementsService.getUserAchievements(user.id);
      setAchievements(userAchievements);
      
      const points = await achievementsService.getUserAchievementPoints(user.id);
      setTotalPoints(points);
    } catch (error) {
      console.error('Error al cargar logros:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    if (!user) return;
    
    try {
      const newAchievements = await achievementsService.checkAchievements(user.id);
      
      if (newAchievements.length > 0) {
        // Actualizar la lista de logros
        await loadAchievements();
        
        // Mostrar notificaciones para los nuevos logros
        newAchievements.forEach(achievement => {
          toast.success(
            <div className="flex flex-col">
              <span className="font-bold">¡Nuevo logro desbloqueado!</span>
              <span>{achievement.name}</span>
              <span className="text-xs text-foreground/70">{achievement.description}</span>
            </div>,
            {
              duration: 5000,
              icon: '🏆'
            }
          );
        });
      }
    } catch (error) {
      console.error('Error al verificar nuevos logros:', error);
    }
  };

  const value = {
    achievements,
    loading,
    totalPoints,
    checkForNewAchievements
  };

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements debe ser usado dentro de un AchievementsProvider');
  }
  return context;
}
