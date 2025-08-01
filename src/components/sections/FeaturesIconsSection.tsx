"use client";

import { DollarSign, Clock, Laptop, Sparkles } from "lucide-react";

const features = [
	{
		icon: <DollarSign className="h-6 w-6 text-white" />,
		title: "Gana dinero real",
		description: "Genera ingresos todos los días completando tareas sencillas",
	},
	{
		icon: <Clock className="h-6 w-6 text-white" />,
		title: "Horario flexible",
		description: "Trabaja en el momento que prefieras, sin horarios fijos",
	},
	{
		icon: <Laptop className="h-6 w-6 text-white" />,
		title: "Desde tu casa",
		description: "Completa microtrabajos desde la comodidad de tu hogar",
	},
	{
		icon: <Sparkles className="h-6 w-6 text-white" />,
		title: "Sin experiencia previa",
		description: "No necesitas conocimientos técnicos para comenzar",
	},
];

const FeaturesIconsSection = () => {
	return (
		<section className="py-16 relative overflow-hidden">


			<div className="container-custom relative z-10">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">Cómo funciona Flasti</h2>
					<p className="text-foreground/70 max-w-2xl mx-auto">
						Genera ingresos extra completando tareas sencillas con la ayuda de
						nuestra inteligencia artificial
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<div
							key={index}
							className="glass-card p-6 rounded-3xl border border-[#3c66ce]/30 hover:border-[#3c66ce] transition-all hover:shadow-lg hover:shadow-[#3c66ce]/10"
						>
							<div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#9333ea] to-[#3c66ce] flex items-center justify-center mb-4">
								{feature.icon}
							</div>
							<h3 className="text-xl font-bold mb-2">{feature.title}</h3>
							<p className="text-foreground/70 text-sm">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturesIconsSection;
