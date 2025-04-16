import { supabase } from './supabase';

class AffiliateNotificationService {
  private static instance: AffiliateNotificationService;

  private constructor() {}

  public static getInstance(): AffiliateNotificationService {
    if (!AffiliateNotificationService.instance) {
      AffiliateNotificationService.instance = new AffiliateNotificationService();
    }
    return AffiliateNotificationService.instance;
  }

  /**
   * Notifica al usuario cuando alguien hace clic en su enlace de afiliado
   */
  public async notifyLinkClick(userId: string, appId: number, appName: string): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        id: `click_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user_id: userId,
        type: 'info',
        category: 'affiliate',
        title: 'Nuevo clic en tu enlace',
        message: `Alguien ha hecho clic en tu enlace de ${appName}`,
        data: { appId, type: 'click' },
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al enviar notificación de clic:', error);
    }
  }

  /**
   * Notifica al usuario cuando se realiza una venta a través de su enlace
   */
  public async notifySale(
    userId: string, 
    appId: number, 
    appName: string, 
    amount: number, 
    commission: number
  ): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        id: `sale_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user_id: userId,
        type: 'success',
        category: 'affiliate',
        title: '¡Nueva venta completada!',
        message: `Has ganado $${commission.toFixed(2)} USD por la venta de ${appName}`,
        data: { 
          appId, 
          type: 'sale',
          amount,
          commission
        },
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al enviar notificación de venta:', error);
    }
  }

  /**
   * Notifica al usuario cuando su nivel ha sido actualizado
   */
  public async notifyLevelUpgrade(userId: string, newLevel: number): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        id: `level_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user_id: userId,
        type: 'success',
        category: 'system',
        title: '¡Has subido de nivel!',
        message: `Felicidades, ahora eres nivel ${newLevel} y obtendrás mayores comisiones`,
        data: { 
          type: 'level_upgrade',
          newLevel
        },
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al enviar notificación de nivel:', error);
    }
  }

  /**
   * Notifica al usuario sobre el estado de su solicitud de retiro
   */
  public async notifyWithdrawalStatusChange(
    userId: string, 
    withdrawalId: string,
    status: 'approved' | 'rejected' | 'completed',
    amount: number
  ): Promise<void> {
    let title = '';
    let message = '';
    let type: 'success' | 'error' | 'info' = 'info';

    switch (status) {
      case 'approved':
        title = 'Retiro aprobado';
        message = `Tu solicitud de retiro por $${amount.toFixed(2)} USD ha sido aprobada y está en proceso`;
        type = 'success';
        break;
      case 'rejected':
        title = 'Retiro rechazado';
        message = `Tu solicitud de retiro por $${amount.toFixed(2)} USD ha sido rechazada. El monto ha sido devuelto a tu balance`;
        type = 'error';
        break;
      case 'completed':
        title = 'Retiro completado';
        message = `Tu retiro por $${amount.toFixed(2)} USD ha sido completado exitosamente`;
        type = 'success';
        break;
    }

    try {
      await supabase.from('notifications').insert({
        id: `withdrawal_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user_id: userId,
        type,
        category: 'payment',
        title,
        message,
        data: { 
          type: 'withdrawal_status',
          withdrawalId,
          status,
          amount
        },
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al enviar notificación de retiro:', error);
    }
  }

  /**
   * Notifica al usuario cuando recibe un nuevo mensaje
   */
  public async notifyNewMessage(
    userId: string, 
    senderId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        id: `message_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user_id: userId,
        type: 'info',
        category: 'chat',
        title: 'Nuevo mensaje',
        message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
        data: { 
          type: 'new_message',
          senderId,
          senderName,
          conversationId
        },
        read: false,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al enviar notificación de mensaje:', error);
    }
  }
}

export const affiliateNotificationService = AffiliateNotificationService.getInstance();
