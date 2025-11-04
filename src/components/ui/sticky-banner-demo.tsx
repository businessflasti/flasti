'use client';

import React, { useState, useEffect } from 'react';
import { StickyBanner } from './sticky-banner';
import { supabase } from '@/lib/supabase';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import Image from 'next/image';

export function StickyBannerDemo() {
  const { activeTheme } = useSeasonalTheme();
  const [bannerConfig, setBannerConfig] = useState({
    text: '¡Bienvenido a Flasti! Gana dinero completando microtareas',
    logoUrl: '/logo.svg',
    backgroundGradient: 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
    backgroundImage: null as string | null,
    showSeparator: true,
    isActive: true
  });
  const [loading, setLoading] = useState(true);

  // Solo mostrar logo si el tema es el predeterminado (no halloween, no navidad, etc.)
  const isDefaultTheme = !activeTheme || activeTheme === 'default';

  useEffect(() => {
    loadBannerConfig();

    // Suscripción en tiempo real para cambios
    const channel = supabase
      .channel('banner_config_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'banner_config',
        },
        () => {
          loadBannerConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadBannerConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setBannerConfig({
          text: data.banner_text,
          logoUrl: data.logo_url,
          backgroundGradient: data.background_gradient || 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
          backgroundImage: data.background_image || null,
          showSeparator: data.show_separator !== false,
          isActive: data.is_active
        });
      }
    } catch (error) {
      console.error('Error loading banner config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !bannerConfig.isActive) {
    return null;
  }

  // Determinar el estilo de fondo: imagen o degradado
  const backgroundStyle = bannerConfig.backgroundImage
    ? {
        backgroundImage: `url(${bannerConfig.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  const backgroundClass = bannerConfig.backgroundImage
    ? '' // Sin clase de gradiente si hay imagen
    : `bg-gradient-to-r ${bannerConfig.backgroundGradient}`;

  return (
    <StickyBanner className={backgroundClass} style={backgroundStyle}>
      <div className="flex items-center justify-start gap-2 sm:gap-3 max-w-7xl mx-auto">
        {/* Logo - Solo en tema predeterminado */}
        {isDefaultTheme && (
          <>
            <div className="flex-shrink-0">
              <Image
                src={bannerConfig.logoUrl}
                alt="Flasti Logo"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
            
            {/* Separador */}
            {bannerConfig.showSeparator && (
              <div className="h-4 sm:h-5 w-px bg-white/30"></div>
            )}
          </>
        )}
        
        {/* Texto - Soporta HTML para negrita */}
        <span 
          className="text-white text-[11px] sm:text-xs drop-shadow-lg"
          dangerouslySetInnerHTML={{ __html: bannerConfig.text }}
        />
      </div>
    </StickyBanner>
  );
}
