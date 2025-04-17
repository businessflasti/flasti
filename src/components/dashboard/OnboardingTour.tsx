"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  forceVisible?: boolean; // Para forzar que el elemento sea visible
}

export default function OnboardingTour() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isScrolling, setIsScrolling] = useState(false);

  // Definir los pasos del tour con instrucciones detalladas y selectores precisos
  const tourSteps: TourStep[] = [
    {
      target: 'header .logo',
      title: '¡Bienvenido a Flasti!',
      content: 'Esta es tu plataforma para generar ingresos recomendando nuestras aplicaciones. Vamos a mostrarte cómo funciona todo.',
      position: 'bottom',
      forceVisible: true
    },
    {
      target: '.user-level-badge',
      title: 'Tu Nivel de Afiliado',
      content: 'Este indicador muestra tu nivel actual. A mayor nivel, mayores comisiones. Comienza en 50% y puedes llegar hasta 70% en el nivel 3.',
      position: 'bottom',
      forceVisible: true
    },
    {
      target: '[data-tour="balance"]',
      title: 'Tu Balance',
      content: 'Aquí puedes ver tu balance actual en tiempo real. Cada venta que generes se reflejará automáticamente. Usa el botón "Retirar" cuando quieras transferir tus ganancias.',
      position: 'bottom',
      forceVisible: true
    },
    {
      target: '.relative:has(.notifications-icon)',
      title: 'Notificaciones en Tiempo Real',
      content: 'Recibe alertas instantáneas de nuevos clics, ventas y comisiones. El número indica notificaciones sin leer. Haz clic para ver todas tus notificaciones.',
      position: 'bottom',
      forceVisible: true
    },
    {
      target: '.mobile-menu-toggle',
      title: 'Menú de Navegación',
      content: 'Accede rápidamente a todas las secciones de la plataforma. Puedes cambiar entre modo claro/oscuro y cerrar sesión desde aquí.',
      position: 'right',
      forceVisible: true
    },
    {
      target: '.quick-stats',
      title: 'Estadísticas Rápidas',
      content: 'Monitorea tus métricas clave: clics totales, ventas realizadas, tasa de conversión y última actividad. Estos datos se actualizan automáticamente.',
      position: 'top',
      forceVisible: true
    },
    {
      target: '[data-tour="apps"], a[href="/dashboard/cursos"]',
      title: 'Nuestras Aplicaciones',
      content: 'Explora las aplicaciones que puedes probar y recomendar. Haz clic para conocer cada producto y generar tu enlace de afiliado personalizado.',
      position: 'top',
      forceVisible: true
    },
    {
      target: '[data-tour="links"], a[href="/dashboard/enlaces"]',
      title: 'Tus Enlaces de Afiliado',
      content: 'Aquí puedes gestionar todos tus enlaces. Cada enlace es único y rastrea las visitas y ventas que generas. Comparte estos enlaces en tus redes sociales, sitio web o correos.',
      position: 'left',
      forceVisible: true
    },
    {
      target: '[data-tour="stats"], a[href="/dashboard/estadisticas"]',
      title: 'Estadísticas Detalladas',
      content: 'Analiza el rendimiento de tus campañas con gráficos y datos detallados. Puedes ver qué enlaces funcionan mejor y optimizar tus estrategias de recomendación.',
      position: 'right',
      forceVisible: true
    },
    {
      target: '[data-tour="level"]',
      title: 'Progreso de Nivel',
      content: 'Visualiza tu progreso hacia el siguiente nivel. Cada ganancia te acerca a mejores comisiones. Al alcanzar $20 USD subes a Nivel 2 (60%) y con $30 USD llegas al Nivel 3 (70%).',
      position: 'top',
      forceVisible: true
    },
    {
      target: '.recent-activity',
      title: 'Actividad Reciente',
      content: 'Revisa tus últimas actividades: clics, ventas y comisiones en tiempo real. Esta sección te ayuda a seguir el recorrido de tus visitantes hasta que se convierten en clientes.',
      position: 'left',
      forceVisible: true
    },
    {
      target: '[data-tour="paypal"], a[href="/dashboard/paypal"]',
      title: 'Retiros a PayPal',
      content: 'Cuando estés listo para retirar tus ganancias, ve a esta sección. Podrás solicitar transferencias a tu cuenta de PayPal y ver el historial de tus retiros anteriores.',
      position: 'top',
      forceVisible: true
    },
    {
      target: '[data-tour="centro-ayuda"], a[href="/dashboard/centro-ayuda"]',
      title: 'Centro de Ayuda',
      content: 'Si tienes cualquier duda o necesitas ayuda, nuestro equipo está disponible para asistirte. Usa el chat para comunicarte directamente con nosotros.',
      position: 'right',
      forceVisible: true
    }
  ];

  // Verificar si es la primera visita del usuario - OBLIGATORIO para nuevos usuarios
  useEffect(() => {
    if (!user) return;

    // Verificar si el usuario ya ha visto el tour
    const hasSeenTour = localStorage.getItem(`flasti_hasSeenTour_${user.id}`);

    // SIEMPRE mostrar el tour para nuevos usuarios (sin opción de omitirlo)
    if (!hasSeenTour) {
      console.log('Mostrando tour de onboarding obligatorio para nuevo usuario');
      // Esperar a que la página se cargue completamente
      setTimeout(() => {
        // Asegurarse de que el usuario esté en la parte superior de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsVisible(true);
        updateTooltipPosition();
      }, 1500);
    }
  }, [user]);

  // Prevenir que el usuario cierre el tour con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Bloquear/desbloquear scroll cuando el tour está activo
  useEffect(() => {
    // No bloquear completamente el scroll para permitir ver elementos
    // pero añadir una clase que haga el scroll más suave
    if (isVisible) {
      document.body.classList.add('tour-active');
    } else {
      document.body.classList.remove('tour-active');
    }

    return () => {
      document.body.classList.remove('tour-active');
    };
  }, [isVisible]);

  // Actualizar la posición del tooltip cuando cambia el paso
  useEffect(() => {
    if (isVisible) {
      updateTooltipPosition();
    }
  }, [currentStep, isVisible]);

  // Función para actualizar la posición del tooltip
  const updateTooltipPosition = useCallback(() => {
    if (isScrolling) return; // Evitar actualizaciones durante el scroll

    const step = tourSteps[currentStep];
    let element = document.querySelector(step.target) as HTMLElement;

    // Si no se encuentra el elemento, intentar con selectores alternativos
    if (!element && step.target.includes(',')) {
      const selectors = step.target.split(',').map(s => s.trim());
      for (const selector of selectors) {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) {
          element = el;
          break;
        }
      }
    }

    if (element) {
      setTargetElement(element);

      // Primero, asegurarse de que el elemento esté visible en la pantalla
      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const elementIsInView = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <= viewportWidth
      );

      // Si el elemento no está completamente visible o se fuerza la visibilidad, hacer scroll
      if (!elementIsInView || step.forceVisible) {
        setIsScrolling(true);

        // Determinar la mejor posición de scroll
        let block: ScrollLogicalPosition = 'center';

        if (rect.top < 0) {
          block = 'start';
        } else if (rect.bottom > viewportHeight) {
          block = 'end';
        }

        // Scroll suave hacia el elemento
        try {
          element.scrollIntoView({
            behavior: 'smooth',
            block: block,
            inline: 'nearest'
          });
        } catch (error) {
          console.error('Error al hacer scroll:', error);
          // Fallback para navegadores que no soportan scrollIntoView con opciones
          window.scrollTo({
            top: window.scrollY + rect.top - 100,
            behavior: 'smooth'
          });
        }

        // Esperar a que termine el scroll antes de continuar
        setTimeout(() => {
          // Obtener la nueva posición después del scroll
          const newRect = element.getBoundingClientRect();
          positionTooltip(element, newRect, step.position);
          setIsScrolling(false);
        }, 600);
      } else {
        // El elemento ya está visible, posicionar el tooltip directamente
        positionTooltip(element, rect, step.position);
      }

      // Resaltar el elemento con animación mejorada
      element.classList.add('tour-highlight');

      // Limpiar el resaltado anterior
      document.querySelectorAll('.tour-highlight').forEach(el => {
        if (el !== element) {
          el.classList.remove('tour-highlight');
        }
      });
    } else {
      console.warn(`Elemento no encontrado: ${step.target}`);
      // Si no se encuentra el elemento, mostrar el tooltip en el centro de la pantalla
      const centerTop = window.innerHeight / 2 - 110;
      const centerLeft = window.innerWidth / 2 - 192;
      setTooltipPosition({ top: centerTop, left: centerLeft });
    }
  }, [currentStep, isScrolling, tourSteps]);

  // Función auxiliar para posicionar el tooltip
  const positionTooltip = useCallback((element: HTMLElement, rect: DOMRect, position: string) => {
    const tooltipWidth = Math.min(384, window.innerWidth * 0.9); // Adaptativo para móviles
    const tooltipHeight = 220; // Altura estimada para el contenido más extenso
    const spacing = 25;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Calcular posición inicial según la dirección
    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - spacing;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + spacing;
        break;
    }

    // Ajustar para pantallas pequeñas
    const mobileAdjustment = viewportWidth < 768 ? 10 : 20;

    // Asegurarse de que el tooltip no se salga de la pantalla
    if (left < mobileAdjustment) left = mobileAdjustment;
    if (left + tooltipWidth > viewportWidth - mobileAdjustment) {
      left = viewportWidth - tooltipWidth - mobileAdjustment;
    }
    if (top < mobileAdjustment) top = mobileAdjustment;
    if (top + tooltipHeight > viewportHeight - mobileAdjustment) {
      top = viewportHeight - tooltipHeight - mobileAdjustment;
    }

    // En dispositivos móviles, usar una estrategia diferente para asegurar visibilidad
    if (viewportWidth < 768) {
      // Centrar horizontalmente
      left = (viewportWidth - tooltipWidth) / 2;

      // Determinar si mostrar arriba o abajo del elemento
      // Priorizar mostrar el tooltip donde haya más espacio
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      if (spaceBelow > spaceAbove && spaceBelow > tooltipHeight + spacing) {
        // Hay más espacio abajo y es suficiente
        top = rect.bottom + spacing;
      } else if (spaceAbove > tooltipHeight + spacing) {
        // Hay suficiente espacio arriba
        top = rect.top - tooltipHeight - spacing;
      } else {
        // No hay suficiente espacio ni arriba ni abajo, mostrar en el centro de la pantalla
        // pero asegurándonos de que el elemento resaltado siga visible
        if (rect.top > viewportHeight / 2) {
          // Elemento en la mitad inferior, mostrar tooltip arriba
          top = Math.max(mobileAdjustment, rect.top - tooltipHeight - spacing);
        } else {
          // Elemento en la mitad superior, mostrar tooltip abajo
          top = Math.min(viewportHeight - tooltipHeight - mobileAdjustment, rect.bottom + spacing);
        }
      }
    }

    // Actualizar la posición del tooltip
    setTooltipPosition({ top, left });
  }, []);

  // Función para avanzar al siguiente paso
  const nextStep = useCallback(() => {
    if (isScrolling) return; // Evitar cambios durante el scroll

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentStep, isScrolling, tourSteps.length]);

  // Función para retroceder al paso anterior
  const prevStep = useCallback(() => {
    if (isScrolling) return; // Evitar cambios durante el scroll

    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, isScrolling]);

  // Función para completar el tour
  const completeTour = useCallback(() => {
    if (!user) return;

    // Solo permitir completar el tour si se ha llegado al último paso
    if (currentStep < tourSteps.length - 1) {
      // Mostrar mensaje para animar a completar el tour
      toast.info('Por favor, completa el tour para conocer todas las funcionalidades de la plataforma.');
      return;
    }

    setIsVisible(false);
    // Guardar con el ID del usuario para que sea único por cuenta
    localStorage.setItem(`flasti_hasSeenTour_${user.id}`, 'true');

    // Limpiar todos los resaltados
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });

    // Notificar que el tour ha sido completado
    toast.success('¡Felicidades! Has completado el tour de introducción. Ahora puedes comenzar a usar la plataforma.');
  }, [currentStep, tourSteps.length, user]);

  // Función para intentar cerrar el tour (solo permitido en el último paso)
  const tryCloseTour = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      toast.info('Por favor, completa el tour para conocer todas las funcionalidades de la plataforma.');
      return;
    }
    completeTour();
  }, [completeTour, currentStep, tourSteps.length]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay semi-transparente - No se puede cerrar haciendo clic */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={() => {
          // Solo mostrar mensaje si intentan cerrar antes del último paso
          if (currentStep < tourSteps.length - 1) {
            toast.info('Por favor, completa el tour para conocer todas las funcionalidades de la plataforma.');
          } else {
            completeTour();
          }
        }}
      />

      {/* Botón flotante para móviles que indica el progreso */}
      <div className="fixed top-4 right-4 z-[70] md:hidden">
        <div className="bg-foreground/20 backdrop-blur-md rounded-full p-2 text-white flex items-center gap-2">
          <HelpCircle size={18} />
          <span className="text-sm font-medium">{currentStep + 1}/{tourSteps.length}</span>
        </div>
      </div>

      {/* Indicador de progreso flotante para móviles */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70] md:hidden">
        <div className="bg-foreground/20 backdrop-blur-md rounded-full px-3 py-1.5 text-white flex items-center gap-2">
          <span className="text-xs font-medium">Paso {currentStep + 1} de {tourSteps.length}</span>
        </div>
      </div>

      {/* Tooltip */}
      <div
        className="fixed z-[60] w-96 max-w-[90vw] bg-card/95 backdrop-blur-md rounded-xl border border-primary/20 shadow-xl p-5 animate-fadeInUp"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        {/* Botón de cerrar solo visible en el último paso */}
        {currentStep === tourSteps.length - 1 && (
          <button
            className="absolute top-3 right-3 text-foreground/60 hover:text-foreground transition-colors"
            onClick={completeTour}
          >
            <X size={18} />
          </button>
        )}

        <div className="mb-5">
          <h3 className="text-xl font-bold mb-3 text-gradient">{tourSteps[currentStep].title}</h3>
          <p className="text-foreground/80 leading-relaxed">{tourSteps[currentStep].content}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-foreground/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                className="p-1 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                onClick={prevStep}
                disabled={isScrolling}
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <button
              className="px-3 py-1 rounded-md bg-primary text-white text-sm font-medium flex items-center gap-1"
              onClick={nextStep}
              disabled={isScrolling}
            >
              {currentStep < tourSteps.length - 1 ? 'Siguiente' : 'Finalizar'}
              {currentStep < tourSteps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Estilos para el resaltado y comportamiento del tour */}
      <style jsx global>{`
        /* Clase para el body cuando el tour está activo */
        body.tour-active {
          scroll-behavior: smooth;
          overflow-x: hidden; /* Prevenir scroll horizontal */
        }

        /* Indicador flotante para móviles que muestra que hay que hacer scroll */
        @media (max-width: 768px) {
          .tour-active::after {
            content: '';
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background-color: rgba(147, 51, 234, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            animation: bounce 2s infinite;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        }

        /* Estilos para el elemento resaltado - Más visible y llamativo */
        .tour-highlight {
          position: relative;
          z-index: 55;
          box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.7), 0 0 0 8px rgba(147, 51, 234, 0.3);
          border-radius: 8px;
          animation: pulse 2s infinite;
          transition: all 0.3s ease-out;
          pointer-events: auto !important;
        }

        /* Asegurar que los elementos resaltados sean clickeables */
        .tour-highlight * {
          pointer-events: auto !important;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.7), 0 0 0 8px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(147, 51, 234, 0.7), 0 0 0 16px rgba(147, 51, 234, 0.2);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.7), 0 0 0 8px rgba(147, 51, 234, 0.3);
          }
        }

        /* Efecto de oscurecimiento para el resto de la pantalla */
        .tour-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: rgba(147, 51, 234, 0.1);
          border-radius: 12px;
          z-index: -1;
        }

        /* Mejorar visibilidad en modo oscuro */
        .dark .tour-highlight {
          box-shadow: 0 0 0 4px rgba(167, 91, 254, 0.8), 0 0 0 8px rgba(167, 91, 254, 0.4);
        }

        .dark .tour-highlight::before {
          background: rgba(167, 91, 254, 0.15);
        }

        @keyframes pulse-dark {
          0% {
            box-shadow: 0 0 0 4px rgba(167, 91, 254, 0.8), 0 0 0 8px rgba(167, 91, 254, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(167, 91, 254, 0.8), 0 0 0 16px rgba(167, 91, 254, 0.3);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(167, 91, 254, 0.8), 0 0 0 8px rgba(167, 91, 254, 0.4);
          }
        }

        /* Asegurar que el tooltip sea visible y atractivo */
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
