'use client';

import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface ThemedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ThemedLogo({ size = 'md', className = '' }: ThemedLogoProps) {
  const { activeTheme } = useSeasonalTheme();
  const [logoUrl, setLogoUrl] = useState<string>('/logo/isotipo-web.png');
  
  const sizeClasses = {
    sm: 'h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9',
    md: 'h-8 w-8 sm:h-10 sm:w-10',
    lg: 'h-12 w-12 sm:h-14 sm:w-14'
  };

  // Cargar el logo del tema activo desde la BD
  useEffect(() => {
    const loadThemeLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('seasonal_themes')
          .select('logo_url')
          .eq('theme_name', activeTheme)
          .single();

        if (!error && data?.logo_url) {
          setLogoUrl(data.logo_url);
        } else {
          // Fallback al logo por defecto
          setLogoUrl('/logo/isotipo-web.png');
        }
      } catch (error) {
        console.error('Error loading theme logo:', error);
        setLogoUrl('/logo/isotipo-web.png');
      }
    };

    loadThemeLogo();
  }, [activeTheme]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Logo del tema */}
      <Image
        src={logoUrl}
        alt="Logo Flasti"
        width={56}
        height={56}
        priority
        className="h-full w-full object-contain"
        onError={(e) => {
          // Si falla, usar el logo por defecto
          e.currentTarget.src = '/logo/isotipo-web.png';
        }}
      />
    </div>
  );
}
