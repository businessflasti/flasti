/**
 * Servicio de tracking específico para Hotmart
 * Integra Facebook Pixel, Yandex Metrica y otros sistemas de tracking
 */

interface HotmartPurchaseData {
  event: string;
  data: {
    purchase?: {
      transaction: string;
      status: string;
      product: {
        id: string;
        name: string;
      };
      price: {
        value: number;
        currency_value: string;
      };
      buyer: {
        email: string;
        name: string;
      };
      affiliate?: {
        id: string;
      };
    };
    buyer?: {
      email: string;
      name: string;
    };
    product?: {
      id: string;
      name: string;
    };
  };
}

interface FacebookPixelPurchaseEvent {
  value: number;
  currency: string;
  content_ids: string[];
  content_name: string;
  content_type: string;
  num_items: number;
}

class HotmartTrackingService {
  private pixelId: string = "738700458549300";
  private excludedIp: string = "201.235.207.156";
  private conversionApiToken: string = process.env.FACEBOOK_CONVERSIONS_API_TOKEN || '';

  private isLocalhostBackend(): boolean {
    const host = process.env.HOST || process.env.NEXT_PUBLIC_BASE_URL || '';
    return (
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.includes('::1') ||
      host.startsWith('192.168.') ||
      host.startsWith('10.')
    );
  }

  private async shouldTrack(ip?: string): Promise<boolean> {
    // Bloquear tracking si el backend está en local/red local
    if (this.isLocalhostBackend()) {
      console.log('[Meta API] Tracking bloqueado: entorno local/backend');
      return false;
    }
    // Bloquear tracking si la IP es undefined, vacía o IP excluida
    if (!ip) {
      console.log('[Meta API] Tracking bloqueado: IP indefinida');
      return false;
    }
    if (ip === this.excludedIp) {
      console.log('[Meta API] Tracking bloqueado: IP excluida', ip);
      return false;
    }
    // Bloquear si la IP es localhost o red local
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      /^192\.168\./.test(ip) ||
      /^10\./.test(ip) ||
      ip === 'localhost'
    ) {
      console.log('[Meta API] Tracking bloqueado: IP local/red local', ip);
      return false;
    }
    return true;
  }

  /**
   * Envía evento de compra a Facebook Pixel usando Conversions API
   * Esto es necesario porque el webhook de Hotmart se ejecuta en el servidor
   */
  private async sendServerSidePixelEvent(eventName: string, eventData: any, userData: any, ip?: string): Promise<void> {
    if (!(await this.shouldTrack(ip))) return;
    try {
      // Facebook Conversions API endpoint
      const url = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;
      
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: 'https://flasti.com/dashboard/checkout',
          user_data: {
            em: userData.email ? this.hashEmail(userData.email) : undefined,
            fn: userData.firstName ? this.hashString(userData.firstName) : undefined,
            ln: userData.lastName ? this.hashString(userData.lastName) : undefined,
            client_ip_address: ip || undefined
          },
          custom_data: eventData
        }],
        access_token: this.conversionApiToken
      };

      // Solo enviar si tenemos el token de acceso
      if (!this.conversionApiToken) {
        console.log('⚠️ Facebook Conversions API token no configurado');
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Evento enviado a Facebook Conversions API:', eventName);
      } else {
        const error = await response.text();
        console.error('❌ Error al enviar a Facebook Conversions API:', error);
      }
    } catch (error) {
      console.error('💥 Error en Facebook Conversions API:', error);
    }
  }

  /**
   * Hash de email para Facebook Pixel (requerido por Conversions API)
   */
  private hashEmail(email: string): string {
    // En producción, usar crypto.createHash('sha256')
    // Por ahora, retornar el email en minúsculas (Facebook lo hasheará)
    return email.toLowerCase().trim();
  }

  /**
   * Hash de string para Facebook Pixel
   */
  private hashString(str: string): string {
    // En producción, usar crypto.createHash('sha256')
    // Por ahora, retornar el string en minúsculas
    return str.toLowerCase().trim();
  }

  /**
   * Procesa una compra completada de Hotmart
   */
  public async trackHotmartPurchaseComplete(payload: HotmartPurchaseData, ip?: string): Promise<void> {
    try {
      console.log('📊 Iniciando tracking de compra de Hotmart...');

      const purchaseData = payload.data.purchase;
      if (!purchaseData) {
        console.error('❌ Datos de compra no encontrados en payload');
        return;
      }

      // Extraer información de la compra
      const transactionId = purchaseData.transaction;
      const productName = purchaseData.product?.name || 'Acceso a Flasti';
      const productId = purchaseData.product?.id || 'hotmart-product';
      const price = purchaseData.price?.value || 0;
      const currency = purchaseData.price?.currency_value || 'USD';
      const buyerEmail = purchaseData.buyer?.email || '';
      const buyerName = purchaseData.buyer?.name || '';

      console.log('💰 Datos de compra:', {
        transactionId,
        productName,
        productId,
        price,
        currency,
        buyerEmail: buyerEmail ? '***@***.***' : 'no email'
      });

      // Preparar datos para Facebook Pixel
      const pixelEventData: FacebookPixelPurchaseEvent = {
        value: price,
        currency: currency,
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        num_items: 1
      };

      // Preparar datos del usuario
      const userData = {
        email: buyerEmail,
        firstName: buyerName.split(' ')[0] || '',
        lastName: buyerName.split(' ').slice(1).join(' ') || ''
      };

      // Hotmart tracking - Solo para webhooks del servidor (no interfiere con los 4 eventos principales)
      await this.sendServerSidePixelEvent('Purchase', pixelEventData, userData, ip);

      console.log('✅ Tracking de compra de Hotmart completado');

    } catch (error) {
      console.error('💥 Error al trackear compra de Hotmart:', error);
    }
  }

  /**
   * Procesa una compra aprobada de Hotmart
   */
  public async trackHotmartPurchaseApproved(payload: HotmartPurchaseData): Promise<void> {
    try {
      console.log('📊 Iniciando tracking de compra aprobada de Hotmart...');

      // Para compras aprobadas, podemos enviar eventos adicionales
      const purchaseData = payload.data.purchase;
      if (!purchaseData) {
        console.error('❌ Datos de compra no encontrados en payload');
        return;
      }

      const transactionId = purchaseData.transaction;
      const buyerEmail = purchaseData.buyer?.email || '';

      // Enviar evento de lead completado
      const userData = {
        email: buyerEmail,
        firstName: purchaseData.buyer?.name?.split(' ')[0] || '',
        lastName: purchaseData.buyer?.name?.split(' ').slice(1).join(' ') || ''
      };

      await this.sendServerSidePixelEvent('CompleteRegistration', {
        content_name: 'Flasti Registration',
        status: 'approved'
      }, userData);

      console.log('✅ Tracking de compra aprobada de Hotmart completado');

    } catch (error) {
      console.error('💥 Error al trackear compra aprobada de Hotmart:', error);
    }
  }

  // Método trackToYandexMetrica eliminado - solo usamos Facebook Pixel + Conversions API

  /**
   * Registra un evento personalizado de Hotmart
   */
  public async trackHotmartCustomEvent(eventName: string, eventData: any, userEmail?: string): Promise<void> {
    try {
      const userData = {
        email: userEmail || '',
        firstName: '',
        lastName: ''
      };

      await this.sendServerSidePixelEvent(`Hotmart_${eventName}`, eventData, userData);
      console.log(`✅ Evento personalizado de Hotmart enviado: ${eventName}`);

    } catch (error) {
      console.error(`💥 Error al enviar evento personalizado de Hotmart: ${eventName}`, error);
    }
  }

  /**
   * Trackea cuando un usuario se registra desde Hotmart
   */
  public async trackHotmartUserRegistration(userEmail: string, userName: string): Promise<void> {
    try {
      const userData = {
        email: userEmail,
        firstName: userName.split(' ')[0] || '',
        lastName: userName.split(' ').slice(1).join(' ') || ''
      };

      await this.sendServerSidePixelEvent('CompleteRegistration', {
        content_name: 'Hotmart User Registration',
        registration_method: 'hotmart'
      }, userData);

      console.log('✅ Registro de usuario de Hotmart trackeado');

    } catch (error) {
      console.error('💥 Error al trackear registro de usuario de Hotmart:', error);
    }
  }
}

// Crear una instancia única del servicio
const hotmartTrackingService = new HotmartTrackingService();

export default hotmartTrackingService;
