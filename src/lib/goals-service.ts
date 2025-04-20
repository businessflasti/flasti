import { supabase } from './supabase';

export interface Goal {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  type: 'sales' | 'clicks' | 'earnings' | 'custom';
  target_value: number;
  current_value: number;
  deadline: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class GoalsService {
  private static instance: GoalsService;

  private constructor() {}

  public static getInstance(): GoalsService {
    if (!GoalsService.instance) {
      GoalsService.instance = new GoalsService();
    }
    return GoalsService.instance;
  }

  /**
   * Obtiene todos los objetivos del usuario
   */
  public async getUserGoals(userId: string): Promise<Goal[]> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al obtener objetivos:', error);
        return [];
      }

      return data as Goal[];
    } catch (error) {
      console.error('Error general al obtener objetivos:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo objetivo para el usuario
   */
  public async createGoal(userId: string, goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed'>): Promise<Goal | null> {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          name: goal.name,
          description: goal.description,
          type: goal.type,
          target_value: goal.target_value,
          current_value: goal.current_value || 0,
          deadline: goal.deadline
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear objetivo:', error);
        return null;
      }

      return data as Goal;
    } catch (error) {
      console.error('Error general al crear objetivo:', error);
      return null;
    }
  }

  /**
   * Actualiza un objetivo existente
   */
  public async updateGoal(goalId: number, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Goal | null> {
    try {
      // Añadir timestamp de actualización
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('goals')
        .update(updatedData)
        .eq('id', goalId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar objetivo:', error);
        return null;
      }

      return data as Goal;
    } catch (error) {
      console.error('Error general al actualizar objetivo:', error);
      return null;
    }
  }

  /**
   * Elimina un objetivo
   */
  public async deleteGoal(goalId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Error al eliminar objetivo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error general al eliminar objetivo:', error);
      return false;
    }
  }

  /**
   * Actualiza el progreso de los objetivos del usuario basado en su actividad
   */
  public async updateGoalsProgress(userId: string): Promise<Goal[]> {
    try {
      // Obtener todos los objetivos del usuario
      const goals = await this.getUserGoals(userId);
      const updatedGoals: Goal[] = [];

      // Obtener estadísticas del usuario
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('total_sales, total_earnings')
        .eq('user_id', userId)
        .single();

      if (affiliateError && affiliateError.code !== 'PGRST116') {
        console.error('Error al obtener datos de afiliado:', affiliateError);
      }

      // Obtener clics del usuario
      const { count: totalClicks, error: clicksError } = await supabase
        .from('affiliate_clicks')
        .select('id', { count: 'exact', head: true })
        .eq('affiliate_id', userId);

      if (clicksError) {
        console.error('Error al obtener clics:', clicksError);
      }

      // Actualizar cada objetivo según su tipo
      for (const goal of goals) {
        let newValue = goal.current_value;
        let completed = goal.completed;

        switch (goal.type) {
          case 'sales':
            newValue = affiliateData?.total_sales || 0;
            break;
          case 'clicks':
            newValue = totalClicks || 0;
            break;
          case 'earnings':
            newValue = affiliateData?.total_earnings || 0;
            break;
          // Los objetivos personalizados se actualizan manualmente
        }

        // Verificar si se ha completado el objetivo
        if (newValue >= goal.target_value && !goal.completed) {
          completed = true;
        }

        // Solo actualizar si hay cambios
        if (newValue !== goal.current_value || completed !== goal.completed) {
          const updatedGoal = await this.updateGoal(goal.id, {
            current_value: newValue,
            completed
          });

          if (updatedGoal) {
            updatedGoals.push(updatedGoal);
          }
        }
      }

      return updatedGoals;
    } catch (error) {
      console.error('Error general al actualizar progreso de objetivos:', error);
      return [];
    }
  }
}

export const goalsService = GoalsService.getInstance();
