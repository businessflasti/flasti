// Servicio mejorado para gestionar ventas y comisiones
import { supabase, Sale, User } from './supabase';

export class SalesServiceEnhanced {
  private static instance: SalesServiceEnhanced;

  private constructor() {}

  public static getInstance(): SalesServiceEnhanced {
    if (!SalesServiceEnhanced.instance) {
      SalesServiceEnhanced.instance = new SalesServiceEnhanced();
    }
    return SalesServiceEnhanced.instance;
  }

  /**
   * Obtiene todas las ventas registradas
   */
  public async getAllSales(): Promise<Sale[]> {
    const { data } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });

    return data as Sale[] || [];
  }

  /**
   * Obtiene las ventas de un afiliado específico
   */
  public async getAffiliateSales(affiliateId: string): Promise<Sale[]> {
    const { data } = await supabase
      .from('sales')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false });

    return data as Sale[] || [];
  }

  /**
   * Obtiene el resumen de ventas para el panel de administración
   */
  public async getSalesSummary(): Promise<{
    totalSales: number;
    totalAmount: number;
    totalCommissions: number;
    topAffiliates: { id: string; name: string; sales: number; commissions: number }[];
  }> {
    // Obtener todas las ventas
    const { data: sales } = await supabase
      .from('sales')
      .select('*');

    const allSales = sales as Sale[] || [];

    // Calcular totales
    const totalSales = allSales.length;
    const totalAmount = allSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalCommissions = allSales.reduce((sum, sale) => sum + sale.commission, 0);

    // Agrupar ventas por afiliado
    const affiliateSales: Record<string, { sales: number; commissions: number }> = {};
    
    allSales.forEach(sale => {
      if (sale.affiliate_id) {
        if (!affiliateSales[sale.affiliate_id]) {
          affiliateSales[sale.affiliate_id] = { sales: 0, commissions: 0 };
        }
        affiliateSales[sale.affiliate_id].sales += 1;
        affiliateSales[sale.affiliate_id].commissions += sale.commission;
      }
    });

    // Obtener información de los afiliados
    const affiliateIds = Object.keys(affiliateSales);
    const { data: affiliates } = await supabase
      .from('users')
      .select('id, name')
      .in('id', affiliateIds.length > 0 ? affiliateIds : [0]);

    // Crear lista de top afiliados
    const topAffiliates = (affiliates as Pick<User, 'id' | 'name'>[]).map(affiliate => ({
      id: affiliate.id,
      name: affiliate.name,
      sales: affiliateSales[affiliate.id].sales,
      commissions: affiliateSales[affiliate.id].commissions,
    })).sort((a, b) => b.commissions - a.commissions).slice(0, 10);

    return {
      totalSales,
      totalAmount,
      totalCommissions,
      topAffiliates,
    };
  }

  /**
   * Detecta posibles fraudes en las ventas
   */
  public async detectFraudulentActivity(): Promise<{
    suspiciousIps: { ip: string; count: number }[];
    suspiciousUsers: { id: string; name: string; count: number }[];
  }> {
    // Obtener todas las ventas
    const { data: sales } = await supabase
      .from('sales')
      .select('*');

    const allSales = sales as Sale[] || [];

    // Agrupar por IP
    const ipCounts: Record<string, number> = {};
    allSales.forEach(sale => {
      if (sale.ip_address) {
        ipCounts[sale.ip_address] = (ipCounts[sale.ip_address] || 0) + 1;
      }
    });

    // Identificar IPs sospechosas (más de 5 ventas desde la misma IP)
    const suspiciousIps = Object.entries(ipCounts)
      .filter(([_, count]) => count > 5)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count);

    // Agrupar por afiliado
    const affiliateCounts: Record<string, number> = {};
    allSales.forEach(sale => {
      if (sale.affiliate_id) {
        affiliateCounts[sale.affiliate_id] = (affiliateCounts[sale.affiliate_id] || 0) + 1;
      }
    });

    // Obtener información de los afiliados con muchas ventas
    const suspiciousAffiliateIds = Object.entries(affiliateCounts)
      .filter(([_, count]) => count > 20) // Umbral arbitrario para considerar sospechoso
      .map(([id]) => id);

    const { data: suspiciousAffiliatesData } = await supabase
      .from('users')
      .select('id, name')
      .in('id', suspiciousAffiliateIds.length > 0 ? suspiciousAffiliateIds : [0]);

    const suspiciousUsers = (suspiciousAffiliatesData as Pick<User, 'id' | 'name'>[]).map(user => ({
      id: user.id,
      name: user.name,
      count: affiliateCounts[user.id],
    })).sort((a, b) => b.count - a.count);

    return {
      suspiciousIps,
      suspiciousUsers,
    };
  }

  /**
   * Obtiene el historial de comisiones de un afiliado
   */
  public async getAffiliateCommissionHistory(affiliateId: string): Promise<{
    commissions: Array<{
      date: string;
      amount: number;
      app_id: number;
      app_name: string;
    }>;
    totalCommission: number;
  }> {
    // Obtener todas las ventas del afiliado
    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false });

    const affiliateSales = sales as Sale[] || [];

    // Obtener información de las apps
    const appIds = [...new Set(affiliateSales.map(sale => sale.app_id))];
    const { data: apps } = await supabase
      .from('apps')
      .select('id, name')
      .in('id', appIds.length > 0 ? appIds : [0]);

    const appNames = (apps || []).reduce((acc, app) => {
      acc[app.id] = app.name;
      return acc;
    }, {} as Record<number, string>);

    // Formatear comisiones
    const commissions = affiliateSales.map(sale => ({
      date: sale.created_at,
      amount: sale.commission,
      app_id: sale.app_id,
      app_name: appNames[sale.app_id] || `App ${sale.app_id}`,
    }));

    // Calcular total
    const totalCommission = commissions.reduce((sum, commission) => sum + commission.amount, 0);

    return {
      commissions,
      totalCommission,
    };
  }

  /**
   * Verifica si una venta es potencialmente fraudulenta
   */
  public async checkFraudulentSale(sale: Sale): Promise<{
    isFraudulent: boolean;
    reasons: string[];
  }> {
    const reasons: string[] = [];

    // Verificar si hay múltiples ventas desde la misma IP
    const { data: ipSales } = await supabase
      .from('sales')
      .select('*')
      .eq('ip_address', sale.ip_address)
      .neq('id', sale.id);

    if (ipSales && ipSales.length > 5) {
      reasons.push(`Múltiples ventas (${ipSales.length}) desde la misma IP`);
    }

    // Verificar si hay ventas rápidas del mismo afiliado
    if (sale.affiliate_id) {
      const oneHourAgo = new Date(new Date(sale.created_at).getTime() - 60 * 60 * 1000).toISOString();
      
      const { data: recentSales } = await supabase
        .from('sales')
        .select('*')
        .eq('affiliate_id', sale.affiliate_id)
        .gte('created_at', oneHourAgo)
        .neq('id', sale.id);

      if (recentSales && recentSales.length > 3) {
        reasons.push(`${recentSales.length} ventas del mismo afiliado en la última hora`);
      }
    }

    return {
      isFraudulent: reasons.length > 0,
      reasons,
    };
  }
}

// Exportar instancia singleton
export const salesServiceEnhanced = SalesServiceEnhanced.getInstance();