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

  // Manejar la selección de carta
  const handleCardClick = (index: number) => {
    if (stage === 'cards') {
      setSelectedCard(index);
      setStage('reveal');

      // Mostrar confeti
      setShowConfetti(true);

      // Después de la animación de revelación, completar
      // Aumentamos considerablemente el tiempo para que la gente pueda leer bien el contenido
      setTimeout(() => {
        setStage('complete');

        // Aplicar una transición suave de desvanecimiento al contenedor del juego
        const gameContainer = document.querySelector('div[class*="fixed inset-0 z-50"]');
        if (gameContainer && gameContainer instanceof HTMLElement) {
          // Agregar una transición suave
          gameContainer.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
          gameContainer.style.opacity = '0';
          gameContainer.style.transform = 'scale(0.95)';

          // Llamar al callback después de que termine la transición
          setTimeout(() => {
            onCardSelected();
          }, 1200); // Esperar a que termine la transición
        } else {
          // Si no se encuentra el contenedor, llamar al callback directamente
          setTimeout(() => {
            onCardSelected();
          }, 1000);
        }
      }, 12000); // Aumentado a 12 segundos para dar mucho más tiempo de lectura
    }
  };

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
              className="w-36 h-56 sm:w-48 sm:h-72 mx-auto relative perspective-1000"
              style={{ rotateY: 0 }}
            >
              {/* Cuerpo principal del sobre vertical */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#9333ea] to-[#ec4899] rounded-xl shadow-lg overflow-hidden">
                {/* Textura de papel */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
                </div>

                {/* Borde del sobre */}
                <div className="absolute inset-0.5 rounded-lg border border-white/20"></div>

                {/* Solapa superior - Se abre hacia arriba */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/4 origin-bottom"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)',
                    backgroundColor: '#a855f7',
                    backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    transformOrigin: 'bottom',
                    zIndex: 30,
                    transform: envelopeOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)',
                    transition: envelopeOpening ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                  }}
                >
                  {/* Textura de la solapa */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
                  </div>
                </div>

                {/* Interior del sobre - Visible cuando se abre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-lg flex flex-col items-center justify-center">
                    {/* Logo de Flasti en la parte inferior del sobre */}
                    <div
                      className="absolute bottom-20 left-0 right-0 flex justify-center"
                      style={{ opacity: 0 }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src="/logo/isotipo.png"
                          alt="Flasti Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Mensaje de felicitaciones en el interior del sobre */}
                    <div
                      className="absolute bottom-6 left-0 right-0 flex flex-col items-center"
                      style={{ opacity: 0 }}
                    >
                      <div className="bg-gradient-to-r from-[#6e8efb]/30 to-[#a777e3]/30 rounded-full px-5 py-1.5 border border-[#a777e3]/40 shadow-lg">
                        <span className="text-white font-medium text-sm">Felicitaciones</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cartas saliendo del sobre cuando se abre - Animación más fluida */}
                {envelopeOpening && (
                  <div
                    className="absolute inset-x-0 top-1/4 flex items-start justify-center z-40"
                    style={{ opacity: 0, y: 0 }}
                  >
                    <div className="flex space-x-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-14 h-20 bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] rounded-md border border-[#3a3a5a] shadow-lg"
                          style={{
                            y: -40,
                            rotate: 0,
                            scale: 0.5,
                            opacity: 0
                          }}
                        >
                          {/* Diseño trasero de la carta */}
                          <div className="w-full h-full rounded-md bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center p-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                              <div className="w-4 h-4 flex items-center justify-center">
                                <img
                                  src="/logo/isotipo.png"
                                  alt="Flasti Logo"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                            <div className="absolute inset-1.5 border border-[#9333ea]/20 rounded-md"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Efectos de brillo y partículas */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Partículas brillantes */}
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
                  <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.3s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-1/4 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cartas */}
        {stage === 'cards' && (
          <div
            className="p-8 rounded-xl relative"
            style={{ opacity: 1 }}
          >
            <div className="flex justify-center items-center gap-2 sm:gap-6">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-20 h-32 sm:w-28 sm:h-40 bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] rounded-lg border-2 border-[#3a3a5a] shadow-lg cursor-pointer relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Diseño trasero de la carta con el estilo original pero colores de Flasti */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                      {/* Logo de Flasti en lugar de la estrella (tamaño reducido) */}
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
              ))}
            </div>
            <div
              className="text-center mt-8"
              style={{ opacity: 1 }}
            >
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
                className="w-40 h-56 sm:w-48 sm:h-64 bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2e] rounded-lg border-2 border-[#3a3a5a] shadow-lg relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Frente de la carta (descuento) con diseño más limpio y compacto */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                  {/* Fondo principal - Gradiente premium */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2b42]"></div>

                  {/* Borde exterior dorado más sutil */}
                  <div className="absolute inset-1 rounded-md border border-[#f0b90b]/30"></div>

                  {/* Contenido de la carta con mejor espaciado y elementos más pequeños */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3">
                    {/* Encabezado de la carta */}
                    <div className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] rounded-full px-4 sm:px-5 py-0.5 mb-2 sm:mb-4 shadow-sm flex justify-center w-20 sm:w-24">
                      <span className="text-white font-medium text-[10px] sm:text-xs">GANASTE</span>
                    </div>

                    {/* Contenido principal */}
                    <div className="text-center mb-2 sm:mb-4">
                      <div className="text-[#f0b90b] font-bold text-4xl sm:text-5xl mb-1">84%</div>
                      <div className="text-white font-medium text-sm sm:text-base mb-2 sm:mb-3">DESCUENTO</div>
                      <div className="bg-gradient-to-r from-[#6e8efb] to-[#a777e3] text-white font-bold py-1 px-3 sm:px-4 rounded-full shadow-sm flex justify-center mx-auto" style={{ width: isArgentina ? 'auto' : '7rem' }}>
                        {isArgentina ? <span className="text-sm sm:text-base">AR$ 9.200</span> : <span className="text-base sm:text-lg">$8 USD</span>}
                      </div>
                    </div>

                    {/* Logo de Flasti en la parte inferior */}
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

                  {/* Imagen de fondo - Logo de Flasti muy sutil */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img
                        src="/logo/isotipo.png"
                        alt="Flasti Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Brillos y efectos */}
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-[#f0b90b]/70 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Trasero de la carta (ya no visible) */}
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#9333ea]/20 to-[#ec4899]/20 flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9333ea]/30 to-[#ec4899]/30 flex items-center justify-center">
                    {/* Logo de Flasti en lugar de la estrella (tamaño reducido) */}
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
              </div>
            </div>

            <div
              className="text-center mt-8"
              style={{ opacity: 1 }}
            >
              <div className="relative">
                {/* Efecto de brillo detrás del texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/0 via-[#f59e0b]/20 to-[#f59e0b]/0 blur-md"></div>

                {/* Mensaje principal */}
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">¡Felicitaciones!</h2>
                <p className="text-white text-lg sm:text-xl font-medium">Has ganado un descuento exclusivo</p>

                {/* Mensaje adicional */}
                <div className="mt-3 sm:mt-4 flex flex-col items-center space-y-2 sm:space-y-3">
                  <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 max-w-xs">
                    <p className="text-[#f59e0b] text-xs sm:text-sm">
                      Este descuento se aplicará automáticamente al continuar
                    </p>
                  </div>

                  {/* Mensaje de espera con animación */}
                  <div
                    className="mt-2"
                    style={{ opacity: 1 }}
                  >
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
    </div>
  );
};

export default CardGame;
