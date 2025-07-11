"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ShieldCheck, Trophy, Lock, CheckSquare, DollarSign, HelpCircle, Briefcase, Sparkles, CreditCard, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getFaqs = (t: any) => [
	{
		icon: <Award className="h-5 w-5" />,
		question: t('faq1Question'),
		answer: t('faq1Answer')
	},
	{
		icon: <Briefcase className="h-5 w-5" />,
		question: t('faq2Question'),
		answer: t('faq2Answer')
	},
	{
		icon: <DollarSign className="h-5 w-5" />,
		question: t('faq3Question'),
		answer: t('faq3Answer')
	},
	{
		icon: <Sparkles className="h-5 w-5" />,
		question: t('faq4Question'),
		answer: t('faq4Answer')
	},
	{
		icon: <CreditCard className="h-5 w-5" />,
		question: t('faq5Question'),
		answer: t('faq5Answer')
	},
	{
		icon: <ShieldCheck className="h-5 w-5" />,
		question: t('faq6Question'),
		answer: t('faq6Answer')
	}
];

// Definir las respuestas para la pregunta de inversión
const inversionAnswerUSD = "Esta plataforma fue creada con el objetivo de cambiar la vida de nuestros miembros, brindándoles una oportunidad real de independencia laboral. Nuestro propósito es llegar a la mayor cantidad de personas posible, transformando la manera en que se trabaja en línea. Y hoy, solo por tiempo limitado, tenemos una oferta especial para ti, para que puedas unirte a Flasti y comenzar a generar ingresos desde ya.\n\n$$$OFERTA_VERDE$$$ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO! $$$FIN_VERDE$$$\n\nValor original: $$$PRECIO_TACHADO$$$ | SOLO POR HOY $$$PRECIO_OFERTA$$$ (el equivalente en tu moneda local se mostrará al finalizar el pago)\n\n¡Paga una sola vez y accede a Flasti de por vida usando PayPal o tu moneda local!\n\n$$$TEXTO_ROJO$$$ EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE $50 USD EN CUALQUIER MOMENTO $$$FIN_ROJO$$$\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n$$$RECUERDA_NEGRITA_SUBRAYADO$$$Recuerda$$$FIN_RECUERDA$$$: Este precio tiene un $$$AMARILLO$$$ 80% de descuento $$$FIN_AMARILLO$$$ y es solo por tiempo limitado. ¡Estás ahorrando $$$AHORRO_VERDE$$$ $40 USD $$$FIN_AHORRO_VERDE$$$ por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n$$$IMPORTANTE_NEGRITA$$$ ⚠️ IMPORTANTE: $$$FIN_IMPORTANTE$$$ El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const inversionAnswerARS = "Esta plataforma fue creada con el objetivo de cambiar la vida de nuestros miembros, brindándoles una oportunidad real de independencia laboral. Nuestro propósito es llegar a la mayor cantidad de personas posible, transformando la manera en que se trabaja en línea. Y hoy, solo por tiempo limitado, tenemos una oferta especial para ti, para que puedas unirte a Flasti y comenzar a generar ingresos desde ya.\n\n$$$OFERTA_VERDE$$$ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO! $$$FIN_VERDE$$$\n\nValor original: $$$PRECIO_TACHADO$$$ | SOLO POR HOY $$$PRECIO_OFERTA$$$\n\n¡Paga una sola vez y accede a Flasti de por vida usando Mercado Pago, tarjeta de débito y crédito, Pago Fácil o Rapipago!\n\n$$$TEXTO_ROJO$$$ EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE AR$ 57.500 EN CUALQUIER MOMENTO $$$FIN_ROJO$$$\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n💡 Recuerda: Este precio tiene un $$$AMARILLO$$$ 80% de descuento $$$FIN_AMARILLO$$$ y es solo por tiempo limitado. ¡Estás ahorrando $$$AHORRO_VERDE$$$ AR$ 46.000 $$$FIN_AHORRO_VERDE$$$ por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const RegistrationFAQSection = React.memo(() => {
	const { language, t } = useLanguage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [isArgentina, setIsArgentina] = useState(false);

	// Detectar si el usuario es de Argentina
	useEffect(() => {
		const detectCountry = async () => { 
			try {
				// Intentar obtener la ubicación del usuario desde localStorage primero
				const savedCountry = localStorage.getItem('userCountry');
				if (savedCountry) {
					setIsArgentina(savedCountry === 'AR');
					return;
				}

				// Si no hay información en localStorage, intentar detectar por IP
				const response = await fetch('https://ipapi.co/json/');
				const data = await response.json();
				const isAR = data.country_code === 'AR';

				// Guardar el resultado en localStorage para futuras visitas
				localStorage.setItem('userCountry', isAR ? 'AR' : 'OTHER');
				setIsArgentina(isAR);
			} catch (error) {
				console.error('Error al detectar país:', error);
				// En caso de error, asumir que no es de Argentina
				setIsArgentina(false);
			}
		};

		if (typeof window !== 'undefined') {
			detectCountry();
		}
	}, []);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	// Utilidad para reemplazar tokens por HTML
	function parseInversionAnswer(answer: string, isArgentina: boolean) {
		return answer
			.replace(/\n/g, '<br/>')
			.replace(/\$\$\$OFERTA_VERDE\$\$\$/g, '<span style="font-weight:bold;color:#22c55e">')
			.replace(/\$\$\$FIN_VERDE\$\$\$/g, '</span>')
			.replace(/\$\$\$PRECIO_TACHADO\$\$\$/g, '<span style="text-decoration:line-through;color:#ef4444">' + (isArgentina ? 'AR$ 57.500' : '$50 USD') + '</span>')
			.replace(/\$\$\$PRECIO_OFERTA\$\$\$/g, '<span style="font-weight:bold;color:#22c55e">' + (isArgentina ? 'AR$ 11.500' : '$10 USD') + '</span>')
			.replace(/\$\$\$TEXTO_ROJO\$\$\$/g, '<span style="color:#ef4444">')
			.replace(/\$\$\$FIN_ROJO\$\$\$/g, '</span>')
			.replace(/\$\$\$AMARILLO\$\$\$/g, '<span style="font-weight:bold;color:#eab308">')
			.replace(/\$\$\$FIN_AMARILLO\$\$\$/g, '</span>')
			.replace(/\$\$\$AHORRO_VERDE\$\$\$/g, '<span style="font-weight:bold;color:#22c55e">')
			.replace(/\$\$\$FIN_AHORRO_VERDE\$\$\$/g, '</span>')
			.replace(/\$\$\$RECUERDA_NEGRITA_SUBRAYADO\$\$\$/g, '<span style="font-weight:bold;text-decoration:underline">')
			.replace(/\$\$\$FIN_RECUERDA\$\$\$/g, '</span>')
			.replace(/\$\$\$IMPORTANTE_NEGRITA\$\$\$/g, '<span style="font-weight:bold">')
			.replace(/\$\$\$FIN_IMPORTANTE\$\$\$/g, '</span>')
			// Limpieza de cualquier token $$$ suelto
			.replace(/\$\$\$[^\s<]*/g, '')
			.replace(/\$\$\$/g, '');
	}

	return (
		<section className="py-16 relative overflow-hidden">
			{/* Elementos decorativos del fondo eliminados para fondo negro puro */}

			<div className="container-custom relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-4 text-white dark:text-white light:text-black title-google-sans">{t('faqTitle')}</h2>
					<p className="text-foreground/70 max-w-2xl mx-auto">
						{t('faqSubtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
					{getFaqs(t).map((faq, index) => (
						<div
							key={index}
							className="bg-[#232323] overflow-hidden relative rounded-xl border border-white/10"
						>
							<button
								className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left"
								onClick={() => toggleFAQ(index)}
							> 
								<div className="flex items-center">
									<div className="w-8 h-8 rounded-full bg-[#232323] flex items-center justify-center mr-3 border border-white/10">
										<div className="text-white transition-all duration-300 group-hover:scale-110">{faq.icon && React.cloneElement(faq.icon, { color: 'white' })}</div>
									</div>
									<span className="font-medium">{faq.question}</span>
								</div>
								<div className="text-[#ec4899]">
									{openIndex === index ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
								</div>
							</button>

							<div
								className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-500 ${
									openIndex === index ? "max-h-none opacity-100" : "max-h-0 opacity-0 overflow-hidden"
								}`}
							>
								<div className="pt-3 pb-6 border-t border-white/10 pl-11 whitespace-pre-line">
									{index === 4 && faq.question === t('faq5Question') ? (
										<span
											dangerouslySetInnerHTML={{
												__html: parseInversionAnswer(isArgentina ? inversionAnswerARS : inversionAnswerUSD, isArgentina)
											}}
										/>
									) : faq.answer}
								</div>
							</div>

							{/* Línea decorativa inferior eliminada para evitar líneas de color en los costados */}
						</div>
					))}
				</div>
			</div>
		</section>
	);
});

export default RegistrationFAQSection;
