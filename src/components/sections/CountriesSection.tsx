"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CountriesSection = () => {
  const { t, language } = useLanguage();
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Lista de países donde está disponible la plataforma
  const countries = [
    { name: 'Estados Unidos', flag: '🇺🇸', code: 'US' },
    { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
    { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
    { name: 'Perú', flag: '🇵🇪', code: 'PE' },
    { name: 'Rep. Dominicana', flag: '🇩🇴', code: 'DO' },
    { name: 'Bolivia', flag: '🇧🇴', code: 'BO' },
    { name: 'España', flag: '🇪🇸', code: 'ES' },
    { name: 'Venezuela', flag: '🇻🇪', code: 'VE' },
    { name: 'Ecuador', flag: '🇪🇨', code: 'EC' },
    { name: 'Panamá', flag: '🇵🇦', code: 'PA' },
    { name: 'México', flag: '🇲🇽', code: 'MX' },
    { name: 'Guatemala', flag: '🇬🇹', code: 'GT' },
    { name: 'El Salvador', flag: '🇸🇻', code: 'SV' },
    { name: 'Costa Rica', flag: '🇨🇷', code: 'CR' },
    { name: 'Uruguay', flag: '🇺🇾', code: 'UY' },
    { name: 'Chile', flag: '🇨🇱', code: 'CL' },
    { name: 'Puerto Rico', flag: '🇵🇷', code: 'PR' },
    { name: 'Paraguay', flag: '🇵🇾', code: 'PY' },
    { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
  ];

  // Cuadruplicar la lista para un loop perfecto sin saltos
  const duplicatedCountries = [...countries, ...countries, ...countries, ...countries];

  // Detectar dispositivos de baja potencia
  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const isSlowConnection = (navigator as any).connection && 
        ((navigator as any).connection.effectiveType === 'slow-2g' || 
         (navigator as any).connection.effectiveType === '2g');
      const isOldDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      setIsLowPerformance(isMobile || isLowMemory || isSlowConnection || isOldDevice);
    };

    checkPerformance();
  }, []);

  const getCountryName = (country: typeof countries[0]) => {
    if (language === 'en') {
      const englishNames: { [key: string]: string } = {
        'Estados Unidos': 'United States',
        'Argentina': 'Argentina',
        'Colombia': 'Colombia',
        'Perú': 'Peru',
        'Rep. Dominicana': 'Dominican Republic',
        'Bolivia': 'Bolivia',
        'España': 'Spain',
        'Venezuela': 'Venezuela',
        'Ecuador': 'Ecuador',
        'Panamá': 'Panama',
        'México': 'Mexico',
        'Guatemala': 'Guatemala',
        'El Salvador': 'El Salvador',
        'Costa Rica': 'Costa Rica',
        'Uruguay': 'Uruguay',
        'Chile': 'Chile',
        'Puerto Rico': 'Puerto Rico',
        'Paraguay': 'Paraguay',
        'Honduras': 'Honduras',
      };
      return englishNames[country.name] || country.name;
    } else if (language === 'pt-br') {
      const portugueseNames: { [key: string]: string } = {
        'Estados Unidos': 'Estados Unidos',
        'Argentina': 'Argentina',
        'Colombia': 'Colômbia',
        'Perú': 'Peru',
        'Rep. Dominicana': 'Rep. Dominicana',
        'Bolivia': 'Bolívia',
        'España': 'Espanha',
        'Venezuela': 'Venezuela',
        'Ecuador': 'Equador',
        'Panamá': 'Panamá',
        'México': 'México',
        'Guatemala': 'Guatemala',
        'El Salvador': 'El Salvador',
        'Costa Rica': 'Costa Rica',
        'Uruguay': 'Uruguai',
        'Chile': 'Chile',
        'Puerto Rico': 'Porto Rico',
        'Paraguay': 'Paraguai',
        'Honduras': 'Honduras',
      };
      return portugueseNames[country.name] || country.name;
    }
    return country.name;
  };

  return (
    <section className="py-4 bg-[#101010] overflow-hidden">
      <style jsx>{`
        @keyframes scroll-left-smooth {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
          }
        }
        
        @keyframes scroll-left-performance {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        .scroll-container {
          display: flex;
          width: 400%;
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
          animation: ${isLowPerformance ? 'scroll-left-performance' : 'scroll-left-smooth'} 
                     ${isLowPerformance ? '120s' : '90s'} linear infinite;
          transform: translateZ(0);
          animation-fill-mode: none;
        }
        
        .country-item {
          display: flex;
          align-items: center;
          white-space: nowrap;
          margin-right: 2.5rem;
          flex-shrink: 0;
          transform: translateZ(0);
        }
        
        .flag-circle {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
          background: ${isLowPerformance ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
          ${isLowPerformance ? '' : 'backdrop-filter: blur(10px);'}
          transform: translateZ(0);
          overflow: hidden;
        }
        
        .country-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #FFFFFF;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .section-container {
          contain: layout style paint;
          isolation: isolate;
        }
        
        .section-container:hover .scroll-container {
          animation-play-state: paused;
        }
        
        /* Optimizaciones para dispositivos móviles */
        @media (max-width: 768px) {
          .scroll-container {
            animation-duration: ${isLowPerformance ? '60s' : '45s'};
          }
          
          .flag-circle {
            backdrop-filter: none;
            background: rgba(0, 0, 0, 0.08);
          }
          
          .country-item {
            margin-right: 2rem;
          }
          
          .country-name {
            font-size: 0.9rem;
          }
        }
        
        /* Reducir efectos en dispositivos con preferencia de movimiento reducido */
        @media (prefers-reduced-motion: reduce) {
          .scroll-container {
            animation-duration: 150s;
          }
        }
        
        /* Optimizaciones adicionales para dispositivos muy lentos */
        @media (max-width: 480px) {
          .scroll-container {
            animation-duration: ${isLowPerformance ? '70s' : '50s'};
          }
          
          .flag-circle {
            width: 1.4rem;
            height: 1.4rem;
          }
          
          .country-name {
            font-size: 0.85rem;
          }
        }
      `}</style>
      
      <div className="section-container">
        <div className="scroll-container">
          {duplicatedCountries.map((country, index) => (
            <div key={`${country.code}-${index}`} className="country-item">
              <div className="flag-circle">
                <img
                  src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                  alt={country.code}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span className="country-name">
                {getCountryName(country)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountriesSection;