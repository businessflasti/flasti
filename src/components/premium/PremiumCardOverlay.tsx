'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { PremiumCardOverlayProps } from './types';
import styles from './PremiumCardOverlay.module.css';

const PremiumCardOverlay: React.FC<PremiumCardOverlayProps> = ({
  isLocked,
  onUnlockClick,
  lockReason = 'premium',
  customMessage,
  showShimmer = true,
  blurIntensity = 'medium',
  className = '',
  children
}) => {
  // Si no está bloqueado, renderizar solo los children
  if (!isLocked) {
    return <>{children}</>;
  }



  // Clases CSS dinámicas
  const overlayClasses = [
    styles.premiumOverlay,
    styles[`blur${blurIntensity.charAt(0).toUpperCase() + blurIntensity.slice(1)}`],
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUnlockClick();
  };

  return (
    <div className="relative">
      {/* Contenido original (borroso) */}
      {children}
      
      {/* Overlay de bloqueo */}
      <div 
        className={overlayClasses}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onUnlockClick();
          }
        }}
        aria-label="Desbloquear contenido premium"
      >

        
        {/* Ícono de candado */}
        <Lock className={styles.lockIcon} />
        
        {/* Botón de desbloqueo */}
        <button 
          className={styles.unlockButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e);
          }}
          type="button"
        >
          Desbloquear
        </button>
      </div>
    </div>
  );
};

export default PremiumCardOverlay;