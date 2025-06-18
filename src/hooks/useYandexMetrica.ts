'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import analyticsService from '@/lib/analytics-service';
import { YandexMetricaEventParams, YandexMetricaGoalParams } from '@/types/yandex-metrica';

/**
 * Hook personalizado para usar Yandex Metrica en componentes React
 */
export const useYandexMetrica = () => {
  const pathname = usePathname();

  // Trackear cambios de página automáticamente
  useEffect(() => {
    if (pathname) {
      analyticsService.trackPageView(pathname);
    }
  }, [pathname]);

  // Funciones de tracking envueltas en useCallback para optimización
  const trackEvent = useCallback((eventName: string, params?: YandexMetricaEventParams) => {
    analyticsService.trackEvent(eventName, params);
  }, []);

  const trackGoal = useCallback((goalName: string, params?: YandexMetricaGoalParams) => {
    analyticsService.trackGoal(goalName, params);
  }, []);

  const trackPageView = useCallback((url?: string, title?: string) => {
    analyticsService.trackPageView(url, title);
  }, []);

  const setUserParams = useCallback((params: YandexMetricaEventParams) => {
    analyticsService.setUserParams(params);
  }, []);

  // Métodos específicos de la plataforma
  const trackUserRegistration = useCallback((method: string = 'email') => {
    analyticsService.trackUserRegistration(method);
  }, []);

  const trackUserLogin = useCallback((method: string = 'email') => {
    analyticsService.trackUserLogin(method);
  }, []);

  const trackPurchase = useCallback((orderId: string, revenue: number, currency: string = 'USD', products: any[]) => {
    analyticsService.trackPurchase(orderId, revenue, currency, products);
  }, []);

  const trackAffiliateClick = useCallback((affiliateId: string, appId: string, appName: string) => {
    analyticsService.trackAffiliateClick(affiliateId, appId, appName);
  }, []);

  const trackDashboardAccess = useCallback(() => {
    analyticsService.trackDashboardAccess();
  }, []);

  const trackWithdrawalRequest = useCallback((amount: number, method: string) => {
    analyticsService.trackWithdrawalRequest(amount, method);
  }, []);

  const trackOnboardingComplete = useCallback(() => {
    analyticsService.trackOnboardingComplete();
  }, []);

  const trackChatInteraction = useCallback((action: string) => {
    analyticsService.trackChatInteraction(action);
  }, []);

  return {
    trackEvent,
    trackGoal,
    trackPageView,
    setUserParams,
    trackUserRegistration,
    trackUserLogin,
    trackPurchase,
    trackAffiliateClick,
    trackDashboardAccess,
    trackWithdrawalRequest,
    trackOnboardingComplete,
    trackChatInteraction
  };
};

export default useYandexMetrica;
