"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CTABentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const CTABentoGrid: React.FC<CTABentoGridProps> = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CTABentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CTABentoGridItem: React.FC<CTABentoGridItemProps> = ({
  className,
  title,
  description,
  header,
  icon
}) => {
  return (
    <div
      className={cn(
        "group relative bg-white/[0.03] backdrop-blur-2xl justify-between flex flex-col h-full rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-700 shadow-2xl overflow-hidden",
        className
      )}
    >
      {/* Efecto neón sutil al hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ 
          boxShadow: `inset 0 0 60px rgba(110, 64, 255, 0.15), 0 0 40px rgba(110, 64, 255, 0.1)` 
        }}
      ></div>
      
      {/* Brillo superior glassmorphism */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {header}
      <div className="px-4 md:px-6 pb-4 md:pb-4 mt-3 md:mt-2 relative z-10">
        {icon}
        <div className="font-sans font-bold text-white mb-2 md:mb-2 text-sm md:text-base group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </div>
        <div className="font-sans font-normal text-white/60 text-xs md:text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};