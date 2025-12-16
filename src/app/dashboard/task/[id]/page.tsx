'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Headphones, Check, Shield, Award, ChevronDown, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import styles from './TaskPage.module.css';

interface CustomOffer {
  id: string;
  modal_title: string;
  modal_subtitle: string;
  audio_url: string;
  video_url?: string;
  input_placeholder: string;
  input_label: string;
  help_text: string;
  amount: number;
  image_url?: string;
  task_type?: string;
  partner_name?: string;
  partner_logo?: string;
  objective?: string;
  block_bg_color?: string;
  image_bg_color?: string;
}

export default function TaskPage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile } = useAuth();
  const [offer, setOffer] = useState<CustomOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [errorTime, setErrorTime] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const taskId = params.id as string;
  const isVideoTask = offer?.task_type?.toLowerCase() === 'video' || !!offer?.video_url;

  const getTodayDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  // Cargar tarea inmediatamente al montar - sin esperar auth
  useEffect(() => {
    const loadTask = async () => {
      try {
        const { data, error } = await supabase
          .from('custom_offers')
          .select('*')
          .eq('id', taskId)
          .single();

        if (error || !data) {
          router.push('/dashboard');
          return;
        }

        setOffer(data);
      } catch (error) {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Progreso
  useEffect(() => {
    if (isVideoTask) {
      const timePattern = /^\d{1,2}:\d{2}$|^\d{1,2}$/;
      const isValidTime = timePattern.test(errorTime.trim());
      const hasDescription = errorDescription.trim().length >= 5;
      let newProgress = 0;
      if (isValidTime) newProgress += 50;
      if (hasDescription) newProgress += 50;
      setProgress(newProgress);
    } else {
      const words = userInput.trim().split(/\s+/).filter(w => w.length > 0);
      const newProgress = Math.min((words.length / 5) * 100, 100);
      setProgress(newProgress);
    }
  }, [userInput, errorTime, errorDescription, isVideoTask]);

  const handleClose = () => window.location.href = '/dashboard';

  const handleSubmit = async () => {
    if (isClaiming || !user || !offer) return;
    setIsClaiming(true);

    timeoutRef.current = setTimeout(() => {
      setIsClaiming(false);
      alert('La operación está tardando demasiado. Por favor, verifica tu conexión e intenta nuevamente.');
    }, 30000);

    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance, total_earnings')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw new Error('No se pudo obtener el perfil del usuario');

      const newBalance = (userProfile?.balance || 0) + offer.amount;
      const newTotalEarnings = (userProfile?.total_earnings || 0) + offer.amount;

      const { data: existingCompletion } = await supabase
        .from('custom_offers_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('offer_id', offer.id)
        .single();

      if (existingCompletion) {
        setIsClaiming(false);
        handleClose();
        return;
      }

      const { error: insertError } = await supabase
        .from('custom_offers_completions')
        .insert({ user_id: user.id, offer_id: offer.id, amount_earned: offer.amount });

      if (insertError) throw new Error('No se pudo registrar la completación de la tarea');

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ balance: newBalance, total_earnings: newTotalEarnings })
        .eq('user_id', user.id);

      if (updateError) throw new Error('No se pudo actualizar el balance');

      const metadata: any = {
        offer_name: offer.modal_title,
        description: offer.modal_subtitle,
        campaign_name: offer.modal_title,
        type: 'reward'
      };

      if (isVideoTask) {
        metadata.user_response = { error_time: errorTime.trim(), error_description: errorDescription.trim() };
      } else {
        metadata.user_response = { words: userInput.trim() };
      }

      await supabase.from('cpalead_transactions').insert({
        user_id: user.id,
        transaction_id: `custom_offer_${offer.id}_${Date.now()}`,
        offer_id: offer.id,
        amount: offer.amount,
        currency: 'USD',
        status: 'approved',
        source: 'custom_offer',
        metadata: metadata,
        created_at: new Date().toISOString()
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsCompleted(true);
      toast.success(`Saldo acreditado: +$${offer.amount.toFixed(2)} USD`);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (error) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      alert(error instanceof Error ? error.message : 'Error al procesar la tarea. Por favor, intenta nuevamente.');
      setIsClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F6F3F3' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#0D50A4' }}></div>
      </div>
    );
  }

  if (!offer) return null;

  if (isCompleted) {
    return (
      <div className={styles.pageContainer}>
        <div className={`${styles.modalContent} ${styles.modalWide}`}>
          <div className={styles.successAnimation}>
            <div className={styles.successCircle}>
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <h2 className={styles.successTitle} style={{ color: '#111827' }}>¡COMPLETADO!</h2>
            <div className={styles.successAmount}>
              <span className={styles.amountValue}>+${offer.amount.toFixed(2)}</span>
              <span className={styles.amountCurrency}>USD</span>
            </div>
            <p className={styles.successMessage}>Acreditado a tu balance</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.modalContent} ${styles.modalWide}`}>
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIndicatorContent}>
            <span className={styles.scrollIndicatorText}>Desliza hacia abajo</span>
            <ChevronDown className={styles.scrollIndicatorIcon} size={16} strokeWidth={2.5} color="#FFFFFF" />
          </div>
          <button onClick={handleClose} className={styles.closeButtonMobile}>
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.leftColumn}>
            <div className={styles.taskInfoBlock} style={{ background: offer.block_bg_color || '#255BA5' }}>
              <div className={styles.taskImageContainer} style={{ background: offer.image_bg_color || '#255BA5' }}>
                {offer.image_url ? (
                  <img src={offer.image_url} alt={offer.modal_title} className={styles.taskImage} />
                ) : (
                  <div className={styles.taskImagePlaceholder} style={{ background: offer.image_bg_color || '#255BA5' }}>
                    {isVideoTask ? <Video className="w-16 h-16 text-white" /> : <Headphones className="w-16 h-16 text-yellow-400" />}
                  </div>
                )}
              </div>
              <div className={styles.taskInfo}>
                <h2 className={styles.taskTitle}>{offer.modal_title}</h2>
                <p className={styles.taskSubtitle}>{offer.modal_subtitle}</p>
                <div className={styles.taskDetails}>
                  <div className={styles.detailItem}>
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>+${offer.amount.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statCardCenter}`}>
                {offer.partner_logo ? (
                  <img src={offer.partner_logo} alt="Partner" className={styles.partnerLogoLarge} />
                ) : (
                  <div className={styles.partnerPlaceholder}>
                    <Award className="w-8 h-8 text-blue-400" />
                  </div>
                )}
                <div className={styles.statLabel}>Partner</div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardObjective}`}>
                <div className={styles.objectiveContent}>
                  <div className={styles.statObjective}>{offer.objective || 'Ayúdanos a mejorar nuestros servicios completando esta tarea'}</div>
                  <div className={styles.statLabel}>Objetivo</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isVideoTask ? <Video className="w-4 h-4 text-purple-400" /> : <Headphones className="w-4 h-4 text-purple-400" />}
                    {offer.task_type || 'Audio'}
                  </div>
                  <div className={styles.statLabel}>Categoría</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{getTodayDate()}</div>
                  <div className={styles.statLabel}>Fecha</div>
                </div>
              </div>
            </div>

            <div className={styles.instructionsCard}>
              <h3 className={styles.instructionsTitle}>Cómo completar esta tarea</h3>
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

          <div className={styles.rightColumn}>
            <div className={styles.workArea}>
              <h3 className={styles.workAreaTitle}>Área de trabajo</h3>
              
              <div className={styles.audioSection}>
                {isVideoTask ? (
                  <video ref={videoRef} controls controlsList="nodownload nofullscreen noremoteplayback noplaybackrate" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className={styles.videoPlayer}>
                    <source src={offer.video_url || offer.audio_url} type="video/mp4" />
                  </video>
                ) : (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '4px' }}>
                    <audio ref={audioRef} controls controlsList="nodownload noplaybackrate" onContextMenu={(e) => e.preventDefault()} className={styles.audioPlayer} style={{ backgroundColor: '#FFFFFF' }}>
                      <source src={offer.audio_url} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>

              {isVideoTask ? (
                <div className="space-y-3">
                  <div className="rounded-xl p-4 relative" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0D50A4' }}>
                      <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>1</span>
                    </div>
                    <label className="block text-sm font-medium mb-2 ml-4" style={{ color: '#111827' }}>Anota el segundo exacto donde viste el error</label>
                    <input type="text" value={errorTime} onChange={(e) => setErrorTime(e.target.value)} placeholder="Ejemplo: 00:25" className={styles.textInput} style={{ height: '42px' }} autoComplete="off" />
                  </div>
                  <div className="rounded-xl p-4 relative" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0D50A4' }}>
                      <span className="text-xs font-bold" style={{ color: '#FFFFFF' }}>2</span>
                    </div>
                    <label className="block text-sm font-medium mb-2 ml-4" style={{ color: '#111827' }}>Describe qué error encontraste</label>
                    <textarea value={errorDescription} onChange={(e) => setErrorDescription(e.target.value)} placeholder="Ejemplo: El video quedó en color blanco" className={styles.textInput} rows={2} autoComplete="off" />
                  </div>
                </div>
              ) : (
                <div className={styles.inputContainer}>
                  <div className={styles.inputSection}>
                    <label className={styles.sectionLabel}>{offer.input_label}</label>
                    <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder={offer.input_placeholder} className={styles.textInput} rows={2} autoComplete="off" />
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className={styles.progressRow}>
                    <p className={styles.progressText}>Progreso: {Math.round(progress)}%</p>
                    <p className={styles.helpTextInline}>{offer.help_text}</p>
                  </div>
                </div>
              )}

              {!isVideoTask && <p className={styles.helpTextMobile}>{offer.help_text}</p>}

              <button onClick={handleSubmit} disabled={isVideoTask ? (!errorTime.trim() || !errorDescription.trim() || errorDescription.trim().length < 5 || isClaiming) : (!userInput.trim() || isClaiming)} className={styles.submitButton}>
                {isClaiming ? (<><div className={styles.spinner}></div>Procesando...</>) : 'Confirmar'}
              </button>

              <div className={styles.securityBadges}>
                <div className={styles.securityBadge}>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className={styles.badgeText}>Acreditación instantánea</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
