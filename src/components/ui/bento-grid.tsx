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
        "relative justify-between flex flex-col space-y-2 h-full rounded-3xl transition-opacity duration-300 shadow-2xl",
        className
      )}
      style={{
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        backgroundColor: '#FFFFFF'
      }}
    >
      {header}
      <div className="relative z-10">
        {icon}
        <div className="font-sans font-bold mb-2 mt-1 transition-opacity duration-300" style={{ color: '#111827' }}>
          {title}
        </div>
        <div className="font-sans font-normal text-xs" style={{ color: '#6B7280' }}>
          {description}
        </div>
      </div>
    </div>
  );
};