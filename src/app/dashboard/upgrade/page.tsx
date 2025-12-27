'use client';

import { useEffect } from 'react';
import StartupHeroSection from '@/components/sections/StartupHeroSection';
import StepsSection from '@/components/sections/StepsSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import PricingSection from '@/components/sections/PricingSection';

export default function UpgradePage() {
  useEffect(() => {
    // Cambiar el fondo del body a oscuro para esta página
    document.body.style.backgroundColor = '#202020';
    document.documentElement.style.backgroundColor = '#202020';
    
    return () => {
      // Restaurar el color original al salir
      document.body.style.backgroundColor = '#F6F3F3';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

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
