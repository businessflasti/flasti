"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { CTABentoGrid, CTABentoGridItem } from "./cta-bento-grid";

const BannerImage = ({ src }: { src: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] md:min-h-[6rem] rounded-t-3xl overflow-hidden">
    <img 
      src={src} 
      alt="News banner" 
      className="w-full h-full max-h-[90px] md:max-h-[70px] object-cover object-left rounded-t-3xl"
    />
  </div>
);

export const CTANewsBentoGrid: React.FC = () => {
  const newsItems = [
    {
      title: "Agosto 2025: Más microtareas disponibles",
      description: "Nuevas tareas se están sumando al ecosistema de Flasti este mes. Eso significa más microtareas disponibles a diario para todos los usuarios registrados",
      image: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/bannerdot1.png",
    },
    {
      title: "Nueva función activa",
      description: "Ya está disponible la nueva modalidad de tareas rápidas. Se pueden completar en menos de tres minutos, desde cualquier dispositivo",
      image: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/bannerdot2.png",
    },
    {
      title: "+4.800 usuarios nuevos esta semana",
      description: "Porque unidos somos más. Esta semana, miles de personas comenzaron a trabajar desde flasti en todo el mundo",
      image: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/banner3.png",
    },
  ];

  return (
    <CTABentoGrid className="w-full max-w-3xl mx-auto grid-cols-1 gap-6 md:gap-8">
      {newsItems.map((item, index) => (
        <CTABentoGridItem
          key={index}
          title={item.title}
          description={item.description}
          header={<BannerImage src={item.image} />}
          className="col-span-1 min-h-[8rem] md:min-h-[8.5rem] w-full"
        />
      ))}
    </CTABentoGrid>
  );
};