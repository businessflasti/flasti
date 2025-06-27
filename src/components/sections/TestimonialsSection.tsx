"use client";

import { useState, useRef, useEffect, TouchEvent } from "react";
import { Card } from "@/components/ui/card";
import { Star, User, ChevronLeft, ChevronRight, Landmark } from "lucide-react";
import PayPalIcon from "@/components/icons/PayPalIcon";
import { useLanguage } from "@/contexts/LanguageContext";

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
	testimonial: typeof testimonials[0];
}) => {
	return (
		<Card className="bg-card/30 backdrop-blur-md shadow-xl p-6 rounded-xl border border-white/10 hover:border-[#d4386c]/30 transition-all hover:shadow-lg hover:shadow-[#d4386c]/10">
			<div className="flex flex-col md:flex-row md:items-start md:gap-6">
				<div className="flex flex-col items-center mb-4 md:mb-0 md:flex-shrink-0 md:w-[180px]">
					<div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden mb-3">
						<img
							src={testimonial.avatar}
							alt={testimonial.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="font-bold text-center">
						{testimonial.name}
					</h3>
					<div className="flex justify-center mt-2 items-center">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${
									i < testimonial.rating
										? "text-[#facc15] fill-[#facc15]"
										: "text-foreground/30"
								}`}
							/>
						))}
						{testimonial.id !== 4 && (
							<div className="ml-2 bg-transparent rounded-full p-1 border dark:border-white/10 border-gray-300 flex items-center justify-center w-6 h-6 overflow-hidden">
								{testimonial.paymentMethod === "paypal" ? (
									<div className="flex items-center justify-center pl-0.5">
										<PayPalIcon className="h-3.5 w-3.5 text-white" />
									</div>
								) : (
									<div className="flex items-center justify-center">
										<Landmark className="h-3.5 w-3.5 text-white" />
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="md:flex-grow md:border-l md:border-white/10 md:pl-6">
					<p className="text-foreground/80 text-sm text-center md:text-left italic">
						"{testimonial.content}"
					</p>
				</div>
			</div>
		</Card>
	);
};

const TestimonialsSection = () => {
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
			{/* Elementos decorativos */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/5 blur-3xl"></div>
				<div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#ec4899]/5 blur-3xl"></div>
			</div>

			<div className="container-custom relative z-10">
				{/* Versión para escritorio */}
				<div className="hidden md:block">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<div>
							<h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black">
								{t("loQueSiempre")}
							</h2>
							<p
								className="text-foreground/70 mb-6"
								dangerouslySetInnerHTML={{ __html: t("experienciasUsuarios") }}
							></p>
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

						<div className="relative">
							<div
								className="min-h-[250px] cursor-pointer"
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
												? "bg-[#d4386c] scale-110"
												: "bg-white/20"
										}`}
										aria-label={`Go to testimonial ${index + 1}`}
									/>
								))}
							</div>

							<button
								onClick={prevTestimonial}
								className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/80 transition-colors"
								aria-label="Previous testimonial"
							>
								<ChevronLeft className="h-6 w-6" />
							</button>

							<button
								onClick={nextTestimonial}
								className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/80 transition-colors"
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
							{t("loQueSiempre")}
						</h2>
						<p
							className="text-foreground/70 max-w-2xl mx-auto"
							dangerouslySetInnerHTML={{ __html: t("experienciasUsuariosMobile") }}
						></p>
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
											? "bg-[#d4386c] scale-110"
											: "bg-white/20"
									}`}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>

						<button
							onClick={prevTestimonial}
							className="absolute top-1/3 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/80 transition-colors"
							aria-label="Previous testimonial"
						>
							<ChevronLeft className="h-6 w-6" />
						</button>

						<button
							onClick={nextTestimonial}
							className="absolute top-1/3 -translate-y-1/2 right-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/80 transition-colors"
							aria-label="Next testimonial"
						>
							<ChevronRight className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
