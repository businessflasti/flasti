'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Volume2, VolumeX } from 'lucide-react';

interface Story {
  id: string;
  avatar_url: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  order: number;
}

interface StoriesProps {
  stories: Story[];
}

export default function Stories({ stories }: StoriesProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPauseIndicator, setShowPauseIndicator] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);

  const currentStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;
  const duration = currentStory?.duration || 5000;

  // Avance automático de historias con animación fluida
  useEffect(() => {
    if (selectedStoryIndex === null || isPaused) return;

    // Si es video
    if (currentStory?.media_type === 'video' && videoRef.current) {
      const video = videoRef.current;
      let animationFrameId: number;
      
      const handleVideoEnd = () => {
        handleNext();
      };

      const updateProgress = () => {
        if (video.duration && !video.paused) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          const remaining = Math.ceil(video.duration - video.currentTime);
          setProgress(currentProgress);
          setTimeRemaining(remaining);
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };

      video.addEventListener('ended', handleVideoEnd);
      animationFrameId = requestAnimationFrame(updateProgress);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // Para imágenes, usar requestAnimationFrame para animación fluida
    startTimeRef.current = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / duration) * 100;
      const remaining = Math.ceil((duration - elapsed) / 1000);

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
        setTimeRemaining(remaining);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedStoryIndex, isPaused, duration, currentStory?.media_type]);

  const handleNext = () => {
    if (selectedStoryIndex === null) return;
    
    if (selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (selectedStoryIndex === null) return;
    
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedStoryIndex(null);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 300);
  };

  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
    setProgress(0);
    setTimeRemaining(Math.ceil(stories[index].duration / 1000));
    startTimeRef.current = Date.now();
    setTimeout(() => setIsVisible(true), 10);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    setShowPauseIndicator(true);
    setTimeout(() => setShowPauseIndicator(false), 500);
    
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <>
      {/* Badge elegante con historias - Compacto sin borde */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1a1a1a] shadow-sm">
        {/* Texto "Testimonios" */}
        <span className="text-white/70 text-xs font-medium">Testimonios</span>
        
        {/* Mostrar máximo 3 círculos apilados */}
        <div className="flex items-center -space-x-1.5">
          {stories.slice(0, 3).map((story, index) => (
            <button
              key={story.id}
              onClick={() => openStory(index)}
              className="relative flex-shrink-0 transition-all duration-200 hover:z-10 hover:scale-110 hover:brightness-110"
              style={{ zIndex: 3 - index }}
            >
              <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-green-400 via-emerald-500 to-green-600 transition-all duration-200">
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={story.avatar_url}
                    alt="Story"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Indicador "+33" fijo (no clickeable) */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5">
          <span className="text-white/60 text-[10px] font-semibold leading-none">+33</span>
        </div>
      </div>

      {/* Visor de historias */}
      {currentStory && selectedStoryIndex !== null && (
        <div 
          className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Overlay con gradiente negro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

          {/* Botón cerrar con efecto */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 text-white hover:scale-110 transition-all duration-200 bg-black/30 backdrop-blur-sm rounded-full p-2 hover:bg-black/50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Botón mute/unmute para videos */}
          {currentStory.media_type === 'video' && (
            <button
              onClick={toggleMute}
              className="absolute top-6 right-20 z-50 text-white hover:scale-110 transition-all duration-200 bg-black/30 backdrop-blur-sm rounded-full p-2 hover:bg-black/50"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          )}

          {/* Barra de progreso mejorada */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 px-2">
            <div className="h-[3px] bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-white via-white to-white/80 transition-all shadow-lg shadow-white/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Indicador de pausa */}
          {showPauseIndicator && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-full p-6 animate-ping">
                <div className="w-12 h-12 flex items-center justify-center">
                  {isPaused ? (
                    <div className="flex gap-2">
                      <div className="w-2 h-8 bg-white rounded-full" />
                      <div className="w-2 h-8 bg-white rounded-full" />
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Áreas de clic para navegar */}
          <div className="absolute inset-0 flex z-30">
            {/* Área izquierda - anterior */}
            <button
              className="flex-1 cursor-pointer group"
              onClick={handlePrevious}
              onMouseDown={handlePauseToggle}
              onMouseUp={handlePauseToggle}
              onMouseLeave={() => isPaused && handlePauseToggle()}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="w-8 h-8 border-l-2 border-t-2 border-white/50 -rotate-45" />
              </div>
            </button>
            
            {/* Área derecha - siguiente */}
            <button
              className="flex-1 cursor-pointer group"
              onClick={handleNext}
              onMouseDown={handlePauseToggle}
              onMouseUp={handlePauseToggle}
              onMouseLeave={() => isPaused && handlePauseToggle()}
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="w-8 h-8 border-r-2 border-t-2 border-white/50 rotate-45" />
              </div>
            </button>
          </div>

          {/* Media centrado (video o imagen) con animación */}
          <div className={`relative w-full max-w-md h-full flex items-center justify-center transition-all duration-500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {currentStory.media_type === 'video' ? (
              <video
                ref={videoRef}
                src={currentStory.media_url}
                className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                autoPlay
                playsInline
                muted={isMuted}
              />
            ) : (
              <Image
                src={currentStory.media_url}
                alt="Story"
                width={500}
                height={888}
                className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                priority
              />
            )}
          </div>

          {/* Cuenta regresiva */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-white text-lg font-bold bg-black/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
            {timeRemaining}s
          </div>
        </div>
      )}
    </>
  );
}
