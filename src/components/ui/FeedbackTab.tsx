import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StarRating from "@/components/ui/StarRating";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const feedbackTexts: Record<string, { button: string; title: string; submit: string; thanks: string }> = {
  es: {
    button: "Feedback",
    title: "¿Cómo fue tu experiencia en la página principal de Flasti?",
    submit: "Enviar",
    thanks: "¡Gracias por tu feedback!"
  },
  en: {
    button: "Feedback",
    title: "How was your experience on Flasti homepage?",
    submit: "Submit",
    thanks: "Thank you for your feedback!"
  },
  "pt-br": {
    button: "Feedback",
    title: "Como foi sua experiência na página inicial da Flasti?",
    submit: "Enviar",
    thanks: "Obrigado pelo seu feedback!"
  }
};

const FeedbackTab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const t = feedbackTexts[language] || feedbackTexts.es;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setRating(0);
    }, 1200);
  };

  return (
    <>
      <button
        className="flex items-center gap-2 bg-[#121212] hover:bg-[#0a0a0a] text-white px-3 py-1.5 rounded-lg shadow-lg transition-all border border-white/10 text-sm"
        style={{ borderRadius: 8 }}
        onClick={() => setOpen(true)}
        aria-label="Feedback"
      >
        <Star className="w-4 h-4" />
        {t.button}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-xs p-6 pt-10 bg-[#121212] text-white border-none shadow-xl rounded-2xl sm:rounded-2xl"
          style={{ background: '#121212', color: '#fff', borderRadius: 18 }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-base font-semibold mb-2">{t.title}</DialogTitle>
          </DialogHeader>
          <StarRating value={rating} onChange={setRating} />
          {!submitted ? (
            <button
              className="mt-5 w-full bg-primary text-white py-2 rounded-lg font-semibold disabled:opacity-60 transition-all"
              disabled={rating === 0}
              onClick={handleSubmit}
            >
              {t.submit}
            </button>
          ) : (
            <div className="mt-5 text-center text-green-500 font-semibold">{t.thanks}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackTab;
