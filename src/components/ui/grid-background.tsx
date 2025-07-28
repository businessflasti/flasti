"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function GridBackgroundDemo() {
  return (
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p>
    </div>
  );
}

export function GridBackground({ 
  className,
  children,
  gridColor = "#262626",
  gridSize = "40px",
  backgroundColor = "#101010",
  maskEnabled = true
}: {
  className?: string;
  children?: React.ReactNode;
  gridColor?: string;
  gridSize?: string;
  backgroundColor?: string;
  maskEnabled?: boolean;
}) {
  return (
    <div className={cn("relative w-full", className)} style={{ backgroundColor }}>
      <div
        className={cn(
          "absolute inset-0",
          `[background-size:${gridSize}_${gridSize}]`,
        )}
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`
        }}
      />
      
      {/* Radial gradient mask if enabled */}
      {maskEnabled && (
        <div 
          className="pointer-events-none absolute inset-0 flex items-center justify-center" 
          style={{
            background: backgroundColor,
            maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 70%)'
          }}
        ></div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}