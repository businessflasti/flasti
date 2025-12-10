'use client';

import React, { useState, useEffect, memo, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TopUser {
  rank: number;
  earnings: number;
  name: string;
  country_code?: string;
  avatar_url?: string;
}

interface RankingSettings {
  title: string;
  subtitle: string;
}

interface WeeklyTopRankingProps {
  variant?: 'default' | 'dark';
}

// Sin datos por defecto - mostrar loader hasta que carguen los datos reales

const defaultSettings: RankingSettings = {
  title: 'Reporte semanal de actividad',
  subtitle: 'Ingresos verificados'
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        gradient: 'from-yellow-400 via-yellow-500 to-amber-600',
        glow: 'shadow-yellow-500/20',
        icon: 'text-yellow-400'
      };
    case 2:
      return {
        gradient: 'from-gray-300 via-gray-400 to-gray-500',
        glow: 'shadow-gray-400/20',
        icon: 'text-gray-300'
      };
    case 3:
      return {
        gradient: 'from-orange-400 via-orange-500 to-orange-600',
        glow: 'shadow-orange-500/20',
        icon: 'text-orange-400'
      };
    default:
      return {
        gradient: 'from-gray-400 to-gray-600',
        glow: 'shadow-gray-500/20',
        icon: 'text-gray-400'
      };
  }
};

const WeeklyTopRanking: React.FC<WeeklyTopRankingProps> = memo(({ variant = 'default' }) => {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [settings, setSettings] = useState<RankingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemBgColor = variant === 'dark' ? '#1A1A1A' : '#1A1A1A';

  const fetchTopRanking = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_top_ranking')
        .select('*')
        .order('rank', { ascending: true });

      if (error) {
        console.error('Error fetching top ranking:', error);
        return;
      }

      if (data && data.length > 0) {
        const formattedData: TopUser[] = data.map(item => ({
          rank: item.rank,
          earnings: parseFloat(item.earnings),
          name: item.name,
          country_code: item.country_code,
          avatar_url: item.avatar_url
        }));
        setTopUsers(formattedData);
      }
    } catch (error) {
      console.error('Error fetching top ranking:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRanking();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('weekly_top_ranking_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'weekly_top_ranking'
      }, () => {
        fetchTopRanking();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTopRanking]);

  return (
    <div className="mt-3 pt-3 border-t border-white/10 flex-1 flex flex-col">
      {/* Título */}
      <div className="mb-7 weekly-ranking-title">
        <h3 className="text-[10px] sm:text-xs font-bold text-white leading-tight">
          {settings.title}
        </h3>
        <p className="text-[8px] sm:text-[10px] text-white/60 leading-tight">
          {settings.subtitle}
        </p>
      </div>

      {/* Spinner mientras carga */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div 
            className="w-8 h-8 rounded-full animate-spin"
            style={{ 
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#fff'
            }}
          />
        </div>
      ) : topUsers.length === 0 ? (
        /* Mensaje cuando no hay datos */
        <div className="text-center py-6 text-white/40 text-xs">
          No hay datos disponibles
        </div>
      ) : (
        /* Lista de top usuarios */
        <div className="space-y-2 flex-1">
          {topUsers.map((user) => {
          const colors = getRankColor(user.rank);
          return (
            <div
              key={user.rank}
              className="relative group"
            >
              {/* Badge con el número en la esquina superior izquierda */}
              <div className={`
                absolute -top-1.5 -left-1.5 z-10
                flex items-center justify-center
                w-5 h-5 sm:w-6 sm:h-6 rounded-full
                bg-gradient-to-br ${colors.gradient}
              `}>
                <span className="text-[9px] sm:text-[10px] font-bold text-white">{user.rank}</span>
              </div>

              {/* Contenedor optimizado */}
              <div 
                className="relative overflow-hidden rounded-xl p-2 sm:p-2.5"
                style={{ backgroundColor: itemBgColor }}
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {/* Avatar profesional con loading */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
                    {user.avatar_url ? (
                      <>
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onLoad={(e) => {
                            e.currentTarget.style.opacity = '1';
                            const skeleton = e.currentTarget.nextElementSibling as HTMLElement;
                            if (skeleton) skeleton.style.display = 'none';
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const skeleton = e.currentTarget.nextElementSibling as HTMLElement;
                            if (skeleton) {
                              skeleton.style.display = 'flex';
                              skeleton.classList.remove('animate-pulse');
                            }
                          }}
                          style={{ opacity: 0 }}
                        />
                        {/* Loading skeleton mientras carga */}
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-600 animate-pulse">
                          <span className="text-white/60 text-[10px] font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Placeholder profesional y neutro cuando no hay imagen */
                      <div className="w-full h-full flex items-center justify-center bg-slate-600">
                        <span className="text-white text-[10px] font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info del usuario */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-white/70 truncate">{user.name}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                      <span className="text-[10px] sm:text-xs font-bold text-white">
                        ${user.earnings.toLocaleString()}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-white/50">USD</span>
                    </div>
                  </div>

                  {/* Bandera del país */}
                  {user.country_code && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 overflow-hidden rounded-full flex items-center justify-center bg-slate-600 flex-shrink-0">
                      <img
                        src={`https://flagcdn.com/w20/${user.country_code.toLowerCase()}.png`}
                        alt={user.country_code}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
});

WeeklyTopRanking.displayName = 'WeeklyTopRanking';

export default WeeklyTopRanking;
