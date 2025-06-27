"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';

interface CardGameProps {
  onCardSelected: () => void;
  isArgentina?: boolean;
}

const CardGame: React.FC<CardGameProps> = ({ onCardSelected, isArgentina = false }) => {
  const [stage, setStage] = useState<'envelope' | 'cards' | 'reveal' | 'complete'>('envelope');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configurar las dimensiones para el confeti
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estados para la animación del sobre
  const [envelopeOpening, setEnvelopeOpening] = useState(false);

  // Animación del sobre
  useEffect(() => {
    if (stage === 'envelope') {
      // Iniciar la animación de apertura después de un tiempo
      const openingTimer = setTimeout(() => {
        // Iniciar la animación de rasgado del sobre
        setEnvelopeOpening(true);

        // Cambiar al siguiente estado después de completar la animación
        const nextStageTimer = setTimeout(() => {
          setStage('cards');
        }, 2000); // Tiempo ajustado para la animación del sobre vertical

        return () => clearTimeout(nextStageTimer);
      }, 1000); // Tiempo reducido antes de iniciar la animación

      return () => clearTimeout(openingTimer);
    }
  }, [stage]);

  // --- Estado para animación de carta seleccionada ---
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);

  // Estado para explosión visual
  const [showExplosion, setShowExplosion] = useState(false);

  // --- handleCardClick único y correcto ---
  const handleCardClick = (index: number) => {
    if (stage === 'cards' && animatingCard === null) {
      setAnimatingCard(index);
      setShowExplosion(true);
      setTimeout(() => {
        setShowExplosion(false);
        setSelectedCard(index);
        setStage('reveal');
        setShowConfetti(true);
        setAnimatingCard(null);
        setTimeout(() => {
          setStage('complete');
          const gameContainer = document.querySelector('div[class*="fixed inset-0 z-50"]');
          if (gameContainer && gameContainer instanceof HTMLElement) {
            gameContainer.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
            gameContainer.style.opacity = '0';
            gameContainer.style.transform = 'scale(0.95)';
            setTimeout(() => { onCardSelected(); }, 1200);
          } else {
            setTimeout(() => { onCardSelected(); }, 1000);
          }
        }, 12000);
      }, 900); // Duración de la explosión
    }
  };

  // Estado para flip retardado de la carta grande
  const [showPrizeFlip, setShowPrizeFlip] = useState(false);

  // Efecto para activar el flip tras un pequeño delay al entrar en 'reveal'
  useEffect(() => {
    if (stage === 'reveal') {
      setShowPrizeFlip(false);
      const timer = setTimeout(() => setShowPrizeFlip(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowPrizeFlip(false);
    }
  }, [stage]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm touch-none"
      style={{ overscrollBehavior: 'none' }}
    >
      {showConfetti && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#ec4899', '#9333ea', '#f59e0b', '#22c55e', '#3b82f6']}
        />
      )}

      {/* Botón de cierre (X) eliminado */}

      <div className="relative w-full max-w-md mx-auto px-4 sm:px-0">
        {/* Sobre */}
        {stage === 'envelope' && (
          <div
            className="relative"
          >

            {/* Sobre realista VERTICAL */}
            <div
              className="w-40 h-56 sm:w-52 sm:h-72 mx-auto relative perspective-1000 group" // Ancho intermedio
              style={{ transform: 'rotateY(0deg)' }}
            >
              {/* Cuerpo principal del sobre vertical */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4386c] to-[#3359b6] rounded-xl shadow-lg overflow-hidden z-10">
                {/* Textura de papel mejorada */}
                <div className="absolute inset-0 opacity-15 mix-blend-overlay">
                  <div className="absolute inset-0" style={{ backgroundImage: 'url("/textures/paper-fine.png")', backgroundSize: 'cover' }}></div>
                </div>
                {/* Borde interior sutil */}
                <div className="absolute inset-1 rounded-xl border border-white/10"></div>
                {/* Solapa superior - Se abre hacia arriba */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/4 origin-bottom shadow-xl"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)',
                    backgroundColor: '#d4386c',
                    backgroundImage: 'linear-gradient(135deg, #d4386c 0%, #3359b6 100%)',
                    transformOrigin: 'bottom',
                    zIndex: 30,
                    boxShadow: envelopeOpening ? '0 8px 32px 0 #9333ea55' : '0 2px 8px 0 #9333ea33',
                    filter: envelopeOpening ? 'brightness(1.1) drop-shadow(0 0 12px #f0b90b88)' : 'none',
                    transform: envelopeOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                    transition: envelopeOpening ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s, box-shadow 0.5s' : 'none'
                  }}
                >
                  {/* Brillo animado en la solapa */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/4 top-0 w-1/2 h-full bg-gradient-to-r from-white/30 via-white/0 to-white/30 blur-lg opacity-0 group-hover:opacity-60 animate-flap-shine"></div>
                  </div>
                  {/* Textura de la solapa */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url("/textures/paper-fine.png")', backgroundSize: 'cover' }}></div>
                  </div>
                </div>

                {/* Interior del sobre - Visible cuando se abre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-lg flex flex-col items-center justify-center">
                    {/* Logo de Flasti en la parte inferior del sobre con pulso */}
                    <div
                      className="absolute bottom-20 left-0 right-0 flex justify-center transition-opacity duration-700"
                      style={{ opacity: envelopeOpening ? 1 : 0 }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center animate-logo-pulse">
                        <img
                          src="/logo/isotipo.png"
                          alt="Flasti Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Mensaje de felicitaciones en el interior del sobre */}
                    <div
                      className="absolute bottom-6 left-0 right-0 flex flex-col items-center transition-opacity duration-700"
                      style={{ opacity: envelopeOpening ? 1 : 0 }}
                    >
                      <div className="bg-gradient-to-r from-[#6e8efb]/30 to-[#a777e3]/30 rounded-full px-5 py-1.5 border border-[#a777e3]/40 shadow-lg">
                        <span className="text-white font-medium text-sm">Felicitaciones</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partículas brillantes y destellos extra */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
                  <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.3s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.1s' }}></div>
                  {/* Destellos extra */}
                  <div className="absolute top-2 left-1/2 w-2 h-0.5 bg-white/40 rounded-full blur-sm animate-shine-x"></div>
                  <div className="absolute bottom-2 right-1/3 w-1.5 h-0.5 bg-white/30 rounded-full blur-sm animate-shine-x" style={{ animationDelay: '0.8s' }}></div>
                </div>
              </div>
              {/* Cartas saliendo del sobre cuando se abre - Animación más fluida */}
              {envelopeOpening && (
                <div
                  className="absolute inset-x-0 top-1/4 flex items-start justify-center z-30 animate-fade-in"
                  style={{ opacity: 1, transform: 'translateY(-24px)' }}
                >
                  <div className="flex space-x-3"> {/* Espacio moderado entre cartas */}
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-14 h-20 bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] rounded-md border-2 border-[#3a3a5a] shadow-lg animate-jump relative overflow-hidden"
                        style={{ boxSizing: 'border-box' }}
                      >
                        {/* Diseño trasero de la carta */}
                        <div className="w-full h-full rounded-md bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center p-2 relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <img
                                src="/logo/isotipo.png"
                                alt="Flasti Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          {/* Borde interior sutil, bien contenido */}
                          <div className="absolute inset-1.5 border border-[#9333ea]/20 rounded-md pointer-events-none" style={{boxSizing: 'border-box', zIndex: 1}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Borde animado con brillo */}
              <div className="absolute inset-0.5 rounded-xl border-2 border-white/30 shadow-2xl pointer-events-none animate-border-glow z-40"></div>
            </div>
          </div>
        )}

        {/* Cartas */}
        {stage === 'cards' && (
          <div className="p-8 rounded-xl relative" style={{ opacity: 1 }}>
            <div className="flex justify-center items-center gap-2 sm:gap-6">
              {[0, 1, 2].map((index) => {
                const isAnimating = animatingCard === index;
                const isFading = animatingCard !== null && animatingCard !== index;
                return (
                  <div
                    key={index}
                    className={`w-20 h-32 sm:w-28 sm:h-40 bg-transparent rounded-lg border-2 border-[#3a3a5a] shadow-lg cursor-pointer relative transition-transform duration-200 hover:-translate-y-4 active:scale-95 ${selectedCard === index ? 'z-10' : ''}`}
                    style={{
                      perspective: '1000px',
                      zIndex: isAnimating ? 50 : undefined,
                      transform: isFading ? 'scale(0.8) translateY(40px)' : undefined,
                      opacity: isFading ? 0.3 : 1,
                      transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
                    }}
                    onClick={() => handleCardClick(index)}
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(index); }}
                    aria-label={`Seleccionar carta ${index + 1}`}
                  >
                    {/* Solo mostrar la cara trasera, sin flip */}
                    <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                          <img
                            src="/logo/isotipo.png"
                            alt="Flasti Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-2 border-2 border-[#9333ea]/20 rounded-lg"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8" style={{ opacity: 1 }}>
              <p className="text-white text-lg font-medium">Selecciona una carta</p>
            </div>
          </div>
        )}

        {/* Revelación */}
        {stage === 'reveal' && selectedCard !== null && (
          <div
            className="p-4 sm:p-8 rounded-xl relative"
            style={{ opacity: 1 }}
          >
            <div className="flex justify-center items-center">
              <div
                className="w-40 h-56 sm:w-48 sm:h-64 bg-transparent rounded-lg relative"
                style={{ perspective: '1000px' }}
              >
                <div
                  className={`absolute inset-0 w-full h-full transition-transform duration-500 ${showPrizeFlip ? 'rotate-y-180' : ''} border-2 border-[#3a3a5a] shadow-lg bg-transparent rounded-lg`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Cara trasera */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#d4386c]/20 to-[#3359b6]/20 flex items-center justify-center backface-hidden">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <img
                          src="/logo/isotipo.png"
                          alt="Flasti Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-2 border-2 border-[#9333ea]/20 rounded-lg"></div>
                  </div>
                  {/* Cara delantera */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden backface-hidden rotate-y-180">
                    {/* Fondo principal - Gradiente premium */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2b42]"></div>
                    <div className="absolute inset-1 rounded-md border border-[#f0b90b]/30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3">
                      <div className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] rounded-full px-4 sm:px-5 py-0.5 mb-2 sm:mb-4 shadow-sm flex justify-center w-20 sm:w-24">
                        <span className="text-white font-medium text-[10px] sm:text-xs">GANASTE</span>
                      </div>
                      <div className="text-center mb-2 sm:mb-4">
                        <div className="text-[#f0b90b] font-bold text-4xl sm:text-5xl mb-1">84%</div>
                        <div className="text-white font-medium text-sm sm:text-base mb-2 sm:mb-3">DESCUENTO</div>
                        <div className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] text-white font-bold py-1 px-3 sm:px-4 rounded-full shadow-sm flex justify-center mx-auto" style={{ width: isArgentina ? 'auto' : '7rem' }}>
                          {isArgentina ? <span className="text-sm sm:text-base">AR$ 9.200</span> : <span className="text-base sm:text-lg">$8 USD</span>}
                        </div>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center">
                        <div className="flex items-center">
                          <img
                            src="/logo/isotipo.png"
                            alt="Flasti Logo"
                            className="h-4 sm:h-5 mr-1"
                          />
                          <span className="text-white/80 text-[10px] sm:text-xs font-medium">flasti</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                      <div className="w-24 h-24 flex items-center justify-center">
                        <img
                          src="/logo/isotipo.png"
                          alt="Flasti Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-8" style={{ opacity: 1 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/0 via-[#f59e0b]/20 to-[#f59e0b]/0 blur-md"></div>
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">¡Felicitaciones!</h2>
                <p className="text-white text-lg sm:text-xl font-medium">Has ganado un descuento exclusivo</p>
                <div className="mt-3 sm:mt-4 flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="bg-[#f59e0b]/10 border border-[#f0b90b]/30 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 max-w-xs">
                    <p className="text-[#f0b90b] text-xs sm:text-sm">
                      Este descuento se aplicará automáticamente al continuar
                    </p>
                  </div>
                  <div className="mt-2" style={{ opacity: 1 }}>
                    <p className="text-white/70 text-xs sm:text-sm flex items-center justify-center">
                      <span>Continúa automáticamente en breve</span>
                      <span className="ml-1 sm:ml-2 flex">
                        <span className="animate-pulse mx-0.5">.</span>
                        <span className="animate-pulse mx-0.5" style={{ animationDelay: '0.3s' }}>.</span>
                        <span className="animate-pulse mx-0.5" style={{ animationDelay: '0.6s' }}>.</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Cierre correcto del contenedor principal */}
      {/* Agregar estilos globales para el flip */}
      <style jsx global>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-in;
        }
        @keyframes jump {
          0% { transform: translateY(40px) scale(0.5); opacity: 0; }
          60% { transform: translateY(-10px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-jump {
          animation: jump 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 12px 2px #f0b90b44, 0 0 0 0 #fff0; }
          50% { box-shadow: 0 0 32px 8px #f0b90b99, 0 0 0 0 #fff0; }
        }
        .animate-border-glow {
          animation: border-glow 2.2s infinite;
        }
        @keyframes flap-shine {
          0%, 100% { opacity: 0; }
          40% { opacity: 0.7; }
          60% { opacity: 0.2; }
          80% { opacity: 0.5; }
        }
        .animate-flap-shine {
          animation: flap-shine 2.5s infinite;
        }
        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 #f0b90b00); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 8px #f0b90b88); }
        }
        .animate-logo-pulse {
          animation: logo-pulse 1.8s infinite;
        }
        @keyframes shine-x {
          0% { opacity: 0; transform: translateX(-20px); }
          30% { opacity: 1; }
          60% { opacity: 0.7; }
          100% { opacity: 0; transform: translateX(20px); }
        }
        .animate-shine-x {
          animation: shine-x 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default CardGame;
