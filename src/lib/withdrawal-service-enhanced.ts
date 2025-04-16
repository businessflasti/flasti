import { supabase } from './supabase';
import { affiliateNotificationService } from './affiliate-notification-service';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: {
    email?: string;
    name?: string;
    accountNumber?: string;
    bankName?: string;
    [key: string]: any;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

class WithdrawalServiceEnhanced {
  private static instance: WithdrawalServiceEnhanced;

  private constructor() {}

  public static getInstance(): WithdrawalServiceEnhanced {
    if (!WithdrawalServiceEnhanced.instance) {
      WithdrawalServiceEnhanced.instance = new WithdrawalServiceEnhanced();
    }
    return WithdrawalServiceEnhanced.instance;
  }

  /**
   * Crea una nueva solicitud de retiro
   */
  public async createWithdrawalRequest(
    userId: string,
    amount: number,
    paymentMethod: string,
    paymentDetails: any
  ): Promise<{ success: boolean; message: string; requestId?: string; newBalance?: number }> {
    try {
      // Verificar que el monto sea válido
      if (amount <= 0) {
        return { success: false, message: 'El monto debe ser mayor a cero' };
      }

      // Llamar a la función RPC para crear la solicitud
      const { data, error } = await supabase.rpc('create_withdrawal_request', {
        p_user_id: userId,
        p_amount: amount,
        p_payment_method: paymentMethod,
        p_payment_details: paymentDetails
      });

      if (error) {
        console.error('Error al crear solicitud de retiro:', error);
        return { success: false, message: error.message };
      }

      return {
        success: data.success,
        message: data.message,
        requestId: data.request_id,
        newBalance: data.new_balance
      };
    } catch (error) {
      console.error('Error al crear solicitud de retiro:', error);
      return { success: false, message: 'Error interno al procesar la solicitud' };
    }
  }

  /**
   * Obtiene todas las solicitudes de retiro de un usuario
   */
  public async getUserWithdrawalRequests(userId: string): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // Evitar mostrar el error en la consola
        return [];
      }

      return data.map(this.mapWithdrawalRequest);
    } catch (error) {
      console.error('Error al obtener solicitudes de retiro:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las solicitudes de retiro pendientes (para administradores)
   */
  public async getPendingWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          user_profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        return [];
      }

      return data.map((item) => ({
        ...this.mapWithdrawalRequest(item),
        userProfile: item.user_profiles
      }));
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las solicitudes de retiro (para administradores)
   */
  public async getAllWithdrawalRequests(
    status?: 'pending' | 'approved' | 'rejected' | 'completed',
    limit = 50,
    offset = 0
  ): Promise<{ requests: WithdrawalRequest[]; total: number }> {
    try {
      let query = supabase
        .from('withdrawal_requests')
        .select(`
          *,
          user_profiles:user_id (
            first_name,
            last_name,
            email
          )
        `, { count: 'exact' });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error al obtener todas las solicitudes:', error);
        return { requests: [], total: 0 };
      }

      const requests = data.map((item) => ({
        ...this.mapWithdrawalRequest(item),
        userProfile: item.user_profiles
      }));

      return { requests, total: count || 0 };
    } catch (error) {
      console.error('Error al obtener todas las solicitudes:', error);
      return { requests: [], total: 0 };
    }
  }

  /**
   * Actualiza el estado de una solicitud de retiro (para administradores)
   */
  public async updateWithdrawalStatus(
    requestId: string,
    status: 'approved' | 'rejected' | 'completed',
    adminNotes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Obtener información de la solicitud antes de actualizarla
      const { data: requestData, error: requestError } = await supabase
        .from('withdrawal_requests')
        .select('user_id, amount, status')
        .eq('id', requestId)
        .single();

      if (requestError) {
        console.error('Error al obtener información de la solicitud:', requestError);
        return { success: false, message: 'Error al obtener información de la solicitud' };
      }

      // Llamar a la función RPC para actualizar el estado
      const { data, error } = await supabase.rpc('update_withdrawal_request_status', {
        p_request_id: requestId,
        p_status: status,
        p_admin_notes: adminNotes
      });

      if (error) {
        console.error('Error al actualizar estado de retiro:', error);
        return { success: false, message: error.message };
      }

      // Enviar notificación al usuario
      await affiliateNotificationService.notifyWithdrawalStatusChange(
        requestData.user_id,
        requestId,
        status,
        requestData.amount
      );

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('Error al actualizar estado de retiro:', error);
      return { success: false, message: 'Error interno al procesar la solicitud' };
    }
  }

  /**
   * Mapea los datos de la base de datos al formato de la interfaz
   */
  private mapWithdrawalRequest(data: any): WithdrawalRequest {
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      paymentMethod: data.payment_method,
      paymentDetails: data.payment_details,
      status: data.status,
      adminNotes: data.admin_notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

export const withdrawalServiceEnhanced = WithdrawalServiceEnhanced.getInstance();
