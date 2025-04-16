// Servicio para gestionar ventas y comisiones
import { supabase, Sale, User } from './supabase';

export class SalesService {
  private static instance: SalesService;

  private constructor() {}

  public static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
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
      .in('id', affiliateIds);

    // Crear lista de top afiliados
    const topAffiliates = (affiliates as Pick<User, 'id' | 'name'>[]).map(affiliate => ({
      id: affiliate.id,
      name: affiliate.name,
      sales: affiliateSales[affiliate.id].sales,
      commissions: affiliateSales[affiliate.id].commissions,
    })).sort((a, b) => b.commissions - a.commissions).slice(0, 5);

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
      .in('id', suspiciousAffiliateIds);

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
}

// Exportar instancia singleton
export const salesService = SalesService.getInstance();