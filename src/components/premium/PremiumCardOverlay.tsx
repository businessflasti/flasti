'use client';

import React from 'react';
import { Lock, Sparkles, Zap, DollarSign } from 'lucide-react';
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
  children,
  taskNumber
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
    <div className="relative group">
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
        {/* Contenedor central con efectos */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
          {/* Ícono de candado sin resplandor */}
          <div className="relative mb-3">
            <div className="relative p-4">
              <Lock className="w-8 h-8 text-white drop-shadow-2xl" />
            </div>
          </div>

          {/* Texto persuasivo */}
          <div className="text-center space-y-2 mb-3">
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              ¡Desbloquea y Gana Ya!
            </h3>
            <p className="text-sm text-white/90 font-medium">
              Acceso instantáneo
            </p>
          </div>
          
          {/* Botón de desbloqueo BLANCO (tamaño original) */}
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

          {/* Número de tarea con icono de dólar */}
          {taskNumber && (
            <div className="flex items-center gap-2 mt-12">
              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-black" />
              </div>
              <p className="text-xs text-yellow-300 font-semibold">
                Tarea {taskNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumCardOverlay;