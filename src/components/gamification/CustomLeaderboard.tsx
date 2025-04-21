'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RefreshCw, Trophy, Medal, Award } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Flag } from '@/components/ui/flag';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  country: string;
  avatar_url: string;
  score: number;
  badge: string;
}

interface LeaderboardData {
  id: number;
  name: string;
  period: string;
  start_date: string;
  end_date: string;
  entries: LeaderboardEntry[];
}

export default function CustomLeaderboard() {
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardData | null>(null);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardData | null>(null);
  const [userWeeklyRank, setUserWeeklyRank] = useState<{ rank: number; total: number } | null>(null);
  const [userMonthlyRank, setUserMonthlyRank] = useState<{ rank: number; total: number } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weekly');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    setRefreshing(true);
    try {
      // Datos estáticos para el top 10 de usuarios latinoamericanos
      const mockWeeklyLeaderboard = {
        id: 1,
        name: 'Clasificación Semanal',
        period: 'weekly',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        entries: [
          { rank: 1, user_id: '1', username: 'Carlos Rodríguez', country: 'MX', avatar_url: '', score: 1250.75, badge: 'Diamante' },
          { rank: 2, user_id: '2', username: 'Ana María González', country: 'AR', avatar_url: '', score: 1080.50, badge: 'Platino' },
          { rank: 3, user_id: '3', username: 'Juan Pérez', country: 'CO', avatar_url: '', score: 920.25, badge: 'Oro' },
          { rank: 4, user_id: '4', username: 'Sofía Martínez', country: 'CL', avatar_url: '', score: 850.80, badge: 'Plata' },
          { rank: 5, user_id: '5', username: 'Diego Hernández', country: 'PE', avatar_url: '', score: 730.45, badge: 'Bronce' },
          { rank: 6, user_id: '6', username: 'Valentina López', country: 'MX', avatar_url: '', score: 680.30, badge: 'Bronce' },
          { rank: 7, user_id: '7', username: 'Alejandro Torres', country: 'AR', avatar_url: '', score: 590.75, badge: 'Bronce' },
          { rank: 8, user_id: '8', username: 'Camila Flores', country: 'CO', avatar_url: '', score: 520.60, badge: 'Bronce' },
          { rank: 9, user_id: '9', username: 'Mateo Gómez', country: 'CL', avatar_url: '', score: 460.25, badge: 'Bronce' },
          { rank: 10, user_id: '10', username: 'Isabella Sánchez', country: 'PE', avatar_url: '', score: 410.90, badge: 'Bronce' },
        ]
      };

      const mockMonthlyLeaderboard = {
        id: 2,
        name: 'Clasificación Mensual',
        period: 'monthly',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        entries: [
          { rank: 1, user_id: '3', username: 'Juan Pérez', country: 'CO', avatar_url: '', score: 4850.75, badge: 'Diamante' },
          { rank: 2, user_id: '1', username: 'Carlos Rodríguez', country: 'MX', avatar_url: '', score: 4320.50, badge: 'Platino' },
          { rank: 3, user_id: '5', username: 'Diego Hernández', country: 'PE', avatar_url: '', score: 3980.25, badge: 'Oro' },
          { rank: 4, user_id: '2', username: 'Ana María González', country: 'AR', avatar_url: '', score: 3650.80, badge: 'Plata' },
          { rank: 5, user_id: '4', username: 'Sofía Martínez', country: 'CL', avatar_url: '', score: 3280.45, badge: 'Bronce' },
          { rank: 6, user_id: '8', username: 'Camila Flores', country: 'CO', avatar_url: '', score: 2940.30, badge: 'Bronce' },
          { rank: 7, user_id: '6', username: 'Valentina López', country: 'MX', avatar_url: '', score: 2750.75, badge: 'Bronce' },
          { rank: 8, user_id: '10', username: 'Isabella Sánchez', country: 'PE', avatar_url: '', score: 2480.60, badge: 'Bronce' },
          { rank: 9, user_id: '7', username: 'Alejandro Torres', country: 'AR', avatar_url: '', score: 2150.25, badge: 'Bronce' },
          { rank: 10, user_id: '9', username: 'Mateo Gómez', country: 'CL', avatar_url: '', score: 1920.90, badge: 'Bronce' },
        ]
      };

      setWeeklyLeaderboard(mockWeeklyLeaderboard);
      setMonthlyLeaderboard(mockMonthlyLeaderboard);
      setUserWeeklyRank({ rank: 15, total: 120 });
      setUserMonthlyRank({ rank: 22, total: 150 });
    } catch (error) {
      console.error('Error al cargar clasificaciones:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadLeaderboards();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  const formatScore = (score: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(score);
  };

  const currentLeaderboard = activeTab === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;
  const userRank = activeTab === 'weekly' ? userWeeklyRank : userMonthlyRank;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clasificación de Afiliados</h2>
          <p className="text-foreground/70">
            Los mejores afiliados según sus ganancias en cada período
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensual</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          {weeklyLeaderboard && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-foreground/70">
                  {format(new Date(weeklyLeaderboard.start_date), "'Semana del' d 'de' MMMM", { locale: es })}
                </p>

              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {weeklyLeaderboard.entries.length > 0 ? (
                      weeklyLeaderboard.entries.map((entry) => (
                        <div
                          key={entry.user_id}
                          className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8">
                              {getRankIcon(entry.rank)}
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-background">
                              <AvatarImage src={entry.avatar_url || undefined} alt={entry.username} />
                              <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{entry.username}</p>
                                <Flag country={entry.country} size="sm" />
                              </div>
                              <p className="text-xs text-foreground/70">
                                {entry.badge}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatScore(entry.score)}</p>
                            <p className="text-xs text-foreground/70">Ganancias</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-foreground/70">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {monthlyLeaderboard && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-sm text-foreground/70">
                  {format(new Date(monthlyLeaderboard.start_date), "'Mes de' MMMM", { locale: es })}
                </p>

              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {monthlyLeaderboard.entries.length > 0 ? (
                      monthlyLeaderboard.entries.map((entry) => (
                        <div
                          key={entry.user_id}
                          className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8">
                              {getRankIcon(entry.rank)}
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-background">
                              <AvatarImage src={entry.avatar_url || undefined} alt={entry.username} />
                              <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{entry.username}</p>
                                <Flag country={entry.country} size="sm" />
                              </div>
                              <p className="text-xs text-foreground/70">
                                {entry.badge}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatScore(entry.score)}</p>
                            <p className="text-xs text-foreground/70">Ganancias</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-foreground/70">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
