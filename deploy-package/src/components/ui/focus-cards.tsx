"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DollarSign, GraduationCap, Clock, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const FocusCards = React.memo(function FocusCards() {
  const { t } = useLanguage();
  const cards = [
    {
      title: t('ganaDinero'),
      description: t('generaIngresosMicrotrabajos'),
      icon: <DollarSign className="text-white" size={32} />,
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: t('sinExperiencia'),
      description: t('empiezaSin'),
      icon: <GraduationCap className="text-white" size={32} />,
      src: "https://images.unsplash.com/photo-1600271772470-bd22a42787b3?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: t('desdeCasa'),
      description: t('usaCelularComputadora'),
      icon: <Home className="text-white" size={32} />,
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: t('sinHorarios'),
      description: t('trabajaCualquierHora'),
      icon: <Clock className="text-white" size={32} />,
      src: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 w-full" style={{maxWidth: '2200px'}}>
      {cards.map((card, index) => (
        <div
          key={card.title}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full",
            hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
          )}
          style={{maxWidth: 600}}
        >
          <img
            src={card.src}
            alt={card.title}
            className="object-cover absolute inset-0 w-full h-full"
          />
          <div
            className={
              "absolute inset-0 bg-black/50 flex flex-col items-center justify-end py-8 px-4 transition-opacity duration-300 opacity-100"
            }
          >
            <div className="mb-3">{card.icon}</div>
            <div className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 text-center">
              {card.title}
            </div>
            <div className="text-sm md:text-base text-neutral-200 text-center mt-2">
              {card.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

