/**
 * Servicio para manejar eventos de Facebook Pixel
 */

// Tipos para eventos de Facebook Pixel
interface FacebookPixelEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  search_string?: string;
  status?: string;
  [key: string]: any;
}

interface FacebookPixelPurchaseParams {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
}

interface FacebookPixelLeadParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}

class FacebookPixelService {
  private pixelId: string = "2198693197269102";
  private isInitialized: boolean = false;

  constructor() {
    // Verificar si Facebook Pixel está disponible
    if (typeof window !== 'undefined') {
      this.checkInitialization();
    }
  }

  /**
   * Verifica si Facebook Pixel está inicializado
   */
  private checkInitialization(): void {
    if (typeof window !== 'undefined' && window.fbq) {
      this.isInitialized = true;
      console.log('Facebook Pixel Service inicializado');
    } else {
      // Intentar nuevamente después de un breve delay
      setTimeout(() => this.checkInitialization(), 1000);
    }
  }

  /**
   * Envía un evento personalizado a Facebook Pixel
   */
  public trackEvent(eventName: string, params?: FacebookPixelEventParams): void {
    if (!this.isInitialized || typeof window === 'undefined' || !window.fbq) {
      console.warn('Facebook Pixel no está inicializado');
      return;
    }

    try {
      if (params) {
        window.fbq('track', eventName, params);
        console.log(`Evento enviado a Facebook Pixel: ${eventName}`, params);
      } else {
        window.fbq('track', eventName);
        console.log(`Evento enviado a Facebook Pixel: ${eventName}`);
      }
    } catch (error) {
      console.error('Error al enviar evento a Facebook Pixel:', error);
    }
  }

  /**
   * Registra una vista de página
   */
  public trackPageView(): void {
    this.trackEvent('PageView');
  }

  /**
   * Registra cuando un usuario ve contenido
   */
  public trackViewContent(params: FacebookPixelEventParams): void {
    this.trackEvent('ViewContent', params);
  }

  /**
   * Registra cuando un usuario busca algo
   */
  public trackSearch(searchString: string, params?: FacebookPixelEventParams): void {
    this.trackEvent('Search', {
      search_string: searchString,
      ...params
    });
  }

  /**
   * Registra cuando un usuario agrega algo al carrito
   */
  public trackAddToCart(params: FacebookPixelEventParams): void {
    this.trackEvent('AddToCart', params);
  }

  /**
   * Registra cuando un usuario inicia el proceso de checkout
   */
  public trackInitiateCheckout(params: FacebookPixelEventParams): void {
    this.trackEvent('InitiateCheckout', params);
  }

  /**
   * Registra cuando un usuario agrega información de pago
   */
  public trackAddPaymentInfo(params?: FacebookPixelEventParams): void {
    this.trackEvent('AddPaymentInfo', params);
  }

  /**
   * Registra una compra completada
   */
  public trackPurchase(params: FacebookPixelPurchaseParams): void {
    this.trackEvent('Purchase', params);
  }

  /**
   * Registra un lead (registro, suscripción, etc.)
   */
  public trackLead(params?: FacebookPixelLeadParams): void {
    this.trackEvent('Lead', params);
  }

  /**
   * Registra cuando un usuario completa un registro
   */
  public trackCompleteRegistration(params?: FacebookPixelEventParams): void {
    this.trackEvent('CompleteRegistration', params);
  }

  /**
   * Registra cuando un usuario se suscribe
   */
  public trackSubscribe(params?: FacebookPixelEventParams): void {
    this.trackEvent('Subscribe', params);
  }

  /**
   * Registra cuando un usuario inicia una prueba gratuita
   */
  public trackStartTrial(params?: FacebookPixelEventParams): void {
    this.trackEvent('StartTrial', params);
  }

  /**
   * Registra cuando un usuario envía una aplicación
   */
  public trackSubmitApplication(params?: FacebookPixelEventParams): void {
    this.trackEvent('SubmitApplication', params);
  }

  /**
   * Registra eventos personalizados específicos de Flasti
   */
  public trackFlastiEvent(eventName: string, params?: FacebookPixelEventParams): void {
    // Agregar prefijo para eventos personalizados
    const customEventName = `Flasti_${eventName}`;
    this.trackEvent(customEventName, params);
  }

  /**
   * Registra cuando un usuario accede al dashboard
   */
  public trackDashboardAccess(): void {
    this.trackFlastiEvent('DashboardAccess');
  }

  /**
   * Registra cuando un usuario completa un microtrabajo
   */
  public trackMicrotaskCompleted(taskType: string, value?: number): void {
    this.trackFlastiEvent('MicrotaskCompleted', {
      content_name: taskType,
      value: value,
      currency: 'USD'
    });
  }

  /**
   * Registra cuando un usuario se convierte en afiliado
   */
  public trackAffiliateSignup(): void {
    this.trackFlastiEvent('AffiliateSignup');
  }

  /**
   * Registra cuando un usuario genera una referencia
   */
  public trackReferralGenerated(): void {
    this.trackFlastiEvent('ReferralGenerated');
  }
}

// Crear una instancia única del servicio
const facebookPixelService = new FacebookPixelService();

export default facebookPixelService;
