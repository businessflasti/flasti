import { supabase } from './supabase';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string | null;
  score: number;
}

export interface Leaderboard {
  id: number;
  name: string;
  period: 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  entries: LeaderboardEntry[];
}

export class LeaderboardService {
  private static instance: LeaderboardService;

  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  /**
   * Asegura que existan las clasificaciones para el período actual
   */
  private async ensureCurrentLeaderboards(): Promise<void> {
    const now = new Date();
    
    // Período semanal
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Lunes
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Domingo
    const weekName = `Semana del ${format(weekStart, "d 'de' MMMM", { locale: es })}`;
    
    // Período mensual
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthName = format(now, "MMMM yyyy", { locale: es });

    // Verificar si ya existe la clasificación semanal
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('leaderboards')
      .select('id')
      .eq('period', 'weekly')
      .gte('start_date', weekStart.toISOString())
      .lte('end_date', weekEnd.toISOString())
      .single();

    if (weeklyError && weeklyError.code !== 'PGRST116') {
      console.error('Error al verificar clasificación semanal:', weeklyError);
    }

    // Crear clasificación semanal si no existe
    if (!weeklyData) {
      const { error } = await supabase
        .from('leaderboards')
        .insert({
          name: weekName,
          period: 'weekly',
          start_date: weekStart.toISOString(),
          end_date: weekEnd.toISOString()
        });

      if (error) {
        console.error('Error al crear clasificación semanal:', error);
      }
    }

    // Verificar si ya existe la clasificación mensual
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('leaderboards')
      .select('id')
      .eq('period', 'monthly')
      .gte('start_date', monthStart.toISOString())
      .lte('end_date', monthEnd.toISOString())
      .single();

    if (monthlyError && monthlyError.code !== 'PGRST116') {
      console.error('Error al verificar clasificación mensual:', monthlyError);
    }

    // Crear clasificación mensual si no existe
    if (!monthlyData) {
      const { error } = await supabase
        .from('leaderboards')
        .insert({
          name: monthName,
          period: 'monthly',
          start_date: monthStart.toISOString(),
          end_date: monthEnd.toISOString()
        });

      if (error) {
        console.error('Error al crear clasificación mensual:', error);
      }
    }
  }

  /**
   * Actualiza las clasificaciones con datos recientes
   */
  public async updateLeaderboards(): Promise<void> {
    try {
      await this.ensureCurrentLeaderboards();

      // Obtener las clasificaciones actuales
      const { data: leaderboards, error } = await supabase
        .from('leaderboards')
        .select('id, period, start_date, end_date')
        .or('period.eq.weekly,period.eq.monthly')
        .order('start_date', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error al obtener clasificaciones:', error);
        return;
      }

      for (const leaderboard of leaderboards) {
        // Obtener los mejores afiliados para el período
        const { data: topAffiliates, error: affiliatesError } = await supabase
          .rpc('get_top_affiliates_for_period', { 
            start_date_param: leaderboard.start_date,
            end_date_param: leaderboard.end_date,
            limit_param: 100
          });

        if (affiliatesError) {
          console.error(`Error al obtener afiliados para ${leaderboard.period}:`, affiliatesError);
          continue;
        }

        // Limpiar entradas existentes
        const { error: deleteError } = await supabase
          .from('leaderboard_entries')
          .delete()
          .eq('leaderboard_id', leaderboard.id);

        if (deleteError) {
          console.error(`Error al limpiar entradas para ${leaderboard.period}:`, deleteError);
          continue;
        }

        // Insertar nuevas entradas
        if (topAffiliates && topAffiliates.length > 0) {
          const entries = topAffiliates.map((affiliate: any, index: number) => ({
            leaderboard_id: leaderboard.id,
            user_id: affiliate.user_id,
            score: affiliate.total_sales || 0,
            rank: index + 1
          }));

          const { error: insertError } = await supabase
            .from('leaderboard_entries')
            .insert(entries);

          if (insertError) {
            console.error(`Error al insertar entradas para ${leaderboard.period}:`, insertError);
          }
        }
      }
    } catch (error) {
      console.error('Error general al actualizar clasificaciones:', error);
    }
  }

  /**
   * Obtiene la clasificación para un período específico
   */
  public async getLeaderboard(period: 'weekly' | 'monthly'): Promise<Leaderboard | null> {
    try {
      await this.ensureCurrentLeaderboards();
      
      // Obtener la clasificación más reciente para el período
      const { data: leaderboardData, error } = await supabase
        .from('leaderboards')
        .select('id, name, period, start_date, end_date')
        .eq('period', period)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(`Error al obtener clasificación ${period}:`, error);
        return null;
      }

      // Obtener las entradas de la clasificación
      const { data: entriesData, error: entriesError } = await supabase
        .from('leaderboard_entries')
        .select(`
          rank,
          user_id,
          score,
          profiles:user_id (
            username:name,
            avatar_url
          )
        `)
        .eq('leaderboard_id', leaderboardData.id)
        .order('rank', { ascending: true });

      if (entriesError) {
        console.error(`Error al obtener entradas para ${period}:`, entriesError);
        return {
          ...leaderboardData,
          entries: []
        };
      }

      // Formatear las entradas
      const entries = entriesData.map((entry: any) => ({
        rank: entry.rank,
        user_id: entry.user_id,
        username: entry.profiles?.username || 'Usuario',
        avatar_url: entry.profiles?.avatar_url,
        score: entry.score
      }));

      return {
        ...leaderboardData,
        entries
      };
    } catch (error) {
      console.error(`Error general al obtener clasificación ${period}:`, error);
      return null;
    }
  }

  /**
   * Obtiene la posición del usuario en la clasificación
   */
  public async getUserRank(userId: string, period: 'weekly' | 'monthly'): Promise<{ rank: number; total: number } | null> {
    try {
      // Obtener la clasificación más reciente para el período
      const { data: leaderboardData, error } = await supabase
        .from('leaderboards')
        .select('id')
        .eq('period', period)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(`Error al obtener clasificación ${period} para usuario:`, error);
        return null;
      }

      // Obtener la posición del usuario
      const { data: userEntry, error: userError } = await supabase
        .from('leaderboard_entries')
        .select('rank')
        .eq('leaderboard_id', leaderboardData.id)
        .eq('user_id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error(`Error al obtener posición del usuario en ${period}:`, userError);
      }

      // Obtener el total de entradas
      const { count, error: countError } = await supabase
        .from('leaderboard_entries')
        .select('id', { count: 'exact', head: true })
        .eq('leaderboard_id', leaderboardData.id);

      if (countError) {
        console.error(`Error al obtener total de entradas en ${period}:`, countError);
        return null;
      }

      return {
        rank: userEntry?.rank || 0,
        total: count || 0
      };
    } catch (error) {
      console.error(`Error general al obtener posición del usuario en ${period}:`, error);
      return null;
    }
  }
}

export const leaderboardService = LeaderboardService.getInstance();
