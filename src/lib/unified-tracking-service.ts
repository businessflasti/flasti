/**
 * Servicio unificado de tracking - Solo 4 eventos permitidos
 * 1. PageView (inicio de app)
 * 2. InitiateCheckout (página checkout)
 * 3. AddPaymentInfo (abrir sección de pago)
 * 4. Purchase (página payment-confirmation-9d4e7b2a8f1c6e3b)
 */

import facebookEventDeduplication from './facebook-event-deduplication';

interface TrackingEventParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  payment_method?: string;
  transaction_id?: string;
  user_email?: string;
  user_name?: string;
  [key: string]: any;
}

interface PurchaseParams {
  transaction_id: string;
  value: number;
  currency: string;
  payment_method: string;
  user_email?: string;
  user_name?: string;
  content_name?: string;
}

class UnifiedTrackingService {
  /**
   * 1. PageView - Solo al iniciar la app
   */
  public async trackPageView(): Promise<void> {
    try {
      // Usar sendDuplicatedEvent para PageView ya que no hay método específico
      await facebookEventDeduplication.sendDuplicatedEvent({
        eventName: 'PageView',
        eventData: {
          content_name: 'Flasti App',
          content_category: 'application'
        }
      });
      console.log('📊 PageView trackeado con deduplicación (Pixel + API)');
    } catch (error) {
      console.error('❌ Error en trackPageView:', error);
    }
  }

  /**
   * 2. InitiateCheckout - Solo en página checkout
   */
  public async trackInitiateCheckout(): Promise<void> {
    try {
      await facebookEventDeduplication.trackInitiateCheckout({
        content_name: 'Flasti Access',
        content_category: 'platform_access',
        value: 7,
        currency: 'USD',
        num_items: 1
      });
      console.log('📊 InitiateCheckout trackeado con deduplicación (Pixel + API)');
    } catch (error) {
      console.error('❌ Error en trackInitiateCheckout:', error);
    }
  }

  /**
   * 3. AddPaymentInfo - Solo al abrir sección de pago
   */
  public async trackAddPaymentInfo(paymentMethod: string): Promise<void> {
    try {
      await facebookEventDeduplication.trackAddPaymentInfo({
        content_name: 'Flasti Access',
        content_category: 'platform_access',
        value: 7,
        currency: 'USD',
        payment_method: paymentMethod
      });
      console.log(`📊 AddPaymentInfo trackeado con deduplicación (Pixel + API): ${paymentMethod}`);
    } catch (error) {
      console.error('❌ Error en trackAddPaymentInfo:', error);
    }
  }

  /**
   * 4. Purchase - Solo en página payment-confirmation-9d4e7b2a8f1c6e3b
   */
  public async trackPurchase(params: PurchaseParams): Promise<void> {
    try {
      await facebookEventDeduplication.trackPurchase({
        value: params.value,
        currency: params.currency,
        content_ids: ['flasti-access'],
        content_name: params.content_name || 'Flasti Access',
        content_type: 'product',
        num_items: 1,
        transaction_id: params.transaction_id
      });
      console.log(`📊 Purchase trackeado con deduplicación (Pixel + API): ${params.transaction_id}`);
    } catch (error) {
      console.error('❌ Error en trackPurchase:', error);
    }
  }
}

// Crear una instancia única del servicio
const unifiedTrackingService = new UnifiedTrackingService();

export default unifiedTrackingService;
