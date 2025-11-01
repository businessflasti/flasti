import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGift, FiCheckCircle } from 'react-icons/fi';

export function ConfettiCheck({ show, onClose, message = '¡Acción completada con éxito!' }) {
  if (!show) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        aria-live="polite"
        role="status"
      >
        <div className="relative flex flex-col items-center gap-4 bg-[#1a1a1a]/90 border border-[#333] rounded-2xl px-8 py-8 shadow-2xl animate-fade-in pointer-events-auto">
          <FiCheckCircle className="text-green-400 text-6xl animate-bounce" />
          <span className="text-white text-lg font-semibold text-center animate-fade-in-slow">{message}</span>
          <button
            className="mt-2 px-4 py-1 rounded bg-[#9333ea] text-white font-medium hover:bg-[#b0b0b0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
            onClick={onClose}
            aria-label="Cerrar animación"
          >
            Cerrar
          </button>
          {/* Confetti SVG animado */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" fill="none">
            <motion.circle cx="50" cy="50" r="6" fill="#9333ea" animate={{ cy: [50, 180], opacity: [1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
            <motion.circle cx="150" cy="60" r="5" fill="#b0b0b0" animate={{ cy: [60, 170], opacity: [1, 0] }} transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }} />
            <motion.circle cx="100" cy="40" r="4" fill="#fff" animate={{ cy: [40, 160], opacity: [1, 0] }} transition={{ duration: 1.3, repeat: Infinity, delay: 0.4 }} />
            <motion.circle cx="80" cy="80" r="3" fill="#9333ea" animate={{ cy: [80, 190], opacity: [1, 0] }} transition={{ duration: 1.0, repeat: Infinity, delay: 0.6 }} />
            <motion.circle cx="120" cy="30" r="4" fill="#b0b0b0" animate={{ cy: [30, 150], opacity: [1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }} />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
