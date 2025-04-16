"use client";

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingModal() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Pasos del onboarding
  const steps = [
    {
      title: "¡Bienvenido a Flasti!",
      description: "Estamos emocionados de tenerte con nosotros. Vamos a mostrarte cómo sacar el máximo provecho de tu nueva cuenta.",
      image: "/images/onboarding/welcome.svg"
    },
    {
      title: "Tu Panel Personal",
      description: "Aquí podrás ver tus estadísticas, ganancias y acceder a todas las funciones de Flasti.",
      image: "/images/onboarding/dashboard.svg"
    },
    {
      title: "Genera Ingresos",
      description: "Prueba y recomienda nuestras aplicaciones y gana comisiones por cada venta que generes.",
      image: "/images/onboarding/earnings.svg"
    },
    {
      title: "Sube de Nivel",
      description: "A medida que generes más ganancias, subirás de nivel y aumentarás tus comisiones.",
      image: "/images/onboarding/level-up.svg"
    },
    {
      title: "¡Listo para Empezar!",
      description: "Ya estás listo para comenzar a generar ingresos con Flasti. Te damos la bienvenida y te deseamos muchos éxitos en esta nueva etapa trabajando con nosotros.",
      image: "/images/onboarding/success.svg"
    }
  ];

  // Escuchar el evento personalizado para mostrar el onboarding
  useEffect(() => {
    const handleShowOnboarding = (event: CustomEvent) => {
      setIsVisible(true);
    };

    window.addEventListener('showOnboarding', handleShowOnboarding as EventListener);

    // Verificar si es un nuevo usuario que nunca ha visto el onboarding
    if (user) {
      const hasSeenOnboarding = localStorage.getItem(`flasti_hasSeenOnboarding_${user.id}`);
      if (!hasSeenOnboarding) {
        console.log('Mostrando onboarding obligatorio para nuevo usuario');
        setIsVisible(true);
      }
    }

    return () => {
      window.removeEventListener('showOnboarding', handleShowOnboarding as EventListener);
    };
  }, [user]);

  // Cerrar el onboarding
  const closeOnboarding = () => {
    setIsVisible(false);
    setCurrentStep(0);

    // Guardar que el usuario ha visto el onboarding
    if (user) {
      localStorage.setItem(`flasti_hasSeenOnboarding_${user.id}`, 'true');
    }
  };

  // Ir al siguiente paso
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeOnboarding();
    }
  };

  // Ir al paso anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Si no es visible, no renderizar nada
  if (!isVisible) return null;

  // Asegurar que el modal aparezca en el área visible al abrirse
  useEffect(() => {
    if (isVisible) {
      // Desplazar al inicio de la página para asegurar visibilidad
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Bloquear el scroll mientras el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll cuando se cierra
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001] p-4 overflow-y-auto">
      <div className="bg-card/95 backdrop-blur-md rounded-xl border border-border/20 shadow-2xl w-full max-w-md animate-fadeInUp my-8 mx-auto">
        {/* Añadir un botón flotante para cerrar en móviles */}
        <button
          onClick={closeOnboarding}
          className="fixed top-4 right-4 md:hidden bg-foreground/20 backdrop-blur-md rounded-full p-2 text-white z-[1002]"
        >
          <X size={24} />
        </button>
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          <h3 className="font-semibold text-lg">Onboarding</h3>
          <button
            onClick={closeOnboarding}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              {/* Aquí iría la imagen del paso actual */}
              <img
                src={steps[currentStep].image || "/images/onboarding/placeholder.svg"}
                alt={steps[currentStep].title}
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">{steps[currentStep].title}</h2>
          <p className="text-center text-foreground/70 mb-6">{steps[currentStep].description}</p>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-primary' : 'bg-foreground/20'}`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 ${currentStep === 0 ? 'text-foreground/40 cursor-not-allowed' : 'text-foreground/70 hover:text-foreground'}`}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity px-4 py-2 rounded-lg flex items-center gap-1 text-white"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Finalizar
                  <Check size={16} />
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
