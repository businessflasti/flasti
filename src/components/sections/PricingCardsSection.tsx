"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
	{
		name: "Básico",
		price: "29",
		description: "Ideal para pequeñas empresas y startups",
		features: [
			"Acceso a IA básica",
			"5 proyectos activos",
			"10,000 consultas/mes",
			"Soporte por email",
			"Actualizaciones mensuales",
		],
		popular: false,
		buttonText: "Comenzar gratis",
		buttonVariant: "outline",
	},
	{
		name: "Pro",
		price: "79",
		description: "Para empresas en crecimiento con necesidades avanzadas",
		features: [
			"Todo lo del plan Básico",
			"IA avanzada con aprendizaje",
			"20 proyectos activos",
			"50,000 consultas/mes",
			"Soporte prioritario",
			"API personalizada",
			"Actualizaciones semanales",
		],
		popular: true,
		buttonText: "Comenzar ahora",
		buttonVariant: "default",
	},
	{
		name: "Empresarial",
		price: "199",
		description: "Soluciones personalizadas para grandes empresas",
		features: [
			"Todo lo del plan Pro",
			"IA completamente personalizada",
			"Proyectos ilimitados",
			"Consultas ilimitadas",
			"Soporte 24/7",
			"Integración con sistemas existentes",
			"Actualizaciones en tiempo real",
			"Consultor dedicado",
		],
		popular: false,
		buttonText: "Contactar ventas",
		buttonVariant: "outline",
	},
];

const PricingCardsSection = () => {
	return (
		<section id="planes" className="py-20 relative overflow-hidden">
			{/* Elementos decorativos */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#d4386c]/5 blur-3xl"></div>
				<div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-[#3359b6]/5 blur-3xl"></div>
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold mb-4">
						Planes Adaptados a tus Necesidades
					</h2>
					<p className="text-foreground/70 max-w-2xl mx-auto">
						Elige el plan que mejor se adapte a tu empresa y comienza a
						transformar tu negocio con IA
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{plans.map((plan, index) => (
						<div
							key={index}
							className={`glass-card p-8 rounded-3xl border border-[#3c66ce]/30 hover:border-[#3c66ce] transition-all hover:shadow-lg hover:shadow-[#3c66ce]/10 ${
								plan.popular
									? "border-[#3c66ce]/50 shadow-lg shadow-[#3c66ce]/10"
									: "border-white/10"
							} transition-all relative`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#9333ea] to-[#3c66ce] text-white text-xs font-bold py-1 px-4 rounded-full">
									Más popular
								</div>
							)}

							<h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
							<div className="flex items-baseline mb-4">
								<span className="text-4xl font-bold">${plan.price}</span>
								<span className="text-foreground/70 ml-1">/mes</span>
							</div>
							<p className="text-foreground/70 text-sm mb-6">
								{plan.description}
							</p>

							<ul className="space-y-3 mb-8">
								{plan.features.map((feature, i) => (
									<li key={i} className="flex items-start">
										<Check className="h-5 w-5 text-[#3c66ce] mr-2 shrink-0" />
										<span className="text-sm">{feature}</span>
									</li>
								))}
							</ul>

							<Link href="/login" className="block">
								<Button
									className={`w-full ${
										plan.buttonVariant === "default"
											? "glow-effect bg-gradient-to-r from-[#3c66ce] to-[#3359b6] hover:opacity-90 transition-opacity text-white"
											: "border-[#3c66ce]/30 hover:bg-[#3c66ce]/10 transition-colors"
									}`}
								>
									{plan.buttonText}
								</Button>
							</Link>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<p className="text-foreground/60 text-sm">
						¿Necesitas un plan personalizado?{" "}
						<a
							href="/contacto"
							className="text-[#ec4899] hover:underline"
						>
							Contáctanos
						</a>
					</p>
				</div>
			</div>
		</section>
	);
};

export default PricingCardsSection;
