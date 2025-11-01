import React, { useState, useEffect } from "react";
import StarRating from "@/components/ui/StarRating";
import { Star, X } from "lucide-react";
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

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setRating(0);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      <button
        className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.05] text-white px-3 py-1.5 rounded-lg shadow-2xl transition-all border border-white/10 hover:border-white/20 text-sm"
        style={{ borderRadius: 8 }}
        onClick={() => setOpen(true)}
        aria-label="Feedback"
      >
        <Star className="w-4 h-4" />
        {t.button}
      </button>

      {/* Custom Modal */}
      {open && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 z-50 animate-in fade-in duration-200"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl text-white border border-white/10 shadow-2xl rounded-2xl p-6 pt-10 relative overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Brillo superior glassmorphism */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-2 top-2 p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title */}
              <div className="mb-6">
                <h2 className="text-center text-base font-semibold">{t.title}</h2>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center mb-6">
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Submit Button or Thanks Message */}
              <div className="relative z-10">
                {!submitted ? (
                  <button
                    className="w-full bg-white/[0.05] hover:bg-white/[0.08] text-white py-2 rounded-lg font-semibold disabled:opacity-60 transition-all"
                    disabled={rating === 0}
                    onClick={handleSubmit}
                  >
                    {t.submit}
                  </button>
                ) : (
                  <div className="text-center text-green-400 font-semibold">{t.thanks}</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FeedbackTab;
