import { supabase } from './supabase';

export interface AdminDashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalSales: number;
  salesToday: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
  openConversations: number;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  level: number;
  totalSales: number;
  totalCommissions: number;
  totalWithdrawals: number;
  createdAt: Date;
  lastLoginAt?: Date;
  role: 'user' | 'admin' | 'super_admin';
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
   * Verifica si un usuario tiene rol de administrador
   */
  public async isAdmin(userId: string): Promise<boolean> {
    try {
      // Primero verificamos en localStorage (solución alternativa)
      if (typeof window !== 'undefined') {
        const isAdminInLocalStorage = localStorage.getItem('isAdmin') === 'true';
        if (isAdminInLocalStorage) {
          return true;
        }
      }

      // Luego intentamos verificar en la tabla user_roles
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();

        if (!error && data) {
          return data.role === 'admin' || data.role === 'super_admin';
        }
      } catch (roleError) {
        console.log('No se encontró en user_roles, verificando en user_profiles...');
      }

      // Si no encontramos en user_roles, verificamos el campo is_admin en user_profiles
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', userId)
          .single();

        if (!profileError && profileData && profileData.is_admin === true) {
          return true;
        }
      } catch (profileError) {
        console.log('Error al verificar is_admin en user_profiles:', profileError);
      }

      return false;
    } catch (error) {
      console.error('Error al verificar rol de administrador:', error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas para el panel de administración
   */
  public async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

      if (error) {
        console.error('Error al obtener estadísticas:', error);
        return {
          totalUsers: 0,
          newUsersToday: 0,
          totalSales: 0,
          salesToday: 0,
          pendingWithdrawals: 0,
          pendingWithdrawalAmount: 0,
          openConversations: 0
        };
      }

      return {
        totalUsers: data.total_users,
        newUsersToday: data.new_users_today,
        totalSales: data.total_sales,
        salesToday: data.sales_today,
        pendingWithdrawals: data.pending_withdrawals,
        pendingWithdrawalAmount: data.pending_withdrawal_amount,
        openConversations: data.open_conversations
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalUsers: 0,
        newUsersToday: 0,
        totalSales: 0,
        salesToday: 0,
        pendingWithdrawals: 0,
        pendingWithdrawalAmount: 0,
        openConversations: 0
      };
    }
  }

  /**
   * Obtiene la lista de usuarios
   */
  public async getUsers(
    search?: string,
    limit = 20,
    offset = 0
  ): Promise<{ users: UserData[]; total: number }> {
    try {
      let query = supabase
        .from('user_profiles')
        .select(`
          *,
          users:user_id (
            email,
            created_at,
            last_login_at
          ),
          roles:user_id (
            role
          )
        `, { count: 'exact' });

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error al obtener usuarios:', error);
        return { users: [], total: 0 };
      }

      // Obtener estadísticas adicionales para cada usuario
      const usersWithStats = await Promise.all(
        data.map(async (user) => {
          // Obtener total de ventas
          const { data: salesData } = await supabase
            .from('sales')
            .select('amount', { count: 'exact', head: true })
            .eq('affiliate_id', user.user_id);

          // Obtener total de comisiones
          const { data: commissionsData } = await supabase
            .from('commissions')
            .select('amount', { count: 'exact', head: true })
            .eq('user_id', user.user_id);

          // Obtener total de retiros
          const { data: withdrawalsData } = await supabase
            .from('withdrawal_requests')
            .select('amount', { count: 'exact', head: true })
            .eq('user_id', user.user_id)
            .eq('status', 'completed');

          return {
            id: user.user_id,
            email: user.users?.email || '',
            firstName: user.first_name,
            lastName: user.last_name,
            balance: user.balance || 0,
            level: user.level || 1,
            totalSales: salesData?.count || 0,
            totalCommissions: commissionsData?.count || 0,
            totalWithdrawals: withdrawalsData?.count || 0,
            createdAt: new Date(user.users?.created_at || user.created_at),
            lastLoginAt: user.users?.last_login_at ? new Date(user.users.last_login_at) : undefined,
            role: user.roles?.role || 'user'
          };
        })
      );

      return { users: usersWithStats, total: count || 0 };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { users: [], total: 0 };
    }
  }

  /**
   * Obtiene detalles de un usuario específico
   */
  public async getUserDetails(userId: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          users:user_id (
            email,
            created_at,
            last_login_at
          ),
          roles:user_id (
            role
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        console.error('Error al obtener detalles del usuario:', error);
        return null;
      }

      // Obtener estadísticas adicionales
      const [salesResult, commissionsResult, withdrawalsResult] = await Promise.all([
        supabase
          .from('sales')
          .select('amount', { count: 'exact', head: true })
          .eq('affiliate_id', userId),
        supabase
          .from('commissions')
          .select('amount', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('withdrawal_requests')
          .select('amount', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
      ]);

      return {
        id: data.user_id,
        email: data.users?.email || '',
        firstName: data.first_name,
        lastName: data.last_name,
        balance: data.balance || 0,
        level: data.level || 1,
        totalSales: salesResult.count || 0,
        totalCommissions: commissionsResult.count || 0,
        totalWithdrawals: withdrawalsResult.count || 0,
        createdAt: new Date(data.users?.created_at || data.created_at),
        lastLoginAt: data.users?.last_login_at ? new Date(data.users.last_login_at) : undefined,
        role: data.roles?.role || 'user'
      };
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      return null;
    }
  }

  /**
   * Actualiza el rol de un usuario
   */
  public async updateUserRole(
    userId: string,
    role: 'user' | 'admin' | 'super_admin'
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Verificar si ya existe un rol para el usuario
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        // Actualizar rol existente
        const { error } = await supabase
          .from('user_roles')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (error) {
          console.error('Error al actualizar rol:', error);
          return { success: false, message: error.message };
        }
      } else {
        // Crear nuevo rol
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (error) {
          console.error('Error al crear rol:', error);
          return { success: false, message: error.message };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar rol de usuario:', error);
      return { success: false, message: 'Error interno al actualizar rol' };
    }
  }

  /**
   * Actualiza el balance de un usuario
   */
  public async updateUserBalance(
    userId: string,
    amount: number,
    operation: 'add' | 'subtract'
  ): Promise<{ success: boolean; message?: string; newBalance?: number }> {
    try {
      // Obtener balance actual
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (userError) {
        console.error('Error al obtener balance del usuario:', userError);
        return { success: false, message: 'Usuario no encontrado' };
      }

      const currentBalance = userData.balance || 0;
      let newBalance = currentBalance;

      if (operation === 'add') {
        newBalance = currentBalance + amount;
      } else {
        // Verificar que hay suficiente balance
        if (currentBalance < amount) {
          return { success: false, message: 'Balance insuficiente' };
        }
        newBalance = currentBalance - amount;
      }

      // Actualizar balance
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ balance: newBalance })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error al actualizar balance:', updateError);
        return { success: false, message: updateError.message };
      }

      return {
        success: true,
        newBalance,
        message: `Balance ${operation === 'add' ? 'incrementado' : 'reducido'} correctamente`
      };
    } catch (error) {
      console.error('Error al actualizar balance:', error);
      return { success: false, message: 'Error interno al actualizar balance' };
    }
  }
}

export const adminService = AdminService.getInstance();
