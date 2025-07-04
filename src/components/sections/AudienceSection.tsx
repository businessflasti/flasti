"use client";

import { DollarSign, Briefcase } from "lucide-react";

const audiences = [
	{
		icon: <DollarSign className="h-6 w-6 text-white" />,
		title: "Quieres ganar dinero por internet de forma segura",
		description:
			"No sabes qué es la inteligencia artificial, pero quieres empezar a ganar dinero en internet de forma fácil y rápida, sin complicaciones",
	},
	{
		icon: <Briefcase className="h-6 w-6 text-white" />,
		title: "Ya tienes un empleo y buscas un ingreso extra",
		description:
			"Te gustaría encontrar una forma fácil y segura de generar un ingreso extra adicional sin dejar tu trabajo",
	},
];

const AudienceSection = () => {
	return (
		<section className="py-24 relative overflow-hidden">
			{/* Elementos decorativos del fondo */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-[#3c66ce]/10 blur-3xl"></div>
				<div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#facc15]/10 blur-3xl"></div>
				<div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
				<div className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
			</div>

			<div className="container-custom relative z-10">
				<div className="text-center mb-16 max-w-4xl mx-auto hardware-accelerated">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						<span className="text-gradient">
							+500,000 personas
						</span>{" "}
						ya están ganando dinero completando microtrabajos en línea
					</h2>
					<p className="text-2xl font-medium text-foreground/90">
						¡No te quedes afuera!{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ec4899] to-[#9333ea]">
							Flasti
						</span>{" "}
						es para ti, sí:
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
					{audiences.map((audience, index) => (
						<div
							key={index}
							className="glass-card group overflow-hidden relative p-6 rounded-xl border border-[#3c66ce]/30 hover:border-[#3c66ce] transition-all hover:shadow-lg hover:shadow-[#3c66ce]/10"
						>
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#3c66ce]/5 to-transparent"></div>

							<div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3c66ce] to-[#3359b6] flex items-center justify-center mb-5 mx-auto">
								<div className="text-white">{audience.icon}</div>
							</div>

							<h3 className="text-lg font-bold mb-3 text-center group-hover:text-gradient transition-all duration-300">
								{audience.title}
							</h3>

							<p className="text-foreground/70 text-sm text-center">
								{audience.description}
							</p>

							<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default AudienceSection;
