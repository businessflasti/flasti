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
  eventID?: string; // Para deduplicación con Conversions API
  [key: string]: any;
}

interface FacebookPixelPurchaseParams {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
  eventID?: string; // Para deduplicación con Conversions API
}

interface FacebookPixelLeadParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  eventID?: string; // Para deduplicación con Conversions API
}

class FacebookPixelService {
  private pixelId: string = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "738700458549300";
  private isInitialized: boolean = false;
  private excludedIp: string = "201.235.207.156";

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

  private async getClientIp(): Promise<string | null> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return null;
    }
  }

  private isLocalhost(): boolean {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      // IPv6 localhost
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.')
    );
  }

  private async shouldTrack(): Promise<boolean> {
    if (typeof window === 'undefined') return true;
    if (this.isLocalhost()) return false;
    const ip = await this.getClientIp();
    return ip !== this.excludedIp;
  }

  /**
   * Envía un evento personalizado a Facebook Pixel
   */
  public async trackEvent(eventName: string, params?: FacebookPixelEventParams): Promise<void> {
    if (!this.isInitialized || typeof window === 'undefined' || !window.fbq) {
      console.warn('Facebook Pixel no está inicializado');
      return;
    }
    if (!(await this.shouldTrack())) return;
    try {
      if (params) {
        // Si hay eventID, usar trackSingle para deduplicación
        if (params.eventID) {
          window.fbq('trackSingle', this.pixelId, eventName, params, { eventID: params.eventID });
          console.log(`Evento enviado a Facebook Pixel con eventID: ${eventName}`, { ...params, eventID: params.eventID });
        } else {
          window.fbq('track', eventName, params);
          console.log(`Evento enviado a Facebook Pixel: ${eventName}`, params);
        }
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
  public async trackPageView(): Promise<void> {
    await this.trackEvent('PageView');
  }

  /**
   * Registra cuando un usuario inicia el proceso de checkout
   */
  public async trackInitiateCheckout(params: FacebookPixelEventParams): Promise<void> {
    await this.trackEvent('InitiateCheckout', params);
  }

  /**
   * Registra cuando un usuario agrega información de pago
   */
  public async trackAddPaymentInfo(params?: FacebookPixelEventParams): Promise<void> {
    await this.trackEvent('AddPaymentInfo', params);
  }

  /**
   * Registra una compra completada
   */
  public async trackPurchase(params: FacebookPixelPurchaseParams): Promise<void> {
    await this.trackEvent('Purchase', params);
  }

  /**
   * Registra un lead
   */
  public async trackLead(params: FacebookPixelLeadParams): Promise<void> {
    await this.trackEvent('Lead', params);
  }

  /**
   * Registra cuando un usuario completa el registro
   */
  public async trackCompleteRegistration(params: FacebookPixelEventParams): Promise<void> {
    await this.trackEvent('CompleteRegistration', params);
  }

  /**
   * Registra un evento personalizado de Flasti
   */
  public async trackFlastiEvent(eventName: string, params?: FacebookPixelEventParams): Promise<void> {
    await this.trackEvent(`Flasti_${eventName}`, params);
  }
}

// Crear una instancia única del servicio
const facebookPixelService = new FacebookPixelService();

export default facebookPixelService;
