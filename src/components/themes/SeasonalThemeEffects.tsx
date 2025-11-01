'use client';

import { useSeasonalTheme } from '@/hooks/useSeasonalTheme';
import { useEffect } from 'react';

export default function SeasonalThemeEffects() {
  const { activeTheme, loading } = useSeasonalTheme();

  useEffect(() => {
    // Aplicar clase al body para estilos globales
    if (!loading) {
      document.body.className = `theme-${activeTheme}`;
      console.log('🎨 Clase de tema aplicada al body:', `theme-${activeTheme}`);
    }
    
    return () => {
      document.body.className = '';
    };
  }, [activeTheme, loading]);

  // No renderizar nada mientras carga
  if (loading) {
    console.log('🎨 SeasonalThemeEffects: Cargando tema...');
    return null;
  }

  // No renderizar efectos si es tema default
  if (activeTheme === 'default') {
    console.log('🎨 SeasonalThemeEffects: Tema default, sin efectos');
    return null;
  }

  console.log('🎨 SeasonalThemeEffects: Renderizando efectos para tema:', activeTheme);

  return (
    <>
      {/* Efectos de Halloween */}
      {activeTheme === 'halloween' && (
        <>
          {/* Guirnalda de luces de Halloween colgante */}
          <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
            {/* Desktop: Guirnalda completa */}
            <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
              {/* Cable principal con curva */}
              <path
                d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10"
                stroke="#2a2a2a"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              
              {/* Luces colgantes */}
              {[...Array(25)].map((_, i) => {
                const x = (i * 48) + 24;
                const y = 10 + Math.sin(i * 0.5) * 8;
                const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
                const color = colors[i % colors.length];
                
                return (
                  <g key={`light-${i}`}>
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2={y + 15}
                      stroke="#2a2a2a"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <ellipse
                      cx={x}
                      cy={y + 20}
                      rx="4"
                      ry="6"
                      fill={color}
                      opacity="0.9"
                      className="animate-halloween-lights"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        filter: `drop-shadow(0 0 4px ${color})`
                      }}
                    />
                    <ellipse
                      cx={x - 1}
                      cy={y + 18}
                      rx="1.5"
                      ry="2"
                      fill="white"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Mobile: Guirnalda adaptada con cable de borde a borde */}
            <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
              {/* Cable principal con curva que va desde el borde izquierdo hasta el derecho */}
              <path
                d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8"
                stroke="#2a2a2a"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              
              {/* Luces colgantes - Solo 10 para móvil */}
              {[...Array(10)].map((_, i) => {
                const x = (i * 40) + 20;
                const y = 8 + Math.sin(i * 0.5) * 5;
                const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
                const color = colors[i % colors.length];
                
                return (
                  <g key={`light-mobile-${i}`}>
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2={y + 10}
                      stroke="#2a2a2a"
                      strokeWidth="0.8"
                      opacity="0.5"
                    />
                    <ellipse
                      cx={x}
                      cy={y + 14}
                      rx="3"
                      ry="5"
                      fill={color}
                      opacity="0.9"
                      className="animate-halloween-lights"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        filter: `drop-shadow(0 0 3px ${color})`
                      }}
                    />
                    <ellipse
                      cx={x - 0.8}
                      cy={y + 12}
                      rx="1"
                      ry="1.5"
                      fill="white"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </>
      )}

      {/* Efectos de Navidad */}
      {activeTheme === 'christmas' && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {/* Copos de nieve */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`snow-${i}`}
              className="absolute text-white animate-snowfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                fontSize: `${10 + Math.random() * 10}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            >
              ❄️
            </div>
          ))}
          
          {/* Decoraciones navideñas en esquinas */}
          <div className="absolute top-4 left-4 text-4xl animate-bounce-slow">
            🎄
          </div>
          <div className="absolute top-4 right-4 text-4xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
            🎅
          </div>
          <div className="absolute bottom-4 left-4 text-3xl animate-pulse-slow">
            🎁
          </div>
          <div className="absolute bottom-4 right-4 text-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}>
            ⭐
          </div>
          
          {/* Luces navideñas en la parte superior */}
          <div className="absolute top-0 left-0 right-0 flex justify-around py-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={`light-${i}`}
                className="w-2 h-2 rounded-full animate-christmas-lights"
                style={{
                  backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#0000ff'][i % 4],
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes halloween-lights {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1.2);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.85);
            filter: brightness(0.8);
          }
        }

        @keyframes snowfall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes christmas-lights {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Estilos de tema Halloween */
        .theme-halloween {
          --theme-primary: #ff6b00;
          --theme-secondary: #8b00ff;
          --theme-accent: #00ff00;
        }

        /* Estilos de tema Navidad */
        .theme-christmas {
          --theme-primary: #c41e3a;
          --theme-secondary: #0f8b3a;
          --theme-accent: #ffd700;
        }
      `}</style>
    </>
  );
}
