'use client';

import React, { useEffect } from 'react';
import { useAchievements } from '@/contexts/AchievementsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Zap, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Achievements() {
  const { achievements, loading, totalPoints, checkForNewAchievements } = useAchievements();

  useEffect(() => {
    // Verificar nuevos logros cuando se carga el componente
    checkForNewAchievements();
  }, []);

  const getIconForAchievement = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'medal-bronze':
        return <Medal className="h-6 w-6 text-amber-700" />;
      case 'medal-silver':
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 'medal-gold':
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 'medal-diamond':
        return <Medal className="h-6 w-6 text-blue-400" />;
      case 'clicks':
      case 'clicks-medium':
      case 'clicks-advanced':
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 'money':
        return <Zap className="h-6 w-6 text-green-500" />;
      case 'profile':
        return <Zap className="h-6 w-6 text-purple-500" />;
      default:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mis Logros</h2>
          <p className="text-foreground/70">Desbloquea logros para ganar puntos y reconocimiento</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
          {totalPoints} puntos
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              achievement.earned 
                ? "border-green-500/20 bg-green-500/5" 
                : "border-gray-200 dark:border-gray-800 opacity-70"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getIconForAchievement(achievement.icon)}
                  <CardTitle className="text-base">{achievement.name}</CardTitle>
                </div>
                <Badge variant={achievement.earned ? "default" : "outline"} className="ml-auto">
                  {achievement.points} pts
                </Badge>
              </div>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-xs text-foreground/70">
                <div>
                  {achievement.criteria.type === 'sales' && `${achievement.criteria.count} ventas`}
                  {achievement.criteria.type === 'clicks' && `${achievement.criteria.count} clics`}
                  {achievement.criteria.type === 'withdrawals' && `${achievement.criteria.count} retiros`}
                  {achievement.criteria.type === 'profile_completion' && `Perfil 100% completo`}
                </div>
                <div className="flex items-center">
                  {achievement.earned ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(achievement.earned_at!), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      <span>Pendiente</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
