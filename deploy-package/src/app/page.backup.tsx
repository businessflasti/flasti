import HeroSection from "@/components/sections/HeroSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeatureCardsSection from "@/components/sections/FeatureCardsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import RegistrationFAQSection from "@/components/sections/RegistrationFAQSection";
import SimplePricingSection from "@/components/sections/SimplePricingSection";
import PaymentInfoSection from "@/components/sections/PaymentInfoSection";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout showHeader={true}>
      {/* Sección 1: Hero (actual) */}
      <HeroSection />

      {/* Sección 2: Accede a Flasti y comienza a ganar */}
      <BenefitsSection />

      {/* Sección 3: ¿Cómo funciona? */}
      <HowItWorksSection />

      {/* Sección 4: Ingresa a un mundo exclusivo de oportunidades */}
      <FeatureCardsSection />

      {/* Sección 5: Lo que nuestra comunidad comparte */}
      <TestimonialsSection />


      {/* Sección 6: FAQ */}
      <RegistrationFAQSection />

      {/* Sección 7: Un único pago, acceso de por vida */}
      <SimplePricingSection />

      {/* Sección 8: Nueva sección - Plataforma por dentro y retiros */}
      <PaymentInfoSection />
    </MainLayout>
  );
}
