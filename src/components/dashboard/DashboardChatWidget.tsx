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

    let checkTawk: NodeJS.Timeout;

    try {
      // Esperar a que Tawk.to se cargue completamente
      checkTawk = setInterval(() => {
        try {
          if (window.Tawk_API) {
            clearInterval(checkTawk);
            console.log('Tawk.to API detectada en el dashboard');

            // Configurar el evento onLoad
            window.Tawk_API.onLoad = function() {
              try {
                console.log('Tawk.to cargado en el dashboard');

                // Personalizar colores para que coincidan con la plataforma
                if (window.Tawk_API && typeof window.Tawk_API.customize === 'function') {
                  try {
                    window.Tawk_API.customize({
                      // Colores principales de la plataforma
                      primaryColor: '#9333ea', // Color primario (morado)
                      secondaryColor: '#ec4899', // Color secundario (rosa)
                      backgroundColor: '#1e1e2e', // Fondo oscuro
                      foregroundColor: '#ffffff', // Texto claro
                    });
                  } catch (customizeError) {
                    console.warn('Error al personalizar Tawk.to:', customizeError);
                  }
                }

                // Maximizar automáticamente el chat solo en páginas de ayuda
                if (isHelpPage && typeof window.Tawk_API.maximize === 'function') {
                  setTimeout(() => {
                    try {
                      window.Tawk_API.maximize();
                    } catch (maximizeError) {
                      console.warn('Error al maximizar el chat de Tawk.to:', maximizeError);
                    }
                  }, 1500); // Aumentar el tiempo para mayor seguridad
                }

                // En dispositivos de bajo rendimiento, ocultar el widget por defecto
                if (isLowEndDevice && typeof window.Tawk_API.hideWidget === 'function') {
                  try {
                    window.Tawk_API.hideWidget();
                  } catch (hideError) {
                    console.warn('Error al ocultar el widget de Tawk.to:', hideError);
                  }
                }
              } catch (onLoadError) {
                console.warn('Error en el evento onLoad de Tawk.to:', onLoadError);
              }
            };
          }
        } catch (checkError) {
          console.warn('Error al verificar Tawk.to API:', checkError);
        }
      }, 1000); // Aumentar el intervalo para reducir la carga
    } catch (error) {
      console.error('Error al configurar el intervalo para Tawk.to:', error);
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      try {
        if (checkTawk) {
          clearInterval(checkTawk);
        }
      } catch (cleanupError) {
        console.warn('Error al limpiar el intervalo de Tawk.to:', cleanupError);
      }
    };
  }, [isScriptLoaded, isHelpPage, isLowEndDevice]);

  // Función para manejar la carga del script
  const handleScriptLoad = () => {
    try {
      console.log('Script de Tawk.to cargado correctamente en el dashboard');
      setIsScriptLoaded(true);
    } catch (error) {
      console.error('Error al manejar la carga del script de Tawk.to:', error);
    }
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
        onError={(error) => {
          console.error('Error al cargar el script de Tawk.to en el dashboard:', error);
        }}
      >
        {`
          try {
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              try {
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6281726e7b967b11798f79e1/1g34qe1tb';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              } catch(e) {
                console.error('Error al insertar el script de Tawk.to:', e);
              }
            })();
          } catch(e) {
            console.error('Error general en la inicialización de Tawk.to:', e);
          }
        `}
      </Script>
    </>
  );
}
