import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiX } from 'react-icons/fi';

const tips = [
  {
    id: 1,
    text: '¡Recuerda revisar tus notificaciones para no perderte recompensas!',
  },
  {
    id: 2,
    text: 'Personaliza tu avatar y color desde tu perfil para destacar en el ranking.',
  },
  {
    id: 3,
    text: '¿Dudas? Usa el soporte para recibir ayuda rápida y personalizada.',
  },
];

export function TipsBanner() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={tips[current].id}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto bg-[#232323] border border-[#333] rounded-lg shadow-md px-4 py-3 flex items-center gap-3 mb-4"
        role="status"
        aria-live="polite"
      >
        <FiInfo className="text-[#b0b0b0] text-xl shrink-0" aria-hidden="true" />
        <span className="text-sm text-[#b0b0b0] flex-1">{tips[current].text}</span>
        <button
          className="text-[#b0b0b0] hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
          aria-label="Siguiente tip"
          onClick={() => setCurrent((c) => (c + 1) % tips.length)}
        >
          Siguiente
        </button>
        <button
          className="ml-2 text-[#b0b0b0] hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
          aria-label="Cerrar tips"
          onClick={() => setVisible(false)}
        >
          <FiX />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
