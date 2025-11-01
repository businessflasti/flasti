"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { Landmark } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from 'embla-carousel-react';

const getTestimonials = (t: any) => [
  {
    id: 1,
    name: t("testimonial1Name"),
    role: t("testimonial1Role"),
    avatar: "/images/testimonials/profi1.jpg",
    content: t("testimonial1Content"),
    rating: 5,
    paymentMethod: "paypal",
  },
  {
    id: 2,
    name: t("testimonial2Name"),
    role: t("testimonial2Role"),
    avatar: "/images/testimonials/profi2.jpg",
    content: t("testimonial2Content"),
    rating: 5,
    paymentMethod: "bank",
  },
];

// Tarjeta de testimonio para móvil (compacta)
const MobileTestimonialCard = ({
  testimonial,
}: {
  testimonial: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    paymentMethod?: string;
  };
}) => {
  return (
    <div className="testimonial-card flex-shrink-0 w-full mx-auto h-full">
      <div className="bg-white/[0.03] backdrop-blur-2xl p-6 rounded-3xl flex flex-col h-full border border-white/10 hover:border-white/20 shadow-2xl transition-all duration-700">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="testimonial-avatar w-16 h-16 rounded-full border-[3px] border-yellow-400/30 overflow-hidden mb-3 relative">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-lg mb-1 text-white">{testimonial.name}</h3>
          
          <div className="flex items-center gap-2 mt-3">
            {testimonial.paymentMethod === 'paypal' && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-2 py-0.5 rounded-full">
                <PayPalIcon className="w-3 h-3 text-white" />
                <span className="text-xs text-white">PayPal</span>
              </div>
            )}
            {testimonial.paymentMethod === 'bank' && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-green-600/20 px-2 py-0.5 rounded-full">
                <Landmark className="w-3 h-3 text-white" />
                <span className="text-xs text-white">Transferencia</span>
              </div>
            )}
            {!testimonial.paymentMethod && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-2 py-0.5 rounded-full">
                <span className="text-xs text-white">Usuario verificado</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto testimonial-content max-h-[150px] px-1">
          <p className="text-white/80 text-sm leading-relaxed text-center italic">
            "{testimonial.content}"
          </p>
        </div>

        <div className="flex items-center justify-center mt-4 pt-4 border-t border-yellow-500/20 min-h-[40px]">
          {testimonial.paymentMethod && (
            <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-2 py-1 rounded-full">
              <span className="text-xs text-white">Usuario verificado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tarjeta de testimonio para escritorio (horizontal)
const DesktopTestimonialCard = ({
  testimonial,
}: {
  testimonial: {
    id: number;
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    paymentMethod?: string;
  };
}) => {
  return (
    <div className="testimonial-card flex-shrink-0 w-full mx-auto h-full">
      <div className="bg-white/[0.03] backdrop-blur-2xl p-8 rounded-3xl flex md:flex-row border border-white/10 hover:border-white/20 shadow-2xl transition-all duration-700">
        {/* Lado izquierdo - Información del usuario */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center md:border-r md:border-yellow-500/20 md:pr-8">
          <div className="testimonial-avatar w-24 h-24 rounded-full border-[3px] border-yellow-400/30 overflow-hidden mb-4 relative">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-xl mb-1 text-white">{testimonial.name}</h3>
          
          <div className="flex items-center gap-2 mb-6">
            {testimonial.paymentMethod === 'paypal' && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-2 py-1 rounded-full">
                <PayPalIcon className="w-3 h-3 text-white" />
                <span className="text-xs text-white">PayPal</span>
              </div>
            )}
            {testimonial.paymentMethod === 'bank' && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-green-600/20 px-2 py-1 rounded-full">
                <Landmark className="w-3 h-3 text-white" />
                <span className="text-xs text-white">Transferencia</span>
              </div>
            )}
            {!testimonial.paymentMethod && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-2 py-1 rounded-full">
                <span className="text-xs text-white">Usuario verificado</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Lado derecho - Contenido del testimonio */}
        <div className="md:w-2/3 md:pl-8 flex items-center">
          <p className="text-white/80 text-base leading-relaxed md:text-left text-center mt-4 md:mt-0 italic">
            "{testimonial.content}"
          </p>
        </div>
      </div>
    </div>
  );
};

const ModernTestimonialsSection = () => {
  const { t } = useLanguage();
  const testimonials = getTestimonials(t);
  
  // Desktop carousel
  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  
  // Mobile carousel
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (desktopEmblaApi) desktopEmblaApi.scrollTo(index);
      if (mobileEmblaApi) mobileEmblaApi.scrollTo(index);
    },
    [desktopEmblaApi, mobileEmblaApi]
  );

  const onDesktopSelect = useCallback(() => {
    if (!desktopEmblaApi) return;
    setSelectedIndex(desktopEmblaApi.selectedScrollSnap());
  }, [desktopEmblaApi]);

  const onMobileSelect = useCallback(() => {
    if (!mobileEmblaApi) return;
    setSelectedIndex(mobileEmblaApi.selectedScrollSnap());
  }, [mobileEmblaApi]);

  useEffect(() => {
    if (!desktopEmblaApi) return;
    
    onDesktopSelect();
    setScrollSnaps(desktopEmblaApi.scrollSnapList());
    desktopEmblaApi.on("select", onDesktopSelect);
    
    return () => {
      desktopEmblaApi.off("select", onDesktopSelect);
    };
  }, [desktopEmblaApi, onDesktopSelect]);

  useEffect(() => {
    if (!mobileEmblaApi) return;
    
    onMobileSelect();
    setScrollSnaps(mobileEmblaApi.scrollSnapList());
    mobileEmblaApi.on("select", onMobileSelect);
    
    return () => {
      mobileEmblaApi.off("select", onMobileSelect);
    };
  }, [mobileEmblaApi, onMobileSelect]);

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-[#0B1017]">

      <div className="container-custom relative z-10 max-w-5xl mx-auto px-4">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
            Ahora es posible
          </h2>

          <p className="mx-auto text-lg md:text-xl md:max-w-screen-md lg:max-w-full text-center text-white/70">
            {t("experienciasUsuarios").replace(/Flasti/g, "flasti").replace(/<[^>]*>/g, '')}
          </p>
        </div>

        {/* Desktop carousel */}
        <div className="hidden md:block relative">
          <div className="overflow-hidden" ref={desktopEmblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <DesktopTestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-[#6E40FF]/50 flex items-center justify-center text-white z-10 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#6E40FF]/20"
            onClick={() => desktopEmblaApi?.scrollPrev()}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-[#6E40FF]/50 flex items-center justify-center text-white z-10 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-[#6E40FF]/20"
            onClick={() => desktopEmblaApi?.scrollNext()}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden" ref={mobileEmblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-3">
                  <MobileTestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons for mobile */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white z-10 shadow-lg"
            onClick={() => mobileEmblaApi?.scrollPrev()}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white z-10 shadow-lg"
            onClick={() => mobileEmblaApi?.scrollNext()}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-yellow-400 scale-125 shadow-lg shadow-yellow-400/50"
                  : "bg-yellow-500/30 hover:bg-yellow-500/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Rating display */}
        <div className="flex justify-center items-center mt-8">
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 shadow-xl">
            <div className="flex">
              {Array.from({ length: 4 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
              <div className="relative overflow-hidden w-5 h-5">
                <div className="absolute left-0 top-0 w-[62%] overflow-hidden">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="absolute left-0 top-0 w-full">
                  <Star className="h-5 w-5 text-yellow-400/30" />
                </div>
              </div>
            </div>
            <span className="text-white font-medium">
              {t("calificacionPromedio")}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-github {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-github {
          animation: pulse-github 10s ease-in-out infinite;
        }

        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 5s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ModernTestimonialsSection;
