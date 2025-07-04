"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import AdBlock from "@/components/ui/AdBlock";
import MainLayout from "@/components/layout/MainLayout";

// Lazy load de secciones pesadas
const HowItWorksSection = dynamic(
  () => import("@/components/sections/HowItWorksSection"),
  { ssr: false }
);
const DashboardPreviewSection = dynamic(
  () => import("@/components/sections/DashboardPreviewSection"),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import("@/components/sections/TestimonialsSection"),
  { ssr: false }
);
const RegistrationFAQSection = dynamic(
  () => import("@/components/sections/RegistrationFAQSection"),
  { ssr: false }
);
const SimplePricingSection = dynamic(
  () => import("@/components/sections/SimplePricingSection"),
  { ssr: false }
);
const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
  ssr: false,
});

// Memoización de componentes principales
const MemoHeroSection = React.memo(HeroSection);
const MemoBenefitsSection = React.memo(BenefitsSection);

export default function Home() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <div style={{ minHeight: "100vh", background: "#000000" }}>
        {/* Sección 1: Hero (actual) */}
        <div style={{ background: "#000000" }}>
          <MemoHeroSection />
        </div>
        {/* Sección 2: Accede a Flasti y comienza a ganar */}
        <MemoBenefitsSection />
        {/* Sección 3: ¿Cómo funciona? */}
        <Suspense fallback={null}>
          <HowItWorksSection />
        </Suspense>
        {/* Sección 4: Vista previa del Dashboard */}
        <Suspense fallback={null}>
          <DashboardPreviewSection />
        </Suspense>
        {/* Sección 5: Lo que nuestra comunidad comparte */}
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        {/* Sección 6: FAQ */}
        <Suspense fallback={null}>
          <RegistrationFAQSection />
        </Suspense>
        {/* Bloque de anuncio 1 */}
        <div className="container-custom py-0">
          <AdBlock adClient="ca-pub-8330194041691289" adSlot="1375086377" />
        </div>
        {/* Sección 7: Un único pago, acceso de por vida */}
        <div>
          <Suspense fallback={null}>
            <SimplePricingSection />
          </Suspense>
        </div>
        {/* Sección 8: Conoce a Flasti */}
        <div>
          <Suspense fallback={null}>
            <CTASection />
          </Suspense>
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
