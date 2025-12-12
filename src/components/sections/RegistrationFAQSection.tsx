"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Award, Briefcase, DollarSign, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";


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
		<section className="py-16 relative overflow-hidden bg-[#F6F3F3]">

			<div className="container-custom relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
						{t('faqTitle')}
					</h2>
					<p className="max-w-2xl mx-auto text-lg md:text-xl" style={{ color: '#6B7280' }}>
						{t('faqSubtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
					{getFaqs(t).map((faq, index) => (
						<div key={index} className="group">
							<div className="bg-[#FFFFFF] overflow-hidden relative rounded-3xl shadow-2xl">
								
								<button
									className="w-full py-5 px-4 flex items-center justify-between text-left relative z-10"
									onClick={() => toggleFAQ(index)}
								> 
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 flex-shrink-0" style={{ backgroundColor: '#0D50A4' }}>
											<div className="text-white">
												{faq.icon && React.cloneElement(faq.icon, { className: 'h-5 w-5' })}
											</div>
										</div>
										<span className="font-semibold transition-all duration-300 leading-tight" style={{ color: '#111827' }}>
											{faq.question}
										</span>
									</div>
									<div className={`transition-all duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} style={{ color: openIndex === index ? '#0D50A4' : '#6B7280' }}>
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
											<div className="px-4 pb-6 pt-0 text-sm relative z-10" style={{ color: '#6B7280' }}>
												<div className="pt-3 pl-[52px] whitespace-pre-line leading-relaxed" style={{ borderTop: '1px solid #E5E7EB' }}>
													{faq.answer.split(/(entre \$0\.50 USD y \$10 USD)/g).map((part, i) => 
														part.match(/entre \$0\.50 USD y \$10 USD/) ? (
															<strong key={i} className="font-bold" style={{ color: '#111827' }}>{part}</strong>
														) : (
															<React.Fragment key={i}>{part}</React.Fragment>
														)
													)}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
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
