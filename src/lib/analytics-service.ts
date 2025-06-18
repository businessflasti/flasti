import { 
  YandexMetricaEventParams, 
  YandexMetricaGoalParams, 
  YandexMetricaEcommerceParams 
} from '@/types/yandex-metrica';

class AnalyticsService {
  private counterId: number = 102603584;
  private isInitialized: boolean = false;

  constructor() {
    // Verificar si estamos en el cliente y si Yandex Metrica está disponible
    if (typeof window !== 'undefined') {
      this.checkInitialization();
    }
  }

  private checkInitialization(): void {
    if (typeof window !== 'undefined' && window.ym) {
      this.isInitialized = true;
    } else {
      // Reintentar después de un breve delay
      setTimeout(() => this.checkInitialization(), 100);
    }
  }

  /**
   * Envía un evento personalizado a Yandex Metrica
   */
  public trackEvent(eventName: string, params?: YandexMetricaEventParams): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      console.warn('Yandex Metrica no está inicializado');
      return;
    }

    try {
      window.ym(this.counterId, 'reachGoal', eventName, params);
      console.log(`Evento enviado a Yandex Metrica: ${eventName}`, params);
    } catch (error) {
      console.error('Error al enviar evento a Yandex Metrica:', error);
    }
  }

  /**
   * Registra un objetivo (goal) en Yandex Metrica
   */
  public trackGoal(goalName: string, params?: YandexMetricaGoalParams): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      console.warn('Yandex Metrica no está inicializado');
      return;
    }

    try {
      window.ym(this.counterId, 'reachGoal', goalName, params);
      console.log(`Objetivo alcanzado en Yandex Metrica: ${goalName}`, params);
    } catch (error) {
      console.error('Error al registrar objetivo en Yandex Metrica:', error);
    }
  }

  /**
   * Envía datos de e-commerce a Yandex Metrica
   */
  public trackEcommerce(action: string, params: YandexMetricaEcommerceParams): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      console.warn('Yandex Metrica no está inicializado');
      return;
    }

    try {
      window.ym(this.counterId, 'ecommerce', action, params);
      console.log(`E-commerce enviado a Yandex Metrica: ${action}`, params);
    } catch (error) {
      console.error('Error al enviar e-commerce a Yandex Metrica:', error);
    }
  }

  /**
   * Registra una página vista manualmente
   */
  public trackPageView(url?: string, title?: string): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      console.warn('Yandex Metrica no está inicializado');
      return;
    }

    try {
      const params: any = {};
      if (url) params.url = url;
      if (title) params.title = title;
      
      window.ym(this.counterId, 'hit', url || window.location.href, params);
      console.log('Página vista enviada a Yandex Metrica:', url || window.location.href);
    } catch (error) {
      console.error('Error al enviar página vista a Yandex Metrica:', error);
    }
  }

  /**
   * Envía parámetros de usuario
   */
  public setUserParams(params: YandexMetricaEventParams): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.ym) {
      console.warn('Yandex Metrica no está inicializado');
      return;
    }

    try {
      window.ym(this.counterId, 'userParams', params);
      console.log('Parámetros de usuario enviados a Yandex Metrica:', params);
    } catch (error) {
      console.error('Error al enviar parámetros de usuario a Yandex Metrica:', error);
    }
  }

  // Métodos específicos para eventos comunes de la plataforma

  /**
   * Registra un nuevo usuario
   */
  public trackUserRegistration(method: string = 'email'): void {
    this.trackGoal('user_registration', { registration_method: method });
  }

  /**
   * Registra un login de usuario
   */
  public trackUserLogin(method: string = 'email'): void {
    this.trackEvent('user_login', { login_method: method });
  }

  /**
   * Registra una compra
   */
  public trackPurchase(orderId: string, revenue: number, currency: string = 'USD', products: any[]): void {
    // Objetivo de compra
    this.trackGoal('purchase', { 
      order_price: revenue, 
      currency: currency,
      order_id: orderId 
    });

    // E-commerce tracking
    this.trackEcommerce('purchase', {
      purchase: {
        actionField: {
          id: orderId,
          revenue: revenue,
          currency: currency
        },
        products: products
      }
    });
  }

  /**
   * Registra un clic de afiliado
   */
  public trackAffiliateClick(affiliateId: string, appId: string, appName: string): void {
    this.trackEvent('affiliate_click', {
      affiliate_id: affiliateId,
      app_id: appId,
      app_name: appName
    });
  }

  /**
   * Registra cuando un usuario accede al dashboard
   */
  public trackDashboardAccess(): void {
    this.trackEvent('dashboard_access');
  }

  /**
   * Registra cuando un usuario solicita un retiro
   */
  public trackWithdrawalRequest(amount: number, method: string): void {
    this.trackEvent('withdrawal_request', {
      amount: amount,
      method: method
    });
  }

  /**
   * Registra cuando un usuario completa el onboarding
   */
  public trackOnboardingComplete(): void {
    this.trackGoal('onboarding_complete');
  }

  /**
   * Registra interacciones con el chat
   */
  public trackChatInteraction(action: string): void {
    this.trackEvent('chat_interaction', { action: action });
  }
}

// Exportar instancia singleton
export const analyticsService = new AnalyticsService();
export default analyticsService;
