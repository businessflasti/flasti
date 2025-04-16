"use client";

import { useState } from "react";
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

const RegistrationFAQSection = () => {
  const { language, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-[#9333ea]/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#ec4899]/10 blur-3xl"></div>
        <div className="absolute top-40 left-[20%] w-3 h-3 rounded-full bg-[#ec4899] animate-pulse"></div>
        <div className="absolute bottom-40 right-[15%] w-2 h-2 rounded-full bg-[#f97316] animate-ping"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-outfit mb-4 text-white dark:text-white light:text-black">{t('faqTitle')}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t('faqSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
          {getFaqs(t).map((faq, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden relative rounded-xl border border-white/10 hover:border-[#ec4899]/30 transition-all hover:shadow-lg hover:shadow-[#ec4899]/5"
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
                  {faq.answer}
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
