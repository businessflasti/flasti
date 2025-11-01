"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid";

const BannerImage = ({ src }: { src: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] md:min-h-[8rem] rounded-3xl overflow-hidden">
    <img 
      src={src} 
      alt="News banner" 
      className="w-full h-full max-h-[90px] object-cover object-left rounded-3xl"
    />
  </div>
);

export const NewsBentoGrid: React.FC = () => {
  const newsItems = [
    {
      title: "Julio 2025: Más microtareas disponibles",
      description: "Esta semana se sumaron nuevas empresas al ecosistema de Flasti. Eso significa más microtareas activas para todos los usuarios registrados",
      image: "/images/principal/banner1.png",
    },
    {
      title: "Nueva función activa",
      description: "Ya está disponible la nueva modalidad de tareas rápidas. Se pueden completar en menos de tres minutos, desde cualquier dispositivo",
      image: "/images/principal/banner2.png",
    },
    {
      title: "+4.800 usuarios nuevos esta semana",
      description: "Porque unidos somos más. Esta semana, miles de personas comenzaron a trabajar desde flasti en todo el mundo",
      image: "/images/principal/banner3.png",
    },
  ];

  return (
    <BentoGrid className="w-full max-w-3xl mx-auto grid-cols-1 gap-6 md:gap-8">
      {newsItems.map((item, index) => (
        <BentoGridItem
          key={index}
          title={item.title}
          description={item.description}
          header={<BannerImage src={item.image} />}
          className="p-3 md:p-4 col-span-1 min-h-[8rem] md:min-h-[10rem] w-full"
        />
      ))}
    </BentoGrid>
  );
};