'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

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

// Sin datos por defecto - mostrar loader hasta que carguen los datos reales

const defaultSettings: RankingSettings = {
  title: 'Top 3 semanal',
  subtitle: 'Los que más ganaron'
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

const WeeklyTopRanking: React.FC = () => {
  const { activeTheme } = useSeasonalTheme();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [settings, setSettings] = useState<RankingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopRanking = async () => {
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
          
          // Actualizar títulos si existen
          if (data[0].title) {
            setSettings({
              title: data[0].title,
              subtitle: data[0].subtitle
            });
          }
        }
      } catch (error) {
        console.error('Error fetching top ranking:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
  }, []);

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      {/* Título */}
      <div className="mb-3">
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
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white/60 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : topUsers.length === 0 ? (
        /* Mensaje cuando no hay datos */
        <div className="text-center py-6 text-white/40 text-xs">
          No hay datos disponibles
        </div>
      ) : (
        /* Lista de top usuarios */
        <div className="space-y-2">
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
                w-6 h-6 rounded-full
                bg-gradient-to-br ${colors.gradient}
                shadow-lg ${colors.glow}
                border-2 border-[#161b22]
              `}>
                <span className="text-[10px] font-bold text-white">#{user.rank}</span>
              </div>

              {/* Contenedor con efecto glassmorphism */}
              <div className={`
                relative overflow-hidden rounded-xl
                bg-white/[0.03] backdrop-blur-xl border border-white/10
                p-2.5 transition-all duration-300
                hover:bg-white/[0.05] hover:border-white/20
                ${colors.glow}
              `}>
                {/* Brillo superior */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div className="relative flex items-center gap-2.5">
                  {/* Avatar profesional con loading */}
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
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
                          <span className="text-white/60 text-xs font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Placeholder profesional y neutro cuando no hay imagen */
                      <div className="w-full h-full flex items-center justify-center bg-slate-600">
                        <span className="text-white text-xs font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info del usuario */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/70 truncate">{user.name}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-bold text-white">
                        ${user.earnings.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-white/50">USD</span>
                    </div>
                  </div>

                  {/* Bandera del país */}
                  {user.country_code && (
                    <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center bg-white/10 border border-white/10 flex-shrink-0">
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
};

export default WeeklyTopRanking;
