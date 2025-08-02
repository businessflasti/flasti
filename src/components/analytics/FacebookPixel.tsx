"use client";

import { useEffect, useState } from 'react';
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

// Función para detectar si estamos en local o red local
function isLocalOrPrivateNetworkOrExcludedIP() {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  // Hostnames locales y IP pública excluida
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '201.235.207.156' // IP pública excluida
  ) {
    return true;
  }
  // IPs privadas típicas
  if (
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname)
  ) {
    return true;
  }
  return false;
}

const FacebookPixel = ({ pixelId = "738700458549300" }: FacebookPixelProps) => {
  const [shouldLoadPixel, setShouldLoadPixel] = useState(false);

  useEffect(() => {
    if (!isLocalOrPrivateNetworkOrExcludedIP()) {
      setShouldLoadPixel(true);
    }
  }, []);

  useEffect(() => {
    if (shouldLoadPixel && typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', pixelId);
      // PageView se disparará automáticamente con deduplicación desde unifiedTrackingService
      console.log('Facebook Pixel inicializado:', pixelId);
      
      // Disparar PageView con deduplicación
      import('@/lib/unified-tracking-service').then(({ default: unifiedTrackingService }) => {
        unifiedTrackingService.trackPageView();
      });
    }
  }, [pixelId, shouldLoadPixel]);

  if (!shouldLoadPixel) return null;

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
            // PageView se maneja con deduplicación desde unifiedTrackingService
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
