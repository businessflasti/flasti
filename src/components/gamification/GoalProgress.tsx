'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Calendar, Trash2, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { Goal } from '@/lib/goals-service';

export default function GoalProgress() {
  const { goals, loading, createGoal, updateGoal, deleteGoal, refreshGoals } = useGoals();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<{
    name: string;
    description: string;
    type: 'sales' | 'clicks' | 'earnings' | 'custom';
    target_value: number;
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de objetivos desactivado</CardTitle>
          <CardDescription>
            El sistema de metas y seguimiento personalizado ha sido desactivado temporalmente. Si tienes dudas, contacta soporte.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
        return 'Ventas';
      case 'clicks':
        return 'Clics';
      case 'earnings':
        return 'Ganancias';
      case 'custom':
        return 'Personalizado';
      default:
        return type;
    }
  };

  const getGoalStatusBadge = (goal: Goal) => {
    if (goal.completed) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completado
        </Badge>
      );
    }

    if (goal.deadline) {
      const deadlineDate = new Date(goal.deadline);
      const today = new Date();
      
      if (isBefore(deadlineDate, today)) {
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vencido
          </Badge>
        );
      }
      
      // Si faltan menos de 3 días
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      if (isBefore(deadlineDate, threeDaysFromNow)) {
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="h-3 w-3 mr-1" />
            Próximo a vencer
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline" className="text-blue-500 border-blue-500">
        <Clock className="h-3 w-3 mr-1" />
        En progreso
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mis Objetivos</h2>
          <p className="text-foreground/70">
            Establece y sigue el progreso de tus metas como afiliado
          </p>
        </div>
        <div className="flex gap-2">
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Nuevo Objetivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Objetivo</DialogTitle>
                <DialogDescription>
                  Define una meta clara y alcanzable para mejorar tu desempeño como afiliado.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del objetivo</Label>
                  <Input 
                    id="name" 
                    value={newGoal.name} 
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} 
                    placeholder="Ej: Conseguir 10 ventas este mes"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea 
                    id="description" 
                    value={newGoal.description} 
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} 
                    placeholder="Describe tu objetivo con más detalle"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de objetivo</Label>
                    <Select 
                      value={newGoal.type} 
                      onValueChange={(value: any) => setNewGoal({ ...newGoal, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Ventas</SelectItem>
                        <SelectItem value="clicks">Clics</SelectItem>
                        <SelectItem value="earnings">Ganancias</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="target">Meta a alcanzar</Label>
                    <Input 
                      id="target" 
                      type="number" 
                      min="1"
                      value={newGoal.target_value} 
                      onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Fecha límite (opcional)</Label>
                  <Input 
                    id="deadline" 
                    type="date" 
                    value={newGoal.deadline} 
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateGoal} disabled={!newGoal.name || newGoal.target_value <= 0}>
                  Crear Objetivo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Target className="h-12 w-12 text-foreground/30" />
            <h3 className="text-xl font-medium">No tienes objetivos definidos</h3>
            <p className="text-foreground/70 max-w-md mx-auto">
              Establece objetivos para mantener tu motivación y medir tu progreso como afiliado.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setDialogOpen(true)}
            >
              Crear mi primer objetivo
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
            
            return (
              <Card key={goal.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{goal.name}</CardTitle>
                    {getGoalStatusBadge(goal)}
                  </div>
                  {goal.description && (
                    <CardDescription>{goal.description}</CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso: {progress}%</span>
                      <span>
                        {goal.current_value} / {goal.target_value} {getGoalTypeLabel(goal.type)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex items-center mt-4 text-xs text-foreground/70">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        Fecha límite: {format(new Date(goal.deadline), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
