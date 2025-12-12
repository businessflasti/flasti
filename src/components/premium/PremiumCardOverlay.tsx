'use client';

import React from 'react';
import { Lock, Sparkles, Zap, DollarSign } from 'lucide-react';
import { PremiumCardOverlayProps } from './types';
import styles from './PremiumCardOverlay.module.css';

interface ExtendedPremiumCardOverlayProps extends PremiumCardOverlayProps {
  isReadyToUnlock?: boolean;
  showUnlockButton?: boolean;
}

const PremiumCardOverlay: React.FC<ExtendedPremiumCardOverlayProps> = ({
  isLocked,
  onUnlockClick,
  lockReason = 'premium',
  customMessage,
  showShimmer = true,
  blurIntensity = 'medium',
  className = '',
  children,
  taskNumber,
  isReadyToUnlock = false,
  showUnlockButton
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
        style={{ cursor: isReadyToUnlock ? 'pointer' : 'default' }}
        onClick={isReadyToUnlock ? handleClick : undefined}
        role={isReadyToUnlock ? "button" : undefined}
        tabIndex={isReadyToUnlock ? 0 : undefined}
        onKeyDown={isReadyToUnlock ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onUnlockClick();
          }
        } : undefined}
        aria-label={isReadyToUnlock ? "Desbloquear contenido premium" : "Contenido bloqueado"}
      >
        {/* Contenedor central con efectos */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          {/* Ícono de candado - animación solo si tiene botón desbloquear */}
          <div className="relative mb-4">
            <div className={`relative p-4 ${showUnlockButton ? styles.lockIconWrapper : ''}`}>
              <Lock className="w-12 h-12 text-white drop-shadow-2xl" />
            </div>
          </div>
          
          {/* Título solo si tiene botón de desbloquear */}
          {(showUnlockButton !== undefined ? showUnlockButton : false) && (
            <div className="text-center space-y-2 mb-4">
              <h3 className="text-white font-bold text-lg drop-shadow-lg">
                Continúa generando ingresos
              </h3>
            </div>
          )}

          {/* Botón de desbloqueo (solo si showUnlockButton es true) */}
          {(showUnlockButton !== undefined ? showUnlockButton : false) && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumCardOverlay;