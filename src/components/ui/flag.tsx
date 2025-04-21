'use client';

import React from 'react';

interface FlagProps {
  country: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Flag({ country, size = 'md' }: FlagProps) {
  const getCountryFlag = (code: string) => {
    // Convertir código de país a emoji de bandera
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <span className={`${sizeClasses[size]} inline-block`}>
      {getCountryFlag(country)}
    </span>
  );
}
