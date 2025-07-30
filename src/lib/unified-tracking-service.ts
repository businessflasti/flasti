/**
 * Servicio unificado de tracking que integra Facebook Pixel y Yandex Metrica
 */

import facebookPixelService from './facebook-pixel-service';
import facebookEventDeduplication from './facebook-event-deduplication';
import analyticsService from './analytics-service';

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
   * Enviar evento a la API de conversiones
   */
  private async sendToMetaAPI(eventName: string, params: any) {
    try {
      await fetch('/api/tracking/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, params })
      });
    } catch (e) {
      console.error('Error enviando evento a API de conversiones:', e);
    }
  }

  /**
   * Track página vista en ambas plataformas
   */
  public async trackPageView(pageName: string, params?: TrackingEventParams) {
    await facebookPixelService.trackPageView();
    analyticsService.trackPageView();
    analyticsService.trackEvent('page_view', { page_name: pageName, ...params });
    await this.sendToMetaAPI('PageView', { content_name: pageName, ...params });

    console.log(`📊 Página vista trackeada: ${pageName}`);
  }

  /**
   * Track inicio de checkout en ambas plataformas
   */
  public async trackInitiateCheckout(params: TrackingEventParams) {
    try {
      // Usar deduplicación para Facebook Pixel + Conversions API
      await facebookEventDeduplication.trackInitiateCheckout({
        content_name: params.content_name || 'Flasti Access',
        content_category: params.content_category || 'platform_access',
        value: params.value,
        currency: params.currency,
        num_items: 1
      });

      // Yandex Metrica
      analyticsService.trackEvent('initiate_checkout', {
        content_name: params.content_name,
        value: params.value,
        currency: params.currency,
        payment_method: params.payment_method
      });

      console.log('📊 InitiateCheckout trackeado con deduplicación');
    } catch (error) {
      console.error('❌ Error en trackInitiateCheckout:', error);
    }
  }

  /**
   * Track información de pago agregada en ambas plataformas
   */
  public async trackAddPaymentInfo(params: TrackingEventParams) {
    try {
      // Usar deduplicación para Facebook Pixel + Conversions API
      await facebookEventDeduplication.trackAddPaymentInfo({
        content_name: params.content_name || 'Flasti Access',
        content_category: params.content_category || 'platform_access',
        value: params.value,
        currency: params.currency
      });

      // Yandex Metrica
      analyticsService.trackEvent('add_payment_info', {
        content_name: params.content_name,
        value: params.value,
        currency: params.currency,
        payment_method: params.payment_method
      });

      console.log('📊 AddPaymentInfo trackeado con deduplicación');
    } catch (error) {
      console.error('❌ Error en trackAddPaymentInfo:', error);
    }
  }

  /**
   * Track compra completada en ambas plataformas
   */
  public async trackPurchase(params: PurchaseParams) {
    await facebookPixelService.trackPurchase({
      value: params.value,
      currency: params.currency,
      content_ids: ['flasti-access'],
      content_name: params.content_name || 'Acceso a Flasti',
      content_type: 'product',
      num_items: 1
    });
    analyticsService.trackPurchase(
      params.transaction_id,
      params.value,
      params.currency,
      [{
        id: 'flasti-access',
        name: params.content_name || 'Acceso a Flasti',
        category: 'Platform Access',
        price: params.value,
        quantity: 1
      }]
    );
    analyticsService.trackGoal('purchase_completed', {
      order_price: params.value,
      currency: params.currency,
      payment_method: params.payment_method,
      transaction_id: params.transaction_id,
      customer_name: params.user_name,
      customer_email: params.user_email
    });
    await this.sendToMetaAPI('Purchase', params);

    console.log(`📊 Compra trackeada: ${params.transaction_id} - ${params.value} ${params.currency}`);
  }

  /**
   * Track lead generado (registro, suscripción)
   */
  public async trackLead(params: TrackingEventParams): Promise<void> {
    try {
      // Usar deduplicación para Facebook Pixel + Conversions API
      await facebookEventDeduplication.trackLead({
        content_name: params.content_name,
        content_category: params.content_category,
        value: params.value,
        currency: params.currency
      });

      // Yandex Metrica
      analyticsService.trackEvent('lead_generated', {
        content_name: params.content_name,
        user_email: params.user_email,
        user_name: params.user_name
      });

      console.log('📊 Lead trackeado con deduplicación');
    } catch (error) {
      console.error('❌ Error en trackLead:', error);
    }
  }

  /**
   * Track registro completado
   */
  public async trackCompleteRegistration(params: TrackingEventParams): Promise<void> {
    try {
      // Usar deduplicación para Facebook Pixel + Conversions API
      await facebookEventDeduplication.trackCompleteRegistration({
        content_name: params.content_name,
        value: params.value,
        currency: params.currency
      });

      // Yandex Metrica
      analyticsService.trackEvent('complete_registration', {
        user_email: params.user_email,
        user_name: params.user_name,
        registration_method: params.payment_method
      });

      console.log('📊 CompleteRegistration trackeado con deduplicación');
    } catch (error) {
      console.error('❌ Error en trackCompleteRegistration:', error);
    }
  }

  /**
   * Track eventos específicos de Flasti
   */
  public trackFlastiEvent(eventName: string, params?: TrackingEventParams): void {
    // Facebook Pixel
    facebookPixelService.trackFlastiEvent(eventName, params);

    // Yandex Metrica
    analyticsService.trackEvent(`flasti_${eventName}`, params);

    console.log(`📊 Evento Flasti trackeado: ${eventName}`);
  }

  /**
   * Track acceso al dashboard
   */
  public trackDashboardAccess(userEmail?: string): void {
    this.trackFlastiEvent('dashboard_access', {
      user_email: userEmail
    });
  }

  /**
   * Track microtrabajo completado
   */
  public trackMicrotaskCompleted(taskType: string, value?: number, userEmail?: string): void {
    this.trackFlastiEvent('microtask_completed', {
      content_name: taskType,
      value: value,
      currency: 'USD',
      user_email: userEmail
    });
  }

  /**
   * Track signup de afiliado
   */
  public trackAffiliateSignup(userEmail?: string): void {
    this.trackFlastiEvent('affiliate_signup', {
      user_email: userEmail
    });
  }

  /**
   * Track referencia generada
   */
  public trackReferralGenerated(userEmail?: string): void {
    this.trackFlastiEvent('referral_generated', {
      user_email: userEmail
    });
  }

  /**
   * Track descuento aplicado
   */
  public trackDiscountApplied(discountType: string, discountValue: number, originalPrice: number): void {
    this.trackFlastiEvent('discount_applied', {
      content_name: discountType,
      value: discountValue,
      currency: 'USD',
      original_price: originalPrice
    });
  }

  /**
   * Track método de pago seleccionado
   */
  public trackPaymentMethodSelected(paymentMethod: string, value: number, currency: string): void {
    this.trackFlastiEvent('payment_method_selected', {
      payment_method: paymentMethod,
      value: value,
      currency: currency
    });
  }

  /**
   * Track cuando se inicia el checkout de Hotmart
   */
  public trackHotmartCheckoutStarted(offerCode: string, value: number, currency: string): void {
    this.trackFlastiEvent('hotmart_checkout_started', {
      offer_code: offerCode,
      value: value,
      currency: currency,
      content_name: 'Hotmart Checkout'
    });
  }

  /**
   * Track cuando se carga el formulario de Hotmart
   */
  public trackHotmartFormLoaded(offerCode: string): void {
    this.trackFlastiEvent('hotmart_form_loaded', {
      offer_code: offerCode,
      content_name: 'Hotmart Form'
    });
  }

  /**
   * Track cuando hay un error en Hotmart
   */
  public trackHotmartError(errorType: string, errorMessage: string): void {
    this.trackFlastiEvent('hotmart_error', {
      error_type: errorType,
      error_message: errorMessage
    });
  }
}

// Crear una instancia única del servicio
const unifiedTrackingService = new UnifiedTrackingService();

export default unifiedTrackingService;
