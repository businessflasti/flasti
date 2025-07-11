import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const novedades = [
  {
    id: 1,
    title: '¡Nuevo panel de progreso!',
    desc: 'Ahora puedes ver tu nivel y logros visualmente en el dashboard.',
  },
  {
    id: 2,
    title: 'Sidebar colapsable',
    desc: 'Disfruta de una navegación más cómoda y moderna en desktop y mobile.',
  },
  {
    id: 3,
    title: 'Animaciones premium',
    desc: 'Confeti y feedback visual en acciones importantes como retiros y perfil.',
  },
];

export function ChangelogBanner() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={novedades[current].id}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl mx-auto bg-[#232323] border border-[#9333ea] rounded-lg shadow-md px-4 py-3 flex items-center gap-3 mb-4"
        role="status"
        aria-live="polite"
      >
        <FiAlertCircle className="text-[#9333ea] text-xl shrink-0" aria-hidden="true" />
        <div className="flex-1">
          <span className="text-sm text-white font-semibold block">{novedades[current].title}</span>
          <span className="text-xs text-[#b0b0b0] block">{novedades[current].desc}</span>
        </div>
        <button
          className="text-[#b0b0b0] hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] text-xs"
          aria-label="Siguiente novedad"
          onClick={() => setCurrent((c) => (c + 1) % novedades.length)}
        >
          Siguiente
        </button>
        <button
          className="ml-2 text-[#b0b0b0] hover:text-white p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
          aria-label="Cerrar novedades"
          onClick={() => setVisible(false)}
        >
          <FiX />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
