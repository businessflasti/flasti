'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Goal, goalsService } from '@/lib/goals-service';
import { toast } from 'sonner';

interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  createGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed'>) => Promise<Goal | null>;
  updateGoal: (goalId: number, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<Goal | null>;
  deleteGoal: (goalId: number) => Promise<boolean>;
  refreshGoals: () => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Actualizar el progreso de los objetivos
      await goalsService.updateGoalsProgress(user.id);
      
      // Cargar los objetivos actualizados
      const userGoals = await goalsService.getUserGoals(user.id);
      setGoals(userGoals);
      
      // Verificar si hay objetivos completados recientemente
      const completedGoals = userGoals.filter(goal => goal.completed && new Date(goal.updated_at) > new Date(Date.now() - 5 * 60 * 1000));
      
      // Mostrar notificaciones para objetivos completados recientemente
      completedGoals.forEach(goal => {
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold">¡Objetivo completado!</span>
            <span>{goal.name}</span>
            <span className="text-xs text-foreground/70">{goal.description}</span>
          </div>,
          {
            duration: 5000,
            icon: '🎯'
          }
        );
      });
    } catch (error) {
      console.error('Error al cargar objetivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed'>) => {
    if (!user) return null;
    
    try {
      const newGoal = await goalsService.createGoal(user.id, goal);
      
      if (newGoal) {
        setGoals(prev => [newGoal, ...prev]);
        toast.success('Objetivo creado con éxito');
      }
      
      return newGoal;
    } catch (error) {
      console.error('Error al crear objetivo:', error);
      toast.error('Error al crear el objetivo');
      return null;
    }
  };

  const updateGoal = async (goalId: number, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedGoal = await goalsService.updateGoal(goalId, updates);
      
      if (updatedGoal) {
        setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
        toast.success('Objetivo actualizado con éxito');
      }
      
      return updatedGoal;
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      toast.error('Error al actualizar el objetivo');
      return null;
    }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      const success = await goalsService.deleteGoal(goalId);
      
      if (success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        toast.success('Objetivo eliminado con éxito');
      }
      
      return success;
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      toast.error('Error al eliminar el objetivo');
      return false;
    }
  };

  const refreshGoals = async () => {
    await loadGoals();
  };

  const value = {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals
  };

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals debe ser usado dentro de un GoalsProvider');
  }
  return context;
}
