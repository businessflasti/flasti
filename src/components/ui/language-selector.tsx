"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";

const LanguageSelector = (props: { mobile?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
    { code: "pt-br", label: "Português" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const flagSrc = (code: string) => {
    switch (code) {
      case "es": return "https://raw.githubusercontent.com/businessflasti/images/03c12e76a6065203aae90f745dc054005efeeb2e/banderas/espana.svg";
      case "en": return "https://raw.githubusercontent.com/businessflasti/images/03c12e76a6065203aae90f745dc054005efeeb2e/banderas/usa.svg";
      case "pt-br": return "https://raw.githubusercontent.com/businessflasti/images/03c12e76a6065203aae90f745dc054005efeeb2e/banderas/brasil.svg";
      default: return "";
    }
  };

  // Forzar minúsculas en el src para evitar problemas en producción
  const safeFlagSrc = (code: string) => flagSrc(code).toLowerCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${props.mobile ? 'block md:hidden' : 'hidden md:block'}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors px-3 py-1.5 rounded-md border border-border/30 shadow-sm backdrop-blur-md font-semibold min-w-[90px] h-8 focus:ring-2 focus:ring-primary/40 focus:outline-none w-full justify-center"
        aria-label="Select language"
        style={{ minWidth: 90, height: 32, background: '#232323' }}
      >
        <Image src={safeFlagSrc(currentLanguage.code)} alt={currentLanguage.label} width={22} height={22} className="rounded-full object-cover" />
        <span className="hidden sm:inline font-medium">{currentLanguage.label}</span>
        <span className="sm:hidden font-medium">{currentLanguage.code === "pt-br" ? "PT" : currentLanguage.code.toUpperCase()}</span>
        <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl border border-border/30 z-50 animate-fade-in" style={{ background: '#232323' }}>
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as "es" | "en" | "pt-br");
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 text-base rounded-lg transition-all font-medium ${lang.code === language ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-primary/5 hover:text-primary"}`}
              >
                <Image src={safeFlagSrc(lang.code)} alt={lang.label} width={22} height={22} className="rounded-full object-cover" />
                <span>{lang.label}</span>
                {lang.code === language && <Check size={16} className="text-primary ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
