"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Fire, Zap, Infinity, Shield, HeadphonesIcon } from "lucide-react";

interface FinalOfferPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: () => void;
}

const FinalOfferPopup2 = ({ isOpen, onClose, onApplyCoupon }: FinalOfferPopupProps) => {
  // Track if animation has completed
  const [animationComplete, setAnimationComplete] = useState(false);

  // Add animation effect when the popup opens
  useEffect(() => {
    if (isOpen) {
      // Iniciar animación del botón
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setAnimationComplete(false);
    }
  }, [isOpen]);

  // Handle coupon application
  const handleApplyCoupon = () => {
    onApplyCoupon();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md border border-[#2a2a4a] bg-gradient-to-b from-[#1a1a2e] to-[#141428] text-white p-0 overflow-hidden shadow-xl"
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevenir cierre con tecla Escape
        onPointerDownOutside={(e) => e.preventDefault()} // Prevenir cierre al hacer clic fuera
        onInteractOutside={(e) => e.preventDefault()} // Prevenir cualquier interacción externa
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#ef4444]/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#f97316]/10 blur-3xl"></div>

        {/* Gradient top border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#ef4444] via-[#f97316] to-[#f59e0b]"></div>

        <div className="p-6 sm:p-8 relative z-10">
          <DialogHeader className="pb-4">
            <div className="flex justify-center mb-2">
              <div className="inline-block p-3 rounded-full bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20 border border-[#f97316]/30">
                <Fire className="h-8 w-8 text-[#ef4444]" />
              </div>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
              ¡ÚLTIMA OPORTUNIDAD!
            </DialogTitle>
            <p className="text-center text-white/70 mt-1">Oferta especial solo por esta vez</p>
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
                  <span className="text-lg line-through text-red-500 font-bold">$50 USD</span>
                </div>
                <div className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white text-xs font-bold py-1 px-2 rounded mr-3">
                  90% OFF
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-white/70">Precio hoy:</span>
                  <span className="text-base text-white/80 line-through">$10 USD</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-white/70">Precio final:</span>
                  <span className="text-2xl font-bold text-[#ef4444]">$5 USD</span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="text-xs text-[#f97316] font-medium">¡Ahorras $45 con esta oferta irrepetible!</span>
              </div>
            </div>

            {/* Beneficios en burbujas flotantes alrededor del contenido */}
            <div className="relative mb-4">
              {/* Urgency section - Compact */}
              <div className="bg-gradient-to-r from-[#ef4444]/20 to-[#f97316]/20 p-2.5 rounded-lg border border-[#ef4444]/30 flex items-center gap-2 shadow-sm shadow-[#ef4444]/20 mb-2">
                <AlertTriangle className="h-4 w-4 text-[#ef4444] flex-shrink-0 animate-pulse" />
                <p className="text-xs text-white leading-tight">
                  Esta es tu <span className="font-bold text-[#ef4444]">última oportunidad</span>. Si cierras esta ventana, perderás este descuento para siempre.
                </p>
              </div>

              {/* Beneficios en formato de burbujas flotantes */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <Zap className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Acceso inmediato</span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <Infinity className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Acceso de por vida</span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <Shield className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Garantía 7 días</span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <HeadphonesIcon className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Soporte 24/7</span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <Sparkles className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Suite completa</span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#2a2a4a]/70 to-[#1a1a2e]/70 px-2 py-1 rounded-full border border-[#3a3a5a]/50">
                  <Gift className="text-[#ec4899] mr-1" size={10} />
                  <span className="text-[10px] text-white">Actualizaciones gratis</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleApplyCoupon}
              className={`w-full max-w-md py-6 text-base font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] hover:from-[#dc2626] hover:to-[#ea580c] border-0 shadow-lg shadow-[#ef4444]/20 flex items-center justify-center gap-2 transition-all ${
                animationComplete ? 'animate-pulse' : ''
              }`}
            >
              <span>¡OBTENER POR SOLO $5!</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinalOfferPopup2;
