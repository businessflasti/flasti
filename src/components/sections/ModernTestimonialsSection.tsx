"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { Landmark } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { motion } from "framer-motion";
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
  {
    id: 3,
    name: t("testimonial3Name"),
    role: t("testimonial3Role"),
    avatar: "/images/testimonials/profi3.jpg",
    content: t("testimonial3Content"),
    rating: 5,
    paymentMethod: "paypal",
  },
  {
    id: 4,
    name: t("testimonial4Name"),
    role: t("testimonial4Role"),
    avatar: "/images/testimonials/profi4.jpg",
    content: t("testimonial4Content"),
    rating: 5,
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
      <div className="bg-[#232323] p-6 rounded-3xl flex flex-col h-full">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="testimonial-avatar w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden mb-3 relative">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-lg mb-1 text-white">{testimonial.name}</h3>
          
          <div className="flex items-center gap-2 mt-3">
            {testimonial.paymentMethod === 'paypal' && (
              <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-full">
                <PayPalIcon className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-300">PayPal</span>
              </div>
            )}
            {testimonial.paymentMethod === 'bank' && (
              <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full">
                <Landmark className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-300">Transferencia</span>
              </div>
            )}
            {!testimonial.paymentMethod && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                <span className="text-xs text-white/80">Usuario verificado</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow overflow-y-auto testimonial-content max-h-[150px] px-1">
          <p className="text-foreground/80 text-sm leading-relaxed text-center">
            "{testimonial.content}"
          </p>
        </div>

        <div className="flex items-center justify-center mt-4 pt-4 border-t border-white/10 min-h-[40px]">
          {testimonial.paymentMethod && (
            <div className="flex items-center justify-center gap-1 bg-white/10 px-2 py-1 rounded-full">
              <span className="text-xs text-white/80">Usuario verificado</span>
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
      <div className="bg-[#232323] p-8 rounded-3xl flex md:flex-row">
        {/* Lado izquierdo - Información del usuario */}
        <div className="md:w-1/3 flex flex-col items-center justify-center text-center md:border-r md:border-white/10 md:pr-8">
          <div className="testimonial-avatar w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden mb-4 relative">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full object-cover"
            />

          </div>
          <h3 className="font-bold text-xl mb-1 text-white">{testimonial.name}</h3>
          
          <div className="flex items-center gap-2 mb-6">
            {testimonial.paymentMethod === 'paypal' && (
              <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full">
                <PayPalIcon className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-300">PayPal</span>
              </div>
            )}
            {testimonial.paymentMethod === 'bank' && (
              <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                <Landmark className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-300">Transferencia</span>
              </div>
            )}
            {!testimonial.paymentMethod && (
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                <span className="text-xs text-white/80">Usuario verificado</span>
              </div>
            )}
          </div>

        </div>
        
        {/* Lado derecho - Contenido del testimonio */}
        <div className="md:w-2/3 md:pl-8 flex items-center">
          <p className="text-foreground/80 text-base leading-relaxed md:text-left text-center mt-4 md:mt-0">
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
  
  // Desktop carousel - ahora muestra una sola tarjeta
  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });
  
  // Mobile carousel - versión compacta
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
    <section className="py-12 md:py-16 relative overflow-hidden bg-[#FEF9F3]">


      <div className="container-custom relative z-0 max-w-5xl mx-auto px-4">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0E1726' }}>
            Ahora es posible
          </h2>

          <p className="mx-auto text-lg md:text-xl md:max-w-screen-md lg:max-w-full text-center" style={{ color: '#0E1726' }}>
            {t("experienciasUsuarios").replace(/Flasti/g, "flasti").replace(/<[^>]*>/g, '')}
          </p>
        </div>

        {/* Desktop carousel - Una sola tarjeta horizontal */}
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
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-[#232323] border border-white/10 flex items-center justify-center text-white z-0"
            onClick={() => desktopEmblaApi?.scrollPrev()}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-[#232323] border border-white/10 flex items-center justify-center text-white z-0"
            onClick={() => desktopEmblaApi?.scrollNext()}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile carousel - Versión compacta */}
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
            className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-8 rounded-full bg-[#232323] border border-white/10 flex items-center justify-center text-white z-0"
            onClick={() => mobileEmblaApi?.scrollPrev()}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-8 rounded-full bg-[#232323] border border-white/10 flex items-center justify-center text-white z-0"
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
                  ? "bg-[#3C66CD] scale-125 w-8"
                  : "bg-[#232323]"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Rating display */}
        <div className="flex justify-center items-center mt-8">
          <div className="bg-[#232323] px-6 py-3 rounded-full flex items-center gap-3">
            <div className="flex">
              {/* First 4 full stars */}
              {Array.from({ length: 4 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-[#facc15] fill-[#facc15]"
                />
              ))}
              {/* Last star with partial fill to represent 4.9 */}
              <div className="relative overflow-hidden w-5 h-5">
                <div className="absolute left-0 top-0 w-[62%] overflow-hidden">
                  <Star className="h-5 w-5 text-[#facc15] fill-[#facc15]" />
                </div>
                <div className="absolute left-0 top-0 w-full">
                  <Star className="h-5 w-5 text-[#facc15] opacity-30" />
                </div>
              </div>
            </div>
            <span className="text-white font-medium">
              {t("calificacionPromedio")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonialsSection;