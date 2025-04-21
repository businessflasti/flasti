'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Sparkles,
  Gift,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Aplicaciones destacadas para el carrusel
const featuredApps = [
  {
    id: 1,
    title: 'Flasti Images',
    image: '/apps/active/images-logo.png',
    clicks: '1.2k',
    price: '$5',
    commission: '$2.50',
    isNew: true,
    isActive: true,
    href: '/dashboard/apps/flasti-images',
    bgColor: '#ec4899'
  },
  {
    id: 2,
    title: 'Flasti AI',
    image: '/apps/active/ia-logo.png',
    clicks: '950',
    price: '$7',
    commission: '$3.50',
    isTop: true,
    isActive: true,
    href: '/dashboard/apps/flasti-ai',
    bgColor: '#9333ea'
  },
  {
    id: 3,
    title: 'Velto',
    image: '/apps/coming-soon/velto-logo.png',
    comingSoon: true,
    bgColor: '#3a86ff'
  },
  {
    id: 4,
    title: 'Flux',
    image: '/apps/coming-soon/flux-logo.png',
    comingSoon: true,
    bgColor: '#8338ec'
  },
  {
    id: 5,
    title: 'Thinkerly',
    image: '/apps/coming-soon/thinkerly-logo.png',
    comingSoon: true,
    bgColor: '#ff006e'
  },
  {
    id: 6,
    title: 'Mindra',
    image: '/apps/coming-soon/mindra-logo.png',
    comingSoon: true,
    bgColor: '#fb5607'
  },
];

// Gamificación y progreso
const promotions = [
  {
    id: 1,
    title: 'Niveles',
    description: 'Sube de nivel y desbloquea beneficios',
    image: '/gamification/levels-bg.jpg',
    color: '#ec4899',
    icon: <Star size={20} />
  },
  {
    id: 2,
    title: 'Logros',
    description: 'Completa misiones y gana recompensas',
    image: '/gamification/achievements-bg.jpg',
    color: '#9333ea',
    icon: <Gift size={20} />
  },
  {
    id: 3,
    title: 'Clasificación',
    description: 'Compite con otros afiliados por premios',
    image: '/gamification/ranking-bg.jpg',
    color: '#0ea5e9',
    icon: <Users size={20} />
  }
];

// Herramientas para afiliados
const affiliateTools = [
  { id: 'earnings-simulator', label: 'Simulador de ganancias', href: '/dashboard/simulador' },
  { id: 'ai-generator', label: 'Generador IA', href: '/dashboard/generador-contenido' },
  { id: 'analysis', label: 'Optimiza tus resultados', href: '/dashboard/analisis' },
  { id: 'goals', label: 'Establece tus metas', href: '/dashboard/objetivos' },
  { id: 'link-editor', label: 'Personaliza tus enlaces', href: '/dashboard/editor-enlaces' }
];

// Importar componentes existentes
import QuickStats from '@/components/dashboard/QuickStats';
import LevelProgress from '@/components/dashboard/LevelProgress';
import CasinoBalance from './casino-balance';
import CasinoTutor from './casino-tutor';

export default function CasinoContent() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Manejar cambio de herramienta
  const handleToolChange = (toolId: string) => {
    setActiveFilter(toolId);
  };

  // Efecto para mostrar un desplazamiento sutil al cargar la página
  useEffect(() => {
    if (carouselRef.current) {
      // Esperar a que se cargue todo y luego hacer un pequeño desplazamiento
      const timer = setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: 60,
            behavior: 'smooth'
          });

          // Volver a la posición inicial después de un momento
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
              });
            }
          }, 1200);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Funciones para el carrusel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = 300; // Cantidad de píxeles a desplazar
    const currentScroll = carouselRef.current.scrollLeft;

    carouselRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Variables para el seguimiento de clics vs. arrastres
  const [clickStartTime, setClickStartTime] = useState<number>(0);
  const [clickStartPosition, setClickStartPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  // Funciones para el deslizamiento táctil
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);

    // Registrar el inicio del clic
    setClickStartTime(Date.now());
    setClickStartPosition({x: e.pageX, y: e.pageY});
    setHasMoved(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);

    // Registrar el inicio del toque
    setClickStartTime(Date.now());
    setClickStartPosition({x: e.touches[0].pageX, y: e.touches[0].pageY});
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;

    // Calcular la distancia movida
    const deltaX = Math.abs(e.pageX - clickStartPosition.x);
    const deltaY = Math.abs(e.pageY - clickStartPosition.y);

    // Si se ha movido más de 5 píxeles, considerar como arrastre
    if (deltaX > 5 || deltaY > 5) {
      setHasMoved(true);
    }

    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplicador para ajustar la velocidad
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;

    // Calcular la distancia movida
    const deltaX = Math.abs(e.touches[0].pageX - clickStartPosition.x);
    const deltaY = Math.abs(e.touches[0].pageY - clickStartPosition.y);

    // Si se ha movido más de 5 píxeles, considerar como arrastre
    if (deltaX > 5 || deltaY > 5) {
      setHasMoved(true);
    }

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* Bloque de balance */}
      <CasinoBalance />

      {/* Bloque de tutora asignada */}
      <CasinoTutor />

      {/* Estadísticas rápidas */}
      <div className="mb-6">
        <QuickStats />
      </div>

      {/* Herramientas para afiliados */}
      <div className="filter-buttons">
        {affiliateTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className={`filter-button ${activeFilter === tool.id ? 'active' : ''}`}
          >
            {tool.label}
          </Link>
        ))}
      </div>

      {/* Carrusel de aplicaciones */}
      <div className="apps-carousel">
        <div className="carousel-header">
          <div className="carousel-title-container">
            <h2 className="carousel-title">Aplicaciones Populares</h2>
            <div className="carousel-nav carousel-nav-mobile">
              <button
                className="carousel-nav-button"
                onClick={() => scrollCarousel('left')}
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft size={18} color="white" />
              </button>
              <button
                className="carousel-nav-button"
                onClick={() => scrollCarousel('right')}
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight size={18} color="white" />
              </button>
            </div>
          </div>
          <div className="carousel-nav carousel-nav-desktop">
            <button
              className="carousel-nav-button"
              onClick={() => scrollCarousel('left')}
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeft size={20} color="white" />
            </button>
            <button
              className="carousel-nav-button"
              onClick={() => scrollCarousel('right')}
              aria-label="Desplazar a la derecha"
            >
              <ChevronRight size={20} color="white" />
            </button>
          </div>
        </div>

        <div
          className={`carousel-items ${isDragging && hasMoved ? 'dragging' : ''}`}
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging && hasMoved ? 'grabbing' : 'pointer' }}
        >
          {featuredApps.map((app) => (
            <div key={app.id} className={`app-card ${app.comingSoon ? 'app-card-coming-soon' : ''}`}>
              {app.isActive ? (
                <Link href={app.href || '#'}>
                  <div
                    className="app-card-image active-app-image"
                    style={{
                      background: app.bgColor ? `linear-gradient(135deg, ${app.bgColor}20, ${app.bgColor}40)` : 'linear-gradient(135deg, rgba(30, 27, 46, 0.8), rgba(30, 27, 46, 0.95))',
                      boxShadow: app.bgColor ? `0 8px 32px ${app.bgColor}30` : 'none',
                      border: app.bgColor ? `1px solid ${app.bgColor}40` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={app.image}
                      alt={app.title}
                      width={70}
                      height={70}
                      className="active-app-logo"
                      style={{ objectFit: 'contain' }}
                    />

                    {app.isNew && (
                      <div className="badge badge-new absolute top-2 left-2">NEW</div>
                    )}
                    {app.isTop && (
                      <div className="badge badge-hot absolute top-2 left-2">TOP</div>
                    )}
                  </div>
                  <div className="app-card-content">
                    <div className="app-card-title">{app.title}</div>
                    <div className="app-card-stats">
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>Precio: {app.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Comisión: {app.commission}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <>
                  <div
                    className="app-card-image coming-soon-image"
                    style={{
                      background: app.bgColor ? `linear-gradient(135deg, ${app.bgColor}20, ${app.bgColor}40)` : 'linear-gradient(135deg, rgba(30, 27, 46, 0.8), rgba(30, 27, 46, 0.95))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      boxShadow: app.bgColor ? `0 8px 32px ${app.bgColor}30` : 'none'
                    }}
                  >
                    <img
                      src={app.image}
                      alt="Flasti Logo"
                      width={70}
                      height={70}
                      className="opacity-80 drop-shadow-md app-logo-image"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="app-card-content">
                    <div className="app-card-title">{app.title}</div>
                    <div className="coming-soon-label">
                      <Clock size={12} />
                      <span>En desarrollo</span>
                    </div>
                    <div className="app-card-stats coming-soon-stats">
                      <div className="flex items-center gap-1 opacity-50">
                        <TrendingUp size={12} />
                        <span>--</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-50">
                        <DollarSign size={12} />
                        <span>--</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gamificación y progreso */}
      <div className="featured-promos">
        {promotions.map((promo) => (
          <Link
            key={promo.id}
            href={promo.title === 'Clasificación' ? '/dashboard/clasificacion' : `/dashboard/${promo.title.toLowerCase()}`}
            className="promo-card"
            style={{
              backgroundImage: `url(${promo.image})`,
              backgroundColor: '#1E1B2E' // Fallback color
            }}
          >
            <div className="promo-card-content">
              <h3 className="promo-card-title">{promo.title}</h3>
              <p className="promo-card-description">{promo.description}</p>
              <div className="promo-card-action">
                {promo.icon}
                <span>Explorar</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Progreso de Nivel */}
      <div className="mb-8">
        <LevelProgress />
      </div>
    </>
  );
}
