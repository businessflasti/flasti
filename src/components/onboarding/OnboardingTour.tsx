"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OnboardingTourProps {
  userId: string;
  onComplete: () => void;
}

interface TourStep {
  id: string;
  type: 'modal' | 'spotlight';
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    type: 'modal',
    title: 'Bienvenido a flasti',
    description: 'Te guiaremos en un recorrido rápido para que aprendas a usar la plataforma y comiences a generar ingresos.'
  },
  {
    id: 'balance',
    type: 'spotlight',
    title: 'Balance',
    description: 'Aquí verás tus ganancias en tiempo real. Cada microtarea completada suma a tu balance.',
    targetSelector: '[data-tour="balance"]',
    position: 'bottom'
  },
  {
    id: 'stats',
    type: 'spotlight',
    title: 'Estadísticas',
    description: 'Visualiza tu progreso diario, semanal y total. Aquí podrás ver cuánto has ganado y cuántas microtareas has completado.',
    targetSelector: '[data-tour="stats"]',
    position: 'top'
  },
  {
    id: 'work-area',
    type: 'spotlight',
    title: 'Área de trabajo',
    description: 'Aquí encontrarás las microtareas. Al comenzar tendrás una microtarea disponible. Complétala para desbloquear las siguientes.',
    targetSelector: '[data-tour="work-area"]',
    position: 'top'
  },
  {
    id: 'first-task',
    type: 'spotlight',
    title: 'Microtarea disponible',
    description: 'Toca la microtarea para abrirla. Sigue las instrucciones, completa la actividad y confirma al finalizar para recibir tu pago.',
    targetSelector: '[data-tour="first-task"]',
    position: 'top'
  },
  {
    id: 'menu',
    type: 'spotlight',
    title: 'Menú',
    description: 'Desde aquí accedes a tu perfil, historial de recompensas, retiros y soporte técnico.',
    targetSelector: '[data-tour="menu"]',
    position: 'bottom'
  },
  {
    id: 'finish',
    type: 'modal',
    title: '¡Listo para comenzar!',
    description: 'Completa tu primera microtarea y comienza a generar ingresos.'
  }
];

// Memoized progress dots component
const ProgressDots = memo(({ currentStep, total }: { currentStep: number; total: number }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, index) => (
      <div
        key={index}
        className="w-2 h-2 rounded-full"
        style={{ background: index === currentStep ? '#0D50A4' : '#E5E7EB' }}
      />
    ))}
  </div>
));
ProgressDots.displayName = 'ProgressDots';

const OnboardingTour: React.FC<OnboardingTourProps> = ({ userId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isModal = step.type === 'modal';

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Find and highlight target element (only visible ones)
  const updateTargetPosition = useCallback(() => {
    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll(step.targetSelector!);
      let element: Element | null = null;
      
      for (const el of elements) {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetParent !== null) {
          element = el;
          break;
        }
      }
      
      if (!element) {
        setTargetRect(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      
      // Special case for menu and balance steps - scroll to top
      if (step.id === 'menu' || step.id === 'balance') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          setTargetRect(element!.getBoundingClientRect());
        }, 200);
        return;
      }
      
      // Check if scroll is needed
      const isLargeElement = rect.height > window.innerHeight * 0.5;
      const isElementPartiallyHidden = rect.top < 0 || rect.bottom > window.innerHeight;
      const needsScroll = isLargeElement || isElementPartiallyHidden || rect.top < 80;
      
      if (needsScroll && !isModal) {
        const scrollPadding = 280;
        const elementTop = rect.top + window.scrollY;
        const targetScrollY = Math.max(0, elementTop - scrollPadding);
        
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        
        setTimeout(() => {
          setTargetRect(element!.getBoundingClientRect());
        }, 200);
      } else {
        setTargetRect(rect);
      }
    });
  }, [step.targetSelector, step.id, isModal]);

  // Update position on step change
  useEffect(() => {
    updateTargetPosition();
  }, [currentStep, updateTargetPosition]);

  // Throttled resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
        updateTargetPosition();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [updateTargetPosition]);

  // Save completion to database
  const saveCompletion = useCallback(async () => {
    localStorage.setItem('onboarding_completed', 'true');
    try {
      await supabase
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  }, [userId]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      saveCompletion();
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep, saveCompletion, onComplete]);



  // Block scroll while onboarding is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.classList.add('onboarding-active');
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.body.classList.remove('onboarding-active');
    };
  }, []);

  // Memoized tooltip style calculation
  const tooltipStyle = useMemo((): React.CSSProperties => {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
    const vHeight = typeof window !== 'undefined' ? window.innerHeight : 667;
    const edgePadding = isMobile ? 12 : 16;
    const spotlightGap = isMobile ? 28 : 48;
    const tooltipWidth = isMobile ? Math.min(viewportWidth - 24, 320) : 320;
    const tooltipHeight = 200;

    // For modals (step 1 and 7), center on screen
    if (!targetRect || isModal) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${tooltipWidth}px`,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 10000
      };
    }

    let top = 0;
    let left = 0;

    if (isMobile) {
      const targetCenter = targetRect.top + targetRect.height / 2;
      const isTargetInUpperHalf = targetCenter < vHeight / 2;

      if (isTargetInUpperHalf) {
        top = Math.min(targetRect.bottom + spotlightGap, vHeight - tooltipHeight - edgePadding);
      } else {
        top = Math.max(targetRect.top - tooltipHeight - spotlightGap, edgePadding);
      }
      left = (viewportWidth - tooltipWidth) / 2;
    } else {
      const bottomGap = 12;
      
      switch (step.position) {
        case 'bottom':
          top = targetRect.bottom + bottomGap;
          left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
          break;
        case 'top':
          top = targetRect.top - tooltipHeight - spotlightGap;
          left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
          break;
        default:
          top = targetRect.bottom + bottomGap;
          left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
      }
    }

    // Keep within viewport
    left = Math.max(edgePadding, Math.min(left, viewportWidth - tooltipWidth - edgePadding));
    if (top < edgePadding && step.position !== 'top') top = edgePadding;
    if (top + tooltipHeight > vHeight - edgePadding && step.position !== 'bottom') {
      top = vHeight - tooltipHeight - edgePadding;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`
    };
  }, [targetRect, isModal, isMobile, step.position]);

  // Memoized spotlight style
  const spotlightStyle = useMemo(() => {
    if (!targetRect || isModal) return null;
    return {
      left: targetRect.left - 8,
      top: targetRect.top,
      width: targetRect.width + 16,
      height: targetRect.height
    };
  }, [targetRect, isModal]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999]" 
      style={{ pointerEvents: 'auto' }}
    >
      {/* Overlay - glassmorphism style for modals */}
      {isModal && (
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        />
      )}
      
      {/* Spotlight cutout with overlay and blue ring */}
      {spotlightStyle && (
        <div
          className="absolute rounded-2xl"
          style={{
            ...spotlightStyle,
            background: 'transparent',
            boxShadow: '0 0 0 4px #0D50A4, 0 0 0 9999px rgba(0, 0, 0, 0.75)',
            transition: 'left 0.15s ease-out, top 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out'
          }}
        />
      )}

      {/* Tooltip/Modal */}
      <div
        className="shadow-2xl"
        style={{
          ...tooltipStyle,
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0D50A4',
          pointerEvents: 'auto',
          zIndex: 10,
          transition: isModal ? 'none' : 'top 0.15s ease-out, left 0.15s ease-out'
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 md:px-5 md:py-4" style={{ background: '#0D50A4' }}>
          <h3 className="text-base md:text-lg font-bold text-white">{step.title}</h3>
        </div>

        {/* Content */}
        <div className="px-4 py-3 md:px-5 md:py-4" style={{ background: '#FFFFFF' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div 
          className="px-4 py-3 md:px-5 md:py-4 flex items-center justify-between border-t border-gray-100" 
          style={{ background: '#FFFFFF' }}
        >
          <ProgressDots currentStep={currentStep} total={tourSteps.length} />

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="px-4 py-2.5 md:px-4 md:py-2 rounded-xl text-sm font-medium text-white flex items-center gap-1 hover:opacity-90 active:opacity-80 touch-manipulation"
              style={{ background: '#0D50A4' }}
              type="button"
            >
              {isFirstStep ? 'Comenzar' : isLastStep ? 'Acceder al panel' : 'Siguiente'}
              {!isLastStep && !isFirstStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OnboardingTour);
