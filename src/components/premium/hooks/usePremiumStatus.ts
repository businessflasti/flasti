'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumStatus } from '../types';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    subscriptionType: 'free',
    features: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPremiumStatus = async () => {
    if (!user) {
      setPremiumStatus({
        isPremium: false,
        subscriptionType: 'free',
        features: []
      });
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener el token de sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No hay sesión activa');
      }

      // Llamada real a la API de estado premium
      const response = await fetch('/api/user/premium-status', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPremiumStatus({
        isPremium: data.isPremium,
        subscriptionType: data.subscriptionType,
        features: data.features || []
      });
      
    } catch (error) {
      console.error('Error checking premium status:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      
      // En caso de error, asumir usuario gratuito por seguridad
      setPremiumStatus({
        isPremium: false,
        subscriptionType: 'free',
        features: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  return {
    ...premiumStatus,
    isLoading,
    error,
    refresh: checkPremiumStatus
  };
};