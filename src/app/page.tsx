"use client";

import React from "react";
// BenefitsSection removed due to persistent errors
import AdBlock from "@/components/ui/AdBlock";
import MainLayout from "@/components/layout/MainLayout";
import StudiovaHeroSection from "@/components/sections/StudiovaHeroSection";
import StatsSection from "@/components/sections/StatsSection";
import TeamSection from "@/components/sections/TeamSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import ModernTestimonialsSection from "@/components/sections/ModernTestimonialsSection";
import RegistrationFAQSection from "@/components/sections/RegistrationFAQSection";
import SimplePricingSection from "@/components/sections/SimplePricingSection";
import CTASection from "@/components/sections/CTASection";

// Memoización de componentes principales
// const MemoBenefitsSection = React.memo(BenefitsSection);

export default function Home() {
  return (
    <MainLayout disableChat={true} showStickyBanner={true}>
      <div style={{ minHeight: "100vh", background: "#101010" }}>
        {/* Sección Studiova Hero (nueva) */}
        <StudiovaHeroSection />
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
        {/* Bloque de anuncio 1 */}
        <div className="container-custom py-0">
          <AdBlock adClient="ca-pub-8330194041691289" adSlot="1375086377" className="flex justify-center" />
        </div>
        {/* Sección 7: Un único pago, acceso de por vida */}
        <div>
          <SimplePricingSection />
        </div>
        {/* Sección 8: Conoce a Flasti */}
        <div>
          <CTASection />
        </div>
        {/* Bloque de anuncio 2 */}
        <div className="container-custom py-6">
          <AdBlock
            adClient="ca-pub-8330194041691289"
            adSlot="8886744888"
            className="flex justify-center"
          />
        </div>
      </div>
    </MainLayout>
  );
}
