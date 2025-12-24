'use client';

import StartupHeroSection from '@/components/sections/StartupHeroSection';
import StepsSection from '@/components/sections/StepsSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import PricingSection from '@/components/sections/PricingSection';

export default function UpgradePage() {
  return (
    <div className="w-full">
      <StartupHeroSection />
      <StepsSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
    </div>
  );
}
