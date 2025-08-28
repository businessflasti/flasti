'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/logo";
import { CheckCircle, ArrowRight, Users, DollarSign, Smartphone, BarChart3 } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    // Si no hay usuario, redirigir al login
    if (!user) {
      console.log('Welcome: No hay usuario, redirigiendo a login...');
      router.push('/login');
      return;
    }
    
    // Verificar si ya completó el onboarding (doble verificación)
    const checkOnboardingStatus = async () => {
      try {
        // Verificar localStorage primero
        const localCompleted = localStorage.getItem(`onboarding_completed_${user.email}`);
        if (localCompleted === 'true') {
          console.log('Welcome: Usuario ya completó onboarding, redirigiendo a dashboard...');
          router.push('/dashboard');
          return;
        }
        
        // Verificar en base de datos
        const response = await fetch('/api/user/onboarding-status');
        if (response.ok) {
          const { hasCompletedOnboarding } = await response.json();
          if (hasCompletedOnboarding) {
            console.log('Welcome: Onboarding ya completado en BD, sincronizando y redirigiendo...');
            localStorage.setItem(`onboarding_completed_${user.email}`, 'true');
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Welcome: Error al verificar estado de onboarding:', error);
        // Continuar mostrando welcome en caso de error
      }
    };
    
    checkOnboardingStatus();
  }, [user, router]);

  const steps = [
    {
      title: "Bienvenido a Flasti",
      description: "La plataforma líder global en generación de ingresos, donde la tecnología se integra con oportunidades reales",
      icon: <Users className="w-12 h-12 text-blue-500" />,
      content: "Estás a punto de comenzar a ganar dinero de forma segura, completando microtareas sencillas y diseñadas para ti."
    },
    {
      title: "Cómo funciona",
      description: "Genera ingresos en 3 simples pasos",
      icon: <BarChart3 className="w-12 h-12 text-green-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
              <p className="text-gray-300 text-left">Accede a tu lista diaria de microtareas asignadas, pensadas para ti</p>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
              <p className="text-gray-300 text-left">Completa las microtareas fácilmente</p>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
              <p className="text-gray-300 text-left">Retira tus ganancias de forma rápida, segura y sin complicaciones</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Herramientas",
      description: "Todo lo que necesitas en un solo lugar",
      icon: <Smartphone className="w-12 h-12" style={{ color: '#EA4085' }} />,
      content: "Accede a microtareas diarias, estadísticas en tiempo real y un panel completo para gestionar tus ganancias."
    },
    {
      title: "Comienza a trabajar",
      description: "Tu panel te está esperando",
      icon: <DollarSign className="w-12 h-12 text-yellow-500" />,
      content: "¡Todo está listo! Dirígete a tu panel para completar tus primeras microtareas asignadas y comenzar a generar ingresos."
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar que el usuario ya vio el onboarding y redirigir al dashboard
      handleFinishOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funciones para manejo táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentStep > 0) {
      handlePrevious();
    }
  };

  // Función para navegar directamente a un paso
  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleFinishOnboarding = async () => {
    console.log('Marcando onboarding como completado...');
    
    if (!user?.id || !user?.email) {
      console.error('Error: No hay usuario válido para completar onboarding');
      return;
    }
    
    try {
      // 1. Guardar en localStorage inmediatamente
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      localStorage.setItem(`onboarding_completed_${user.email}`, 'true');
      console.log('Onboarding marcado en localStorage');
      
      // 2. Guardar en base de datos
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          completedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('Onboarding guardado en base de datos exitosamente');
      } else {
        console.warn('Error al guardar onboarding en BD, pero continuando con localStorage');
      }
      
    } catch (error) {
      console.error('Error al completar onboarding:', error);
      // Continuar de todos modos si localStorage funcionó
    }
    
    console.log('Onboarding completado, redirigiendo al dashboard...');
    router.push('/dashboard');
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#101010]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#101010] px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo centrado */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Indicador de progreso */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                  index <= currentStep ? 'bg-white' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Ir al paso ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div 
          className="bg-card/60 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center mb-6">
            {steps[currentStep].icon}
          </div>

          <h1 className="text-3xl font-bold mb-4 text-white">
            {steps[currentStep].title}
          </h1>

          <p className="text-lg text-gray-300 mb-6">
            {steps[currentStep].description}
          </p>

          <div className="text-gray-400 mb-8 leading-relaxed">
            {typeof steps[currentStep].content === 'string' ? (
              <div className="whitespace-pre-line">{steps[currentStep].content}</div>
            ) : (
              steps[currentStep].content
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-white hover:bg-gray-100 text-black font-medium px-8 py-3 rounded-lg transition-all duration-200"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinishOnboarding}
                className="bg-white hover:bg-gray-100 text-black font-medium px-8 py-3 rounded-lg transition-all duration-200"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Ir al Panel
              </Button>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}