'use client';

import { useState, useEffect, useRef } from 'react';
import { Gift, Sparkles, Check, Play } from 'lucide-react';
import styles from './WelcomeBonus.module.css';
import { supabase } from '@/lib/supabase';

interface WelcomeBonusProps {
  userId: string;
  onBonusClaimed?: () => void;
}

const WORD = 'AVANZA33';

export default function WelcomeBonus({ userId, onBonusClaimed }: WelcomeBonusProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [userInput, setUserInput] = useState<string[]>(Array(WORD.length).fill(''));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    const { data } = await supabase
      .from('user_profiles')
      .select('welcome_bonus_claimed')
      .eq('user_id', userId)
      .single();
    
    if (data?.welcome_bonus_claimed) {
      setBonusClaimed(true);
    }
  };

  const handleLetterInput = (index: number, value: string) => {
    // Si el valor está vacío, permitir borrar
    if (value === '') {
      const newInput = [...userInput];
      newInput[index] = '';
      setUserInput(newInput);
      return;
    }

    const char = value.toUpperCase().slice(-1);
    // Aceptar letras A-Z y números 0-9
    if (!char.match(/[A-Z0-9]/)) return;

    const newInput = [...userInput];
    newInput[index] = char;
    setUserInput(newInput);

    if (char === WORD[index]) {
      if (index < WORD.length - 1) {
        const nextIndex = index + 1;
        setCurrentIndex(nextIndex);
        // Enfocar el siguiente input automáticamente sin cerrar el teclado
        setTimeout(() => {
          const nextInput = inputRefs.current[nextIndex];
          if (nextInput) {
            nextInput.focus();
            // Prevenir que el teclado se cierre en móvil
            nextInput.click();
          }
        }, 10);
      } else {
        setIsCompleted(true);
        setTimeout(() => claimBonus(), 800);
      }
    }
  };

  const claimBonus = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const newBalance = (userProfile?.balance || 0) + 0.75;

      // Actualizar balance y marcar bono como reclamado
      await supabase
        .from('user_profiles')
        .update({ 
          balance: newBalance,
          welcome_bonus_claimed: true 
        })
        .eq('user_id', userId);

      // Registrar en historial de recompensas (rewards_history)
      await supabase
        .from('cpalead_transactions')
        .insert({
          user_id: userId,
          amount: 0.75,
          type: 'reward',
          status: 'approved',
          description: 'Tarea de bienvenida',
          offer_id: 'welcome_bonus',
          offer_name: 'Bono de Bienvenida',
          created_at: new Date().toISOString()
        });

      console.log('✅ Bono de bienvenida registrado en historial');

      setTimeout(() => {
        setShowPopup(false);
        setBonusClaimed(true);
        onBonusClaimed?.();
        // Recargar la página para reflejar el nuevo balance
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error claiming bonus:', error);
      setIsClaiming(false);
    }
  };

  // Si el bono ya fue reclamado, no renderizar nada (el AdBlock se maneja en el padre)
  if (bonusClaimed) return null;

  return (
    <>
      <div className={styles.bonusCard}>
        <div className={styles.bonusGlow}></div>
        <div className={styles.bonusContent}>
          <div className={styles.bonusIcon}>
            <Gift className="w-8 h-8" />
            <Sparkles className={`w-4 h-4 ${styles.sparkle1}`} />
            <Sparkles className={`w-4 h-4 ${styles.sparkle2}`} />
          </div>
          <div className={styles.bonusText}>
            <h3 className={styles.bonusTitle}>
              <span className="md:hidden">¡Bienvenido!</span>
              <span className="hidden md:inline">¡Bienvenido a Flasti!</span>
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
                  <Gift className="w-10 h-10 text-yellow-400" />
                  <h2 className={styles.popupTitle}>¡Tu primera tarea!</h2>
                  <p className={styles.popupSubtitle}>Completa la palabra letra por letra</p>
                </div>

                <div className={styles.wordHint}>
                  <span className={styles.hintLabel}>Palabra:</span>
                  <span className={styles.hintWord}>{WORD}</span>
                </div>

                <div className={styles.letterBoxes}>
                  {WORD.split('').map((letter, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="characters"
                      spellCheck="false"
                      maxLength={1}
                      value={userInput[index]}
                      onChange={(e) => handleLetterInput(index, e.target.value)}
                      className={`${styles.letterBox} ${
                        userInput[index] === letter ? styles.correct : ''
                      } ${currentIndex === index ? styles.active : ''}`}
                      disabled={index !== currentIndex}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <p className={styles.instruction}>
                  Escribe {/[0-9]/.test(WORD[currentIndex]) ? 'el número' : 'la letra'} <strong>{WORD[currentIndex]}</strong>
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
