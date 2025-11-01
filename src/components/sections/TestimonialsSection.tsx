"use client";

import React, { useState, useRef, useEffect, TouchEvent } from "react";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Landmark } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const getTestimonials = (t: any) => [
	{
		id: 1,
		name: t("testimonial1Name"),
		avatar: "/images/testimonials/profi1.jpg",
		content: t("testimonial1Content"),
		rating: 5,
		paymentMethod: "paypal",
	},
	{
		id: 2,
		name: t("testimonial2Name"),
		avatar: "/images/testimonials/profi2.jpg",
		content: t("testimonial2Content"),
		rating: 5,
		paymentMethod: "bank",
	},
	{
		id: 3,
		name: t("testimonial3Name"),
		avatar: "/images/testimonials/profi3.jpg",
		content: t("testimonial3Content"),
		rating: 5,
		paymentMethod: "paypal",
	},
	{
		id: 4,
		name: t("testimonial4Name"),
		avatar: "/images/testimonials/profi4.jpg",
		content: t("testimonial4Content"),
		rating: 5,
	},
];

const TestimonialCard = ({
	testimonial,
}: {
	testimonial: {
		id: number;
		name: string;
		avatar: string;
		content: string;
		rating: number;
		paymentMethod?: string;
	};
}) => {
	return (
		<Card className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col h-full transition-colors group">
			<div className="flex items-start gap-4 mb-6">
				<div className="flex-shrink-0">
					<div className="w-14 h-14 rounded-3xl overflow-hidden group-hover:scale-110 transition-transform duration-500">
						<img
							src={testimonial.avatar}
							alt={testimonial.name}
							className="w-full h-full object-cover"
						/>
					</div>
				</div>
				<div>
					<h3 className="font-bold text-lg mb-1 text-white">
						{testimonial.name}
					</h3>
					<div className="flex items-center gap-2">
						{testimonial.paymentMethod === 'paypal' && (
							<PayPalIcon className="w-4 h-4 text-blue-400" />
						)}
						{testimonial.paymentMethod === 'bank' && (
							<Landmark className="w-4 h-4 text-green-400" />
						)}
						<span className="text-xs text-foreground/60">
							{testimonial.paymentMethod === 'paypal' ? 'PayPal' : testimonial.paymentMethod === 'bank' ? 'Transferencia' : 'Usuario verificado'}
						</span>
					</div>
				</div>
			</div>

			<div className="flex-grow">
				<p className="text-foreground/80 text-base leading-relaxed">
					"{testimonial.content}"
				</p>
			</div>

			<div className="flex items-center gap-1 mt-6 pt-6">
				{Array.from({ length: testimonial.rating }).map((_, i) => (
					<Star key={i} className="w-4 h-4 text-[#facc15] fill-[#facc15]" />
				))}
			</div>
		</Card>
	);
};

const TestimonialsSection = React.memo(() => {
	const { language, t } = useLanguage();
	const [currentIndex, setCurrentIndex] = useState(0);
	const testimonials = getTestimonials(t);

	// Referencias para el manejo de swipe
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);
	// const isSwiping = useRef(false);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
		);
	};

	// Funciones para manejar eventos táctiles
	const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
		touchStartX.current = e.touches[0].clientX;
		// isSwiping.current = true;
	};

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		// if (!isSwiping.current) return;
		touchEndX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		// if (!isSwiping.current) return;

		const swipeDistance = touchEndX.current - touchStartX.current;
		const minSwipeDistance = 50; // Distancia mínima para considerar un swipe válido

		if (swipeDistance > minSwipeDistance) {
			// Swipe hacia la derecha - testimonio anterior
			prevTestimonial();
		} else if (swipeDistance < -minSwipeDistance) {
			// Swipe hacia la izquierda - siguiente testimonio
			nextTestimonial();
		}

		// Reiniciar valores
		// isSwiping.current = false;
	};

	return (
		<section className="py-16 relative overflow-hidden">
			{/* Elementos decorativos eliminados completamente */}

			<div className="container-custom relative z-10">
				{/* Versión para escritorio */}
				<div className="hidden md:block">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">
								{t('testimonialsTitle', language === 'es' ? 'Ahora es posible' : language === 'en' ? 'Now it’s possible' : 'Agora é possível')}
							</h2>
							<TextGenerateEffect 
								words={t("experienciasUsuarios").replace(/Flasti/g, "flasti").replace(/<[^>]*>/g, '')}
								className="text-foreground/70 mb-6"
							/>
							<div className="flex gap-2 mt-4">
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
								<span className="text-foreground/80 ml-2 hidden sm:inline">
									{t("calificacionPromedio")}
								</span>
								<span className="text-foreground/80 ml-2 sm:hidden">
									{t("calificacion")}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-4">
							{testimonials.map((testimonial, index) => (
								<div 
									key={testimonial.id}
									className={`transform transition-all duration-500 ${
										index === currentIndex 
											? "scale-105 ring-2 ring-white/20"
											: "opacity-70 hover:opacity-100"
									}`}
								>
									<TestimonialCard testimonial={testimonial} />
								</div>
							))}
						</div>

						<div className="flex justify-center items-center gap-8 mt-12">
							<button
								onClick={prevTestimonial}
								className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white hover:bg-[#101010] transition-all hover:scale-110"
								aria-label="Previous testimonial"
							>
								<ChevronLeft className="h-6 w-6" />
							</button>

							<div className="flex justify-center gap-3">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentIndex(index)}
										className={`w-3 h-3 rounded-full transition-all ${
											index === currentIndex
												? "bg-white scale-125 w-12"
												: "bg-[#1a1a1a] hover:bg-white/50"
										}`}
										aria-label={`Go to testimonial ${index + 1}`}
									/>
								))}
							</div>

							<button
								onClick={nextTestimonial}
								className="w-14 h-14 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white hover:bg-[#101010] transition-all hover:scale-110"
								aria-label="Next testimonial"
							>
								<ChevronRight className="h-6 w-6" />
							</button>
						</div>
					</div>
				</div>

				{/* Versión para móvil */}
				<div className="md:hidden">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">
							{t('testimonialsTitle', language === 'es' ? 'Ahora es posible' : language === 'en' ? 'Now it’s possible' : 'Agora é possível')}
						</h2>
						<TextGenerateEffect 
							words={t("experienciasUsuariosMobile").replace(/Flasti/g, "flasti").replace(/<[^>]*>/g, '')}
							className="text-foreground/70 max-w-2xl mx-auto"
						/>
						<div className="flex gap-2 mt-4 justify-center">
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
							<span className="text-foreground/80 ml-2 hidden sm:inline">
								{t("calificacionPromedio")}
							</span>
							<span className="text-foreground/80 ml-2 sm:hidden">
								{t("calificacion")}
							</span>
						</div>
					</div>

					<div className="relative">
						<div
							className="min-h-[350px] cursor-pointer"
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							<TestimonialCard testimonial={testimonials[currentIndex]} />
						</div>

						<div className="flex justify-center mt-4 gap-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentIndex(index)}
									className={`w-3 h-3 rounded-full transition-all ${
										index === currentIndex
											? "bg-white scale-110"
											: "bg-[#1a1a1a]"
									}`}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>

						<button
							onClick={prevTestimonial}
							className="absolute top-12 left-20 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white hover:bg-[#101010] transition-colors"
							aria-label="Previous testimonial"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>

						<button
							onClick={nextTestimonial}
							className="absolute top-12 right-20 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white hover:bg-[#101010] transition-colors"
							aria-label="Next testimonial"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
});

export default TestimonialsSection;
