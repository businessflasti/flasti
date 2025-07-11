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
  Zap,
  Image as ImageIcon,
  FileText,
  Headphones,
  Lock,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/components/ui/Notification';
import { Skeleton } from '@/components/ui/skeleton';

// Microtrabajos adicionales
const additionalMicroJobs = [
  {
    id: 1,
    title: 'Creá imágenes',
    description: 'Usá nuestra plataforma para generar imágenes únicas.',
    icon: <ImageIcon size={24} />,
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f59e0b20, #f59e0b40)',
    shadowColor: '#f59e0b30',
    borderColor: '#f59e0b40',
    isLocked: true,
  },
  {
    id: 2,
    title: 'Resumí textos en pocos minutos',
    description: 'Leés un contenido y hacés un resumen con tus palabras.',
    icon: <FileText size={24} />,
    color: '#9333ea',
    bgGradient: 'linear-gradient(135deg, #9333ea20, #9333ea40)',
    shadowColor: '#9333ea30',
    borderColor: '#9333ea40',
    isLocked: true,
  },
  {
    id: 3,
    title: 'Convertí audios a texto con un clic',
    description: 'Transforma los audios a texto usando nuestra herramienta de IA',
    icon: <Headphones size={24} />,
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, #22c55e20, #22c55e40)',
    shadowColor: '#22c55e30',
    borderColor: '#22c55e40',
    isLocked: true,
  },
];

// Importar componentes existentes
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

  // Simulación de loading para ejemplo visual
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="w-full px-0">
      {/* Offerwall MyLead Rewards */}
      {user?.id && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6"
        >
          {loading ? (
            <Skeleton className="h-[400px] w-full mb-6" />
          ) : (
            <iframe
              title="Offerwall MyLead Rewards"
              src={`https://offerwall.mylead.global/offerwall/ed3a45f2-5d7d-11f0-a77f-8a5fb7be40ea?player_id=${user.id}`}
              className="w-full h-[700px] rounded-xl border border-[#232323] bg-[#232323]"
              frameBorder="0"
              allow="fullscreen"
              style={{ minHeight: 500 }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}
