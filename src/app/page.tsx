"use client";

import React, { useEffect } from "react";
// BenefitsSection removed due to persistent errors
import AdBlock from "@/components/ui/AdBlock";
import AdBlockWrapper from "@/components/ui/AdBlockWrapper";
import MainLayout from "@/components/layout/MainLayout";
import StudiovaHeroSection from "@/components/sections/StudiovaHeroSection";
import StatsSection from "@/components/sections/StatsSection";
import TeamSection from "@/components/sections/TeamSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import ModernTestimonialsSection from "@/components/sections/ModernTestimonialsSection";
import RegistrationFAQSection from "@/components/sections/RegistrationFAQSection";

import CTASection from "@/components/sections/CTASection";
import CountriesSection from "@/components/sections/CountriesSection";

// Memoización de componentes principales
// const MemoBenefitsSection = React.memo(BenefitsSection);

export default function Home() {
  // Agregar meta tags específicas para no indexar imágenes y configurar todas las imágenes
  useEffect(() => {
    // Agregar meta tag para no indexar imágenes si no existe
    if (!document.querySelector('meta[name="robots"][content*="noimageindex"]')) {
      const metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      metaRobots.content = 'index, follow, noimageindex';
      document.head.appendChild(metaRobots);
    }

    // Meta tag específica para Googlebot
    if (!document.querySelector('meta[name="googlebot"]')) {
      const metaGooglebot = document.createElement('meta');
      metaGooglebot.name = 'googlebot';
      metaGooglebot.content = 'index, follow, noimageindex';
      document.head.appendChild(metaGooglebot);
    }

    // Meta tag específica para Bingbot
    if (!document.querySelector('meta[name="bingbot"]')) {
      const metaBingbot = document.createElement('meta');
      metaBingbot.name = 'bingbot';
      metaBingbot.content = 'index, follow, noimageindex';
      document.head.appendChild(metaBingbot);
    }

    // Agregar atributos data-noindex a todas las imágenes de la página principal
    const addNoIndexToImages = () => {
      const images = document.querySelectorAll('img, [data-next-image]');
      images.forEach((img) => {
        if (!img.hasAttribute('data-noindex')) {
          img.setAttribute('data-noindex', 'true');
          // Agregar loading lazy si no existe
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
        }
      });
    };

    // Ejecutar inmediatamente
    addNoIndexToImages();

    // Ejecutar después de que se carguen los componentes dinámicos
    const timer = setTimeout(addNoIndexToImages, 2000);

    // Observer para imágenes que se cargan dinámicamente
    const observer = new MutationObserver(() => {
      addNoIndexToImages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <MainLayout disableChat={true} showStickyBanner={true}>
      <div style={{ minHeight: "100vh", background: "#FEF9F3" }}>
        {/* Sección Studiova Hero (nueva) */}
        <StudiovaHeroSection />
        
        {/* Sección: Países disponibles */}
        <CountriesSection />
        
        {/* Sección Stats (nueva) */}
        <StatsSection />
        
        {/* Sección Team (nueva) */}
        <TeamSection />
        
        {/* Sección 2: Accede a Flasti y comienza a ganar - REMOVED DUE TO ERRORS */}
        {/* Sección 3: ¿Cómo funciona? */}
        <HowItWorksSection />
        
        {/* Sección 4: Vista previa del Dashboard */}
        <DashboardPreviewSection />
        
        {/* Sección 5: Lo que nuestra comunidad comparte */}
        <ModernTestimonialsSection />

        {/* Sección 6: FAQ */}
        <RegistrationFAQSection />
        {/* Sección 8: Conoce a Flasti */}
        <CTASection />
      </div>
    </MainLayout>
  );
}
