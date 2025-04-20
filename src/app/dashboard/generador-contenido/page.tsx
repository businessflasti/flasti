'use client';

import React from 'react';
import AIContentGenerator from '@/components/tools/AIContentGenerator';
import BackButton from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AIContentGeneratorPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="text-3xl font-bold">Generador de Contenido con IA</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 p-6 bg-gradient-to-r from-[#ec4899]/10 to-[#9333ea]/10 border-none">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#ec4899] to-[#9333ea] text-white">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Crea Contenido Persuasivo</h2>
              <p className="text-foreground/70">
                Utiliza la inteligencia artificial para generar contenido persuasivo para tus campañas de afiliados.
                Crea publicaciones para redes sociales, correos electrónicos, artículos de blog y anuncios
                personalizados para promocionar las aplicaciones de Flasti.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <AIContentGenerator />
    </div>
  );
}
