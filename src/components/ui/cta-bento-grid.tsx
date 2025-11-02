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
      style={{
        contain: 'layout style',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      }}
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
        "relative bg-white/[0.03] backdrop-blur-2xl justify-between flex flex-col h-full rounded-3xl border border-white/10 transition-opacity duration-300 shadow-2xl overflow-hidden",
        className
      )}
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden'
      }}
    >
      
      {/* Brillo superior glassmorphism */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {header}
      <div className="px-4 md:px-6 pb-4 md:pb-4 mt-3 md:mt-2 relative z-10">
        {icon}
        <div className="font-sans font-bold text-white mb-2 md:mb-2 text-sm md:text-base transition-opacity duration-300">
          {title}
        </div>
        <div className="font-sans font-normal text-white/60 text-xs md:text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};