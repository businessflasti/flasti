"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'light' | 'dark';
}

/**
 * Skeleton loader elegante con animación shimmer
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'light' }) => {
  const baseColor = variant === 'light' ? '#E5E7EB' : '#374151';
  const shimmerColor = variant === 'light' ? '#F3F4F6' : '#4B5563';
  
  return (
    <div 
      className={`relative overflow-hidden rounded ${className}`}
      style={{ backgroundColor: baseColor }}
    >
      <div 
        className="absolute inset-0 skeleton-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
      />
      <style jsx>{`
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Skeleton para el bloque de balance - TODO skeleton (icono, título, número)
 */
export const BalanceSkeleton: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const isLight = variant === 'light';
  
  return (
    <div 
      className="rounded-3xl p-3 lg:p-4 shadow-sm"
      style={{ backgroundColor: isLight ? '#FFFFFF' : '#121212' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 lg:gap-3 flex-1">
          {/* Icono skeleton */}
          <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0" variant={variant} />
          
          <div className="flex flex-col flex-1 gap-1">
            {/* Label skeleton */}
            <Skeleton className="h-3 lg:h-4 w-16 rounded" variant={variant} />
            {/* Número skeleton */}
            <Skeleton className="h-7 lg:h-8 w-28 rounded-md" variant={variant} />
          </div>
        </div>
        
        {/* Botón ojo skeleton */}
        <Skeleton className="h-8 w-8 lg:h-9 lg:w-9 rounded-lg flex-shrink-0" variant={variant} />
      </div>
    </div>
  );
};

/**
 * Skeleton para un bloque de estadística - TODO skeleton (icono, título, número)
 */
export const StatSkeleton: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const isLight = variant === 'light';
  
  return (
    <div 
      className="rounded-3xl p-4 lg:p-6 shadow-sm"
      style={{ backgroundColor: isLight ? '#FFFFFF' : '#121212' }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {/* Label skeleton */}
          <Skeleton className="h-3 w-16 rounded" variant={variant} />
          {/* Número skeleton */}
          <Skeleton className="h-8 lg:h-10 w-24 rounded-md" variant={variant} />
        </div>
        {/* Icono skeleton */}
        <Skeleton className="w-12 h-12 rounded-full" variant={variant} />
      </div>
    </div>
  );
};

/**
 * Skeleton para card de estadística con icono a la izquierda (usado en withdrawals, rewards-history)
 */
export const StatCardSkeleton: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  const isLight = variant === 'light';
  
  return (
    <div 
      className="rounded-3xl border-0 shadow-sm p-4"
      style={{ backgroundColor: isLight ? '#FFFFFF' : '#121212' }}
    >
      <div className="flex items-center gap-3">
        {/* Icono skeleton */}
        <Skeleton className="w-11 h-11 rounded-2xl flex-shrink-0" variant={variant} />
        <div className="space-y-1.5">
          {/* Label skeleton */}
          <Skeleton className="h-3 w-20 rounded" variant={variant} />
          {/* Número skeleton */}
          <Skeleton className="h-6 w-24 rounded" variant={variant} />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid de 4 skeletons de estadísticas
 */
export const StatsGridSkeleton: React.FC<{ variant?: 'light' | 'dark' }> = ({ variant = 'light' }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatSkeleton variant={variant} />
      <StatSkeleton variant={variant} />
      <StatSkeleton variant={variant} />
      <StatSkeleton variant={variant} />
    </div>
  );
};

/**
 * Grid de 3 skeletons de cards (para withdrawals)
 */
export const StatsCardsGridSkeleton: React.FC<{ variant?: 'light' | 'dark'; columns?: number }> = ({ variant = 'light', columns = 3 }) => {
  const gridClass = columns === 4 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' 
    : 'grid grid-cols-1 md:grid-cols-3 gap-4';
  
  return (
    <div className={gridClass}>
      {Array.from({ length: columns }).map((_, i) => (
        <StatCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};

export default Skeleton;
