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
        "bg-[#232323] justify-between flex flex-col h-full rounded-3xl",
        className
      )}
    >
      {header}
      <div className="px-4 md:px-6 pb-4 md:pb-4 mt-3 md:mt-2">
        {icon}
        <div className="font-sans font-bold text-white mb-2 md:mb-2 text-sm md:text-base">
          {title}
        </div>
        <div className="font-sans font-normal text-white/70 text-xs md:text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};