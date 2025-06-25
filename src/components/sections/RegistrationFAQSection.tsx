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

const inversionAnswerARS = "Esta plataforma fue creada con el objetivo de cambiar la vida de nuestros miembros, brindándoles una oportunidad real de independencia laboral. Nuestro propósito es llegar a la mayor cantidad de personas posible, transformando la manera en que se trabaja en línea. Y hoy, solo por tiempo limitado, tenemos una oferta especial para ti, para que puedas unirte a Flasti y comenzar a generar ingresos desde ya.\n\n$$$OFERTA_VERDE$$$ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO! $$$FIN_VERDE$$$\n\nValor original: $$$PRECIO_TACHADO$$$ | SOLO POR HOY $$$PRECIO_OFERTA$$$\n\n¡Paga una sola vez y accede a Flasti de por vida usando Mercado Pago, tarjeta de débito y crédito, Pago Fácil o Rapipago!\n\n$$$TEXTO_ROJO$$$ EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE AR$ 57.500 EN CUALQUIER MOMENTO $$$FIN_ROJO$$$\n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.\n\n$$$RECUERDA_NEGRITA_SUBRAYADO$$$Recuerda$$$FIN_RECUERDA$$$: Este precio tiene un $$$AMARILLO$$$ 80% de descuento $$$FIN_AMARILLO$$$ y es solo por tiempo limitado. ¡Estás ahorrando $$$AHORRO_VERDE$$$ AR$ 46.000 $$$FIN_AHORRO_VERDE$$$ por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!\n\n$$$IMPORTANTE_NEGRITA$$$ ⚠️ IMPORTANTE: $$$FIN_IMPORTANTE$$$ El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.";

const RegistrationFAQSection = () => {
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

	return (
		<section className="py-16 relative overflow-hidden">
			{/* Elementos decorativos del fondo */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
				<div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
			</div>

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
							className="bg-card/30 backdrop-blur-md shadow-xl overflow-hidden relative rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5"
						>
							<button
								className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left"
								onClick={() => toggleFAQ(index)}
							>
								<div className="flex items-center">
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center mr-3 border border-white/10">
										<div className="text-[#ec4899]">{faq.icon}</div>
									</div>
									<span className="font-medium">{faq.question}</span>
								</div>
								<div className="text-[#ec4899]">
									{openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
								</div>
							</button>

							<div
								className={`px-4 pb-4 pt-0 text-foreground/70 text-sm transition-all duration-500 ${
									openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
								}`}
							>
								<div className="pt-3 pb-6 border-t border-white/10 pl-11 whitespace-pre-line">
									{index === 4 && faq.question === t('faq5Question') ? (
										<React.Fragment key="answer-wrapper">
											{(isArgentina ? inversionAnswerARS : inversionAnswerUSD)
												// Primero procesamos el texto verde de la oferta
												.split('$$$OFERTA_VERDE$$$')
												.map((part, i) => {
													if (i === 0) return part;

													const verdePartes = part.split('$$$FIN_VERDE$$$');
													return (
														<React.Fragment key={`verde-${i}`}>
															<span style={{ fontWeight: 'bold', color: '#22c55e' }}>{verdePartes[0]}</span>
															{
																// Procesamos el precio tachado
																verdePartes[1].split('$$$PRECIO_TACHADO$$$').map((tachPart, j) => {
																	if (j === 0) return tachPart;

																	// Procesamos el precio de oferta
																	const ofertaPartes = tachPart.split('$$$PRECIO_OFERTA$$$');
																	return (
																		<React.Fragment key={`tachado-${j}`}>
																			<span style={{ textDecoration: 'line-through', color: '#ef4444' }}>
																				{isArgentina ? 'AR$ 57.500' : '$50 USD'}
																			</span>
																			{ofertaPartes[0]}
																			<span style={{ fontWeight: 'bold', color: '#22c55e' }}>
																				{isArgentina ? 'AR$ 11.500' : '$10 USD'}
																			</span>
																			{
																				// Procesamos el texto rojo
																				ofertaPartes[1].split('$$$TEXTO_ROJO$$$').map((rojoPart, k) => {
																					if (k === 0) return rojoPart;

																					const rojoFinal = rojoPart.split('$$$FIN_ROJO$$$');

																					// Procesamos el texto amarillo (80% de descuento)
																					const amarilloPartes = rojoFinal[1].split('$$$AMARILLO$$$');
																					const amarilloFinal = amarilloPartes.length > 1 ?
																						amarilloPartes[1].split('$$$FIN_AMARILLO$$$') : ['', ''];

																					// Procesamos el texto verde del ahorro
																					const ahorroPartes = (amarilloPartes.length > 1 ? amarilloFinal[1] : amarilloPartes[0])
																						.split('$$$AHORRO_VERDE$$$');
																					const ahorroFinal = ahorroPartes.length > 1 ?
																						ahorroPartes[1].split('$$$FIN_AHORRO_VERDE$$$') : ['', ''];

																					// Procesamos Recuerda: en negrita y subrayado
																					const recuerdaPartes = amarilloPartes[0].split('$$$RECUERDA_NEGRITA_SUBRAYADO$$$');
																					const recuerdaFinal = recuerdaPartes.length > 1 ?
																						recuerdaPartes[1].split('$$$FIN_RECUERDA$$$') : ['', ''];

																					// Procesamos IMPORTANTE: en negrita
																					const importantePartes = (recuerdaPartes.length > 1 ?
																						(amarilloPartes.length > 1 ?
																							ahorroFinal[1] : recuerdaFinal[1]) :
																						amarilloPartes[0]).split('$$$IMPORTANTE_NEGRITA$$$');
																					const importanteFinal = importantePartes.length > 1 ?
																						importantePartes[1].split('$$$FIN_IMPORTANTE$$$') : ['', ''];

																					return (
																						<React.Fragment key={`rojo-${k}`}>
																							<span style={{ color: '#ef4444' }}>{rojoFinal[0]}</span>
																							{recuerdaPartes[0]}

																							{/* Renderizar Recuerda: en negrita y subrayado */}
																							{recuerdaPartes.length > 1 && (
																								<React.Fragment key="recuerda">
																									<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{recuerdaFinal[0]}</span>

																									{/* Continuar con el texto amarillo */}
																									{amarilloPartes.length > 1 ? (
																										<React.Fragment key="amarillo">
																											{recuerdaFinal[1].split('$$$AMARILLO$$$')[0]}
																											<span style={{ fontWeight: 'bold', color: '#eab308' }}>{amarilloFinal[0]}</span>

																											{/* Continuar con el texto verde del ahorro */}
																											{ahorroPartes[0]}
																											{ahorroPartes.length > 1 && (
																												<React.Fragment key="ahorro">
																													<span style={{ fontWeight: 'bold', color: '#22c55e' }}>{ahorroFinal[0]}</span>

																													{/* Continuar con IMPORTANTE: en negrita */}
																													{importantePartes[0]}
																													{importantePartes.length > 1 && (
																														<React.Fragment key="importante">
																															<span style={{ fontWeight: 'bold' }}>{importanteFinal[0]}</span>
																															{importanteFinal[1]}
																														</React.Fragment>
																													)}
																												</React.Fragment>
																											)}
																										</React.Fragment>
																									) : (
																										<React.Fragment key="no-amarillo">
																											{recuerdaFinal[1]}
																										</React.Fragment>
																									)}
																								</React.Fragment>
																							)}

																							{/* Si no hay Recuerda: pero hay IMPORTANTE: */}
																							{recuerdaPartes.length <= 1 && importantePartes.length > 1 && (
																								<React.Fragment key="solo-importante">
																									{importantePartes[0]}
																									<span style={{ fontWeight: 'bold' }}>{importanteFinal[0]}</span>
																									{importanteFinal[1]}
																								</React.Fragment>
																							)}
																						</React.Fragment>
																					);
																				})
																			}
																		</React.Fragment>
																	);
																})
															}
														</React.Fragment>
													);
												})
											}
										</React.Fragment>
									) : faq.answer}
								</div>
							</div>

							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#ec4899]/30 to-transparent"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default RegistrationFAQSection;
