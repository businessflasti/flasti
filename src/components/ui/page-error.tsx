'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function PageError({ 
  message = "Error al cargar la página", 
  onRetry,
  className = "" 
}: PageErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 space-y-4 ${className}`}>
      <div className="p-4 rounded-full bg-red-500/20">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">Oops, algo salió mal</h3>
        <p className="text-gray-400 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  );
}

export default PageError;