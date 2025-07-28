"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function DotBackground({ 
  className,
  children,
  dotColor = "#404040",
  dotSize = "1px",
  dotSpacing = "20px",
  backgroundColor = "transparent",
  maskEnabled = false,
  fadeEdges = true,
  fadeAmount = "60px",
  fadeTop = true,
  fadeBottom = true
}: {
  className?: string;
  children?: React.ReactNode;
  dotColor?: string;
  dotSize?: string;
  dotSpacing?: string;
  backgroundColor?: string;
  maskEnabled?: boolean;
  fadeEdges?: boolean;
  fadeAmount?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Base background color to match site background */}
      <div className="absolute inset-0" style={{ backgroundColor: backgroundColor }}></div>
      
      {/* Dot pattern with opacity transition */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-image:radial-gradient(var(--dot-color)_var(--dot-size),transparent_var(--dot-size))]",
        )}
        style={{
          '--dot-color': dotColor,
          '--dot-size': dotSize,
          backgroundSize: `${dotSpacing} ${dotSpacing}`,
          opacity: 1, // Fully visible dots
        } as React.CSSProperties}
      />
      
      {/* Radial gradient mask for center focus */}
      {maskEnabled && (
        <div 
          className="pointer-events-none absolute inset-0 flex items-center justify-center" 
          style={{
            background: backgroundColor,
            maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 70%)'
          }}
        ></div>
      )}
      
      {/* Top fade gradient */}
      {fadeEdges && fadeTop && (
        <div 
          className="pointer-events-none absolute top-0 left-0 right-0" 
          style={{
            height: fadeAmount,
            background: `linear-gradient(to bottom, ${backgroundColor} 0%, transparent 100%)`
          }}
        ></div>
      )}
      
      {/* Bottom fade gradient */}
      {fadeEdges && fadeBottom && (
        <div 
          className="pointer-events-none absolute bottom-0 left-0 right-0" 
          style={{
            height: fadeAmount,
            background: `linear-gradient(to top, ${backgroundColor} 0%, transparent 100%)`
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