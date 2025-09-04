'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Users, BarChart3, Smartphone, DollarSign, X } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import styles from './OnboardingSlider.module.css';

interface OnboardingSliderProps {
  className?: string;
}

export default function OnboardingSlider({ className = '' }: OnboardingSliderProps) {
  const [isOpen, setIsOpen] = useState(true); // Abierto por defecto
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenido a Flasti",
      description: "La plataforma líder global en generación de ingresos",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      content: "Completa microtareas sencillas y diseñadas para ti para generar ingresos de forma segura.",
      center: true
    },
    {
      title: "Cómo funciona",
      description: "Genera ingresos en 3 simples pasos",
      icon: <BarChart3 className="w-8 h-8 text-green-500" />,
      content: (
        <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: '#101010' }}>
          <div className="flex items-start gap-3">
            <span style={{ backgroundColor: '#3C66CE' }} className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
            <p className="text-gray-300 text-sm">Accede a tu lista diaria de microtareas asignadas, pensadas para ti</p>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ backgroundColor: '#EE5635' }} className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
            <p className="text-gray-300 text-sm">Completa las microtareas fácilmente</p>
          </div>
          <div className="flex items-start gap-3">
            <span style={{ backgroundColor: '#4AA44B' }} className="text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
            <p className="text-gray-300 text-sm">Retira tus ganancias de forma rápida, segura y sin complicaciones</p>
          </div>
        </div>
      )
    },
    {
      title: "Herramientas",
      description: "Todo lo que necesitas en un solo lugar",
      icon: <Smartphone className="w-8 h-8" style={{ color: '#EA4085' }} />,
      content: "Accede a microtareas diarias, estadísticas en tiempo real y un panel completo para gestionar tus ganancias.",
      center: true
    },
    {
      title: "Comienza a trabajar",
      description: "Tu panel te está esperando",
      icon: <DollarSign className="w-8 h-8 text-yellow-500" />,
      content: "¡Todo está listo! Completa tus primeras microtareas asignadas y comienza a generar ingresos.",
      center: true
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < steps.length - 1) {
        handleNext();
      }
      setIsDragging(false);
    },
    onSwipedRight: () => {
      if (currentStep > 0) {
        handlePrevious();
      }
      setIsDragging(false);
    },
    onSwipeStart: () => {
      setIsDragging(true);
    },
    onSwiping: () => {
      setIsDragging(true);
    },
    onTouchEndOrOnMouseUp: () => {
      setIsDragging(false);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: true }
  });

  return (
    <div className={`${styles.container} ${className}`} {...handlers}>
      {/* Pestaña colapsible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.toggleButton} ${!isOpen ? styles.toggleButtonClosed : ''}`}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar guía de onboarding" : "Abrir guía de onboarding"}
      >
        {/* Imagen de fondo para la pestaña: siempre visible */}
        <img
          src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/herouno.webp"
          alt="Fondo pestaña"
          className={styles.toggleBg}
          aria-hidden
        />
        <div className={styles.toggleContent}>
          <span className={styles.toggleText}>¿Cómo funciona?</span>
          <div className={styles.toggleIcon}>
            {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Contenido del slider */}
      <div className={`${styles.sliderContainer} ${isOpen ? styles.open : ''}`}>
        <div className={`${styles.sliderContent} ${isDragging ? styles.grabbing : ''}`}>
          {/* Indicadores de progreso */}
          <div className={styles.progressIndicators}>
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`${styles.progressDot} ${index === currentStep ? styles.active : ''}`}
                aria-label={`Ir al paso ${index + 1}`}
              />
            ))}
          </div>

          {/* Contenido del paso actual */}
          <div className={styles.stepContent} {...handlers}>
            <div className={styles.stepIcon}>
              {steps[currentStep].icon}
            </div>
            
            <h3 className={styles.stepTitle}>
              {steps[currentStep].title}
            </h3>
            
            <p className={styles.stepDescription}>
              {steps[currentStep].description}
            </p>
            
            <div className={styles.stepBody}>
              {typeof steps[currentStep].content === 'string' ? (
                <p className={`${styles.stepText} ${steps[currentStep].center ? styles.centerText : ''}`.trim()}>{steps[currentStep].content}</p>
              ) : (
                steps[currentStep].content
              )}
            </div>
          </div>

          {/* Controles de navegación */}
          <div className={styles.navigationControls}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`${styles.navButton} ${styles.prevButton}`}
              aria-label="Paso anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className={styles.stepCounter}>
              {currentStep + 1} de {steps.length}
            </span>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleClose}
                className={styles.closeButton}
                aria-label="Cerrar guía"
              >
                Cerrar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`${styles.navButton} ${styles.nextButton}`}
                aria-label="Siguiente paso"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}