import { supabase } from './supabase';

export class AffiliatePaymentService {
  /**
   * Obtiene el saldo disponible para retirar de un afiliado
   * @param affiliateId ID del afiliado
   * @returns Saldo disponible
   */
  static async getAvailableBalance(affiliateId: string): Promise<number> {
    try {
      // Obtener el total de comisiones ganadas
      const { data: salesData, error: salesError } = await supabase
        .from('affiliate_sales')
        .select('commission_amount')
        .eq('affiliate_id', affiliateId)
        .eq('status', 'approved');
      
      if (salesError) {
        console.error('Error al obtener ventas:', salesError);
        return 0;
      }
      
      // Calcular el total de comisiones
      const totalCommission = salesData?.reduce((sum, sale) => sum + (sale.commission_amount || 0), 0) || 0;
      
      // Obtener el total de pagos realizados
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('affiliate_payments')
        .select('amount')
        .eq('affiliate_id', affiliateId)
        .in('status', ['completed', 'processing']);
      
      if (paymentsError) {
        console.error('Error al obtener pagos:', paymentsError);
        return 0;
      }
      
      // Calcular el total de pagos
      const totalPayments = paymentsData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      
      // Calcular el saldo disponible
      const availableBalance = totalCommission - totalPayments;
      
      return Math.max(0, availableBalance);
    } catch (error) {
      console.error('Error al calcular saldo disponible:', error);
      return 0;
    }
  }

  /**
   * Obtiene el historial de pagos de un afiliado
   * @param affiliateId ID del afiliado
   * @returns Historial de pagos
   */
  static async getPaymentHistory(affiliateId: string) {
    try {
      const { data, error } = await supabase
        .from('affiliate_payments')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al obtener historial de pagos:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, payments: data || [] };
    } catch (error) {
      console.error('Error en getPaymentHistory:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Solicita un pago para un afiliado
   * @param affiliateId ID del afiliado
   * @param amount Monto a retirar
   * @param paymentMethod Método de pago
   * @param paymentDetails Detalles del pago (cuenta, etc.)
   * @returns Resultado de la operación
   */
  static async requestPayment(
    affiliateId: string,
    amount: number,
    paymentMethod: string,
    paymentDetails: string
  ) {
    try {
      // Verificar que el monto sea válido
      if (amount <= 0) {
        return { success: false, error: 'El monto debe ser mayor a cero' };
      }
      
      // Verificar que el afiliado tenga saldo suficiente
      const availableBalance = await this.getAvailableBalance(affiliateId);
      if (amount > availableBalance) {
        return { 
          success: false, 
          error: 'Saldo insuficiente',
          availableBalance
        };
      }
      
      // Crear la solicitud de pago
      const { data, error } = await supabase
        .from('affiliate_payments')
        .insert({
          affiliate_id: affiliateId,
          amount,
          payment_method: paymentMethod,
          status: 'pending',
          notes: paymentDetails
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error al solicitar pago:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, payment: data };
    } catch (error) {
      console.error('Error en requestPayment:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Verifica si un afiliado puede solicitar un pago
   * @param affiliateId ID del afiliado
   * @param minAmount Monto mínimo para retirar
   * @returns Resultado de la verificación
   */
  static async canRequestPayment(affiliateId: string, minAmount: number = 50) {
    try {
      // Obtener el saldo disponible
      const availableBalance = await this.getAvailableBalance(affiliateId);
      
      // Verificar si hay pagos pendientes
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('affiliate_payments')
        .select('id')
        .eq('affiliate_id', affiliateId)
        .eq('status', 'pending')
        .limit(1);
      
      if (pendingError) {
        console.error('Error al verificar pagos pendientes:', pendingError);
        return { 
          success: false, 
          error: pendingError.message,
          canRequest: false
        };
      }
      
      const hasPendingPayments = pendingPayments && pendingPayments.length > 0;
      
      return {
        success: true,
        canRequest: availableBalance >= minAmount && !hasPendingPayments,
        availableBalance,
        hasPendingPayments,
        minAmount
      };
    } catch (error) {
      console.error('Error en canRequestPayment:', error);
      return { 
        success: false, 
        error: 'Error interno del servidor',
        canRequest: false
      };
    }
  }
}
