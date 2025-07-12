'use client';

import React from 'react';
// import { GoalsProvider } from '@/contexts/GoalsContext';
// import GoalProgress from '@/components/gamification/GoalProgress';
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
      <Card className="col-span-1 md:col-span-3 p-6 bg-gradient-to-r from-[#ec4899]/10 to-[#9333ea]/10 border-none">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="p-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#9333ea] text-white">
            <Target className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Sistema de objetivos desactivado</h2>
            <p className="text-foreground/70">
              El sistema de metas y seguimiento personalizado ha sido desactivado temporalmente. Si tienes dudas, contacta soporte.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
