"use client";

import React from 'react';
import { StickyBanner } from './sticky-banner';

interface StickyBannerDemoProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export function StickyBannerDemo({
  message = "¡Empieza agosto ganando más! Descubrí las novedades y aprovechá al máximo",
  linkText = "Ver más",
  linkHref = "#"
}: StickyBannerDemoProps) {
  try {
    return (
      <StickyBanner className="bg-[#3C66CD]">
        <p className="mx-0 text-sm sm:text-base text-white drop-shadow-md leading-relaxed pr-8">
          <span className="font-bold">¡Empieza agosto ganando más!</span> Descubrí las novedades y aprovechá al máximo
        </p>
      </StickyBanner>
    );
  } catch (error) {
    console.error('StickyBannerDemo render error:', error);
    return null; // Fail silently
  }
}

export default StickyBannerDemo;