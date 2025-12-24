"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { ExternalLink, DollarSign, Lock, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import PremiumCardOverlay from '@/components/premium/PremiumCardOverlay';
import { supabase } from '@/lib/supabase';
import CompletedTaskOverlay from '@/components/dashboard/CompletedTaskOverlay';

interface CustomOffer {
  id: string;
  title: string;
  description: string;
  amount: number;
  image_url: string;
  task_type: string;
  is_active: boolean;
  position: number;
}

interface TasksListProps {
  variant?: 'dark' | 'light';
}

// Modal de microtarea pendiente - optimizado con memo y portal
const LockedTaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  task: CustomOffer | null;
  nextAvailablePosition: number;
}> = React.memo(({ isOpen, onClose, task, nextAvailablePosition }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen || !task || !mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', willChange: 'opacity' }}
    >
      <div 
        className="relative w-full max-w-md"
        style={{ animation: 'modalIn 0.25s ease-out', willChange: 'transform, opacity' }}
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx global>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulseLight {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.25; }
          }
        `}</style>
        
        {/* Card principal */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Header con gradiente */}
          <div 
            className="relative px-6 pt-8 pb-6 text-center"
            style={{ background: 'linear-gradient(135deg, #0D50A4 0%, #1a6fc9 100%)' }}
          >
            {/* Icono de candado con animación optimizada */}
            <div className="relative inline-flex mb-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', animation: 'pulseLight 2s ease-in-out infinite' }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Microtarea pendiente
            </h2>
            <p className="text-white/80 text-sm">
              Completa las microtareas anteriores para acceder a:
            </p>
          </div>

          {/* Contenido - Info de la tarea */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: '#F3F3F3' }}>
              {/* Imagen de la tarea */}
              {task.image_url ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                  <Image 
                    src={task.image_url} 
                    alt={task.title} 
                    fill 
                    className="object-cover"
                    sizes="64px"
                    priority
                  />
                </div>
              ) : (
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0D50A4' }}
                >
                  <Globe className="w-8 h-8 text-white" />
                </div>
              )}
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 style={{ color: '#111827', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span 
                    className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md"
                    style={{ backgroundColor: '#D1FAE5', color: '#047857' }}
                  >
                    ${task.amount.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Mensaje de progreso */}
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#0D50A4' }}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#374151' }}>
                    <span className="font-semibold">Siguiente paso:</span> Completa la microtarea #{nextAvailablePosition} para continuar avanzando.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <Button
              onClick={onClose}
              className="w-full py-6 text-base font-bold rounded-xl text-white"
              style={{ backgroundColor: '#0D50A4' }}
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Usar portal para renderizar en el body
  return ReactDOM.createPortal(modalContent, document.body);
});

const TasksList: React.FC<TasksListProps> = ({ variant = 'dark' }) => {
  const { user, profile } = useAuth();
  const [customOffers, setCustomOffers] = useState<CustomOffer[]>([]);
  const [completedOfferIds, setCompletedOfferIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  
  // Estado para el modal
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedTask, setSelectedLockedTask] = useState<CustomOffer | null>(null);
  const [nextAvailablePosition, setNextAvailablePosition] = useState(1);
  
  // Obtener estado premium del perfil
  const isPremiumUser = profile?.is_premium || false;

  useEffect(() => {
    if (hasLoaded.current && customOffers.length > 0) {
      setLoading(false);
      return;
    }
    
    const loadOffers = async () => {
      setLoading(true);
      try {
        const { data: offers, error } = await supabase
          .from('custom_offers')
          .select('*')
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (!error && offers) {
          setCustomOffers(offers);
          hasLoaded.current = true;
        }

        if (user) {
          const { data: completions } = await supabase
            .from('custom_offers_completions')
            .select('offer_id')
            .eq('user_id', user.id);

          if (completions) {
            setCompletedOfferIds(completions.map(c => c.offer_id));
          }
        }
      } catch (error) {
        console.error('Error loading offers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, [user]);

  // Calcular la siguiente tarea disponible
  const getNextAvailablePosition = (): number => {
    for (const offer of customOffers) {
      if (!completedOfferIds.includes(offer.id)) {
        return offer.position;
      }
    }
    return customOffers.length + 1;
  };

  // Verificar si puede acceder a una tarea (aplica para TODOS los usuarios)
  const canAccessTask = (offer: CustomOffer): boolean => {
    // Verificar que todas las tareas anteriores estén completadas
    for (const o of customOffers) {
      if (o.position < offer.position && !completedOfferIds.includes(o.id)) {
        return false;
      }
    }
    return true;
  };

  // Manejar click en tarea
  const handleTaskClick = (offer: CustomOffer) => {
    if (canAccessTask(offer)) {
      window.location.href = `/dashboard/task/${offer.id}`;
    } else {
      setSelectedLockedTask(offer);
      setNextAvailablePosition(getNextAvailablePosition());
      setShowLockedModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0, 0, 0, 0.1)', borderTopColor: '#0D50A4' }}></div>
      </div>
    );
  }

  if (customOffers.length === 0) {
    return (
      <Card className="bg-[#F3F3F3] border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">No hay tareas disponibles en este momento</p>
            <p className="text-sm text-gray-500">Las tareas se actualizan periódicamente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Modal de tarea bloqueada */}
      <LockedTaskModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        task={selectedLockedTask}
        nextAvailablePosition={nextAvailablePosition}
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {customOffers.map((offer, index) => {
            const isFirstTask = index === 0;
            const isCompleted = completedOfferIds.includes(offer.id);
            const canAccess = canAccessTask(offer);
            
            // Lógica del overlay premium (para usuarios NO premium en tareas 4+)
            const task3 = customOffers.find(o => o.position === 3);
            const isTask3Completed = task3 ? completedOfferIds.includes(task3.id) : false;
            
            let showPremiumOverlay = false;
            let showUnlockButton = false;
            
            if (!isPremiumUser && offer.position >= 4) {
              showPremiumOverlay = true;
              // Solo la tarea 4 muestra el botón desbloquear (si completó la 3)
              showUnlockButton = offer.position === 4 && isTask3Completed;
            }
            
            // Lógica de secuencia para las primeras 3 tareas
            const isSequenceLocked = !canAccess && offer.position <= 3;
            
            // Las tarjetas 5+ solo son clickeables si la tarea 3 está completada
            const isClickableAfterTask3 = offer.position >= 5 && isTask3Completed;

            // Altura fija para todas las tarjetas
            const cardStyle = { background: '#F3F3F3', height: '300px' };

            if (isCompleted) {
              return (
                <div key={offer.id} className="relative" style={{ height: '300px' }} {...(isFirstTask ? { 'data-tour': 'first-task' } : {})}>
                  <CompletedTaskOverlay amount={offer.amount} imageUrl={offer.image_url}>
                    <Card className="relative border-0 rounded-3xl overflow-hidden" style={cardStyle}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 line-clamp-2 mb-2">{offer.title}</CardTitle>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 inline-flex items-center gap-1">
                              <DollarSign className="w-3 h-3 flex-shrink-0" />
                              <span>{offer.amount.toFixed(2)} USD</span>
                            </Badge>
                          </div>
                          {offer.image_url && (
                            <Image src={offer.image_url} alt={offer.title} width={60} height={60} className="rounded-lg object-cover ml-3" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-600 line-clamp-2 mb-3">{offer.description}</CardDescription>
                        <Button disabled className="w-full text-white opacity-50" style={{ backgroundColor: '#6765F2' }}>
                          <ExternalLink className="w-4 h-4 mr-2" />Completada
                        </Button>
                      </CardContent>
                    </Card>
                  </CompletedTaskOverlay>
                </div>
              );
            }

            // Si debe mostrar overlay premium (tarea 4+ para usuarios no premium)
            // O si es tarea 2 o 3 bloqueada por secuencia
            if (showPremiumOverlay || isSequenceLocked) {
              // TODAS las tarjetas bloqueadas solo son clickeables después de completar tarea 3
              const isOverlayClickable = isTask3Completed;
              
              return (
                <div key={offer.id} className="relative" style={{ height: '300px' }} {...(isFirstTask ? { 'data-tour': 'first-task' } : {})}>
                  <PremiumCardOverlay
                    isLocked={true}
                    onUnlockClick={isOverlayClickable ? () => {
                      if (isSequenceLocked) {
                        handleTaskClick(offer);
                      } else {
                        window.location.href = '/dashboard/upgrade';
                      }
                    } : undefined}
                    taskNumber={offer.position}
                    isReadyToUnlock={isOverlayClickable}
                    showUnlockButton={showUnlockButton}
                  >
                    <Card className="relative border-0 rounded-3xl overflow-hidden" style={cardStyle}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 line-clamp-2 mb-2">{offer.title}</CardTitle>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 inline-flex items-center gap-1">
                              <DollarSign className="w-3 h-3 flex-shrink-0" />
                              <span>{offer.amount.toFixed(2)} USD</span>
                            </Badge>
                          </div>
                          {offer.image_url && (
                            <Image src={offer.image_url} alt={offer.title} width={60} height={60} className="rounded-lg object-cover ml-3" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-600 line-clamp-2 mb-3">{offer.description}</CardDescription>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Globe className="w-4 h-4 mr-2" />
                          <span>Dispositivo: Todos</span>
                        </div>
                        <Button
                          disabled
                          className="w-full text-white"
                          style={{ backgroundColor: '#0C50A4' }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acceder a la tarea
                        </Button>
                        <div className="w-full rounded-md px-4 py-2 text-center mt-3" style={{ backgroundColor: '#fff' }}>
                          <span className="text-gray-900 text-sm font-medium flex items-center justify-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Gana {offer.amount.toFixed(2)} USD
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </PremiumCardOverlay>
                </div>
              );
            }

            // Tarjeta normal - accesible
            return (
              <div key={offer.id} className="relative" style={{ height: '300px' }} {...(isFirstTask ? { 'data-tour': 'first-task' } : {})}>
                <Card className="relative border-0 rounded-3xl overflow-hidden" style={cardStyle}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 line-clamp-2 mb-2">{offer.title}</CardTitle>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 inline-flex items-center gap-1">
                          <DollarSign className="w-3 h-3 flex-shrink-0" />
                          <span>{offer.amount.toFixed(2)} USD</span>
                        </Badge>
                      </div>
                      {offer.image_url && (
                        <Image src={offer.image_url} alt={offer.title} width={60} height={60} className="rounded-lg object-cover ml-3" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 line-clamp-2 mb-3">{offer.description}</CardDescription>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>Dispositivo: Todos</span>
                    </div>
                    <Button
                      onClick={() => handleTaskClick(offer)}
                      className="w-full text-white hover:opacity-90"
                      style={{ backgroundColor: '#0C50A4' }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Acceder a la tarea
                    </Button>
                    <div className="w-full rounded-md px-4 py-2 text-center mt-3" style={{ backgroundColor: '#fff' }}>
                      <span className="text-gray-900 text-sm font-medium flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Gana {offer.amount.toFixed(2)} USD
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TasksList;
