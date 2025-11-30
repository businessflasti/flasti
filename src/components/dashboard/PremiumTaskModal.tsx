'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Headphones, Check, Shield, Users, TrendingUp, Award, Clock, Sparkles, ChevronDown, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './PremiumTaskModal.module.css';

interface PremiumTaskModalProps {
  userId: string;
  customOfferId?: string;
  modalTitle: string;
  modalSubtitle: string;
  audioUrl: string;
  videoUrl?: string;
  inputPlaceholder: string;
  inputLabel: string;
  helpText: string;
  amount: number;
  imageUrl?: string;
  taskType?: string;
  partnerName?: string;
  partnerLogo?: string;
  objective?: string;
  blockBgColor?: string;
  imageBgColor?: string;
  userCountry?: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function PremiumTaskModal({
  userId,
  customOfferId,
  modalTitle,
  modalSubtitle,
  audioUrl,
  videoUrl,
  inputPlaceholder,
  inputLabel,
  helpText,
  amount,
  imageUrl,
  taskType = 'Audio',
  partnerName = 'StudioVA',
  partnerLogo,
  objective = 'Ayúdanos a mejorar nuestros servicios completando esta tarea',
  blockBgColor = '#255BA5',
  imageBgColor = '#255BA5',
  userCountry = 'US',
  onClose,
  onComplete
}: PremiumTaskModalProps) {
  const [userInput, setUserInput] = useState('');
  const [errorTime, setErrorTime] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVideoTask = taskType?.toLowerCase() === 'video' || !!videoUrl;

  // Calcular fecha de expiración (solo fecha de hoy)
  const getTodayDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return `${day}/${month}`;
  };

  // Obtener nombre del país
  const getCountryName = (code: string) => {
    try {
      if ((Intl as any).DisplayNames) {
        const dn = new (Intl as any).DisplayNames(['es'], { type: 'region' });
        return dn.of(code);
      }
    } catch (e) {
      // fallback
    }
    return code;
  };

  // Montar el componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll del body y cleanup
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      // Limpiar timeout si existe al desmontar
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Simular progreso cuando el usuario escribe
  useEffect(() => {
    if (isVideoTask) {
      // Para tareas de video, validar formato de tiempo (MM:SS o SS) y descripción
      const timePattern = /^\d{1,2}:\d{2}$|^\d{1,2}$/;
      const isValidTime = timePattern.test(errorTime.trim());
      const hasDescription = errorDescription.trim().length >= 10;
      
      let newProgress = 0;
      if (isValidTime) newProgress += 50;
      if (hasDescription) newProgress += 50;
      
      setProgress(newProgress);
    } else {
      // Para tareas de audio, contar palabras
      const words = userInput.trim().split(/\s+/).filter(w => w.length > 0);
      const targetWords = 5;
      const newProgress = Math.min((words.length / targetWords) * 100, 100);
      setProgress(newProgress);
    }
  }, [userInput, errorTime, errorDescription, isVideoTask]);

  const handleSubmit = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    // Timeout de seguridad: si después de 30 segundos no se completó, resetear
    timeoutRef.current = setTimeout(() => {
      console.error('Timeout: La operación tardó demasiado');
      setIsClaiming(false);
      alert('La operación está tardando demasiado. Por favor, verifica tu conexión e intenta nuevamente.');
    }, 30000);

    try {
      // 1. Obtener perfil del usuario con validación de error
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance, total_earnings')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error obteniendo perfil:', profileError);
        throw new Error('No se pudo obtener el perfil del usuario');
      }

      const newBalance = (userProfile?.balance || 0) + amount;
      const newTotalEarnings = (userProfile?.total_earnings || 0) + amount;

      // 2. Si es una oferta personalizada, verificar y registrar la completación
      if (customOfferId) {
        const { data: existingCompletion, error: checkError } = await supabase
          .from('custom_offers_completions')
          .select('id')
          .eq('user_id', userId)
          .eq('offer_id', customOfferId)
          .single();

        // Si ya existe (no es error), cerrar modal
        if (existingCompletion) {
          console.log('Tarea ya completada previamente');
          setIsClaiming(false);
          onClose();
          return;
        }

        // Insertar nueva completación
        const { error: insertError } = await supabase
          .from('custom_offers_completions')
          .insert({
            user_id: userId,
            offer_id: customOfferId,
            amount_earned: amount
          });

        if (insertError) {
          console.error('Error registrando completación:', insertError);
          throw new Error('No se pudo registrar la completación de la tarea');
        }
      }

      // 3. Actualizar balance con validación
      const updateData: any = { 
        balance: newBalance,
        total_earnings: newTotalEarnings
      };

      if (!customOfferId) {
        updateData.welcome_bonus_claimed = true;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error actualizando balance:', updateError);
        throw new Error('No se pudo actualizar el balance');
      }

      // 4. Registrar transacción con validación
      const timestamp = Date.now();
      const transactionId = customOfferId 
        ? `custom_offer_${customOfferId}_${timestamp}`
        : `welcome_${userId}_${timestamp}`;
      
      // Preparar metadata con la respuesta del usuario
      const metadata: any = {
        offer_name: modalTitle,
        description: modalSubtitle,
        campaign_name: modalTitle,
        type: 'reward'
      };

      // Agregar respuesta según tipo de tarea
      if (isVideoTask) {
        metadata.user_response = {
          error_time: errorTime.trim(),
          error_description: errorDescription.trim()
        };
      } else {
        metadata.user_response = {
          words: userInput.trim()
        };
      }

      const { error: transactionError } = await supabase
        .from('cpalead_transactions')
        .insert({
          user_id: userId,
          transaction_id: transactionId,
          offer_id: customOfferId || 'welcome_bonus',
          amount: amount,
          currency: 'USD',
          status: 'approved',
          source: customOfferId ? 'custom_offer' : 'welcome_bonus',
          metadata: metadata,
          created_at: new Date().toISOString()
        });

      if (transactionError) {
        console.error('Error registrando transacción:', transactionError);
        // No lanzar error aquí porque el balance ya se actualizó
        console.warn('Balance actualizado pero transacción no registrada');
      }

      // 5. Limpiar timeout de seguridad
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // 6. Mostrar éxito
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      
      // Limpiar timeout de seguridad
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Mostrar mensaje de error al usuario
      alert(error instanceof Error ? error.message : 'Error al procesar la tarea. Por favor, intenta nuevamente.');
      // IMPORTANTE: Resetear el estado para permitir reintentar
      setIsClaiming(false);
    }
  };

  if (!mounted) return null;

  const modalContent = isCompleted ? (
    <div className={styles.modalOverlay}>
        <div className={`${styles.modalContent} ${styles.modalWide}`}>
          <div className={styles.successAnimation}>
            <div className={styles.successCircle}>
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <h2 className={styles.successTitle}>¡COMPLETADO!</h2>
            <div className={styles.successAmount}>
              <span className={styles.amountValue}>+${amount.toFixed(2)}</span>
              <span className={styles.amountCurrency}>USD</span>
            </div>
            <p className={styles.successMessage}>Acreditado a tu balance</p>
            
            {/* Confetti */}
            <div className={styles.confetti}>
              {[...Array(30)].map((_, i) => (
                <div key={i} className={styles.confettiPiece} style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)]
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
  ) : (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.modalWide}`} onClick={(e) => e.stopPropagation()}>
        {/* Indicador de scroll con botón cerrar - Solo móvil */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIndicatorContent}>
            <span className={styles.scrollIndicatorText}>Desliza hacia abajo</span>
            <ChevronDown className={styles.scrollIndicatorIcon} size={16} strokeWidth={2.5} color="rgba(255, 255, 255, 0.5)" />
          </div>
          <button onClick={onClose} className={styles.closeButtonMobile}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Layout de 2 columnas en desktop */}
        <div className={styles.modalBody}>
          {/* Columna izquierda - Información */}
          <div className={styles.leftColumn}>
            {/* Bloque informativo con imagen */}
            <div className={styles.taskInfoBlock} style={{ background: blockBgColor }}>
              {/* Imagen de la tarea */}
              <div className={styles.taskImageContainer} style={{ background: imageBgColor }}>
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={modalTitle}
                    className={styles.taskImage}
                  />
                ) : (
                  <div className={styles.taskImagePlaceholder} style={{ background: imageBgColor }}>
                    {isVideoTask ? (
                      <Video className="w-16 h-16 text-white" />
                    ) : (
                      <Headphones className="w-16 h-16 text-yellow-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Información de la tarea */}
              <div className={styles.taskInfo}>
                <h2 className={styles.taskTitle}>{modalTitle}</h2>
                <p className={styles.taskSubtitle}>{modalSubtitle}</p>
                
                {/* Detalles pequeños */}
                <div className={styles.taskDetails}>
                  <div className={styles.detailItem}>
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>+${amount.toFixed(2)} USD</span>
                  </div>
                  <div className={styles.detailItem}>
                    {isVideoTask ? (
                      <Video className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Headphones className="w-4 h-4 text-purple-400" />
                    )}
                    <span>{taskType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats de credibilidad */}
            <div className={styles.statsGrid}>
              {/* Partner */}
              <div className={`${styles.statCard} ${styles.statCardCenter}`}>
                {partnerLogo ? (
                  <img 
                    src={partnerLogo} 
                    alt="Partner"
                    className={styles.partnerLogoLarge}
                  />
                ) : (
                  <div className={styles.partnerPlaceholder}>
                    <Award className="w-8 h-8 text-blue-400" />
                  </div>
                )}
                <div className={styles.statLabel}>Partner</div>
              </div>

              {/* Objetivo */}
              <div className={`${styles.statCard} ${styles.statCardObjective}`}>
                <div className={styles.objectiveContent}>
                  <div className={styles.statObjective}>{objective}</div>
                  <div className={styles.statLabel}>Objetivo</div>
                </div>
              </div>

              {/* Disponible para */}
              <div className={styles.statCard}>
                <div className={styles.countryFlag}>
                  <img 
                    src={`https://flagcdn.com/w40/${userCountry.toLowerCase()}.png`}
                    alt={getCountryName(userCountry)}
                    className={styles.flagImage}
                  />
                </div>
                <div>
                  <div className={styles.statValue}>{getCountryName(userCountry)}</div>
                  <div className={styles.statLabel}>Disponible para</div>
                </div>
              </div>

              {/* Tarea válida hasta */}
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{getTodayDate()}</div>
                  <div className={styles.statLabel}>Válida solo hoy</div>
                </div>
              </div>
            </div>

            {/* Instrucciones */}
            <div className={styles.instructionsCard}>
              <h3 className={styles.instructionsTitle}>
                Cómo completar esta tarea
              </h3>
              <ol className={styles.instructionsList}>
                {isVideoTask ? (
                  <>
                    <li>Reproduce el video completo</li>
                    <li>Observa y encuentra el error</li>
                    <li>Anota el tiempo donde viste el fallo</li>
                    <li>Presiona "Confirmar" para completar la microtarea</li>
                  </>
                ) : (
                  <>
                    <li>Reproduce el audio</li>
                    <li>Escucha las palabras mencionadas</li>
                    <li>Escribe las palabras en el campo de texto</li>
                    <li>Presiona "Confirmar" para completar la microtarea</li>
                  </>
                )}
              </ol>
            </div>


          </div>

          {/* Columna derecha - Área de trabajo */}
          <div className={styles.rightColumn}>
            <div className={styles.workArea}>
              {/* Botón cerrar - Solo desktop */}
              <button onClick={onClose} className={styles.closeButtonDesktop}>
                <X size={16} strokeWidth={2.5} />
              </button>
              
              <h3 className={styles.workAreaTitle}>Área de trabajo</h3>
              
              {/* Reproductor de audio o video */}
              <div className={styles.audioSection}>
                {!isVideoTask && (
                  <label className={styles.sectionLabel}>
                    <Headphones className="w-4 h-4" />
                    Escucha el audio y escribe las 5 palabras que se mencionan
                  </label>
                )}
                
                {isVideoTask ? (
                  <video 
                    ref={videoRef}
                    controls 
                    controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className={styles.videoPlayer}
                  >
                    <source src={videoUrl || audioUrl} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <audio 
                    ref={audioRef}
                    controls 
                    controlsList="nodownload noplaybackrate"
                    onContextMenu={(e) => e.preventDefault()}
                    className={styles.audioPlayer}
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                )}
              </div>

              {/* Campo de respuesta */}
              <div className={styles.inputContainer}>
                {isVideoTask ? (
                  <>
                    {/* Campos para tarea de video */}
                    <div className={styles.inputSection}>
                      <label className={styles.sectionLabel}>
                        Anota el segundo exacto donde viste el error
                      </label>
                      <input
                        type="text"
                        value={errorTime}
                        onChange={(e) => setErrorTime(e.target.value)}
                        placeholder="Ejemplo: 00:25"
                        className={styles.textInput}
                        style={{ height: '42px', resize: 'none' }}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </div>
                    
                    <div className={styles.inputSection} style={{ marginTop: '12px' }}>
                      <label className={styles.sectionLabel}>
                        Describe qué error encontraste (simple y breve)
                      </label>
                      <textarea
                        value={errorDescription}
                        onChange={(e) => setErrorDescription(e.target.value)}
                        placeholder="Ejemplo: El video quedó en color blanco"
                        className={styles.textInput}
                        rows={2}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </div>
                  </>
                ) : (
                  <div className={styles.inputSection}>
                    <label className={styles.sectionLabel}>
                      {inputLabel}
                    </label>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={inputPlaceholder}
                      className={styles.textInput}
                      rows={2}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </div>
                )}
                
                {/* Barra de progreso - Solo para tareas de audio */}
                {!isVideoTask && (
                  <>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    {/* Progreso y ayuda */}
                    <div className={styles.progressRow}>
                      <p className={styles.progressText}>
                        Progreso: {Math.round(progress)}%
                      </p>
                      <p className={styles.helpTextInline}>
                        {helpText}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Ayuda - Solo visible en móvil y solo para audio */}
              {!isVideoTask && (
                <p className={styles.helpTextMobile}>
                  {helpText}
                </p>
              )}

              {/* Botón de completar */}
              <button
                onClick={handleSubmit}
                disabled={
                  isVideoTask 
                    ? (!errorTime.trim() || !errorDescription.trim() || errorDescription.trim().length < 10 || isClaiming)
                    : (!userInput.trim() || isClaiming)
                }
                className={styles.submitButton}
              >
                {isClaiming ? (
                  <>
                    <div className={styles.spinner}></div>
                    Procesando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>

              {/* Badges de seguridad */}
              <div className={styles.securityBadges}>
                <div className={styles.securityBadge}>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className={styles.badgeText}>Acreditación instantánea</span>
                </div>
                <div className={styles.badgeSeparator}></div>
                <div className={styles.securityBadge} title="Cifrado SSL">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className={styles.badgeTextHideMobile}>Cifrado SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
