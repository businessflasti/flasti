"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import { supabase } from '@/lib/supabase';

interface StickyBannerDemoProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  imageUrl?: string;
}

export function StickyBannerDemo({
  message = "¡Cierra octubre ganando más! Descubrí las novedades y aprovechá al máximo",
  linkText = "Register now",
  linkHref = "#",
  imageUrl = "/images/banner-background.webp"
}: StickyBannerDemoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { activeTheme } = useSeasonalTheme();
  const [eventLogo, setEventLogo] = useState<string>('/images/eventos/event-hallo.png');

  // Cargar logo del evento según el tema
  useEffect(() => {
    const loadEventLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('seasonal_themes')
          .select('event_logo_url')
          .eq('theme_name', activeTheme)
          .single();

        if (!error && data?.event_logo_url) {
          setEventLogo(data.event_logo_url);
        } else {
          // Fallback según tema
          const fallbackLogos: Record<string, string> = {
            halloween: '/images/eventos/event-halloween.png',
            christmas: '/images/eventos/event-navidad.png',
            default: '/images/eventos/event-default.png'
          };
          setEventLogo(fallbackLogos[activeTheme] || fallbackLogos.default);
        }
      } catch (error) {
        console.error('Error loading event logo:', error);
      }
    };

    loadEventLogo();
  }, [activeTheme]);

  if (!isVisible) return null;

  try {
    return (
      <div className="relative w-full overflow-hidden h-[44px]">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay sutil para mejorar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-500/10"></div>
        </div>
        
        {/* Contenido del banner */}
        <div className="relative h-full px-4 flex items-center max-w-[1920px] mx-auto">
          {/* Logo/Marca con separador - Solo en desktop */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center">
              <img 
                src={eventLogo} 
                alt="Event Logo" 
                className="h-7 w-auto object-contain"
              />
            </div>
            {/* Separador vertical */}
            <div className="h-6 w-[1px] bg-black/30"></div>
          </div>

          {/* Mensaje - Alineado a la izquierda en desktop, centrado en móvil */}
          <div className="flex-1 flex items-center md:justify-start justify-center md:pl-4 px-4">
            <p className="text-[14px] text-black leading-tight md:leading-tight leading-relaxed">
              <span className="font-bold">¡Cierra octubre ganando más!</span>
              <span className="font-normal"> Descubrí las novedades y aprovechá al máximo</span>
            </p>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 text-black/60 hover:text-black transition-colors duration-200 focus:outline-none rounded min-w-[32px] flex items-center justify-center"
            aria-label="Cerrar banner"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StickyBannerDemo render error:', error);
    return null;
  }
}

export default StickyBannerDemo;