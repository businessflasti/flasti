'use client';

import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import styles from './CompletedTaskOverlay.module.css';

interface CompletedTaskOverlayProps {
  amount: number;
  imageUrl?: string;
  children: React.ReactNode;
}

const CompletedTaskOverlay: React.FC<CompletedTaskOverlayProps> = ({ amount, imageUrl, children }) => {
  return (
    <div className="relative group">
      {/* Contenido original */}
      {children}
      
      {/* Overlay de completado */}
      <div className={styles.completedOverlay}>
        {/* Partículas de confetti */}
        <div className={styles.confettiContainer}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>

        {/* Contenedor central */}
        <div className={styles.completedContent}>
          {/* Imagen de la tarea con badge verificado */}
          <div className={styles.imageContainer}>
            <div className={styles.imageGlow}></div>
            <div className={styles.imageCircle}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Tarea completada"
                  width={64}
                  height={64}
                  className={styles.taskImage}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
            {/* Check badge verificado - estilo redes sociales */}
            <div className={styles.checkBadge}>
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Texto de completado */}
          <div className={styles.completedText}>
            <h3 className={styles.completedTitle}>¡Completada!</h3>
            <div className={styles.amountBadge}>
              <span className={styles.amountText}>+${amount.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Efecto de brillo en los bordes */}
        <div className={styles.shimmerEffect}></div>
      </div>
    </div>
  );
};

export default CompletedTaskOverlay;
