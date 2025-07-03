"use client";

import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";

import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RegistrationFAQSection from "@/components/sections/RegistrationFAQSection";
import SimplePricingSection from "@/components/sections/SimplePricingSection";

import CTASection from "@/components/sections/CTASection";
import AdBlock from "@/components/ui/AdBlock";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <div style={{ minHeight: "100vh", background: "#000000" }}>
        {/* Sección 1: Hero (actual) */}
        <div style={{ background: "#000000" }}>
          <HeroSection />
        </div>

        {/* Sección 2: Accede a Flasti y comienza a ganar */}
        <BenefitsSection />

        {/* Sección 3: ¿Cómo funciona? */}
        <HowItWorksSection />

        {/* Sección 4: Vista previa del Dashboard */}
        <DashboardPreviewSection />

        {/* Sección 5: Lo que nuestra comunidad comparte */}
        <TestimonialsSection />

        {/* Sección 6: FAQ */}
        <RegistrationFAQSection />

        {/* Bloque de anuncio 1 */}
        <div className="container-custom py-0">
          {/* Inicio/faq */}
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8330194041691289" crossOrigin="anonymous"></script>
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8330194041691289"
            data-ad-slot="1375086377"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
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
          {/* Inicio/cta */}
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8330194041691289" crossOrigin="anonymous"></script>
          <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8330194041691289"
            data-ad-slot="8886744888"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        </div>
      </div>
    </MainLayout>
  );
}
