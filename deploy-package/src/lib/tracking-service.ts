// Servicio para el rastreo de visitantes y atribución de ventas
import { cookies } from 'next/headers';
import { supabase } from './supabase';

export class TrackingService {
  private static instance: TrackingService;
  private readonly COOKIE_NAME = 'flasti_affiliate';
  private readonly COOKIE_EXPIRY_DAYS = 7; // Cookies válidas por 7 días

  private constructor() {}

  public static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  /**
   * Registra una visita de un afiliado
   */
  public async trackAffiliateVisit(req: Request, affiliateId: string, appId: number): Promise<void> {
    try {
      // Obtener IP del visitante
      const ip = this.getClientIp(req);
      
      // Guardar en la base de datos
      await supabase.from('affiliate_visits').insert([
        {
          affiliate_id: affiliateId,
          app_id: appId,
          ip_address: ip,
        }
      ]);

      // Establecer cookie
      this.setAffiliateCookie(affiliateId, appId);
    } catch (error) {
      console.error('Error al registrar visita de afiliado:', error);
    }
  }

  /**
   * Verifica si una venta debe atribuirse a un afiliado
   */
  public async shouldAttributeSale(req: Request, userId: string): Promise<{ shouldAttribute: boolean; affiliateId?: string; appId?: number }> {
    try {
      // Verificar si el usuario está intentando auto-comprarse
      const cookieStore = cookies();
      const affiliateCookie = cookieStore.get(this.COOKIE_NAME);
      
      if (affiliateCookie) {
        const [affiliateId, appId] = affiliateCookie.value.split('_');
        
        // Prevenir auto-compras
        if (affiliateId === userId) {
          return { shouldAttribute: false };
        }
        
        return { 
          shouldAttribute: true, 
          affiliateId, 
          appId: parseInt(appId, 10) 
        };
      }
      
      // Si no hay cookie, verificar por IP en las últimas visitas (7 días)
      const ip = this.getClientIp(req);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: visits } = await supabase
        .from('affiliate_visits')
        .select('*')
        .eq('ip_address', ip)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (visits && visits.length > 0) {
        const latestVisit = visits[0];
        
        // Prevenir auto-compras
        if (latestVisit.affiliate_id === userId) {
          return { shouldAttribute: false };
        }
        
        return { 
          shouldAttribute: true, 
          affiliateId: latestVisit.affiliate_id, 
          appId: latestVisit.app_id 
        };
      }
      
      return { shouldAttribute: false };
    } catch (error) {
      console.error('Error al verificar atribución de venta:', error);
      return { shouldAttribute: false };
    }
  }

  /**
   * Establece una cookie para rastrear al afiliado
   */
  private setAffiliateCookie(affiliateId: string, appId: number): void {
    const cookieStore = cookies();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);
    
    cookieStore.set({
      name: this.COOKIE_NAME,
      value: `${affiliateId}_${appId}`,
      expires: expiryDate,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  /**
   * Obtiene la IP del cliente desde la solicitud
   */
  private getClientIp(req: Request): string {
    // Intentar obtener la IP real del cliente a través de headers comunes
    const headers = new Headers(req.headers);
    const forwardedFor = headers.get('x-forwarded-for');
    
    if (forwardedFor) {
      // x-forwarded-for puede contener múltiples IPs, tomamos la primera
      return forwardedFor.split(',')[0].trim();
    }
    
    // Fallback a otras cabeceras comunes
    const realIp = headers.get('x-real-ip');
    if (realIp) {
      return realIp;
    }
    
    // Si no se puede determinar, devolver una IP genérica
    return '0.0.0.0';
  }
}

// Exportar instancia singleton
export const trackingService = TrackingService.getInstance();