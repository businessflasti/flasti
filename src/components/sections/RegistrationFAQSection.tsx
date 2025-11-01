"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Award, Briefcase, DollarSign, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const getFaqs = (t: any) => [
	{
		icon: <Award className="h-5 w-5" />,
		question: t('faq1Question'),
		answer: t('faq1Answer'),
		color: 'from-yellow-400 to-amber-500'
	},
	{
		icon: <Briefcase className="h-5 w-5" />,
		question: t('faq2Question'),
		answer: t('faq2Answer'),
		color: 'from-blue-400 to-cyan-500'
	},
	{
		icon: <DollarSign className="h-5 w-5" />,
		question: t('faq3Question'),
		answer: t('faq3Answer'),
		color: 'from-green-400 to-emerald-500'
	},
	{
		icon: <Sparkles className="h-5 w-5" />,
		question: t('faq4Question'),
		answer: t('faq4Answer'),
		color: 'from-purple-400 to-fuchsia-500'
	}
];

const RegistrationFAQSection = React.memo(() => {
	const { language, t } = useLanguage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="py-16 relative overflow-hidden bg-[#0B1017]">

			<div className="container-custom relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
						{t('faqTitle')}
					</h2>
					<p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70">
						{t('faqSubtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
					{getFaqs(t).map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group"
						>
							<div className="bg-white/[0.03] backdrop-blur-2xl overflow-hidden relative rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-700 shadow-2xl">
								{/* Efecto neón sutil al hover */}
								<div 
									className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
									style={{ 
										boxShadow: `inset 0 0 60px rgba(110, 64, 255, 0.15), 0 0 40px rgba(110, 64, 255, 0.1)` 
									}}
								></div>
								
								{/* Brillo superior glassmorphism */}
								<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
								
								<button
									className="w-full py-5 px-4 flex items-center justify-between text-left relative z-10"
									onClick={() => toggleFAQ(index)}
								> 
									<div className="flex items-center gap-3">
										<div className={`w-10 h-10 rounded-full bg-gradient-to-br ${faq.color} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
											<div className="text-white">
												{faq.icon && React.cloneElement(faq.icon, { className: 'h-5 w-5' })}
											</div>
										</div>
										<span className="font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
											{faq.question}
										</span>
									</div>
									<div className={`transition-all duration-300 flex-shrink-0 ${openIndex === index ? 'text-[#6E40FF] rotate-180' : 'text-white/60'}`}>
										<ChevronDown size={20} />
									</div>
								</button>

								<AnimatePresence>
									{openIndex === index && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="overflow-hidden"
										>
											<div className="px-4 pb-6 pt-0 text-white/60 text-sm relative z-10">
												<div className="pt-3 border-t border-white/10 pl-[52px] whitespace-pre-line leading-relaxed">
													{faq.answer}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					))}
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
});

export default RegistrationFAQSection;
