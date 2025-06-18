'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { YandexMetricaConfig } from '@/types/yandex-metrica';

interface YandexMetricaProps {
  counterId: number;
  config?: YandexMetricaConfig;
}

const YandexMetrica = ({ 
  counterId = 102603584, 
  config = {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true
  }
}: YandexMetricaProps) => {
  
  useEffect(() => {
    // Inicializar Yandex Metrica cuando el script se carga
    const initYandexMetrica = () => {
      if (typeof window !== 'undefined' && window.ym) {
        window.ym(counterId, 'init', config);
      }
    };

    // Si el script ya está cargado, inicializar inmediatamente
    if (typeof window !== 'undefined' && window.ym) {
      initYandexMetrica();
    }
  }, [counterId, config]);

  return (
    <>
      {/* Script principal de Yandex Metrica */}
      <Script
        id="yandex-metrica-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${counterId}, "init", ${JSON.stringify(config)});
          `
        }}
      />
      
      {/* Noscript fallback */}
      <noscript>
        <div>
          <img 
            src={`https://mc.yandex.ru/watch/${counterId}`} 
            style={{ position: 'absolute', left: '-9999px' }} 
            alt="" 
          />
        </div>
      </noscript>
    </>
  );
};

export default YandexMetrica;
