"use client";

import React from "react";

interface GridBackgroundProps {
  children: React.ReactNode;
  className?: string;
  gridColor?: string;
  gridSize?: string;
  backgroundColor?: string;
  maskEnabled?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className = "",
  gridColor = "#e5e7eb",
  gridSize = "40px",
  backgroundColor = "transparent",
  maskEnabled = false,
}) => {
  const style: React.CSSProperties = {
    backgroundColor,
    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
    backgroundSize: `${gridSize} ${gridSize}`,
  };

  const containerStyle: React.CSSProperties = maskEnabled
    ? { position: "relative", overflow: "hidden" }
    : {};

  return (
    <div className={className} style={containerStyle}>
      <div style={style} className="w-full h-full">
        {children}
      </div>
      <style jsx>{`
        .w-full { width: 100%; }
        .h-full { height: 100%; }
      `}</style>
    </div>
  );
};

export default GridBackground;
