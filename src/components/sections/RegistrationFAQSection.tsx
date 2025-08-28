"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Award, Briefcase, DollarSign, Sparkles } from "lucide-react";
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
	}
];

const RegistrationFAQSection = React.memo(() => {
	const { language, t } = useLanguage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="py-16 relative overflow-hidden bg-[#FEF9F3]">
			<div className="container-custom relative z-10">
				<div className="text-center mb-8">
					<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0E1726' }}>{t('faqTitle')}</h2>
					<p className="max-w-2xl mx-auto text-lg md:text-xl" style={{ color: '#0E1726' }}>
						{t('faqSubtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
					{getFaqs(t).map((faq, index) => (
						<div
							key={index}
							className="bg-[#232323] overflow-hidden relative rounded-3xl border-0"
						>
							<button
								className="w-full pt-6 pb-3 px-4 flex items-center justify-between text-left"
								onClick={() => toggleFAQ(index)}
							> 
								<div className="flex items-center">
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
										<div className="text-[#101010] transition-all duration-300 group-hover:scale-110">{faq.icon && React.cloneElement(faq.icon, { color: '#101010' })}</div>
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
									{faq.answer}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
});

export default RegistrationFAQSection;