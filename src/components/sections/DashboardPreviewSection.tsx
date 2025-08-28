"use client";

import React from "react";
import { DollarSign, Wallet, Zap, HeadphonesIcon, ArrowUpRight, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlastiBentoGrid } from "@/components/ui/flasti-bento-grid";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";


const DashboardPreviewSection = React.memo(() => {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-visible bg-[#101010]">
      <div className="container-custom relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
            {t('ingresaMundo')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-center" style={{ color: '#FFFFFF' }}>
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
