'use client';

import React from 'react';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CasinoTutor() {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <Card className="bg-[#232323] p-6 relative">
        <h2 className="text-sm text-foreground/60 uppercase font-medium mb-4 relative z-10">Tu Tutora Asignada</h2>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-full overflow-hidden relative border-2 border-[#3b82f6]/20">
            <img
              src="/images/tutors/soporte-maria.png"
              alt="Tutora María"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">María</h3>
            <p className="text-foreground/70 mb-3">Equipo de Flasti</p>
            <Button
              className="bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] hover:opacity-90 transition-opacity mobile-touch-friendly mobile-touch-feedback button-hover-effect"
              onClick={() => {
                if (window.Tawk_API && window.Tawk_API.maximize) {
                  window.Tawk_API.maximize();
                }
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Iniciar chat</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
