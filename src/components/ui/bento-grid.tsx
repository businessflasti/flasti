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
        "bg-[#232323] justify-between flex flex-col space-y-2 h-full rounded-3xl",
        className
      )}
    >
      {header}
      <div>
        {icon}
        <div className="font-sans font-bold text-white mb-2 mt-1">
          {title}
        </div>
        <div className="font-sans font-normal text-white/70 text-xs">
          {description}
        </div>
      </div>
    </div>
  );
};