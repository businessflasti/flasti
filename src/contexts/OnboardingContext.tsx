"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Step {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  steps: Step[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps] = useState<Step[]>([
    {
      target: '[data-tour="balance"]',
      title: 'Tu Balance',
      content: 'Aquí podrás ver tu balance actual y realizar retiros cuando lo desees.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="links"]',
      title: 'Enlaces de Afiliado',
      content: 'Genera y gestiona tus enlaces de afiliado para compartir con tu audiencia.',
      placement: 'top'
    },
    {
      target: '[data-tour="stats"]',
      title: 'Estadísticas',
      content: 'Monitorea el rendimiento de tus enlaces y ventas en tiempo real.',
      placement: 'top'
    },
    {
      target: '[data-tour="levels"]',
      title: 'Sistema de Niveles',
      content: 'Aumenta tu nivel para obtener mejores comisiones y beneficios exclusivos.',
      placement: 'left'
    }
  ]);

  // Obtener el contexto de autenticación para acceder al usuario
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Desactivado: ya no mostramos el tour para nuevos usuarios
    // Siempre establecemos que el usuario ya ha visto el tour
    try {
      localStorage.setItem(`flasti_hasSeenContextTour_${user.id}`, 'true');
      setIsActive(false);
    } catch (error) {
      console.error('Error al guardar el estado del tour:', error);
    }
  }, [user]);

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);

    // Guardar que el usuario ha visto el tour
    if (user) {
      localStorage.setItem(`flasti_hasSeenContextTour_${user.id}`, 'true');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        endTour,
        nextStep,
        prevStep
      }}
    >
      {children}
      {isActive && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-50" onClick={endTour} />

          {/* Tour Step */}
          <div
            className="fixed z-[60] bg-card rounded-lg shadow-lg p-4 max-w-xs animate-fade-in"
            style={{
              // Posicionamiento dinámico basado en el elemento objetivo
              // Se implementará en el componente que use este contexto
            }}
          >
            <h3 className="font-medium mb-2">{steps[currentStep].title}</h3>
            <p className="text-sm text-foreground/70 mb-4">{steps[currentStep].content}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={prevStep}
                  className="px-3 py-1 text-sm rounded-md bg-primary/10 text-primary disabled:opacity-50"
                  disabled={currentStep === 0}
                >
                  Anterior
                </button>
                <button
                  onClick={nextStep}
                  className="px-3 py-1 text-sm rounded-md bg-primary text-white"
                >
                  {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </button>
              </div>

              <div className="text-sm text-foreground/60">
                {currentStep + 1}/{steps.length}
              </div>
            </div>
          </div>
        </>
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};