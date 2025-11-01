"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FlastiBentoGrid } from "@/components/ui/flasti-bento-grid";

const DashboardPreviewSection = React.memo(() => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 relative overflow-hidden bg-[#0B1017]">

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
            {t('ingresaMundo')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-center text-white/70">
            {t('accedeArea')}
          </p>
        </div>
        <div className="w-full">
          <FlastiBentoGrid />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-github {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-github {
          animation: pulse-github 10s ease-in-out infinite;
        }

        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 5s linear infinite;
        }
      `}</style>
    </section>
  );
});

export default DashboardPreviewSection;
