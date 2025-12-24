'use client';

import { useState, useEffect, useCallback } from 'react';
import { CardLockConfig } from '../types';

interface TaskOffer {
  id: string;
  amount: number;
  category?: string;
}

export const useCardLockConfig = () => {
  const [config, setConfig] = useState<CardLockConfig>({
    lockAllCards: true,
    lockedOfferTypes: ['high-reward', 'exclusive', 'premium'],
    lockedOfferIds: [],
    premiumOnlyFeatures: ['unlimited-tasks', 'priority-support', 'advanced-analytics']
  });
  const [isLoading, setIsLoading] = useState(false);

  const shouldLockCard = useCallback((offer: TaskOffer, isPremium: boolean = false) => {
    if (isPremium) return false;
    if (config.lockAllCards) return true;
    if (config.lockedOfferIds.includes(offer.id.toString())) return true;
    if (offer.category && config.lockedOfferTypes.includes(offer.category.toLowerCase())) return true;
    if (offer.amount && offer.amount > 5) return true;
    return false;
  }, [config]);

  // Función para actualizar la configuración
  const updateConfig = useCallback((newConfig: Partial<CardLockConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Función para cargar configuración desde API (placeholder)
  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Implementar llamada real a API cuando esté lista
      /*
      const response = await fetch('/api/admin/card-lock-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
      */
      
      // Por ahora usar configuración por defecto
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error loading card lock config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    shouldLockCard,
    updateConfig,
    loadConfig,
    isLoading
  };
};