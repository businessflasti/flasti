'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function DashboardChatWidget() {
  const pathname = usePathname();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detectar si es una página de ayuda o contacto
  const isHelpPage = pathname === '/dashboard/centro-ayuda' ||
                    pathname?.startsWith('/dashboard/centro-ayuda/') ||
                    pathname === '/dashboard/contacto';

  // Detectar dispositivos de bajo rendimiento al inicio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLowPerf = window.navigator.hardwareConcurrency <= 4 ||
                       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsLowEndDevice(isLowPerf);
    }
  }, []);

  // Configurar el chat cuando se cargue
  useEffect(() => {
    if (!isScriptLoaded || typeof window === 'undefined') return;

    // Esperar a que Tawk.to se cargue completamente
    const checkTawk = setInterval(() => {
      if (window.Tawk_API) {
        clearInterval(checkTawk);

        // Configurar el evento onLoad
        window.Tawk_API.onLoad = function() {
          // Personalizar colores para que coincidan con la plataforma
          if (window.Tawk_API && window.Tawk_API.customize) {
            window.Tawk_API.customize({
              // Colores principales de la plataforma
              primaryColor: '#9333ea', // Color primario (morado)
              secondaryColor: '#ec4899', // Color secundario (rosa)
              backgroundColor: '#1e1e2e', // Fondo oscuro
              foregroundColor: '#ffffff', // Texto claro
            });
          }

          // Maximizar automáticamente el chat solo en páginas de ayuda
          if (isHelpPage && window.Tawk_API.maximize) {
            setTimeout(() => {
              window.Tawk_API.maximize();
            }, 1000);
          }

          // En dispositivos de bajo rendimiento, ocultar el widget por defecto
          if (isLowEndDevice && window.Tawk_API.hideWidget) {
            window.Tawk_API.hideWidget();
          }
        };
      }
    }, 1000); // Aumentar el intervalo para reducir la carga

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(checkTawk);
  }, [isScriptLoaded, isHelpPage, isLowEndDevice]);

  // Función para manejar la carga del script
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  // En dispositivos de bajo rendimiento, cargar el script solo si es necesario
  if (isLowEndDevice && !isHelpPage) {
    return null;
  }

  return (
    <>
      <Script
        id="tawk-script"
        strategy="lazyOnload" // Cambiar a lazyOnload para mejorar el rendimiento
        onLoad={handleScriptLoad}
      >
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script>
    </>
  );
}
