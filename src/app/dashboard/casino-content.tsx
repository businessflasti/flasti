'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Search,
  Filter,
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
    image: '/apps/flasti-images.jpg',
    clicks: '1.2k',
    commission: '$25',
    isNew: true
  },
  {
    id: 2,
    title: 'Flasti AI',
    image: '/apps/flasti-ai.jpg',
    clicks: '950',
    commission: '$30',
    isHot: true
  },
  {
    id: 3,
    title: 'Flasti Video',
    image: '/apps/flasti-video.jpg',
    clicks: '750',
    commission: '$20'
  },
  {
    id: 4,
    title: 'Flasti Audio',
    image: '/apps/flasti-audio.jpg',
    clicks: '500',
    commission: '$15'
  },
  {
    id: 5,
    title: 'Flasti PDF',
    image: '/apps/flasti-pdf.jpg',
    clicks: '320',
    commission: '$18',
    isNew: true
  },
  {
    id: 6,
    title: 'Flasti Chat',
    image: '/apps/flasti-chat.jpg',
    clicks: '280',
    commission: '$22',
    isHot: true
  },
];

// Promociones destacadas
const promotions = [
  {
    id: 1,
    title: 'Lucky Promo',
    description: 'Gana comisiones extra por cada referido',
    image: '/promos/promo1.jpg',
    color: '#ec4899',
    icon: <Sparkles size={20} />
  },
  {
    id: 2,
    title: 'Gift of Fortune',
    description: 'Bonos especiales para afiliados nivel 2',
    image: '/promos/promo2.jpg',
    color: '#9333ea',
    icon: <Gift size={20} />
  },
  {
    id: 3,
    title: 'Treasure Hunter',
    description: 'Desbloquea recompensas exclusivas',
    image: '/promos/promo3.jpg',
    color: '#0ea5e9',
    icon: <Zap size={20} />
  }
];

// Filtros para aplicaciones
const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'popular', label: 'Populares' },
  { id: 'new', label: 'Nuevas' },
  { id: 'hot', label: 'Hot' },
  { id: 'recommended', label: 'Recomendadas' },
  { id: 'top', label: 'Top' },
  { id: 'jackpot', label: 'Jackpot' },
  { id: 'big-bonus', label: 'Big Bonus' },
  { id: 'recent', label: 'Recientes' }
];

// Importar componentes existentes
import QuickStats from '@/components/dashboard/QuickStats';
import LevelProgress from '@/components/dashboard/LevelProgress';
import CasinoBalance from './casino-balance';
import CasinoTutor from './casino-tutor';

export default function CasinoContent() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  // Manejar cambio de filtro
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <>
      {/* Bloque de balance */}
      <CasinoBalance />

      {/* Banner principal */}
      <div className="main-banner">
        <div className="banner-content">
          <h1 className="banner-title">WELCOME TO THE FLASTI HUB!</h1>
          <p className="banner-subtitle">Explora las mejores aplicaciones y gana comisiones promocionando productos exclusivos</p>
          <div className="banner-action">
            <Play size={16} />
            <span>Iniciar ahora</span>
          </div>
        </div>
        <div className="banner-image">
          <Image
            src="/dashboard/banner-character.png"
            alt="Personaje Flasti"
            width={200}
            height={250}
            className="float-effect"
          />
        </div>
      </div>

      {/* Bloque de tutora asignada */}
      <CasinoTutor />

      {/* Estadísticas rápidas */}
      <div className="mb-6">
        <QuickStats />
      </div>

      {/* Filtros */}
      <div className="filter-buttons">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => handleFilterChange(filter.id)}
          >
            {filter.label}
          </div>
        ))}
      </div>

      {/* Carrusel de aplicaciones */}
      <div className="apps-carousel">
        <div className="carousel-header">
          <h2 className="carousel-title">Aplicaciones Populares</h2>
          <div className="carousel-nav">
            <div className="carousel-nav-button">
              <ChevronLeft size={20} />
            </div>
            <div className="carousel-nav-button">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>

        <div className="carousel-items">
          {featuredApps.map((app) => (
            <div key={app.id} className="app-card">
              <div
                className="app-card-image"
                style={{
                  backgroundImage: `url(${app.image})`,
                  backgroundColor: '#1E1B2E' // Fallback color
                }}
              >
                {app.isNew && (
                  <div className="badge badge-new absolute top-2 left-2">NEW</div>
                )}
                {app.isHot && (
                  <div className="badge badge-hot absolute top-2 left-2">HOT</div>
                )}
              </div>
              <div className="app-card-content">
                <div className="app-card-title">{app.title}</div>
                <div className="app-card-stats">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>{app.clicks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} />
                    <span>{app.commission}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promociones destacadas */}
      <div className="featured-promos">
        {promotions.map((promo) => (
          <div
            key={promo.id}
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
                <span>Descubrir</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de aplicaciones populares */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Aplicaciones Populares</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar aplicación..."
                className="bg-card/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={16} />
            </div>
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredApps.map((app) => (
            <div key={app.id} className="app-card">
              <div
                className="app-card-image"
                style={{
                  backgroundImage: `url(${app.image})`,
                  backgroundColor: '#1E1B2E' // Fallback color
                }}
              >
                {app.isNew && (
                  <div className="badge badge-new absolute top-2 left-2">NEW</div>
                )}
                {app.isHot && (
                  <div className="badge badge-hot absolute top-2 left-2">HOT</div>
                )}
              </div>
              <div className="app-card-content">
                <div className="app-card-title">{app.title}</div>
                <div className="app-card-stats">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>{app.clicks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} />
                    <span>{app.commission}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso de Nivel */}
      <div className="mb-8">
        <LevelProgress />
      </div>
    </>
  );
}
