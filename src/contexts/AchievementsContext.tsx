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
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Timeout para evitar loading infinito
    const timeoutId = setTimeout(() => {
      console.warn('Timeout al cargar logros, usando datos por defecto');
      setAchievements([]);
      setTotalPoints(0);
      setLoading(false);
    }, 8000); // 8 segundos timeout
    
    try {
      // Usar datos estáticos con logros no conseguidos para nuevos usuarios
      const mockAchievements = [
        {
          id: 1,
          name: 'Primera Venta',
          description: 'Consigue tu primera venta como afiliado',
          icon: 'sales',
          criteria: { type: 'sales', count: 1 },
          points: 10,
          earned: false
        },
        {
          id: 2,
          name: 'Primeros 100 Clics',
          description: 'Consigue 100 clics en tus enlaces de afiliado',
          icon: 'clicks',
          criteria: { type: 'clicks', count: 100 },
          points: 20,
          earned: false
        },
        {
          id: 3,
          name: 'Ventas Constantes',
          description: 'Consigue ventas durante 5 días consecutivos',
          icon: 'streak',
          criteria: { type: 'streak', count: 5 },
          points: 30,
          earned: false
        },
        {
          id: 4,
          name: 'Afiliado Experto',
          description: 'Consigue 10 ventas en un mes',
          icon: 'expert',
          criteria: { type: 'sales', count: 10, period: 'month' },
          points: 50,
          earned: false
        },
        {
          id: 5,
          name: 'Traficante',
          description: 'Consigue 1000 clics en tus enlaces',
          icon: 'traffic',
          criteria: { type: 'clicks', count: 1000 },
          points: 40,
          earned: false
        },
        {
          id: 6,
          name: 'Maestro de Conversiones',
          description: 'Alcanza una tasa de conversión del 5%',
          icon: 'conversion',
          criteria: { type: 'conversion', rate: 5 },
          points: 60,
          earned: false
        }
      ];

      setAchievements(mockAchievements);
      setTotalPoints(0); // Nuevos usuarios comienzan con 0 puntos
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error al cargar logros:', error);
      setAchievements([]);
      setTotalPoints(0);
      clearTimeout(timeoutId);
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
