'use client';

import React from 'react';
import { GoalsProvider } from '@/contexts/GoalsContext';
import GoalProgress from '@/components/gamification/GoalProgress';
import BackButton from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function GoalsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-3xl font-bold">Objetivos Personalizados</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 p-6 bg-gradient-to-r from-[#ec4899]/10 to-[#9333ea]/10 border-none">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#9333ea] text-white">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Establece tus Metas</h2>
              <p className="text-foreground/70">
                Define objetivos personalizados para mantener tu motivación y medir tu progreso como afiliado.
                Puedes establecer metas de ventas, clics, ganancias o cualquier otro indicador que desees seguir.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <GoalsProvider>
        <GoalProgress />
      </GoalsProvider>
    </div>
  );
}
