"use client";

import React from "react";
import { DollarSign, Wallet, Zap, HeadphonesIcon, ArrowUpRight, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlastiBentoGrid } from "@/components/ui/flasti-bento-grid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const DashboardPreviewSection = React.memo(() => {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-visible bg-[#FEF9F3]">
      {/* Fondo de gradiente animado extendido que se extiende más allá de la sección */}
      <div 
        className="absolute pointer-events-none will-change-transform" 
        style={{ 
          top: '-40vh', 
          left: '-25vw', 
          right: '-25vw', 
          bottom: '-40vh',
          zIndex: 1,
          transform: 'translateZ(0)' // Hardware acceleration
        }}
      >
        <BackgroundGradientAnimation
          gradientBackgroundStart="transparent"
          gradientBackgroundEnd="transparent"
          firstColor="60, 102, 205"
          secondColor="234, 64, 133"
          thirdColor="60, 102, 205"
          size="60%"
          blendingValue="multiply"
          interactive={false}
          containerClassName="w-full h-full will-change-transform"
          className="opacity-18"
        />
      </div>
      <div className="container-custom relative z-30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0E1726' }}>
            {t('ingresaMundo')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-center" style={{ color: '#0E1726' }}>
            {t('accedeArea')}
          </p>
        </div>
        <div className="w-full">
          <FlastiBentoGrid />
        </div>
      </div> {/* cierre de .container-custom.relative.z-10 */}
    </section>
  );
});

export default DashboardPreviewSection;
