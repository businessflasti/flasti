// Servicio mejorado para gestionar enlaces de afiliados
import { supabase, AffiliateLink, App } from './supabase';

// Interfaces para estadísticas
export interface AffiliateStats {
  totalClicks: number;
  totalSales: number;
  totalCommission: number;
  linkStats: AppStats[];
  dailyStats: DailyStats[];
}

export interface AppStats {
  appId: number;
  appName: string;
  clicks: number;
  sales: number;
  commission: number;
}

export interface DailyStats {
  date: string;
  clicks: number;
  sales: number;
  commission: number;
}

export class AffiliateServiceEnhanced {
  private static instance: AffiliateServiceEnhanced;

  private constructor() {}

  public static getInstance(): AffiliateServiceEnhanced {
    if (!AffiliateServiceEnhanced.instance) {
      AffiliateServiceEnhanced.instance = new AffiliateServiceEnhanced();
    }
    return AffiliateServiceEnhanced.instance;
  }

  /**
   * Genera un enlace de afiliado único para un usuario y una aplicación
   */
  public async generateAffiliateLink(userId: string, appId: number): Promise<{ success: boolean; link?: AffiliateLink; message?: string }> {
    try {
      // Verificar si ya existe un enlace para este usuario y app
      const { data: existingLink, error: searchError } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('user_id', userId)
        .eq('app_id', appId)
        .single();

      if (existingLink) {
        return { success: true, link: existingLink as AffiliateLink, message: 'Enlace existente recuperado' };
      }

      // Generar nuevo enlace
      let url;

      // Obtener información de la app
      const { data: appData, error: appError } = await supabase
        .from('apps')
        .select('url')
        .eq('id', appId)
        .single();

      if (appError) {
        throw appError;
      }

      // Generar URL específica según la app
      if (appData && appData.url) {
        // Usar la URL de la base de datos
        url = `${appData.url}?ref=${userId}`;
      } else {
        // URL de respaldo en caso de que no se encuentre la app
        if (appId === 1) {
          // Flasti Images
          url = `https://flasti.com/images?ref=${userId}`;
        } else if (appId === 2) {
          // Flasti AI
          url = `https://flasti.com/ai?ref=${userId}`;
        } else {
          // URL genérica para otras apps
          url = `https://flasti.com/app/${appId}?ref=${userId}`;
        }
      }

      const newLink: Omit<AffiliateLink, 'id' | 'created_at'> = {
        user_id: userId,
        app_id: appId,
        url,
      };

      const { data: linkData, error: insertError } = await supabase
        .from('affiliate_links')
        .insert([newLink])
        .select()
        .single();

      if (insertError) {
        return { success: false, message: 'Error al crear enlace de afiliado' };
      }

      // Registrar la creación del enlace para auditoría
      await this.logLinkCreation(userId, appId, url);

      return { success: true, link: linkData as AffiliateLink, message: 'Enlace creado correctamente' };
    } catch (error) {
      console.error('Error al generar enlace de afiliado:', error);
      return { success: false, message: 'Error interno al generar enlace' };
    }
  }

  /**
   * Obtiene todos los enlaces de afiliado de un usuario
   */
  public async getUserAffiliateLinks(userId: string): Promise<{ links: AffiliateLink[]; apps: Record<number, App> }> {
    // Obtener todos los enlaces del usuario
    const { data: links } = await supabase
      .from('affiliate_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const userLinks = links as AffiliateLink[] || [];

    // Obtener información de todas las apps relacionadas
    const appIds = [...new Set(userLinks.map(link => link.app_id))];

    const { data: appsData } = await supabase
      .from('apps')
      .select('*')
      .in('id', appIds.length > 0 ? appIds : [0]);

    const apps = (appsData as App[] || []).reduce((acc, app) => {
      acc[app.id] = app;
      return acc;
    }, {} as Record<number, App>);

    return { links: userLinks, apps };
  }

  /**
   * Obtiene todas las aplicaciones disponibles para promocionar
   */
  public async getAvailableApps(): Promise<App[]> {
    const { data } = await supabase
      .from('apps')
      .select('*')
      .order('id');

    return data as App[] || [];
  }

  /**
   * Obtiene información de una aplicación específica
   */
  public async getAppById(appId: number): Promise<App | null> {
    const { data } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single();

    return data as App || null;
  }

  /**
   * Obtiene estadísticas de rendimiento de los enlaces de afiliado de un usuario
   */
  public async getLinkPerformance(userId: string): Promise<{
    totalClicks: number;
    totalSales: number;
    totalCommission: number;
    linkStats: Array<{
      linkId: string;
      appId: number;
      appName: string;
      clicks: number;
      sales: number;
      commission: number;
      conversionRate: number;
    }>;
  }> {
    // Obtener todos los enlaces del usuario
    const { links, apps } = await this.getUserAffiliateLinks(userId);

    // Obtener estadísticas de clics para cada enlace
    const { data: visitsData } = await supabase
      .from('affiliate_visits')
      .select('affiliate_id, app_id, count')
      .eq('affiliate_id', userId)
      .group('affiliate_id, app_id');

    const visits = visitsData || [];

    // Obtener estadísticas de ventas para cada enlace
    const { data: salesData } = await supabase
      .from('sales')
      .select('affiliate_id, app_id, amount, commission')
      .eq('affiliate_id', userId);

    const sales = salesData || [];

    // Calcular estadísticas para cada enlace
    const linkStats = links.map(link => {
      const appClicks = visits.find(v => v.app_id === link.app_id)?.count || 0;
      const appSales = sales.filter(s => s.app_id === link.app_id);
      const appSalesCount = appSales.length;
      const appCommission = appSales.reduce((sum, sale) => sum + sale.commission, 0);
      const conversionRate = appClicks > 0 ? (appSalesCount / appClicks) * 100 : 0;

      return {
        linkId: link.id,
        appId: link.app_id,
        appName: apps[link.app_id]?.name || `App ${link.app_id}`,
        clicks: appClicks,
        sales: appSalesCount,
        commission: appCommission,
        conversionRate,
      };
    });

    // Calcular totales
    const totalClicks = linkStats.reduce((sum, stat) => sum + stat.clicks, 0);
    const totalSales = linkStats.reduce((sum, stat) => sum + stat.sales, 0);
    const totalCommission = linkStats.reduce((sum, stat) => sum + stat.commission, 0);

    return {
      totalClicks,
      totalSales,
      totalCommission,
      linkStats,
    };
  }

  /**
   * Registra una visita a través de un enlace de afiliado y actualiza el contador de clics
   */
  public async trackVisit(referralCode: string, appId: number, ipAddress: string, userAgent: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log(`Registrando visita: Afiliado=${referralCode}, App=${appId}, IP=${ipAddress}`);

      // Registrar la visita en la tabla affiliate_visits
      const { error: visitError } = await supabase
        .from('affiliate_visits')
        .insert({
          affiliate_id: referralCode,
          app_id: appId,
          ip_address: ipAddress,
          user_agent: userAgent
        });

      if (visitError) {
        console.error('Error al registrar visita:', visitError);
        throw visitError;
      }

      // Incrementar el contador de clics en la tabla affiliate_links
      try {
        // Primero intentamos usar la función RPC si está disponible
        const { error: rpcError } = await supabase.rpc('increment_affiliate_clicks', {
          affiliate_id_param: referralCode,
          app_id_param: appId
        });

        if (rpcError) {
          console.warn('Error al usar RPC para incrementar clics, usando actualización directa:', rpcError);

          // Si falla la función RPC, hacemos una actualización directa
          const { error: updateError } = await supabase
            .from('affiliate_links')
            .update({ clicks: supabase.sql`clicks + 1` })
            .eq('user_id', referralCode)
            .eq('app_id', appId);

          if (updateError) {
            console.error('Error al actualizar contador de clics:', updateError);
            throw updateError;
          }
        }
      } catch (error) {
        console.error('Error al incrementar contador de clics:', error);
        // No lanzamos el error para que al menos se registre la visita
      }

      // Registrar la actividad para auditoría
      await supabase.from('affiliate_activity_logs').insert([{
        user_id: referralCode,
        activity_type: 'link_visit',
        details: JSON.stringify({
          app_id: appId,
          ip_address: ipAddress,
          timestamp: new Date().toISOString()
        })
      }]);

      console.log(`Visita registrada correctamente para afiliado ${referralCode} en app ${appId}`);
      return { success: true, message: 'Visita registrada correctamente' };
    } catch (error) {
      console.error('Error al registrar visita de afiliado:', error);
      return { success: false, message: 'Error al registrar visita' };
    }
  }

  /**
   * Registra la creación de un enlace para auditoría
   */
  private async logLinkCreation(userId: string, appId: number, url: string): Promise<void> {
    try {
      await supabase.from('affiliate_activity_logs').insert([{
        user_id: userId,
        activity_type: 'link_creation',
        details: JSON.stringify({
          app_id: appId,
          url,
          timestamp: new Date().toISOString()
        })
      }]);
    } catch (error) {
      console.error('Error al registrar creación de enlace:', error);
    }
  }

  /**
   * Registra una venta y asigna comisión al afiliado
   *
   * El sistema de comisiones funciona con los siguientes niveles:
   * - Nivel 1: 50% de comisión (nivel inicial)
   * - Nivel 2: 60% de comisión (se desbloquea al alcanzar $20 de balance)
   * - Nivel 3: 70% de comisión (se desbloquea al alcanzar $30 de balance)
   *
   * Ejemplo: Si un usuario de nivel 1 genera una venta de $7, recibirá $3.50 de comisión (50%)
   *
   * @returns Objeto con el resultado de la operación
   */
  public async registerSale(transactionId: string, appId: number, amount: number, referralCode: string | null, buyerEmail: string, ipAddress: string): Promise<{ success: boolean; error?: string; commission?: number }> {
    try {
      // Si no hay código de referido, no hay comisión
      if (!referralCode) {
        return {
          success: false,
          error: 'No hay código de referido',
          commission: 0
        };
      }

      // Obtener el nivel del usuario afiliado y la app
      const [userResponse, appResponse] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('level')
          .eq('user_id', referralCode)
          .single(),
        supabase
          .from('apps')
          .select('name, price, commission_rates')
          .eq('id', appId)
          .single()
      ]);

      if (userResponse.error) {
        throw userResponse.error;
      }

      if (appResponse.error) {
        throw appResponse.error;
      }

      const userData = userResponse.data;
      const appData = appResponse.data;

      // Obtener la tasa de comisión según el nivel del usuario y la app
      let commissionRate = 0;

      // Si la app tiene tasas de comisión específicas por nivel
      if (appData.commission_rates && typeof appData.commission_rates === 'object') {
        const userLevel = userData?.level || 1;
        // Convertir a string para acceder al objeto
        const userLevelKey = userLevel.toString();
        commissionRate = appData.commission_rates[userLevelKey] || 50;
      } else {
        // Tasas de comisión por defecto si no están definidas en la app
        // Usar los mismos niveles y tasas que en UserLevelContext
        switch (userData?.level) {
          case 1:
            commissionRate = 50; // 50%
            break;
          case 2:
            commissionRate = 60; // 60%
            break;
          case 3:
            commissionRate = 70; // 70%
            break;
          default:
            commissionRate = 50; // Por defecto 50% (Nivel 1)
        }
      }

      // Calcular la comisión
      const commissionAmount = (amount * commissionRate) / 100;

      // Registrar la venta
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          transaction_id: transactionId,
          app_id: appId,
          amount: amount,
          commission: commissionAmount,
          affiliate_id: referralCode,
          buyer_email: buyerEmail,
          ip_address: ipAddress,
          status: 'completed'
        })
        .select()
        .single();

      if (saleError) {
        console.error('Error al registrar venta:', saleError);
        return {
          success: false,
          error: 'Error al registrar venta: ' + saleError.message
        };
      }

      // Registrar la comisión
      const { error: commissionError } = await supabase
        .from('commissions')
        .insert({
          user_id: referralCode,
          sale_id: saleData.id,
          amount: commissionAmount,
          status: 'pending'
        });

      if (commissionError) {
        console.error('Error al registrar comisión:', commissionError);
        return {
          success: false,
          error: 'Error al registrar comisión: ' + commissionError.message
        };
      }

      // Actualizar el balance del usuario
      // Esta función RPC actualiza el balance y el nivel del usuario automáticamente
      // basado en los umbrales definidos: Nivel 2 a $20, Nivel 3 a $30
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_id_param: referralCode,
        amount_param: commissionAmount
      });

      if (balanceError) {
        console.error('Error al actualizar balance:', balanceError);
        return {
          success: false,
          error: 'Error al actualizar balance: ' + balanceError.message
        };
      }

      // Registrar la actividad
      await supabase.from('affiliate_activity_logs').insert([{
        user_id: referralCode,
        activity_type: 'sale',
        details: JSON.stringify({
          transaction_id: transactionId,
          app_id: appId,
          amount: amount,
          commission: commissionAmount,
          timestamp: new Date().toISOString()
        })
      }]);

      return {
        success: true,
        commission: commissionAmount
      };
    } catch (error: any) {
      console.error('Error al registrar venta:', error);
      return {
        success: false,
        error: error.message || 'Error desconocido al registrar venta'
      };
    }
  }

  /**
   * Obtiene estadísticas de afiliado para un usuario
   */
  public async getAffiliateStats(userId: string, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<AffiliateStats> {
    try {
      // Verificar si las tablas existen antes de consultar
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .in('table_name', ['affiliate_clicks', 'affiliate_sales'])
        .limit(2);

      // Si hay un error o no existen las tablas, devolver estadísticas en cero
      if (tableError || !tableInfo || tableInfo.length < 2) {
        console.warn('Las tablas de estadísticas no existen o no están disponibles');
        return {
          totalClicks: 0,
          totalSales: 0,
          totalCommission: 0,
          linkStats: [],
          dailyStats: []
        };
      }

      // Obtener datos de clics
      const { data: clicksData, error: clicksError } = await supabase
        .from('affiliate_clicks')
        .select(`
          id,
          created_at,
          affiliate_links!inner(app_id, user_id, apps(id, name, commission_rate))
        `)
        .eq('affiliate_links.user_id', userId)
        .gte('created_at', this.getStartDateForRange(timeRange));

      // Si hay un error, registrarlo pero continuar con valores en cero
      if (clicksError) {
        console.error('Error al obtener datos de clics:', clicksError);
        clicksData = [];
      }

      // Obtener datos de ventas
      const { data: salesData, error: salesError } = await supabase
        .from('affiliate_sales')
        .select(`
          id,
          created_at,
          amount,
          commission_amount,
          affiliate_links!inner(app_id, user_id, apps(id, name, commission_rate))
        `)
        .eq('affiliate_links.user_id', userId)
        .gte('created_at', this.getStartDateForRange(timeRange));

      // Si hay un error, registrarlo pero continuar con valores en cero
      if (salesError) {
        console.error('Error al obtener datos de ventas:', salesError);
        salesData = [];
      }

      // Procesar datos para estadísticas
      const appStatsMap = new Map<number, AppStats>();
      const dailyStatsMap = new Map<string, DailyStats>();
      let totalClicks = 0;
      let totalSales = 0;
      let totalCommission = 0;

      // Procesar clics
      if (clicksData && Array.isArray(clicksData) && clicksData.length > 0) {
        clicksData.forEach((click: any) => {
          try {
            const appId = click.affiliate_links.app_id;
            const appName = click.affiliate_links.apps.name;
            const clickDate = new Date(click.created_at).toISOString().split('T')[0];

            // Actualizar estadísticas por app
            if (!appStatsMap.has(appId)) {
              appStatsMap.set(appId, {
                appId,
                appName,
                clicks: 0,
                sales: 0,
                commission: 0
              });
            }
            const appStats = appStatsMap.get(appId)!;
            appStats.clicks += 1;
            totalClicks += 1;

            // Actualizar estadísticas diarias
            if (!dailyStatsMap.has(clickDate)) {
              dailyStatsMap.set(clickDate, {
                date: clickDate,
                clicks: 0,
                sales: 0,
                commission: 0
              });
            }
            const dayStats = dailyStatsMap.get(clickDate)!;
            dayStats.clicks += 1;
          } catch (err) {
            console.error('Error al procesar clic:', err);
          }
        });
      }

      // Procesar ventas
      if (salesData && Array.isArray(salesData) && salesData.length > 0) {
        salesData.forEach((sale: any) => {
          try {
            const appId = sale.affiliate_links.app_id;
            const appName = sale.affiliate_links.apps.name;
            const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
            const commissionAmount = sale.commission_amount || 0;

            // Actualizar estadísticas por app
            if (!appStatsMap.has(appId)) {
              appStatsMap.set(appId, {
                appId,
                appName,
                clicks: 0,
                sales: 0,
                commission: 0
              });
            }
            const appStats = appStatsMap.get(appId)!;
            appStats.sales += 1;
            appStats.commission += commissionAmount;
            totalSales += 1;
            totalCommission += commissionAmount;

            // Actualizar estadísticas diarias
            if (!dailyStatsMap.has(saleDate)) {
              dailyStatsMap.set(saleDate, {
                date: saleDate,
                clicks: 0,
                sales: 0,
                commission: 0
              });
            }
            const dayStats = dailyStatsMap.get(saleDate)!;
            dayStats.sales += 1;
            dayStats.commission += commissionAmount;
          } catch (err) {
            console.error('Error al procesar venta:', err);
          }
        });
      }

      // Convertir mapas a arrays y ordenar
      const linkStats = Array.from(appStatsMap.values());
      const dailyStats = Array.from(dailyStatsMap.values())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        totalClicks,
        totalSales,
        totalCommission,
        linkStats,
        dailyStats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de afiliado:', error);
      return {
        totalClicks: 0,
        totalSales: 0,
        totalCommission: 0,
        linkStats: [],
        dailyStats: []
      };
    }
  }

  /**
   * Obtiene la fecha de inicio para un rango de tiempo
   */
  private getStartDateForRange(timeRange: 'week' | 'month' | 'year'): string {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
    }

    return startDate.toISOString();
  }
}

// Exportar instancia singleton
export const affiliateServiceEnhanced = AffiliateServiceEnhanced.getInstance();