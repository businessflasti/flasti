import { supabase } from './supabase';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: string;
    count: number;
  };
  points: number;
  earned?: boolean;
  earned_at?: string;
}

export class AchievementsService {
  private static instance: AchievementsService;

  private constructor() {}

  public static getInstance(): AchievementsService {
    if (!AchievementsService.instance) {
      AchievementsService.instance = new AchievementsService();
    }
    return AchievementsService.instance;
  }

  /**
   * Obtiene todos los logros disponibles con información de si el usuario los ha conseguido
   */
  public async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('id, name, description, icon, criteria, points')
        .order('points', { ascending: true });

      if (error) {
        console.error('Error al obtener logros:', error);
        return [];
      }

      // Obtener los logros que el usuario ya ha conseguido
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', userId);

      if (userError) {
        console.error('Error al obtener logros del usuario:', userError);
        return data as Achievement[];
      }

      // Marcar los logros conseguidos
      const achievementsWithStatus = data.map((achievement: Achievement) => {
        const earned = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
          ...achievement,
          earned: !!earned,
          earned_at: earned?.earned_at
        };
      });

      return achievementsWithStatus;
    } catch (error) {
      console.error('Error general al obtener logros:', error);
      return [];
    }
  }

  /**
   * Verifica si el usuario ha conseguido nuevos logros basados en su actividad
   */
  public async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      // Obtener todos los logros disponibles
      const achievements = await this.getUserAchievements(userId);
      const newlyEarned: Achievement[] = [];

      // Obtener estadísticas del usuario
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('total_sales')
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

      // Obtener retiros del usuario
      const { count: totalWithdrawals, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (withdrawalsError) {
        console.error('Error al obtener retiros:', withdrawalsError);
      }

      // Verificar perfil completo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, email, phone, avatar_url')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error al obtener perfil:', profileError);
      }

      const profileCompletion = profileData ? 
        Object.values(profileData).filter(Boolean).length / Object.keys(profileData).length * 100 : 0;

      // Verificar cada logro no conseguido
      for (const achievement of achievements.filter(a => !a.earned)) {
        let achieved = false;

        switch (achievement.criteria.type) {
          case 'sales':
            achieved = (affiliateData?.total_sales || 0) >= achievement.criteria.count;
            break;
          case 'clicks':
            achieved = (totalClicks || 0) >= achievement.criteria.count;
            break;
          case 'withdrawals':
            achieved = (totalWithdrawals || 0) >= achievement.criteria.count;
            break;
          case 'profile_completion':
            achieved = profileCompletion >= achievement.criteria.count;
            break;
        }

        if (achieved) {
          // Registrar el logro conseguido
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id
            });

          if (!error) {
            newlyEarned.push({
              ...achievement,
              earned: true,
              earned_at: new Date().toISOString()
            });
          }
        }
      }

      return newlyEarned;
    } catch (error) {
      console.error('Error general al verificar logros:', error);
      return [];
    }
  }

  /**
   * Obtiene el total de puntos de logros del usuario
   */
  public async getUserAchievementPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_achievement_points', { user_id_param: userId });

      if (error) {
        console.error('Error al obtener puntos de logros:', error);
        
        // Fallback manual si la función RPC no está disponible
        const { data: achievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', userId);

        if (achievementsError) {
          console.error('Error al obtener logros del usuario:', achievementsError);
          return 0;
        }

        if (!achievements || achievements.length === 0) {
          return 0;
        }

        const achievementIds = achievements.map(a => a.achievement_id);
        
        const { data: achievementPoints, error: pointsError } = await supabase
          .from('achievements')
          .select('points')
          .in('id', achievementIds);

        if (pointsError) {
          console.error('Error al obtener puntos de logros:', pointsError);
          return 0;
        }

        return achievementPoints.reduce((sum, a) => sum + a.points, 0);
      }

      return data || 0;
    } catch (error) {
      console.error('Error general al obtener puntos de logros:', error);
      return 0;
    }
  }
}

export const achievementsService = AchievementsService.getInstance();
