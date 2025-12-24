'use client';

interface TaskOffer {
  id: string;
  title?: string;
  amount: number;
}

export const trackPremiumInteraction = (action: string, context?: any) => {
  try {
    console.log('Premium Interaction:', { action, context, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error tracking premium interaction:', error);
  }
};

export const handlePremiumUpgrade = (offer?: TaskOffer) => {
  trackPremiumInteraction('upgrade_attempt', {
    offerId: offer?.id,
    offerTitle: offer?.title,
    offerAmount: offer?.amount
  });

  const message = offer 
    ? `¡Desbloquea esta microtarea de $${offer.amount} USD y muchas más con Premium!`
    : '¡Desbloquea todas las microtareas premium y gana más dinero!';
    
  alert(`🔓 ${message}\n\n✨ Beneficios Premium:\n• Acceso a todas las microtareas\n• Tareas de mayor recompensa\n• Soporte prioritario\n• Sin límites diarios\n\n¡Actualiza ahora y comienza a ganar más!`);
};

export const formatPremiumMessage = (offer?: TaskOffer): string => {
  if (offer && offer.amount) {
    if (offer.amount > 10) return 'Microtarea Premium Exclusiva';
    if (offer.amount > 5) return 'Disponible solo con Premium';
  }
  return 'Desbloquea para acceder ahora';
};

export const getPremiumFeatures = () => {
  return [
    { icon: '🚀', title: 'Acceso Ilimitado', description: 'Todas las microtareas disponibles sin restricciones' },
    { icon: '💰', title: 'Tareas de Alta Recompensa', description: 'Acceso exclusivo a tareas que pagan más de $5' },
    { icon: '⚡', title: 'Soporte Prioritario', description: 'Atención personalizada y respuesta rápida' },
    { icon: '📊', title: 'Analytics Avanzados', description: 'Estadísticas detalladas de tus ganancias' }
  ];
};
