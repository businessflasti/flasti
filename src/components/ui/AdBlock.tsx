import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface AdBlockProps {
  adClient: string;
  adSlot: string;
  className?: string;
}

const AdBlock: React.FC<AdBlockProps> = ({ adClient, adSlot, className = "" }) => {
  const [isAdVisible, setIsAdVisible] = useState(true);
  const adInsRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }

    const adCheckTimeout = setTimeout(() => {
      if (adInsRef.current) {
        const isUnfilled = adInsRef.current.dataset.adStatus === 'unfilled';
        const isEmpty = adInsRef.current.innerHTML.trim() === '' && adInsRef.current.clientHeight === 0;
        if (isUnfilled || isEmpty) {
          setIsAdVisible(false);
        }
      }
    }, 10000); // 10 segundos
    return () => clearTimeout(adCheckTimeout);
  }, []);

  if (!isAdVisible) return null;

  return (
    <div className={`w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-500 flex flex-col justify-center ${className}`}>
      <div className="bg-[#141414] rounded-lg w-full overflow-hidden shadow-lg p-6 pt-8 relative">
        <p className="absolute top-2 right-3 text-[10px] text-muted-foreground/40 uppercase tracking-wider z-10 bg-transparent">
          Publicidad
        </p>
        <Script
          async
          src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + adClient}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ins
          ref={adInsRef}
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center', minHeight: 120 }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        ></ins>
      </div>
    </div>
  );
};

export default AdBlock;
