'use client';

import React from 'react';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message = "Cargando...", className = "" }: PageLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 space-y-4 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-700 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-600 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <p className="text-gray-400 font-medium">{message}</p>
    </div>
  );
}

export default PageLoader;