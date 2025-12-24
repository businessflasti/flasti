'use client';

import React from 'react';

interface ShimmerTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ShimmerTitle({ children, className = '', style = {} }: ShimmerTitleProps) {
  return (
    <>
      <h2 
        className={className}
        style={{
          background: 'linear-gradient(90deg, #9CA3AF 0%, #9CA3AF 40%, #FFFFFF 50%, #9CA3AF 60%, #9CA3AF 100%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 3s ease-in-out infinite',
          ...style,
        }}
      >
        {children}
      </h2>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </>
  );
}
