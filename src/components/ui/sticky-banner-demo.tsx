'use client';

import React, { useState, useEffect } from 'react';
import { StickyBanner } from './sticky-banner';
import { supabase } from '@/lib/supabase';
import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';

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
        // Asegurar que las rutas de imágenes empiecen con /
        const fixImagePath = (path: string | null) => {
          if (!path) return null;
          if (path.startsWith('http://') || path.startsWith('https://')) return path;
          return path.startsWith('/') ? path : `/${path}`;
        };

        setBannerConfig({
          text: data.banner_text,
          logoUrl: fixImagePath(data.logo_url) || '/logo.svg',
          backgroundGradient: data.background_gradient || 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
          backgroundImage: fixImagePath(data.background_image),
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
            <div className="flex-shrink-0 flex items-center">
              {/* Usar img normal para evitar blur de Next.js Image */}
              <img
                src={bannerConfig.logoUrl}
                alt="Flasti Logo"
                className="w-auto h-6 sm:h-7 max-w-[100px] object-contain"
                loading="eager"
              />
            </div>
            
            {/* Separador */}
            {bannerConfig.showSeparator && (
              <div className="h-4 sm:h-5 w-px bg-white/30"></div>
            )}
          </>
        )}
        
        {/* Texto - Soporta HTML para negrita y colores */}
        <span 
          className="text-white text-[11px] sm:text-xs drop-shadow-lg [&>strong]:font-bold [&>strong]:font-extrabold"
          dangerouslySetInnerHTML={{ __html: bannerConfig.text }}
        />
      </div>
    </StickyBanner>
  );
}
