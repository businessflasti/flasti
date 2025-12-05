"use client";

import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PremiumServiceCardProps {
  title: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  imageUrlMobile?: string;
  buttonText: string;
  buttonLink: string;
}

export default function PremiumServicesSlider({
  title = 'Servicio Premium',
  description = 'Accede a funciones exclusivas',
  videoUrl,
  imageUrl,
  imageUrlMobile,
  buttonText = 'Explorar',
  buttonLink = '/dashboard/premium/service'
}: PremiumServiceCardProps) {

  return (
    <Card 
      className="relative backdrop-blur-2xl border-0 h-full overflow-hidden rounded-3xl transition-all duration-700"
      style={{ backgroundColor: '#0B0F17', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
    >
      {/* Imagen o Video de fondo */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        onContextMenu={(e) => e.preventDefault()}
      >
        {imageUrl || imageUrlMobile ? (
          <>
            {/* Imagen para escritorio */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="hidden md:block w-full h-full object-cover opacity-40"
                style={{
                  animation: 'slowZoom 25s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
            )}
            {/* Imagen para móvil */}
            {imageUrlMobile && (
              <img
                src={imageUrlMobile}
                alt={title}
                className="md:hidden w-full h-full object-cover opacity-40"
                style={{
                  animation: 'slowZoom 25s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
            )}
          </>
        ) : videoUrl ? (
          <video
            className="w-full h-full object-cover opacity-40"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : null}
        
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes slowZoom {
          0% {
            transform: scale3d(1, 1, 1);
          }
          100% {
            transform: scale3d(1.08, 1.08, 1);
          }
        }
      `}</style>

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Título y descripción */}
        <div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>
            {title}
          </h3>
          <p className="text-sm text-white/70">
            {description}
          </p>
        </div>

        {/* Botón de acción flotante */}
        <div className="flex justify-end">
          <a
            href={buttonLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 font-semibold text-sm transition-all hover:scale-105 shadow-lg"
            style={{ color: 'black' }}
          >
            {buttonText}
            {buttonText === 'Descubre más' ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2929 10.2929L12.7071 14.8787C12.3166 15.2692 11.6834 15.2692 11.2929 14.8787L6.70711 10.2929C6.07714 9.66295 6.52331 8.5 7.41421 8.5H16.5858C17.4767 8.5 17.9229 9.66295 17.2929 10.2929Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            )}
          </a>
        </div>
      </div>
    </Card>
  );
}
