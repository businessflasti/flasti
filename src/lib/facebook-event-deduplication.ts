/**
 * Servicio para manejar la deduplicación de eventos entre Facebook Pixel y Conversions API
 */

interface EventData {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  content_category?: string;
  num_items?: number;
  [key: string]: any;
}

interface DeduplicationConfig {
  eventName: string;
  eventData: EventData;
  eventId?: string; // Si no se proporciona, se genera automáticamente
}

class FacebookEventDeduplication {
  /**
   * Genera un event_id único para deduplicación
   */
  private generateEventId(eventName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${eventName.toLowerCase()}_${timestamp}_${random}`;
  }

  /**
   * Envía evento tanto al Pixel (cliente) como a Conversions API (servidor) con deduplicación
   */
  public async sendDuplicatedEvent(config: DeduplicationConfig): Promise<string> {
    const eventId = config.eventId || this.generateEventId(config.eventName);
    
    try {
      // 1. Enviar al Facebook Pixel (lado cliente) con eventID
      const { default: facebookPixelService } = await import('./facebook-pixel-service');
      
      const pixelData = {
        ...config.eventData,
        eventID: eventId
      };

      // Enviar según el tipo de evento
      switch (config.eventName) {
        case 'Purchase':
          await facebookPixelService.trackPurchase(pixelData);
          break;
        case 'InitiateCheckout':
          await facebookPixelService.trackInitiateCheckout(pixelData);
          break;
        case 'AddPaymentInfo':
          await facebookPixelService.trackAddPaymentInfo(pixelData);
          break;
        case 'Lead':
          await facebookPixelService.trackLead(pixelData);
          break;
        case 'CompleteRegistration':
          await facebookPixelService.trackCompleteRegistration(pixelData);
          break;
        default:
          await facebookPixelService.trackEvent(config.eventName, pixelData);
      }

      // 2. Enviar a Conversions API (lado servidor) con el mismo eventId
      await this.sendToConversionsAPI(config.eventName, config.eventData, eventId);

      console.log(`✅ Evento ${config.eventName} enviado con deduplicación. EventID: ${eventId}`);
      return eventId;

    } catch (error) {
      console.error(`❌ Error al enviar evento ${config.eventName} con deduplicación:`, error);
      throw error;
    }
  }

  /**
   * Envía evento a Facebook Conversions API
   */
  private async sendToConversionsAPI(eventName: string, eventData: EventData, eventId: string): Promise<void> {
    try {
      const response = await fetch('/api/facebook/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          eventData,
          eventId
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Conversions API error: ${error}`);
      }

      const result = await response.json();
      console.log(`📡 Evento ${eventName} enviado a Conversions API:`, result);

    } catch (error) {
      console.error(`💥 Error enviando ${eventName} a Conversions API:`, error);
      throw error;
    }
  }

  /**
   * Métodos de conveniencia para eventos específicos
   */
  public async trackPurchase(eventData: EventData, eventId?: string): Promise<string> {
    return this.sendDuplicatedEvent({
      eventName: 'Purchase',
      eventData,
      eventId
    });
  }

  public async trackInitiateCheckout(eventData: EventData, eventId?: string): Promise<string> {
    return this.sendDuplicatedEvent({
      eventName: 'InitiateCheckout',
      eventData,
      eventId
    });
  }

  public async trackAddPaymentInfo(eventData: EventData, eventId?: string): Promise<string> {
    return this.sendDuplicatedEvent({
      eventName: 'AddPaymentInfo',
      eventData,
      eventId
    });
  }

  public async trackLead(eventData: EventData, eventId?: string): Promise<string> {
    return this.sendDuplicatedEvent({
      eventName: 'Lead',
      eventData,
      eventId
    });
  }

  public async trackCompleteRegistration(eventData: EventData, eventId?: string): Promise<string> {
    return this.sendDuplicatedEvent({
      eventName: 'CompleteRegistration',
      eventData,
      eventId
    });
  }
}

// Crear una instancia única del servicio
const facebookEventDeduplication = new FacebookEventDeduplication();

export default facebookEventDeduplication;
export type { EventData, DeduplicationConfig };