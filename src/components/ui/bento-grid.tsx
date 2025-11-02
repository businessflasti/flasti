"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
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

interface BentoGridItemProps {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  className,
  title,
  description,
  header,
  icon
}) => {
  return (
    <div
      className={cn(
        "relative bg-white/[0.03] backdrop-blur-2xl justify-between flex flex-col space-y-2 h-full rounded-3xl border border-white/10 transition-opacity duration-300 shadow-2xl",
        className
      )}
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden'
      }}
    >
      
      {/* Brillo superior glassmorphism */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl"></div>
      
      {header}
      <div className="relative z-10">
        {icon}
        <div className="font-sans font-bold text-white mb-2 mt-1 transition-opacity duration-300">
          {title}
        </div>
        <div className="font-sans font-normal text-white/60 text-xs">
          {description}
        </div>
      </div>
    </div>
  );
};