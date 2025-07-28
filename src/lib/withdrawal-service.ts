import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  username: string;
  email: string;
  amount: number;
  payment_method: string;
  payment_details: any;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  timestamp: string;
  processed_at?: string;
  notes?: string;
}

export interface WithdrawalStats {
  total_requested: number;
  total_approved: number;
  total_pending: number;
  total_rejected: number;
  pending_amount: number;
  approved_amount: number;
}

class WithdrawalService {
  private static instance: WithdrawalService;
  private listeners: {
    onRequestReceived: ((request: WithdrawalRequest) => void)[];
    onStatusUpdated: ((request: WithdrawalRequest) => void)[];
  } = {
    onRequestReceived: [],
    onStatusUpdated: []
  };

  private constructor() {
    this.setupRealtimeSubscriptions();
  }

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  /**
   * Configura suscripciones en tiempo real
   */
  private setupRealtimeSubscriptions() {
    // Escuchar nuevas solicitudes de retiro
    supabase
      .channel('withdrawal_requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'withdrawals'
      }, async (payload) => {
        const newRequest = await this.formatWithdrawalRequest(payload.new);
        this.listeners.onRequestReceived.forEach(listener => listener(newRequest));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'withdrawals'
      }, async (payload) => {
        const updatedRequest = await this.formatWithdrawalRequest(payload.new);
        this.listeners.onStatusUpdated.forEach(listener => listener(updatedRequest));
      })
      .subscribe();
  }

  /**
   * Formatea una solicitud de retiro con información del usuario
   */
  private async formatWithdrawalRequest(withdrawalData: any): Promise<WithdrawalRequest> {
    // Obtener información del usuario
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers.users.find(u => u.id === withdrawalData.user_id);

    return {
      id: withdrawalData.id,
      user_id: withdrawalData.user_id,
      username: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Usuario',
      email: authUser?.email || 'No disponible',
      amount: withdrawalData.amount,
      payment_method: withdrawalData.payment_method,
      payment_details: withdrawalData.payment_details,
      status: withdrawalData.status,
      timestamp: withdrawalData.created_at,
      processed_at: withdrawalData.processed_at,
      notes: withdrawalData.payment_details?.rejection_reason || withdrawalData.notes
    };
  }

  /**
   * Obtiene todas las solicitudes de retiro
   */
  async getAllRequests(): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests = await Promise.all(
        data.map(withdrawal => this.formatWithdrawalRequest(withdrawal))
      );

      return formattedRequests;
    } catch (error) {
      console.error('Error obteniendo solicitudes de retiro:', error);
      return [];
    }
  }

  /**
   * Obtiene solicitudes de retiro por estado
   */
  async getRequestsByStatus(status: string): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests = await Promise.all(
        data.map(withdrawal => this.formatWithdrawalRequest(withdrawal))
      );

      return formattedRequests;
    } catch (error) {
      console.error('Error obteniendo solicitudes por estado:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de retiros
   */
  async getWithdrawalStats(): Promise<WithdrawalStats> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('amount, status');

      if (error) throw error;

      const stats = data.reduce((acc, withdrawal) => {
        const amount = parseFloat(withdrawal.amount);
        acc.total_requested += amount;

        switch (withdrawal.status) {
          case 'pending':
            acc.total_pending++;
            acc.pending_amount += amount;
            break;
          case 'approved':
          case 'completed':
            acc.total_approved++;
            acc.approved_amount += amount;
            break;
          case 'rejected':
            acc.total_rejected++;
            break;
        }

        return acc;
      }, {
        total_requested: 0,
        total_approved: 0,
        total_pending: 0,
        total_rejected: 0,
        pending_amount: 0,
        approved_amount: 0
      });

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas de retiros:', error);
      return {
        total_requested: 0,
        total_approved: 0,
        total_pending: 0,
        total_rejected: 0,
        pending_amount: 0,
        approved_amount: 0
      };
    }
  }

  /**
   * Actualiza el estado de una solicitud de retiro
   */
  async updateRequestStatus({
    requestId,
    status,
    notes
  }: {
    requestId: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    notes?: string;
  }): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        processed_at: new Date().toISOString()
      };

      if (notes) {
        // Obtener detalles actuales para preservar otros datos
        const { data: currentWithdrawal } = await supabase
          .from('withdrawals')
          .select('payment_details')
          .eq('id', requestId)
          .single();

        updateData.payment_details = {
          ...currentWithdrawal?.payment_details,
          notes: notes,
          ...(status === 'rejected' && { rejection_reason: notes })
        };
      }

      const { error } = await supabase
        .from('withdrawals')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // Si se aprueba, descontar del saldo del usuario
      if (status === 'completed' || status === 'approved') {
        await this.processApprovedWithdrawal(requestId);
      }

      return true;
    } catch (error) {
      console.error('Error actualizando estado de retiro:', error);
      return false;
    }
  }

  /**
   * Procesa un retiro aprobado (descuenta del saldo)
   */
  private async processApprovedWithdrawal(requestId: string): Promise<void> {
    try {
      // Obtener detalles del retiro
      const { data: withdrawal, error: withdrawalError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', requestId)
        .single();

      if (withdrawalError || !withdrawal) return;

      // Obtener saldo actual del usuario
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance, total_withdrawals')
        .eq('user_id', withdrawal.user_id)
        .single();

      if (profileError || !userProfile) return;

      // Verificar que tenga saldo suficiente
      if (userProfile.balance < withdrawal.amount) {
        console.error('Saldo insuficiente para procesar retiro');
        return;
      }

      // Actualizar saldo del usuario
      const newBalance = userProfile.balance - withdrawal.amount;
      const newTotalWithdrawals = (userProfile.total_withdrawals || 0) + withdrawal.amount;

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          total_withdrawals: newTotalWithdrawals,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', withdrawal.user_id);

      if (updateError) {
        console.error('Error actualizando saldo del usuario:', updateError);
        return;
      }

      // Registrar en logs de actividad
      await supabase
        .from('affiliate_activity_logs')
        .insert({
          user_id: withdrawal.user_id,
          activity_type: 'withdrawal_processed',
          details: {
            withdrawal_id: requestId,
            amount: withdrawal.amount,
            previous_balance: userProfile.balance,
            new_balance: newBalance,
            payment_method: withdrawal.payment_method
          },
          created_at: new Date().toISOString()
        });

    } catch (error) {
      console.error('Error procesando retiro aprobado:', error);
    }
  }

  /**
   * Suscribirse a nuevas solicitudes de retiro
   */
  onRequestReceived(callback: (request: WithdrawalRequest) => void): () => void {
    this.listeners.onRequestReceived.push(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.listeners.onRequestReceived.indexOf(callback);
      if (index > -1) {
        this.listeners.onRequestReceived.splice(index, 1);
      }
    };
  }

  /**
   * Suscribirse a actualizaciones de estado
   */
  onStatusUpdated(callback: (request: WithdrawalRequest) => void): () => void {
    this.listeners.onStatusUpdated.push(callback);
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.listeners.onStatusUpdated.indexOf(callback);
      if (index > -1) {
        this.listeners.onStatusUpdated.splice(index, 1);
      }
    };
  }
}

export default WithdrawalService;