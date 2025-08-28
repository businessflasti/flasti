'use client';

import { useState, useEffect, useCallback } from 'react';
import { CardLockConfig } from '../types';
import { CPALeadOffer } from '@/lib/cpa-lead-api';

export const useCardLockConfig = () => {
  const [config, setConfig] = useState<CardLockConfig>({
    lockAllCards: true, // Por defecto, bloquear todas las tarjetas para usuarios gratuitos
    lockedOfferTypes: ['high-reward', 'exclusive', 'premium'],
    lockedOfferIds: [],
    premiumOnlyFeatures: ['unlimited-tasks', 'priority-support', 'advanced-analytics']
  });
  const [isLoading, setIsLoading] = useState(false);

  // Función para determinar si una tarjeta debe estar bloqueada
  const shouldLockCard = useCallback((offer: CPALeadOffer, isPremium: boolean = false) => {
    // Si el usuario es premium, no bloquear ninguna tarjeta
    if (isPremium) {
      return false;
    }

    // Si la configuración dice bloquear todas las tarjetas
    if (config.lockAllCards) {
      return true;
    }

    // Verificar si el ID específico de la oferta está bloqueado
    if (config.lockedOfferIds.includes(offer.id.toString())) {
      return true;
    }

    // Verificar si el tipo de oferta está bloqueado
    if (offer.category && config.lockedOfferTypes.includes(offer.category.toLowerCase())) {
      return true;
    }

    // Bloquear ofertas de alta recompensa (ejemplo: más de $5)
    if (offer.amount && parseFloat(offer.amount) > 5) {
      return true;
    }

    // Por defecto, no bloquear
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