'use client';

import React from 'react';
import { Globe } from 'lucide-react';

interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ 
  countryCode, 
  size = 'md',
  className = '',
  id
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Si no hay código de país, mostrar icono Globe
  if (!countryCode || countryCode === '--' || countryCode === 'GLOBAL') {
    return (
      <Globe className={`${iconSizeClasses[size]} text-white ${className}`} id={id} />
    );
  }

  const country = countryCode.toLowerCase();

  return (
    <span 
      id={id}
      className={`${sizeClasses[size]} rounded-full overflow-hidden inline-flex items-center justify-center bg-gray-800 border border-white/20 ${className}`}
    >
      <img
        src={`https://flagcdn.com/w20/${country}.png`}
        alt={countryCode.toUpperCase()}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          // Mostrar emoji de bandera como fallback
          if (e.currentTarget.parentElement) {
            const flagEmoji = String.fromCodePoint(
              ...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0))
            );
            e.currentTarget.parentElement.innerHTML = `<span class="text-[10px]">${flagEmoji}</span>`;
          }
        }}
      />
    </span>
  );
};

export default CountryFlag;
