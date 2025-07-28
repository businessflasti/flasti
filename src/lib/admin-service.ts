import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalSales: number;
  salesToday: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
  openConversations: number;
  totalEarnings: number;
  totalWithdrawals: number;
  activeUsers: number;
}

export interface UserProfile {
  user_id: string;
  email: string;
  balance: number;
  total_earnings: number;
  total_withdrawals: number;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  payment_method: string;
  payment_details: any;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  processed_at?: string;
  notes?: string;
}

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Verifica si un usuario es administrador
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Verificando admin para userId:', userId);
      
      // Lista de IDs de administradores (puedes moverlo a variables de entorno)
      const adminIds = process.env.ADMIN_USER_IDS?.split(',').filter(id => id.trim()) || [];
      console.log('📋 Admin IDs en env:', adminIds);
      
      if (adminIds.includes(userId)) {
        console.log('✅ Usuario encontrado en ADMIN_USER_IDS');
        return true;
      }

      // También verificar en base de datos si existe tabla de roles
      console.log('🔍 Verificando en base de datos...');
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'super_admin']);

      console.log('📊 Resultado DB:', { data, error });

      if (error) {
        console.error('❌ Error en consulta DB:', error);
        
        // Si hay error de recursión infinita o tabla no accesible, 
        // usar solo la verificación por variables de entorno
        if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
          console.log('⚠️ Problema de RLS detectado, usando solo ADMIN_USER_IDS');
          return adminIds.includes(userId);
        }
        
        return false;
      }

      const isAdmin = data && data.length > 0;
      console.log(isAdmin ? '✅ Usuario es admin en DB' : '❌ Usuario NO es admin');
      
      return isAdmin;
    } catch (error) {
      console.error('💥 Error verificando admin:', error);
      
      // Fallback: usar solo variables de entorno si hay cualquier error
      const adminIds = process.env.ADMIN_USER_IDS?.split(',').filter(id => id.trim()) || [];
      const isFallbackAdmin = adminIds.includes(userId);
      console.log(`🔄 Fallback admin check: ${isFallbackAdmin}`);
      
      return isFallbackAdmin;
    }
  }

  /**
   * Obtiene estadísticas del dashboard administrativo
   */
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Obtener total de usuarios
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Obtener usuarios nuevos hoy
      const { count: newUsersToday } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Obtener estadísticas de CPALead
      const { data: cpaLeadStats } = await supabase
        .from('cpalead_transactions')
        .select('amount, created_at')
        .eq('status', 'completed');

      const totalSales = cpaLeadStats?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      const salesToday = cpaLeadStats
        ?.filter(t => new Date(t.created_at) >= today)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      // Obtener retiros pendientes
      const { data: pendingWithdrawalsData, count: pendingWithdrawals } = await supabase
        .from('withdrawals')
        .select('amount', { count: 'exact' })
        .eq('status', 'pending');

      const pendingWithdrawalAmount = pendingWithdrawalsData
        ?.reduce((sum, w) => sum + parseFloat(w.amount), 0) || 0;

      // Obtener total de ganancias y retiros
      const { data: profileStats } = await supabase
        .from('user_profiles')
        .select('total_earnings, total_withdrawals, balance');

      const totalEarnings = profileStats?.reduce((sum, p) => sum + (p.total_earnings || 0), 0) || 0;
      const totalWithdrawals = profileStats?.reduce((sum, p) => sum + (p.total_withdrawals || 0), 0) || 0;
      const activeUsers = profileStats?.filter(p => (p.balance || 0) > 0).length || 0;

      return {
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        totalSales,
        salesToday,
        pendingWithdrawals: pendingWithdrawals || 0,
        pendingWithdrawalAmount,
        openConversations: 0, // Se calculará por separado
        totalEarnings,
        totalWithdrawals,
        activeUsers
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas admin:', error);
      return {
        totalUsers: 0,
        newUsersToday: 0,
        totalSales: 0,
        salesToday: 0,
        pendingWithdrawals: 0,
        pendingWithdrawalAmount: 0,
        openConversations: 0,
        totalEarnings: 0,
        totalWithdrawals: 0,
        activeUsers: 0
      };
    }
  }

  /**
   * Obtiene lista de usuarios con sus perfiles
   */
  async getUsers(limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          user_id,
          email,
          balance,
          total_earnings,
          total_withdrawals,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const usersWithEmails: UserProfile[] = data?.map(profile => {
        return {
          user_id: profile.user_id,
          email: profile.email || 'No disponible',
          balance: profile.balance || 0,
          total_earnings: profile.total_earnings || 0,
          total_withdrawals: profile.total_withdrawals || 0,
          created_at: profile.created_at,
          last_login: undefined, // No disponible sin auth.admin
          status: 'active' // Por defecto activo
        };
      }) || [];

      return usersWithEmails;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  /**
   * Obtiene solicitudes de retiro usando API route
   */
  async getWithdrawalRequests(status?: string): Promise<WithdrawalRequest[]> {
    try {
      console.log('🔍 Obteniendo solicitudes de retiro desde API...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No hay sesión activa');
        return [];
      }

      const response = await fetch('/api/admin/withdrawals', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Error en API:', data.error);
        return [];
      }

      let withdrawals = data.withdrawals || [];
      
      // Filtrar por estado si se especifica
      if (status) {
        withdrawals = withdrawals.filter((w: any) => w.status === status);
      }

      console.log('✅ Retiros obtenidos desde API:', withdrawals.length);
      return withdrawals;
    } catch (error) {
      console.error('💥 Error obteniendo retiros desde API:', error);
      return [];
    }
  }

  /**
   * Aprueba una solicitud de retiro usando API route
   */
  async approveWithdrawal(withdrawalId: string, adminId: string): Promise<boolean> {
    try {
      console.log('✅ Aprobando retiro:', withdrawalId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No hay sesión activa');
        return false;
      }

      const response = await fetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          status: 'approved'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al aprobar retiro');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Retiro aprobado exitosamente');
        return true;
      } else {
        console.error('❌ Error en respuesta:', data.error);
        return false;
      }
    } catch (error) {
      console.error('💥 Error aprobando retiro:', error);
      return false;
    }
  }

  /**
   * Rechaza una solicitud de retiro usando API route
   */
  async rejectWithdrawal(withdrawalId: string, reason: string, adminId: string): Promise<boolean> {
    try {
      console.log('❌ Rechazando retiro:', withdrawalId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No hay sesión activa');
        return false;
      }

      const response = await fetch('/api/admin/withdrawals', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          status: 'rejected',
          notes: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al rechazar retiro');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Retiro rechazado exitosamente');
        return true;
      } else {
        console.error('❌ Error en respuesta:', data.error);
        return false;
      }
    } catch (error) {
      console.error('💥 Error rechazando retiro:', error);
      return false;
    }
  }

  /**
   * Agrega saldo a un usuario (función administrativa)
   */
  async addUserBalance(userId: string, amount: number, reason: string, adminId: string): Promise<boolean> {
    try {
      // Obtener perfil actual del usuario
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (profileError || !userProfile) {
        throw new Error('Usuario no encontrado');
      }

      const newBalance = userProfile.balance + amount;

      // Actualizar saldo
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Registrar en logs de actividad
      await supabase
        .from('affiliate_activity_logs')
        .insert({
          user_id: userId,
          activity_type: 'admin_balance_adjustment',
          details: {
            amount: amount,
            reason: reason,
            admin_id: adminId,
            previous_balance: userProfile.balance,
            new_balance: newBalance
          },
          created_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Error agregando saldo:', error);
      return false;
    }
  }
}

export const adminService = AdminService.getInstance();