// Servicio para gestionar el balance y comisiones de los usuarios
import { supabase, User, Sale } from './supabase';
import { RewardsService } from './rewards-service';

export class BalanceService {
  private static instance: BalanceService;
  private rewardsService: RewardsService;

  private constructor() {
    this.rewardsService = RewardsService.getInstance();
  }

  public static getInstance(): BalanceService {
    if (!BalanceService.instance) {
      BalanceService.instance = new BalanceService();
    }
    return BalanceService.instance;
  }

  /**
   * Acredita una comisión al balance del usuario
   */
  public async creditCommission(userId: string, saleId: string): Promise<{ success: boolean; message?: string }> {
    try {
      // Obtener detalles de la venta
      const { data: sale } = await supabase
        .from('sales')
        .select('*')
        .eq('id', saleId)
        .single();

      if (!sale) {
        return { success: false, message: 'Venta no encontrada' };
      }

      // Verificar que el usuario es el afiliado correcto
      if (sale.affiliate_id !== userId) {
        return { success: false, message: 'Usuario no autorizado para esta comisión' };
      }

      // Obtener nivel actual del usuario para calcular bonificaciones
      const { level } = await this.rewardsService.calculateAffiliateLevel(userId);
      const { commissionBonus } = this.rewardsService.getLevelBenefits(level);

      // Calcular comisión final con bonificación
      const finalCommission = sale.commission * (1 + commissionBonus / 100);

      // Actualizar balance del usuario
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return { success: false, message: 'Error al obtener balance del usuario' };
      }

      const newBalance = user.balance + finalCommission;

      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (updateError) {
        return { success: false, message: 'Error al actualizar balance' };
      }

      // Registrar la transacción
      await this.logTransaction(userId, saleId, finalCommission);

      return { success: true, message: 'Comisión acreditada correctamente' };
    } catch (error) {
      console.error('Error al acreditar comisión:', error);
      return { success: false, message: 'Error interno al procesar la comisión' };
    }
  }

  /**
   * Obtiene el balance actual del usuario
   */
  public async getUserBalance(userId: string): Promise<{ balance: number; pendingCommissions: number }> {
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', userId)
      .single();

    // Obtener comisiones pendientes
    const { data: pendingSales } = await supabase
      .from('sales')
      .select('commission')
      .eq('affiliate_id', userId)
      .eq('status', 'pending');

    const pendingCommissions = pendingSales
      ? pendingSales.reduce((sum, sale) => sum + sale.commission, 0)
      : 0;

    return {
      balance: user?.balance || 0,
      pendingCommissions
    };
  }

  /**
   * Registra una transacción en el historial
   */
  private async logTransaction(userId: string, saleId: string, amount: number): Promise<void> {
    await supabase.from('transactions').insert({
      user_id: userId,
      sale_id: saleId,
      amount,
      type: 'commission',
      status: 'completed'
    });
  }
}

export const balanceService = BalanceService.getInstance();