// Servicio para gestionar comisiones y seguimiento de ventas de afiliados
import { supabase, Sale, User } from './supabase';
import { balanceService } from './balance-service';
import { trackingServiceEnhanced } from './tracking-service-enhanced';

export class CommissionService {
  private static instance: CommissionService;

  private constructor() {}

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  /**
   * Procesa una venta y acredita la comisión al afiliado correspondiente
   */
  public async processSale(saleData: {
    transactionId: string;
    appId: number;
    amount: number;
    buyerId: string;
    buyerEmail: string;
    ipAddress: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Verificar si la venta ya fue procesada
      const { data: existingSale } = await supabase
        .from('sales')
        .select('id')
        .eq('transaction_id', saleData.transactionId)
        .single();

      if (existingSale) {
        return { success: false, message: 'Venta ya procesada' };
      }

      // Verificar atribución de la venta
      const { shouldAttribute, affiliateId } = await trackingServiceEnhanced
        .getInstance()
        .shouldAttributeSale({ headers: { 'x-forwarded-for': saleData.ipAddress } } as Request, saleData.buyerId);

      if (!shouldAttribute || !affiliateId) {
        // Registrar venta sin comisión
        await this.registerSale({
          transactionId: saleData.transactionId,
          appId: saleData.appId,
          amount: saleData.amount,
          buyerId: saleData.buyerId,
          buyerEmail: saleData.buyerEmail,
          ipAddress: saleData.ipAddress,
          affiliateId: null,
          commission: 0
        });
        return { success: true, message: 'Venta registrada sin comisión' };
      }

      // Obtener información del afiliado
      const { data: affiliate } = await supabase
        .from('users')
        .select('*')
        .eq('id', affiliateId)
        .single();

      if (!affiliate) {
        return { success: false, message: 'Afiliado no encontrado' };
      }

      // Calcular comisión base según el nivel del afiliado
      const baseCommission = this.calculateBaseCommission(saleData.amount, affiliate.level);

      // Registrar venta con comisión
      const { data: sale } = await this.registerSale({
        transactionId: saleData.transactionId,
        appId: saleData.appId,
        amount: saleData.amount,
        buyerId: saleData.buyerId,
        buyerEmail: saleData.buyerEmail,
        ipAddress: saleData.ipAddress,
        affiliateId: affiliateId,
        commission: baseCommission
      });

      if (sale) {
        // Acreditar comisión al balance del afiliado
        await balanceService.creditCommission(affiliateId, sale.id);
      }

      return { success: true, message: 'Venta procesada y comisión acreditada' };
    } catch (error) {
      console.error('Error al procesar venta:', error);
      return { success: false, message: 'Error interno al procesar la venta' };
    }
  }

  /**
   * Registra una nueva venta en el sistema
   */
  private async registerSale(saleData: {
    transactionId: string;
    appId: number;
    amount: number;
    buyerId: string;
    buyerEmail: string;
    ipAddress: string;
    affiliateId: string | null;
    commission: number;
  }): Promise<{ data: Sale | null; error: any }> {
    return await supabase.from('sales').insert([
      {
        transaction_id: saleData.transactionId,
        app_id: saleData.appId,
        amount: saleData.amount,
        buyer_id: saleData.buyerId,
        buyer_email: saleData.buyerEmail,
        ip_address: saleData.ipAddress,
        affiliate_id: saleData.affiliateId,
        commission: saleData.commission,
        status: 'completed'
      }
    ]).select().single();
  }

  /**
   * Calcula la comisión base según el nivel del afiliado
   */
  private calculateBaseCommission(amount: number, level: number): number {
    const commissionRates = {
      1: 0.5, // 50%
      2: 0.6, // 60%
      3: 0.7  // 70%
    };

    return amount * (commissionRates[level as keyof typeof commissionRates] || 0.5);
  }
}

export const commissionService = CommissionService.getInstance();