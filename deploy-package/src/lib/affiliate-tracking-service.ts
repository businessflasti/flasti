import { supabase } from './supabase';
import { cookies } from 'next/headers';

// Duración de la cookie de afiliado (30 días en segundos)
const AFFILIATE_COOKIE_DURATION = 30 * 24 * 60 * 60;

export class AffiliateTrackingService {
  /**
   * Registra un clic en un enlace de afiliado
   * @param affiliateCode Código del afiliado
   * @param linkId ID del enlace (opcional)
   * @param ipAddress Dirección IP del visitante
   * @param userAgent User Agent del navegador
   * @param referrer URL de referencia
   */
  static async trackClick(
    affiliateCode: string,
    linkId?: string,
    ipAddress?: string,
    userAgent?: string,
    referrer?: string
  ) {
    try {
      // Buscar el afiliado por código
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('affiliate_code', affiliateCode)
        .eq('status', 'active')
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error al buscar afiliado:', affiliateError);
        return { success: false, error: 'Afiliado no encontrado o inactivo' };
      }

      // Registrar el clic
      const { error: clickError } = await supabase
        .from('affiliate_clicks')
        .insert({
          affiliate_id: affiliateData.id,
          link_id: linkId || null,
          ip_address: ipAddress || null,
          user_agent: userAgent || null,
          referrer: referrer || null
        });

      if (clickError) {
        console.error('Error al registrar clic:', clickError);
        return { success: false, error: 'Error al registrar clic' };
      }

      // Si se proporcionó un ID de enlace, incrementar el contador de clics
      if (linkId) {
        await supabase.rpc('increment_affiliate_link_clicks', {
          link_id_param: linkId
        });
      }

      return { success: true, affiliateId: affiliateData.id };
    } catch (error) {
      console.error('Error en trackClick:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Establece una cookie para rastrear al afiliado
   * @param affiliateCode Código del afiliado
   */
  static setAffiliateCookie(affiliateCode: string) {
    const cookieStore = cookies();

    // Establecer la cookie con una duración de 30 días
    cookieStore.set('flasti_affiliate', affiliateCode, {
      maxAge: AFFILIATE_COOKIE_DURATION,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  }

  /**
   * Obtiene el código de afiliado de la cookie
   */
  static getAffiliateCodeFromCookie() {
    const cookieStore = cookies();
    return cookieStore.get('flasti_affiliate')?.value;
  }

  /**
   * Registra una venta atribuida a un afiliado
   * @param affiliateId ID del afiliado
   * @param customerEmail Email del cliente
   * @param orderId ID de la orden
   * @param productId ID del producto
   * @param amount Monto de la venta
   * @param commissionRate Tasa de comisión (opcional, se calculará según el nivel del usuario si no se proporciona)
   */
  static async registerSale(
    affiliateId: string,
    customerEmail: string,
    orderId: string,
    productId: string,
    amount: number,
    commissionRate?: number
  ) {
    try {
      // Si no se proporcionó una tasa de comisión, calcularla según el nivel del usuario
      let finalCommissionRate = commissionRate;

      if (!finalCommissionRate) {
        // Obtener el usuario asociado al afiliado
        const { data: affiliateData, error: affiliateError } = await supabase
          .from('affiliates')
          .select('user_id')
          .eq('id', affiliateId)
          .single();

        if (affiliateError || !affiliateData) {
          console.error('Error al obtener afiliado:', affiliateError);
          return { success: false, error: 'Afiliado no encontrado' };
        }

        // Obtener el nivel del usuario
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('level')
          .eq('user_id', affiliateData.user_id)
          .single();

        if (userError) {
          console.error('Error al obtener nivel del usuario:', userError);
          // Si no se encuentra en user_profiles, buscar en profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('level')
            .eq('id', affiliateData.user_id)
            .single();

          if (profileError || !profileData) {
            console.error('Error al obtener nivel del usuario:', profileError);
            // Usar nivel 1 por defecto
            finalCommissionRate = 0.30;
          } else {
            // Obtener la tasa de comisión según el nivel y la app
            const { data: appData, error: appError } = await supabase
              .from('affiliate_apps')
              .select('id')
              .eq('hotmart_offer_code', productId)
              .single();

            if (appError || !appData) {
              console.error('Error al obtener app:', appError);
              // Usar tasa por defecto
              finalCommissionRate = 0.30;
            } else {
              // Obtener la tasa de comisión usando la función RPC
              const { data: commissionData, error: commissionError } = await supabase
                .rpc('get_commission_rate', {
                  app_id_param: appData.id,
                  user_level_param: profileData.level
                });

              if (commissionError || commissionData === null) {
                console.error('Error al obtener tasa de comisión:', commissionError);
                // Usar tasa por defecto
                finalCommissionRate = 0.30;
              } else {
                finalCommissionRate = commissionData;
              }
            }
          }
        } else {
          // Obtener la tasa de comisión según el nivel y la app
          const { data: appData, error: appError } = await supabase
            .from('affiliate_apps')
            .select('id')
            .eq('hotmart_offer_code', productId)
            .single();

          if (appError || !appData) {
            console.error('Error al obtener app:', appError);
            // Usar tasa por defecto
            finalCommissionRate = 0.30;
          } else {
            // Obtener la tasa de comisión usando la función RPC
            const { data: commissionData, error: commissionError } = await supabase
              .rpc('get_commission_rate', {
                app_id_param: appData.id,
                user_level_param: userData.level
              });

            if (commissionError || commissionData === null) {
              console.error('Error al obtener tasa de comisión:', commissionError);
              // Usar tasa por defecto
              finalCommissionRate = 0.30;
            } else {
              finalCommissionRate = commissionData;
            }
          }
        }
      }

      // Calcular la comisión
      const commissionAmount = amount * finalCommissionRate;

      // Registrar la venta
      const { error: saleError } = await supabase
        .from('affiliate_sales')
        .insert({
          affiliate_id: affiliateId,
          customer_email: customerEmail,
          order_id: orderId,
          product_id: productId,
          amount: amount,
          commission_amount: commissionAmount,
          status: 'approved'
        });

      if (saleError) {
        console.error('Error al registrar venta:', saleError);
        return { success: false, error: 'Error al registrar venta' };
      }

      // Actualizar las estadísticas del afiliado
      await supabase.rpc('update_affiliate_stats', {
        affiliate_id_param: affiliateId,
        sale_amount_param: amount,
        commission_amount_param: commissionAmount
      });

      return {
        success: true,
        commissionAmount,
        commissionRate: finalCommissionRate,
        saleId: orderId
      };
    } catch (error) {
      console.error('Error en registerSale:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene las estadísticas de un afiliado
   * @param userId ID del usuario
   */
  static async getAffiliateStats(userId: string) {
    try {
      // Obtener el ID del afiliado
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error al obtener afiliado:', affiliateError);
        return { success: false, error: 'Afiliado no encontrado' };
      }

      // Obtener las estadísticas
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_affiliate_stats', {
          affiliate_id_param: affiliateData.id
        });

      if (statsError) {
        console.error('Error al obtener estadísticas:', statsError);
        return { success: false, error: 'Error al obtener estadísticas' };
      }

      return {
        success: true,
        stats: statsData[0] || {
          total_clicks: 0,
          total_sales: 0,
          total_commission: 0,
          conversion_rate: 0
        }
      };
    } catch (error) {
      console.error('Error en getAffiliateStats:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Crea un nuevo enlace de afiliado
   * @param userId ID del usuario
   * @param name Nombre del enlace
   * @param slug Slug personalizado
   * @param targetUrl URL de destino
   */
  static async createAffiliateLink(
    userId: string,
    name: string,
    slug: string,
    targetUrl: string
  ) {
    try {
      // Obtener el ID del afiliado
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error al obtener afiliado:', affiliateError);
        return { success: false, error: 'Afiliado no encontrado' };
      }

      // Crear el enlace
      const { data: linkData, error: linkError } = await supabase
        .from('affiliate_links')
        .insert({
          affiliate_id: affiliateData.id,
          name,
          slug,
          target_url: targetUrl
        })
        .select()
        .single();

      if (linkError) {
        console.error('Error al crear enlace:', linkError);
        return { success: false, error: 'Error al crear enlace' };
      }

      return { success: true, link: linkData };
    } catch (error) {
      console.error('Error en createAffiliateLink:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene los enlaces de un afiliado
   * @param userId ID del usuario
   */
  static async getAffiliateLinks(userId: string) {
    try {
      // Obtener el ID del afiliado
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error al obtener afiliado:', affiliateError);
        return { success: false, error: 'Afiliado no encontrado' };
      }

      // Obtener los enlaces
      const { data: linksData, error: linksError } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false });

      if (linksError) {
        console.error('Error al obtener enlaces:', linksError);
        return { success: false, error: 'Error al obtener enlaces' };
      }

      return { success: true, links: linksData || [] };
    } catch (error) {
      console.error('Error en getAffiliateLinks:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene las ventas de un afiliado
   * @param userId ID del usuario
   */
  static async getAffiliateSales(userId: string) {
    try {
      // Obtener el ID del afiliado
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (affiliateError || !affiliateData) {
        console.error('Error al obtener afiliado:', affiliateError);
        return { success: false, error: 'Afiliado no encontrado' };
      }

      // Obtener las ventas
      const { data: salesData, error: salesError } = await supabase
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', affiliateData.id)
        .order('created_at', { ascending: false });

      if (salesError) {
        console.error('Error al obtener ventas:', salesError);
        return { success: false, error: 'Error al obtener ventas' };
      }

      return { success: true, sales: salesData || [] };
    } catch (error) {
      console.error('Error en getAffiliateSales:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene el código de afiliado de un usuario
   * @param userId ID del usuario
   */
  static async getAffiliateCode(userId: string) {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('affiliate_code')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error al obtener código de afiliado:', error);
        return { success: false, error: 'Error al obtener código de afiliado' };
      }

      return { success: true, affiliateCode: data?.affiliate_code };
    } catch (error) {
      console.error('Error en getAffiliateCode:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }
}
