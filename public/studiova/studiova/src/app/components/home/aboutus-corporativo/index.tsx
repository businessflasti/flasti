import React from "react";

const iconStyle = "w-10 h-10 mx-auto mb-3 text-black dark:text-white";
const blockStyle = "bg-[#323232] rounded-xl p-6 flex flex-col items-center text-center";
const iconBlocks = [
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect x="3" y="11" width="18" height="10" rx="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
		),
		title: "Confianza",
		desc: "Relaciones transparentes",
	},
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0 1.41-1.41M6.34 6.34 4.93 4.93" />
				<circle cx="12" cy="12" r="5" />
			</svg>
		),
		title: "Innovación",
		desc: "Mejora constante de la plataforma",
	},
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect x="3" y="11" width="18" height="10" rx="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
		),
		title: "Seguridad",
		desc: "Protección de datos e ingresos",
	},
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
				<path d="M2 12h20" />
			</svg>
		),
		title: "Crecimiento",
		desc: "Plataforma global en expansión",
	},
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 8v4l3 3" />
			</svg>
		),
		title: "Resultados",
		desc: "Beneficios tangibles",
	},
	{
		icon: (
			<svg
				className={iconStyle}
				fill="none"
				stroke="white"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M2 12l10 7 10-7-10-7-10 7Z" />
				<path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
			</svg>
		),
		title: "Oportunidad",
		desc: "Futuro próspero y conectado",
	},
];

export default function AboutUsSection() {
	return (
		<section className="bg-[#F5F8FB] dark:bg-[#000000] py-24 px-4 transition-colors">
			<div className="max-w-4xl mx-auto text-center mb-16">
				<h2 className="text-black dark:text-white text-4xl md:text-5xl font-bold mb-6 font-sans">
					Sobre nosotros
				</h2>
				<p className="text-secondary/70 dark:text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-sans">
					Nacidos de la pasión por empoderar a las personas, diseñamos un ecosistema
					inteligente que simplifica procesos, potencia oportunidades y optimiza la
					generación de ingresos. Nuestra visión va más allá de la tecnología:
					construimos relaciones sostenibles basadas en la confianza, la seguridad y
					la innovación constante, generando resultados tangibles para nuestros
					usuarios. Flasti no es solo una empresa, es una plataforma global en
					crecimiento que impulsa a miles de personas hacia un futuro próspero,
					conectado y lleno de oportunidades.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{iconBlocks.map((block, i) => (
					<div
						key={i}
						className="rounded-xl p-6 flex flex-col items-center text-center bg-[#323232]"
					>
						{block.icon}
						<h3 className="text-white font-bold text-lg mb-1 font-sans">
							{block.title}
						</h3>
						<p className="text-white text-sm font-sans">{block.desc}</p>
					</div>
				))}
			</div>
		</section>
	);
}
