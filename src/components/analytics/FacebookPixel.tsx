"use client";

import { useEffect } from 'react';
import Script from 'next/script';

// Declarar tipos para Facebook Pixel
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface FacebookPixelProps {
  pixelId?: string;
}

const FacebookPixel = ({ pixelId = "2198693197269102" }: FacebookPixelProps) => {
  useEffect(() => {
    // Inicializar Facebook Pixel cuando el componente se monta
    if (typeof window !== 'undefined' && window.fbq) {
      // Pixel ya está cargado, solo inicializar
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
      console.log('Facebook Pixel inicializado:', pixelId);
    }
  }, [pixelId]);

  return (
    <>
      {/* Facebook Pixel Code */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      
      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default FacebookPixel;
