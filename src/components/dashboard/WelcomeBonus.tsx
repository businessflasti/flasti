'use client';

import { useState, useEffect, useRef } from 'react';
import { Headphones, Sparkles, Check, Play } from 'lucide-react';
import styles from './WelcomeBonus.module.css';
import { supabase } from '@/lib/supabase';

interface WelcomeBonusProps {
  userId: string;
  onBonusClaimed?: () => void;
}

export default function WelcomeBonus({ userId, onBonusClaimed }: WelcomeBonusProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState<boolean | null>(null); // null = loading
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    checkBonusStatus();
  }, [userId]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  const checkBonusStatus = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('welcome_bonus_claimed')
        .eq('user_id', userId)
        .single();
      
      setBonusClaimed(data?.welcome_bonus_claimed || false);
    } catch (error) {
      console.error('Error checking bonus status:', error);
      setBonusClaimed(false);
    }
  };

  const handleSubmit = () => {
    // Siempre confirmar sin importar lo que escriba el usuario
    setIsCompleted(true);
    setTimeout(() => claimBonus(), 600);
  };

  const claimBonus = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('balance, total_earnings')
        .eq('user_id', userId)
        .single();

      const newBalance = (userProfile?.balance || 0) + 0.75;
      const newTotalEarnings = (userProfile?.total_earnings || 0) + 0.75;

      // Actualizar balance, total_earnings y marcar bono como reclamado
      await supabase
        .from('user_profiles')
        .update({ 
          balance: newBalance,
          total_earnings: newTotalEarnings,
          welcome_bonus_claimed: true 
        })
        .eq('user_id', userId);

      // Registrar en historial de recompensas (cpalead_transactions)
      await supabase
        .from('cpalead_transactions')
        .insert({
          user_id: userId,
          transaction_id: `welcome_${userId}_${Date.now()}`,
          offer_id: 'welcome_bonus',
          amount: 0.75,
          currency: 'USD',
          type: 'reward',
          status: 'approved',
          metadata: {
            offer_name: 'Tarea de bienvenida',
            description: 'Tarea de bienvenida',
            campaign_name: 'Tarea de bienvenida'
          },
          created_at: new Date().toISOString()
        });

      console.log('✅ Bono de bienvenida registrado en historial y estadísticas actualizadas');

      // Recargar rápidamente para mejor experiencia de usuario
      setTimeout(() => {
        setShowPopup(false);
        setBonusClaimed(true);
        onBonusClaimed?.();
        // Recargar la página para reflejar el nuevo balance
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error('Error claiming bonus:', error);
      setIsClaiming(false);
    }
  };

  // Si está cargando o el bono ya fue reclamado, no renderizar nada
  if (bonusClaimed === null || bonusClaimed === true) return null;

  return (
    <>
      <div className={styles.bonusCard}>
        <div className={styles.bonusGlow}></div>
        <div className={styles.bonusContent}>
          <div className={styles.bonusIcon}>
            <Headphones className="w-8 h-8" />
            <Sparkles className={`w-4 h-4 ${styles.sparkle1}`} />
            <Sparkles className={`w-4 h-4 ${styles.sparkle2}`} />
          </div>
          <div className={styles.bonusText}>
            <h3 className={styles.bonusTitle}>
              Escucha y escribe las palabras
            </h3>
            <p className={styles.bonusAmount}>$0.75 USD</p>
            <p className={`${styles.bonusDescription} text-xs md:text-xs`}>
              Completa la tarea y gana tu primera recompensa
            </p>
          </div>
          <button 
            onClick={() => setShowPopup(true)}
            className={styles.claimButton}
          >
            <span>Iniciar</span>
            <Play className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay} onClick={() => !isCompleted && setShowPopup(false)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            {/* Botón X para cerrar */}
            {!isCompleted && (
              <button
                onClick={() => setShowPopup(false)}
                className={styles.closeButton}
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {!isCompleted ? (
              <>
                <div className={styles.popupHeader}>
                  <div className="flex items-center gap-3 mb-4">
                    <Headphones className="w-16 h-16 text-yellow-400" />
                    <span className="text-yellow-400 text-xl font-bold">+$0.75 USD</span>
                  </div>
                  <h2 className={styles.popupTitle}>¡Tu primera tarea!</h2>
                  <p className={styles.popupSubtitle}>Escucha el audio y escribe las 5 palabras que se mencionan</p>
                </div>

                {/* Reproductor de audio */}
                <div className="w-full mb-6">
                  <audio 
                    ref={audioRef}
                    controls 
                    controlsList="nodownload noplaybackrate"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full"
                    style={{
                      borderRadius: '12px',
                      backgroundColor: '#1a1a1a',
                      outline: 'none'
                    }}
                  >
                    <source src="/audios/bienvenida.mp3" type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>

                {/* Campo de texto para las 5 palabras */}
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Escribe las 5 palabras (separadas por espacios):
                  </label>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ejemplo: PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                {/* Botón de confirmar */}
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                  Las palabras deben estar en el orden mencionado en el audio
                </p>
              </>
            ) : (
              <div className={styles.successAnimation}>
                <div className={styles.checkCircle}>
                  <Check className="w-16 h-16" />
                </div>
                <h2 className={styles.successTitle}>¡COMPLETADO!</h2>
                <p className={styles.successAmount}>+$0.75 USD</p>
                <p className={styles.successMessage}>Acreditado a tu balance</p>
                <div className={styles.confetti}>
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={styles.confettiPiece} style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6'][Math.floor(Math.random() * 4)]
                    }}></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
