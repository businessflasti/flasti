import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const achievements = [
  { icon: <FiAward />, label: 'Primer retiro', achieved: true },
  { icon: <FiTrendingUp />, label: 'Nivel 5 alcanzado', achieved: false },
  { icon: <FiCheckCircle />, label: '10 recompensas', achieved: true },
];

export function ProgressPanel() {
  const { profile } = useAuth();
  const level = profile?.level || 1;
  const progress = Math.min((level / 10) * 100, 100);
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto bg-[#232323] rounded-xl shadow-lg p-4 mb-6 flex flex-col gap-4 border border-[#333]"
      role="region"
      aria-label="Panel de progreso y logros"
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-semibold text-lg">Progreso de usuario</span>
        <button
          className="text-[#b0b0b0] hover:text-white text-xs px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0]"
          onClick={() => setShow(false)}
          aria-label="Cerrar panel de progreso"
        >
          Ocultar
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white font-medium">Nivel {level}</span>
        <div className="flex-1 h-3 bg-[#101010] rounded-full overflow-hidden">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-[#9333ea] to-[#b0b0b0]"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
        </div>
        <span className="text-[#b0b0b0] text-xs">{progress}%</span>
      </div>
      <div className="flex gap-3 mt-2">
        {achievements.map((a, i) => (
          <div key={a.label} className={`flex flex-col items-center gap-1 ${a.achieved ? 'opacity-100' : 'opacity-40'}`}
            title={a.label}
            aria-label={a.label + (a.achieved ? ' logrado' : ' pendiente')}
          >
            <motion.span
              className={`text-2xl ${a.achieved ? 'text-[#9333ea] animate-bounce' : 'text-[#b0b0b0]'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: a.achieved ? 1.2 : 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {a.icon}
            </motion.span>
            <span className="text-xs text-[#b0b0b0] text-center max-w-[80px]">{a.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
