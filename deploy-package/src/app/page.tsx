import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";

import DashboardPreviewSection from "@/components/sections/DashboardPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RegistrationFAQSection from "@/components/sections/RegistrationFAQSection";
import SimplePricingSection from "@/components/sections/SimplePricingSection";

import CTASection from "@/components/sections/CTASection";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      {/* Sección 1: Hero (actual) */}
      <HeroSection />

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

      {/* Sección 7: Un único pago, acceso de por vida */}
      <SimplePricingSection />

      {/* Sección 8: Conoce a Flasti */}
      <CTASection />
    </MainLayout>
  );
}
