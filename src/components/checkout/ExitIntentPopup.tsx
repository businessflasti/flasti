"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Clock, CheckCircle, ArrowRight, AlertTriangle, HelpCircle, Zap, Infinity, Shield, HeadphonesIcon } from "lucide-react";
import dynamic from 'next/dynamic';
import CardGame from './CardGame';

// Importar react-confetti de forma dinámica para evitar problemas de SSR
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: () => void;
  onApplyFinalDiscount: () => void; // Prop para aplicar el descuento final
  isArgentina?: boolean; // Prop para saber si el usuario es de Argentina
}

const ExitIntentPopup = ({ isOpen, onClose, onApplyCoupon, onApplyFinalDiscount, isArgentina = false }: ExitIntentPopupProps) => {
  // Track if animation has completed
  const [animationComplete, setAnimationComplete] = useState(false);

  // Estado para mostrar la oferta final
  const [showFinalOffer, setShowFinalOffer] = useState(false);

  // Estado para mostrar el diálogo de confirmación
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Estado para mostrar el juego de cartas
  const [showCardGame, setShowCardGame] = useState(true);

  // Estado para el confeti
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiRecycle, setConfettiRecycle] = useState(true);

  // Referencias para el tamaño del contenedor
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Add animation effect when the popup opens
  useEffect(() => {
    if (isOpen) {
      // Iniciar animación del botón
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);

      // Mostrar confeti
      setShowConfetti(true);

      // Detener el confeti después de un tiempo
      const confettiTimer = setTimeout(() => {
        setConfettiRecycle(false);
      }, 5000);

      // Obtener dimensiones del contenedor
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }

      // Reiniciar el estado del juego de cartas - Siempre mostrar el juego de cartas primero
      setShowCardGame(true);

      // Detectar si es un dispositivo móvil
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Ajustar la experiencia para dispositivos móviles si es necesario
      if (isMobile) {
        // Asegurarse de que el juego de cartas sea visible en móviles
        document.body.style.overflow = 'hidden'; // Prevenir scroll
      }

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);

        // Restaurar el scroll cuando se cierra
        document.body.style.overflow = '';
      };
    } else {
      setAnimationComplete(false);
      setShowConfetti(false);
      setConfettiRecycle(true);
      setShowFinalOffer(false);
      setShowConfirmation(false);
      setShowCardGame(true); // Reiniciar para que la próxima vez que se abra, muestre el juego de cartas
    }
  }, [isOpen]);

  // Actualizar dimensiones si cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle coupon application
  const handleApplyCoupon = () => {
    // Mostrar confeti adicional al aplicar el cupón
    setShowConfetti(true);
    setConfettiRecycle(true);

    // Detener el confeti después de un tiempo
    setTimeout(() => {
      setConfettiRecycle(false);
    }, 2000);

    onApplyCoupon();
    onClose();
  };

  // Handle final discount application
  const handleApplyFinalDiscount = () => {
    // Mostrar confeti adicional al aplicar el descuento final
    setShowConfetti(true);
    setConfettiRecycle(true);

    // Detener el confeti después de un tiempo
    setTimeout(() => {
      setConfettiRecycle(false);
    }, 2000);

    onApplyFinalDiscount();
    onClose();
  };

  // Manejar la selección de una carta
  const handleCardSelected = () => {
    // Agregar un pequeño retraso para una transición más suave
    setTimeout(() => {
      // Ocultar el juego de cartas y mostrar el popup normal con una transición suave
      setShowCardGame(false);
    }, 500); // Retraso de 500ms para una transición más suave
  };

  return (
    <div ref={containerRef}>
      {/* Confetti effect */}
      {showConfetti && isOpen && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={confettiRecycle}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#ec4899', '#9333ea', '#f59e0b', '#22c55e', '#3b82f6']}
          confettiSource={{
            x: dimensions.width / 2,
            y: dimensions.height / 3,
            w: 0,
            h: 0
          }}
        />
      )}

      {/* Juego de cartas */}
      {isOpen && showCardGame && (
        <CardGame onCardSelected={handleCardSelected} isArgentina={isArgentina} />
      )}

      <Dialog
        open={isOpen && !showCardGame}
        onOpenChange={(open) => {
          if (!open) {
            // Si estamos en el mensaje de confirmación, permitir que se cierre directamente
            if (showConfirmation) {
              onClose();
              return true;
            }

            if (!showFinalOffer) {
              // Si es la primera oferta, mostrar la oferta final
              setShowFinalOffer(true);
              // Prevenir que se cierre el diálogo
              return false;
            } else if (!showConfirmation) {
              // Si es la oferta final y no se está mostrando la confirmación,
              // mostrar el diálogo de confirmación
              setShowConfirmation(true);
              // Prevenir que se cierre el diálogo
              return false;
            }
          }
          return true;
        }}
      >
        <DialogContent
          className={`sm:max-w-md max-w-[320px] mx-auto border border-[#2a2a4a] bg-gradient-to-b from-[#1a1a2e] to-[#141428] text-white p-0 overflow-hidden shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:duration-500 data-[state=closed]:duration-300 rounded-[12px] ${
            showConfirmation ? 'max-w-[300px] sm:max-w-sm' : ''
          }`}
          onEscapeKeyDown={(e) => e.preventDefault()} // Prevenir cierre con tecla Escape
          onPointerDownOutside={(e) => e.preventDefault()} // Prevenir cierre al hacer clic fuera
          onInteractOutside={(e) => e.preventDefault()} // Prevenir cualquier interacción externa
          // NOTA IMPORTANTE: No se renderiza un botón de cierre 'X' en este Dialog.
          // El cierre está estrictamente controlado por la lógica interna de onOpenChange
          // y solo se permite después de que el usuario interactúa con las ofertas
          // y el diálogo de confirmación final.
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#9333ea]/10 blur-3xl"></div>

          {/* Gradient top border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#9333ea] via-[#ec4899] to-[#f59e0b]"></div>

        <div className={`relative z-10 ${showConfirmation ? 'p-4 sm:p-5' : 'p-6 sm:p-8'}`}>
          {showConfirmation ? (
            // Diálogo de confirmación
            <>

              <DialogHeader className="pb-2 sm:pb-3">
                <div className="flex justify-center mb-1 sm:mb-2">
                  <div className="inline-block p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20 border border-[#ef4444]/30">
                    <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#ef4444]" />
                  </div>
                </div>
                <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
                  ¿Estás seguro?
                </DialogTitle>
                <p className="text-center text-white/70 mt-0.5 text-[10px] sm:text-xs">
                  Estás a punto de perder esta oportunidad
                </p>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4 relative">
                <div className="bg-gradient-to-r from-[#ef4444]/20 to-[#f97316]/20 p-3 sm:p-4 rounded-lg border border-[#ef4444]/30 shadow-sm shadow-[#ef4444]/20">
                  <p className="text-[10px] sm:text-xs md:text-sm text-white text-center">
                    Acepto que al cerrar esta ventana <span className="font-bold text-[#ef4444]">renuncio</span> a esta super oferta de <span className="font-bold text-[#22c55e]">{isArgentina ? "AR$ 5.750" : "$5 USD"}</span> y <span className="font-bold text-[#ef4444]">no volveré a tenerla disponible.</span>
                  </p>
                </div>

                <p className="text-[10px] sm:text-xs md:text-sm text-white text-center mt-1 sm:mt-2 font-medium tracking-normal">
                  ¿Realmente deseas renunciar al <span className="text-[#22c55e]">90% de descuento</span>?
                </p>

                <div className="flex flex-col gap-2 mt-3 sm:mt-4">
                  <Button
                    onClick={() => {
                      onApplyFinalDiscount();
                      onClose();
                    }}
                    className="w-full py-2 sm:py-3 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] border-0 shadow-lg shadow-[#22c55e]/20 flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <span>¡Aplicar descuento ahora!</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>

                  <Button
                    onClick={() => {
                      onClose();
                    }}
                    className="w-full py-2 sm:py-3 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#475569]/80 to-[#334155]/80 hover:from-[#475569] hover:to-[#334155] border-0 shadow-lg shadow-[#475569]/10 flex items-center justify-center"
                  >
                    <span>Perder la oferta</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Contenido normal del pop-up (oferta inicial o final)
            <>
              <DialogHeader className="pb-2 sm:pb-4">
                <div className="flex justify-center mb-1 sm:mb-2">
                  {showFinalOffer ? (
                    <div className="inline-block p-2 sm:p-3 rounded-full bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20 border border-[#f97316]/30">
                      <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-[#ef4444]" />
                    </div>
                  ) : (
                    <div className="inline-block p-2 sm:p-3 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 border border-[#ec4899]/30">
                      <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-[#ec4899]" />
                    </div>
                  )}
                </div>
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
                  {showFinalOffer ? "¡Última oportunidad!" : "¡Felicitaciones!"}
                </DialogTitle>
                <p className="text-center text-sm sm:text-base text-white/70 mt-0.5 sm:mt-1">
                  {showFinalOffer ? "Precio mínimo desbloqueado" : "Ganaste un descuento exclusivo"}
                </p>
              </DialogHeader>

              <div className="relative">
                {/* Logo flotante en la esquina superior derecha */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center border border-[#3a3a5a] shadow-lg">
                    <div className="flex items-center justify-center w-full h-full">
                      <img src="/logo/isotipo.png" alt="Flasti" className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Price section - Compact version */}
                <div className="bg-gradient-to-br from-[#2a2a4a]/50 to-[#1a1a2e]/80 p-4 rounded-xl border border-[#3a3a5a] backdrop-blur-sm mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/70">Valor real:</span>
                      {isArgentina ? (
                        <span className="text-lg line-through text-red-500 font-bold">AR$ 57.500</span>
                      ) : (
                        <span className="text-lg line-through text-red-500 font-bold">$50 USD</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mr-3">
                      <div className={`bg-gradient-to-r text-white text-[8px] sm:text-xs font-bold py-1 px-1.5 sm:px-2 rounded whitespace-nowrap ${
                        showFinalOffer
                          ? "from-[#ef4444] to-[#f97316]"
                          : "from-[#22c55e] to-[#16a34a]"
                      }`}>
                        {showFinalOffer ? "90% OFF" : "84% OFF"}
                      </div>
                      {/* Burbuja de ahorro al costado */}
                      <div className={`text-white text-[8px] sm:text-xs font-bold py-1 px-1.5 sm:px-2 rounded shadow-md animate-pulse whitespace-nowrap ${
                        showFinalOffer
                          ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] shadow-[#22c55e]/20"
                          : "bg-gradient-to-r from-[#f97316] to-[#f59e0b] shadow-[#f97316]/20"
                      }`}>
                        {isArgentina
                          ? `¡Ahorras AR$ ${showFinalOffer ? "51.750" : "48.300"}!`
                          : `¡Ahorras $${showFinalOffer ? "45" : "42"}!`
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/70">Precio hoy:</span>
                      {isArgentina ? (
                        <span className="text-sm text-white/80 line-through">AR$ 11.500</span>
                      ) : (
                        <span className="text-base text-white/80 line-through">$10 USD</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-white/70">{showFinalOffer ? "Precio final:" : "Tu precio:"}</span>
                      <div className="flex items-center">
                        {isArgentina ? (
                          <span className="text-xl font-bold text-[#22c55e]">
                            AR$ {showFinalOffer ? "5.750" : "9.200"}
                          </span>
                        ) : (
                          <span className="text-2xl font-bold text-[#22c55e]">
                            ${showFinalOffer ? "5" : "8"} USD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beneficios en burbujas flotantes alrededor del contenido */}
                <div className="relative mb-3 sm:mb-4">
                  {/* Urgency section - Compact */}
                  <div className="bg-gradient-to-r from-[#ef4444]/20 to-[#f97316]/20 p-2 sm:p-2.5 rounded-lg border border-[#ef4444]/30 flex items-center gap-1.5 sm:gap-2 shadow-sm shadow-[#ef4444]/20 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ef4444] flex-shrink-0 animate-pulse" />
                    <p className="text-[10px] sm:text-xs text-white leading-tight">
                      {showFinalOffer ? (
                        <>Esta es tu <span className="font-bold text-[#ef4444]">última oportunidad.</span> Si cierras esta ventana, perderás este descuento.</>
                      ) : (
                        <>Si cierras esta ventana, este descuento desaparecerá y <span className="font-bold text-[#ef4444]">no volverá a estar disponible.</span></>
                      )}
                    </p>
                  </div>

                  {/* Beneficios en formato de burbujas flotantes */}
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <Zap className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Acceso inmediato</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <Infinity className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Acceso de por vida</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <Shield className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Garantía 7 días</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <HeadphonesIcon className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Soporte 24/7</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <Sparkles className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Suite completa</span>
                    </div>
                    <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-[#3a3a5a]/50">
                      <Gift className="text-[#ec4899] mr-0.5 sm:mr-1" size={9} />
                      <span className="text-[9px] sm:text-[10px] text-white">Actualizaciones gratis</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex justify-center">
                <Button
                  onClick={showFinalOffer ? handleApplyFinalDiscount : handleApplyCoupon}
                  className={`w-full max-w-md py-4 sm:py-6 text-sm sm:text-base font-bold border-0 shadow-lg flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                    animationComplete ? 'animate-pulse' : ''
                  } bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] shadow-[#22c55e]/20`}
                >
                  <span>¡Aplicar descuento ahora!</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default ExitIntentPopup;
