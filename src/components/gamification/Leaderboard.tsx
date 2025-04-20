'use client';

import React, { useState } from 'react';
import { useLeaderboard } from '@/contexts/LeaderboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Crown, ArrowUp, ArrowDown, Minus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Leaderboard() {
  const { user } = useAuth();
  const { 
    weeklyLeaderboard, 
    monthlyLeaderboard, 
    userWeeklyRank, 
    userMonthlyRank, 
    loading, 
    refreshLeaderboards 
  } = useLeaderboard();
  const [activeTab, setActiveTab] = useState<string>('weekly');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshLeaderboards();
    setRefreshing(false);
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
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const currentLeaderboard = activeTab === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;
  const userRank = activeTab === 'weekly' ? userWeeklyRank : userMonthlyRank;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clasificación de Afiliados</h2>
          <p className="text-foreground/70">
            Los mejores afiliados según sus ventas en cada período
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
                {userRank && (
                  <Badge variant="outline" className="gap-1">
                    Tu posición: {userRank.rank > 0 ? userRank.rank : 'N/A'} 
                    {userRank.total > 0 ? ` de ${userRank.total}` : ''}
                  </Badge>
                )}
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {weeklyLeaderboard.entries.length > 0 ? (
                      weeklyLeaderboard.entries.map((entry) => (
                        <div 
                          key={entry.user_id} 
                          className={`flex items-center justify-between p-4 ${
                            user && entry.user_id === user.id 
                              ? 'bg-primary/5 dark:bg-primary/10' 
                              : ''
                          }`}
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
                              <p className="font-medium">{entry.username}</p>
                              <p className="text-xs text-foreground/70">
                                {entry.score} {entry.score === 1 ? 'venta' : 'ventas'}
                              </p>
                            </div>
                          </div>
                          {user && entry.user_id === user.id && (
                            <Badge>Tú</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-foreground/70">No hay datos disponibles para este período</p>
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
                  {format(new Date(monthlyLeaderboard.start_date), "MMMM yyyy", { locale: es })}
                </p>
                {userRank && (
                  <Badge variant="outline" className="gap-1">
                    Tu posición: {userRank.rank > 0 ? userRank.rank : 'N/A'} 
                    {userRank.total > 0 ? ` de ${userRank.total}` : ''}
                  </Badge>
                )}
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {monthlyLeaderboard.entries.length > 0 ? (
                      monthlyLeaderboard.entries.map((entry) => (
                        <div 
                          key={entry.user_id} 
                          className={`flex items-center justify-between p-4 ${
                            user && entry.user_id === user.id 
                              ? 'bg-primary/5 dark:bg-primary/10' 
                              : ''
                          }`}
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
                              <p className="font-medium">{entry.username}</p>
                              <p className="text-xs text-foreground/70">
                                {entry.score} {entry.score === 1 ? 'venta' : 'ventas'}
                              </p>
                            </div>
                          </div>
                          {user && entry.user_id === user.id && (
                            <Badge>Tú</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-foreground/70">No hay datos disponibles para este período</p>
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
