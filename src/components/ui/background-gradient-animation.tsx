"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "60%",
  blendingValue = "multiply",
  children,
  className,
  interactive = false,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detección de rendimiento
  useEffect(() => {
    const checkPerformance = () => {
      // Detectar dispositivos de baja potencia
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const isSlowConnection = (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g';
      
      setIsLowPerformance(isMobile || isLowMemory || isSlowConnection);
    };

    checkPerformance();
  }, []);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    document.body.style.setProperty("--gradient-background-start", gradientBackgroundStart);
    document.body.style.setProperty("--gradient-background-end", gradientBackgroundEnd);
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [isVisible]);

  // Si es dispositivo de baja potencia, mostrar versión simplificada
  if (isLowPerformance) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
          containerClassName
        )}
      >
        <div className={cn("", className)}>{children}</div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3C66CD] opacity-30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#EA4085] opacity-30 rounded-full blur-2xl"></div>
        </div>
      </div>
    );
  }

  // Si no es visible aún, mostrar placeholder
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
          containerClassName
        )}
      >
        <div className={cn("", className)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full w-full relative overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <div className={cn("", className)}>{children}</div>
      <div className="gradients-container h-full w-full blur-md">
        {/* Optimizado a 2 gradientes principales para mejor rendimiento */}
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.5)_0,_rgba(var(--first-color),_0)_70%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[calc(var(--size)*0.8)] h-[calc(var(--size)*0.8)] top-[calc(50%-var(--size)*0.4)] left-[calc(50%-var(--size)*0.4)]`,
            `[transform-origin:center_center]`,
            `animate-first-slow`,
            `opacity-70`
          )}
        ></div>
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.5)_0,_rgba(var(--second-color),_0)_70%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[calc(var(--size)*0.8)] h-[calc(var(--size)*0.8)] top-[calc(50%-var(--size)*0.4)] left-[calc(50%-var(--size)*0.4)]`,
            `[transform-origin:calc(50%-300px)]`,
            `animate-second-slow`,
            `opacity-70`
          )}
        ></div>
      </div>
    </div>
  );
};