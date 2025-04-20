'use client';

import React from 'react';
import { ThemesProvider } from '@/contexts/ThemesContext';
import ThemeSelector from '@/components/settings/ThemeSelector';
import BackButton from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';
import { Palette } from 'lucide-react';

export default function ThemesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-3xl font-bold">Temas Personalizables</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 p-6 bg-gradient-to-r from-[#ec4899]/10 to-[#9333ea]/10 border-none">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#9333ea] text-white">
              <Palette className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Personaliza tu Experiencia</h2>
              <p className="text-foreground/70">
                Elige entre diferentes temas para personalizar la apariencia de la plataforma según tus preferencias.
                Puedes seleccionar entre temas claros y oscuros con diferentes combinaciones de colores.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <ThemesProvider>
        <ThemeSelector />
      </ThemesProvider>
    </div>
  );
}
