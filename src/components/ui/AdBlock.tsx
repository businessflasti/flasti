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
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
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
    <div className={`w-full max-w-[320px] mx-auto animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col justify-center relative z-50 ${className}`} style={{color: '#fff'}}>
      <div className="w-full overflow-hidden shadow-none p-0 relative bg-[#0A0A0A] rounded-3xl border border-[#30363d] hover:border-[#8b5cf6]/30 transition-all duration-300 flex flex-col group">
        {/* Efecto neón sutil en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6E40FF]/5 via-transparent to-[#2DE2E6]/5 rounded-3xl"></div>
        </div>
        
        {/* Banda superior para 'Publicidad' */}
        <div className="w-full px-4 py-2 rounded-t-3xl border-b border-[#30363d] flex items-center justify-center relative z-10" style={{minHeight: 32, backgroundColor: '#0A0A0A'}}>
          <span className="text-[10px] text-[#8b949e] uppercase tracking-wider font-semibold select-none">{t('publicidad')}</span>
        </div>
        {/* Área del anuncio o animación minimalista */}
        <div className="w-full flex flex-col items-center justify-center p-4 relative z-10" style={{ minHeight: 0 }}>
          {isAdVisible ? (
            <>
              <Script
                async
                src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + adClient}
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
              {/* Contenedor del anuncio con overflow controlado */}
              <div className="w-full max-w-[288px] max-h-[250px] flex justify-center items-center overflow-hidden rounded-xl">
                <ins
                  ref={adInsRef}
                  className="adsbygoogle"
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    width: '288px', 
                    height: '250px', 
                    margin: '0 auto',
                    overflow: 'hidden'
                  }}
                  data-ad-client={adClient}
                  data-ad-slot={adSlot}
                ></ins>
              </div>
            </>
          ) : (
            adTried && alwaysVisible && (
              <div className="flex flex-col items-center justify-center w-full h-[80px] animate-pulse">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32" className="mb-2 opacity-40">
                  <circle cx="16" cy="16" r="14" stroke="#8b949e" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M10 16h12" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                </svg>
                <span className="text-xs text-[#8b949e]">No hay anuncios disponibles en este momento</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBlock;
