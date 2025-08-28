'use client';

import { CPALeadOffer } from '@/lib/cpa-lead-api';

// Utilidades para el sistema premium

export const trackPremiumInteraction = (action: string, context?: any) => {
  try {
    // Track premium overlay interactions for analytics
    console.log('Premium Interaction:', { action, context, timestamp: new Date().toISOString() });
    
    // TODO: Integrar con servicio de analytics real
    /*
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'premium_interaction', {
        action,
        context: JSON.stringify(context),
        timestamp: new Date().toISOString()
      });
    }
    */
  } catch (error) {
    console.error('Error tracking premium interaction:', error);
  }
};

export const handlePremiumUpgrade = (offer?: CPALeadOffer) => {
  // Track the upgrade attempt
  trackPremiumInteraction('upgrade_attempt', {
    offerId: offer?.id,
    offerTitle: offer?.title,
    offerAmount: offer?.amount
  });

  // For now, show alert - later replace with modal or redirect
  const message = offer 
    ? `¡Desbloquea esta microtarea de $${offer.amount} ${offer.payout_currency} y muchas más con Premium!`
    : '¡Desbloquea todas las microtareas premium y gana más dinero!';
    
  alert(`🔓 ${message}\n\n✨ Beneficios Premium:\n• Acceso a todas las microtareas\n• Tareas de mayor recompensa\n• Soporte prioritario\n• Sin límites diarios\n\n¡Actualiza ahora y comienza a ganar más!`);
  
  // TODO: Implementar modal elegante o redirección a checkout
  /*
  // Opción 1: Abrir modal
  openPremiumModal(offer);
  
  // Opción 2: Redirigir a checkout
  window.location.href = `/checkout/premium?source=card_lock&offer_id=${offer?.id}`;
  */
};

export const formatPremiumMessage = (offer?: CPALeadOffer): string => {
  if (offer && offer.amount) {
    const amount = parseFloat(offer.amount);
    if (amount > 10) {
      return 'Microtarea Premium Exclusiva';
    } else if (amount > 5) {
      return 'Disponible solo con Premium';
    }
  }
  
  return 'Desbloquea para acceder ahora';
};

export const getPremiumFeatures = () => {
  return [
    {
      icon: '🚀',
      title: 'Acceso Ilimitado',
      description: 'Todas las microtareas disponibles sin restricciones'
    },
    {
      icon: '💰',
      title: 'Tareas de Alta Recompensa',
      description: 'Acceso exclusivo a tareas que pagan más de $5'
    },
    {
      icon: '⚡',
      title: 'Soporte Prioritario',
      description: 'Atención personalizada y respuesta rápida'
    },
    {
      icon: '📊',
      title: 'Analytics Avanzados',
      description: 'Estadísticas detalladas de tus ganancias'
    }
  ];
};