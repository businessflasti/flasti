"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { CTABentoGrid, CTABentoGridItem } from "./cta-bento-grid";
import { supabase } from "@/lib/supabase";

interface NewsBlock {
  id: number;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
}

const BannerImage = ({ src }: { src: string }) => (
  <div 
    className="flex flex-1 w-full h-full min-h-[6rem] md:min-h-[6rem] rounded-t-3xl overflow-hidden"
    style={{
      transform: 'translate3d(0, 0, 0)',
      backfaceVisibility: 'hidden'
    }}
  >
    <img 
      src={src} 
      alt="News banner" 
      className="w-full h-full max-h-[90px] md:max-h-[70px] object-cover object-left rounded-t-3xl"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform'
      }}
    />
  </div>
);

export const CTANewsBentoGrid: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // Valores por defecto en caso de que no haya datos en la BD
  const defaultNewsItems = [
    {
      id: 1,
      title: "Octubre 2025: Más microtareas disponibles",
      description: "Nuevas tareas se están sumando al ecosistema de Flasti este mes. Eso significa más microtareas disponibles a diario para todos los usuarios registrados",
      image_url: "/images/principal/bannerdotttt1.png",
      display_order: 1
    },
    {
      id: 2,
      title: "Nueva función activa",
      description: "Ya está disponible la nueva modalidad de tareas rápidas. Se pueden completar en menos de tres minutos, desde cualquier dispositivo",
      image_url: "/images/principal/bannerdot2.png",
      display_order: 2
    },
    {
      id: 3,
      title: "+4.800 usuarios nuevos esta semana",
      description: "Porque unidos somos más. Esta semana, miles de personas comenzaron a trabajar desde flasti en todo el mundo",
      image_url: "/images/principal/banner3.png",
      display_order: 3
    },
  ];

  useEffect(() => {
    const fetchNewsBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from('cta_news_blocks')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching CTA news blocks:', error);
          setNewsItems(defaultNewsItems);
        } else if (data && data.length > 0) {
          // Asegurar que las rutas de imágenes empiecen con /
          const fixedData = data.map(item => ({
            ...item,
            image_url: item.image_url?.startsWith('http') 
              ? item.image_url 
              : item.image_url?.startsWith('/') 
                ? item.image_url 
                : `/${item.image_url}`
          }));
          setNewsItems(fixedData);
        } else {
          setNewsItems(defaultNewsItems);
        }
      } catch (error) {
        console.error('Error:', error);
        setNewsItems(defaultNewsItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsBlocks();
  }, []);

  if (loading) {
    return (
      <CTABentoGrid className="w-full max-w-3xl mx-auto grid-cols-1 gap-6 md:gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-span-1 min-h-[8rem] md:min-h-[8.5rem] w-full bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 animate-pulse" />
        ))}
      </CTABentoGrid>
    );
  }

  return (
    <CTABentoGrid className="w-full max-w-3xl mx-auto grid-cols-1 gap-6 md:gap-8">
      {newsItems.map((item) => (
        <CTABentoGridItem
          key={item.id}
          title={item.title}
          description={item.description}
          header={<BannerImage src={item.image_url} />}
          className="col-span-1 min-h-[8rem] md:min-h-[8.5rem] w-full"
        />
      ))}
    </CTABentoGrid>
  );
};