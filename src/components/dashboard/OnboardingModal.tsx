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
      description: "Estamos emocionados de tenerte con nosotros. Descubre cómo obtener recompensas compartiendo nuestras aplicaciones y servicios.",
      image: "/images/onboarding/welcome.svg"
    },
    {
      title: "Tu Panel Personal",
      description: "Este es tu centro de operaciones donde podrás ver tus estadísticas, recompensas, enlaces personalizados y gestionar tus retiros.",
      image: "/images/onboarding/dashboard.svg"
    },
    {
      title: "Obtén Recompensas",
      description: "Comparte nuestras aplicaciones usando tus enlaces únicos y recibe hasta un 70% de comisión por cada activación exitosa.",
      image: "/images/onboarding/earnings.svg"
    },
    {
      title: "Sistema de Niveles",
      description: "Comienza con un 50% de comisión y avanza hasta el 70% a medida que compartes más. ¡Más participación = mayores beneficios!",
      image: "/images/onboarding/level-up.svg"
    },
    {
      title: "¡Listo para Comenzar!",
      description: "Ya tienes todo lo necesario para empezar a recibir recompensas con Flasti. Nuestro equipo está aquí para apoyarte en cada paso del camino.",
      image: "/images/onboarding/success.svg"
    }
  ];

  // Escuchar el evento personalizado para mostrar el onboarding y verificar nuevos usuarios
  useEffect(() => {
    // Función para manejar el evento personalizado
    const handleShowOnboarding = (event: CustomEvent) => {
      // Permitir mostrar el onboarding manualmente mediante evento
      setIsVisible(true);
    };

    // Registrar el listener para el evento
    window.addEventListener('showOnboarding', handleShowOnboarding as EventListener);

    // Verificar si es un nuevo usuario que nunca ha visto el onboarding
    if (user) {
      try {
        const hasSeenOnboarding = localStorage.getItem(`flasti_hasSeenOnboarding_${user.id}`);
        if (!hasSeenOnboarding) {
          console.log('Mostrando onboarding para nuevo usuario:', user.id);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error al verificar estado del onboarding:', error);
      }
    }

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener('showOnboarding', handleShowOnboarding as EventListener);
    };
  }, [user]);

  // Cerrar el onboarding
  const closeOnboarding = () => {
    // Animación suave al cerrar
    const modal = document.querySelector('.onboarding-modal');
    if (modal) {
      modal.classList.add('animate-fadeOutDown');

      // Esperar a que termine la animación antes de ocultar
      setTimeout(() => {
        setIsVisible(false);
        setCurrentStep(0);
        // Asegurarse de que el desenfoque se elimine
        document.body.style.overflow = '';
        document.body.classList.remove('backdrop-blur-sm');
        // Eliminar cualquier clase que pueda causar desenfoque
        document.querySelectorAll('.backdrop-blur-sm').forEach(el => {
          el.classList.remove('backdrop-blur-sm');
        });
      }, 300);
    } else {
      setIsVisible(false);
      setCurrentStep(0);
      // Asegurarse de que el desenfoque se elimine
      document.body.style.overflow = '';
      document.body.classList.remove('backdrop-blur-sm');
      // Eliminar cualquier clase que pueda causar desenfoque
      document.querySelectorAll('.backdrop-blur-sm').forEach(el => {
        el.classList.remove('backdrop-blur-sm');
      });
    }

    // Guardar que el usuario ha visto el onboarding
    try {
      if (user) {
        localStorage.setItem(`flasti_hasSeenOnboarding_${user.id}`, 'true');
      }
    } catch (error) {
      console.error('Error al guardar el estado del onboarding:', error);
    }
  };

  // Ir al siguiente paso
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Guardar que el usuario ha visto el onboarding
      try {
        if (user) {
          localStorage.setItem(`flasti_hasSeenOnboarding_${user.id}`, 'true');
        }
      } catch (error) {
        console.error('Error al guardar el estado del onboarding:', error);
      }

      // Cerrar el onboarding y recargar la página
      closeOnboarding();

      // Recargar la página después de un breve retraso para permitir que se cierre el modal
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    }
  };

  // Ir al paso anterior
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      // Eliminar cualquier clase que pueda causar desenfoque
      document.querySelectorAll('.backdrop-blur-sm').forEach(el => {
        el.classList.remove('backdrop-blur-sm');
      });
    }
    return () => {
      document.body.style.overflow = '';
      // Asegurarse de eliminar el desenfoque al desmontar el componente
      document.querySelectorAll('.backdrop-blur-sm').forEach(el => {
        el.classList.remove('backdrop-blur-sm');
      });
    };
  }, [isVisible]);

  // Si no es visible, no renderizar nada
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-[1001] p-4 overflow-y-auto">
      <div className="onboarding-modal bg-card/95 rounded-xl border border-border/20 shadow-2xl w-full max-w-md animate-fadeInUp mt-20 mx-auto">
        {/* Añadir un botón flotante para cerrar en móviles */}
        <button
          onClick={closeOnboarding}
          className="fixed top-4 right-4 md:hidden bg-foreground/20 backdrop-blur-md rounded-full p-2 text-white z-[1002]"
        >
          <X size={24} />
        </button>
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 border-b border-border/20 bg-gradient-to-r from-[#9333ea]/10 to-[#ec4899]/10">
          <h3 className="font-semibold text-lg text-gradient">Bienvenido a Flasti</h3>
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
            <div className="w-36 h-36 rounded-full bg-gradient-to-r from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center shadow-lg border border-white/10">
              {/* Aquí iría la imagen del paso actual */}
              <img
                src={steps[currentStep].image || "/images/onboarding/placeholder.svg"}
                alt={steps[currentStep].title}
                className="w-24 h-24 object-contain drop-shadow-md"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-3 text-gradient">{steps[currentStep].title}</h2>
          <p className="text-center text-foreground/80 mb-6 max-w-sm mx-auto">{steps[currentStep].description}</p>

          {/* Indicadores de paso */}
          <div className="flex justify-center gap-3 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? 'bg-gradient-to-r from-[#9333ea] to-[#ec4899] scale-125' : 'bg-foreground/20'}`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-1.5 border ${currentStep === 0 ? 'text-foreground/40 cursor-not-allowed border-border/20' : 'text-foreground/70 hover:text-foreground hover:border-foreground/40 border-border/30'}`}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity px-5 py-2.5 rounded-lg flex items-center gap-1.5 text-white font-medium shadow-md hover:shadow-lg"
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
