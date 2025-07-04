import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdBlockProps {
  adClient: string;
  adSlot: string;
  className?: string;
  alwaysVisible?: boolean;
}

const AdBlock: React.FC<AdBlockProps> = ({ adClient, adSlot, className = "", alwaysVisible = false }) => {
  const { t } = useLanguage();
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [adTried, setAdTried] = useState(false);
  const adInsRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }

    const adCheckTimeout = setTimeout(() => {
      setAdTried(true);
      if (adInsRef.current) {
        const isUnfilled = adInsRef.current.dataset.adStatus === 'unfilled';
        const isEmpty = adInsRef.current.innerHTML.trim() === '' && adInsRef.current.clientHeight === 0;
        if (isUnfilled || isEmpty) {
          setIsAdVisible(false);
        }
      }
    }, 15000); // 15 segundos
    return () => clearTimeout(adCheckTimeout);
  }, []);

  // Si alwaysVisible está activo, el bloque nunca desaparece
  if (!isAdVisible && !alwaysVisible) return null;

  return (
    <div className={`w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col justify-center ${className}`}>
      <div className="w-full overflow-hidden shadow-lg p-0 relative bg-[#141414] rounded-lg border border-[#222] flex flex-col">
        {/* Banda superior para 'Publicidad' */}
        <div className="w-full px-4 py-2 bg-[#141414] rounded-t-lg border-b border-[#222] flex items-center justify-center" style={{minHeight: 32}}>
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold select-none">{t('publicidad')}</span>
        </div>
        {/* Área del anuncio o animación minimalista */}
        <div className="w-full px-4 pb-4 pt-4 flex flex-col items-center min-h-[90px]">
          {isAdVisible ? (
            <>
              <Script
                async
                src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + adClient}
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
              {/* Renderizar <ins> solo si hay anuncios */}
              <ins
                ref={adInsRef}
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center', minHeight: 80, width: '100%' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client={adClient}
                data-ad-slot={adSlot}
              ></ins>
            </>
          ) : (
            adTried && alwaysVisible && (
              <div className="flex flex-col items-center justify-center w-full h-[80px] animate-pulse">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32" className="mb-2 opacity-40">
                  <circle cx="16" cy="16" r="14" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M10 16h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                </svg>
                <span className="text-xs text-muted-foreground/60">No hay anuncios disponibles en este momento</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBlock;
