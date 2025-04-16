import { supabase } from './supabase';
import { createTransport } from 'nodemailer';

export class NotificationService {
  private static instance: NotificationService;
  private emailTransporter: any;

  private constructor() {
    this.emailTransporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Envía una notificación por correo electrónico
   */
  public async sendEmailNotification(
    userId: string,
    subject: string,
    message: string
  ): Promise<boolean> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('email, notification_preferences')
        .eq('id', userId)
        .single();

      if (!user?.email || user?.notification_preferences?.email === false) {
        return false;
      }

      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif;">${message}</div>`
      });

      return true;
    } catch (error) {
      console.error('Error al enviar notificación por correo:', error);
      return false;
    }
  }

  /**
   * Envía una notificación en tiempo real
   */
  public async sendRealtimeNotification(
    userId: string,
    type: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        type,
        data,
        read: false,
        created_at: new Date().toISOString()
      });

      // Emitir evento para actualización en tiempo real
      await supabase
        .from('notification_events')
        .insert({
          user_id: userId,
          event: 'new_notification',
          payload: { type, data }
        });
    } catch (error) {
      console.error('Error al enviar notificación en tiempo real:', error);
    }
  }

  /**
   * Notifica una nueva venta
   */
  public async notifySale(
    affiliateId: string,
    saleData: {
      amount: number;
      commission: number;
      productName: string;
    }
  ): Promise<void> {
    const message = `¡Felicitaciones! Has generado una nueva venta de ${saleData.productName} por $${saleData.amount}. Tu comisión es de $${saleData.commission}.`;

    await Promise.all([
      this.sendEmailNotification(
        affiliateId,
        '¡Nueva venta registrada!',
        message
      ),
      this.sendRealtimeNotification(affiliateId, 'new_sale', {
        ...saleData,
        message
      })
    ]);
  }

  /**
   * Notifica un nuevo nivel alcanzado
   */
  public async notifyLevelUp(
    userId: string,
    newLevel: number,
    benefits: string[]
  ): Promise<void> {
    const message = `¡Felicitaciones! Has alcanzado el nivel ${newLevel}. Nuevos beneficios desbloqueados:\n${benefits.join('\n')}`;

    await Promise.all([
      this.sendEmailNotification(
        userId,
        '¡Has subido de nivel!',
        message
      ),
      this.sendRealtimeNotification(userId, 'level_up', {
        level: newLevel,
        benefits,
        message
      })
    ]);
  }

  /**
   * Notifica un logro desbloqueado
   */
  public async notifyAchievement(
    userId: string,
    achievement: {
      type: string;
      name: string;
      description: string;
      reward?: {
        type: string;
        value: number;
        description: string;
      };
    }
  ): Promise<void> {
    const message = `¡Felicitaciones! Has desbloqueado el logro "${achievement.name}": ${achievement.description}${achievement.reward ? `\n\nRecompensa: ${achievement.reward.description}` : ''}`;

    await Promise.all([
      this.sendEmailNotification(
        userId,
        '¡Nuevo logro desbloqueado!',
        message
      ),
      this.sendRealtimeNotification(userId, 'achievement_unlocked', {
        ...achievement,
        message
      })
    ]);
  }

  /**
   * Notifica una actividad sospechosa
   */
  public async notifySuspiciousActivity(
    userId: string,
    details: {
      type: string;
      description: string;
      recommendations: string[];
    }
  ): Promise<void> {
    const message = `Hemos detectado actividad sospechosa en tu cuenta: ${details.description}\n\nRecomendaciones:\n${details.recommendations.join('\n')}`;

    await Promise.all([
      this.sendEmailNotification(
        userId,
        'Alerta de seguridad',
        message
      ),
      this.sendRealtimeNotification(userId, 'security_alert', {
        ...details,
        message
      })
    ]);
  }

  /**
   * Obtiene las notificaciones no leídas de un usuario
   */
  public async getUnreadNotifications(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false });

    return data || [];
  }

  /**
   * Marca una notificación como leída
   */
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  }

  /**
   * Actualiza las preferencias de notificación de un usuario
   */
  public async updateNotificationPreferences(
    userId: string,
    preferences: {
      email?: boolean;
      push?: boolean;
      sales?: boolean;
      security?: boolean;
      achievements?: boolean;
    }
  ): Promise<void> {
    await supabase
      .from('users')
      .update({ notification_preferences: preferences })
      .eq('id', userId);
  }
}

export const notificationService = NotificationService.getInstance();