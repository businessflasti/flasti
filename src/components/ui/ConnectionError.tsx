"use client";

import React from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionErrorProps {
  message?: string;
  onRetry?: () => void;
  variant?: 'light' | 'dark';
  showIcon?: boolean;
}

/**
 * Componente para mostrar errores de conexión con opción de reintentar
 */
const ConnectionError: React.FC<ConnectionErrorProps> = ({
  message = 'No se pudo cargar el contenido',
  onRetry,
  variant = 'light',
  showIcon = true
}) => {
  const isDark = variant === 'dark';
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl"
      style={{ 
        backgroundColor: isDark ? '#252525' : '#FFFFFF',
        border: `1px solid ${isDark ? '#333333' : '#E5E7EB'}`
      }}
    >
      {showIcon && (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: isDark ? '#333333' : '#F3F4F6' }}
        >
          <WifiOff 
            className="w-6 h-6" 
            style={{ color: isDark ? '#9CA3AF' : '#6B7280' }} 
          />
        </div>
      )}
      
      <div className="text-center">
        <p 
          className="text-sm font-medium mb-1"
          style={{ color: isDark ? '#FFFFFF' : '#111827' }}
        >
          {message}
        </p>
        <p 
          className="text-xs"
          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
        >
          Verifica tu conexión e intenta de nuevo
        </p>
      </div>
      
      <Button
        onClick={handleRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
        style={{
          backgroundColor: isDark ? '#FFFFFF' : '#0D50A4',
          color: isDark ? '#202020' : '#FFFFFF'
        }}
      >
        <RefreshCw className="w-4 h-4" />
        Reintentar
      </Button>
    </div>
  );
};

export default ConnectionError;
