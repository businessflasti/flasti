'use client';

import React from 'react';
import Image from 'next/image';
import styles from './page-loader.module.css';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message = "Cargando...", className = "" }: PageLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 space-y-6 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Spinner exterior giratorio */}
        <div className={`absolute inset-0 w-20 h-20 rounded-full border-2 border-transparent border-t-[#3C66CD] border-r-[#3C66CD] ${styles['spinner-outer']}`}></div>
        
        {/* Spinner medio con rotación inversa */}
        <div className={`absolute inset-2 w-16 h-16 rounded-full border-2 border-transparent border-b-[#E75333] border-l-[#E75333] ${styles['spinner-inner']}`}></div>
        
        {/* Logo en el centro con animación suave */}
        <div className={`relative w-12 h-12 flex items-center justify-center ${styles['logo-pulse']}`}>
          <Image
            src="/logo/isotipo-web.png"
            alt="Flasti Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
            quality={100}
          />
        </div>
        
        {/* Puntos orbitales */}
        <div className={`absolute inset-0 w-20 h-20 ${styles['orbital-dots']}`}>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#3C66CD] rounded-full transform -translate-x-1/2 shadow-sm shadow-[#3C66CD]/50"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-[#E75333] rounded-full transform -translate-x-1/2 shadow-sm shadow-[#E75333]/50"></div>
          <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-[#3C66CD] rounded-full transform -translate-y-1/2 shadow-sm shadow-[#3C66CD]/50"></div>
          <div className="absolute right-0 top-1/2 w-1.5 h-1.5 bg-[#E75333] rounded-full transform -translate-y-1/2 shadow-sm shadow-[#E75333]/50"></div>
        </div>
      </div>
      
      {/* Mensaje con animación de aparición */}
      <div className="text-center">
        <p className="text-gray-400 font-medium text-sm mb-3">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className={`w-1.5 h-1.5 bg-[#3C66CD] rounded-full ${styles['loading-dots']}`}></div>
          <div className={`w-1.5 h-1.5 bg-[#3C66CD] rounded-full ${styles['loading-dots']}`}></div>
          <div className={`w-1.5 h-1.5 bg-[#3C66CD] rounded-full ${styles['loading-dots']}`}></div>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;