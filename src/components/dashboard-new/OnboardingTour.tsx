"use client";

import { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface OnboardingStep {
  title: string;
  description: string;
  image: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export default function OnboardingTour() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Definir los pasos del onboarding
  const steps: OnboardingStep[] = [
    {
      title: t('bienvenidoFlasti'),
      description: t('onboardingWelcomeDesc'),
      image: '/images/onboarding/welcome.webp',
      position: 'center'
    },
    {
      title: t('probarRecomendar'),
      description: t('onboardingTestRecommendDesc'),
      image: '/images/onboarding/recommend.webp',
      position: 'bottom'
    },
    {
      title: t('ganarComisiones'),
      description: t('onboardingEarnDesc'),
      image: '/images/onboarding/earn.webp',
      position: 'right'
    },
    {
      title: t('empezarAhora'),
      description: t('onboardingStartDesc'),
      image: '/images/onboarding/start.webp',
      position: 'center'
    }
  ];

  // Verificar si el usuario ya ha visto el onboarding
  useEffect(() => {
    if (!user) return;

    const onboardingKey = `flasti-onboarding-completed-${user.id}`;
    const hasCompleted = localStorage.getItem(onboardingKey) === 'true';
    setHasSeenOnboarding(hasCompleted);

    // Escuchar evento para mostrar onboarding
    const handleShowOnboarding = (event: CustomEvent) => {
      if (event.detail?.userId === user.id) {
        setIsVisible(true);
      }
    };

    window.addEventListener('showOnboarding', handleShowOnboarding as EventListener);

    // Si es la primera vez, mostrar onboarding automáticamente
    if (!hasCompleted) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('showOnboarding', handleShowOnboarding as EventListener);
    };
  }, [user]);

  // Manejar cambio de idioma
  useEffect(() => {
    // Actualizar los pasos cuando cambie el idioma
  }, [language, t]);

  // Avanzar al siguiente paso
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Completar onboarding
  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`flasti-onboarding-completed-${user.id}`, 'true');
      setHasSeenOnboarding(true);
    }
    setIsVisible(false);
    setCurrentStep(0);
  };

  // Si no es visible o ya se ha visto, no mostrar nada
  if (!isVisible) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hardware-accelerated">
      <div className={`relative w-full max-w-md mx-auto bg-card rounded-xl shadow-2xl overflow-hidden animate-fadeInUp hardware-accelerated ${
        currentStepData.position === 'center' ? 'my-auto' :
        currentStepData.position === 'top' ? 'mt-20 mb-auto' :
        currentStepData.position === 'bottom' ? 'mt-auto mb-20' :
        currentStepData.position === 'left' ? 'ml-20 mr-auto' :
        currentStepData.position === 'right' ? 'ml-auto mr-20' : ''
      }`}>
        {/* Botón para cerrar */}
        <button
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors mobile-touch-friendly hardware-accelerated"
          onClick={completeOnboarding}
        >
          <X size={18} />
        </button>

        {/* Imagen del paso */}
        <div className="w-full h-48 bg-gradient-to-r from-[#9333ea] to-[#ec4899] relative overflow-hidden hardware-accelerated">
          <img
            src={currentStepData.image}
            alt={currentStepData.title}
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        {/* Contenido del paso */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{currentStepData.title}</h2>
          <p className="text-foreground/70 mb-6">{currentStepData.description}</p>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 hardware-accelerated ${
                  index === currentStep ? 'bg-primary w-6' : 'bg-foreground/30'
                }`}
              ></div>
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between">
            {currentStep > 0 ? (
              <button
                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors mobile-touch-friendly hardware-accelerated"
                onClick={prevStep}
              >
                {t('anterior')}
              </button>
            ) : (
              <div></div> // Espacio vacío para mantener el layout
            )}

            {currentStep < steps.length - 1 ? (
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors mobile-touch-friendly hardware-accelerated"
                onClick={nextStep}
              >
                {t('siguiente')}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors mobile-touch-friendly hardware-accelerated"
                onClick={completeOnboarding}
              >
                {t('comenzar')}
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
