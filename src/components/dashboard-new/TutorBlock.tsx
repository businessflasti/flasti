"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function TutorBlock() {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="glass-effect p-6 relative overflow-hidden hardware-accelerated hover-lift">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ea5e9]/10 rounded-full blur-3xl -mr-10 -mt-10 hardware-accelerated"></div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 relative z-10">
        {/* Imagen del tutor */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0ea5e9]/30 hardware-accelerated">
            <img
              src="/images/tutor.webp"
              alt="Tutor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card hardware-accelerated"></div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{t('tuTutorPersonal')}</h3>
          
          <div className={`transition-all duration-300 overflow-hidden hardware-accelerated ${isExpanded ? 'max-h-96' : 'max-h-10'}`}>
            <p className="text-foreground/70 mb-4">
              {t('tutorDescription')}
            </p>
            
            {isExpanded && (
              <div className="space-y-3 text-sm text-foreground/80">
                <p>{t('tutorHelp1')}</p>
                <p>{t('tutorHelp2')}</p>
                <p>{t('tutorHelp3')}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <button
              className="text-sm text-[#0ea5e9] hover:text-[#0ea5e9]/80 transition-colors mobile-touch-friendly hardware-accelerated"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? t('mostrarMenos') : t('mostrarMas')}
            </button>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg flex items-center gap-2 hover:bg-[#0ea5e9]/90 transition-colors mobile-touch-friendly hardware-accelerated">
          <MessageCircle size={18} />
          <span>{t('iniciarChat')}</span>
        </button>
      </div>
    </Card>
  );
}
