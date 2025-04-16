// Servicio para gestionar enlaces de afiliados
import { supabase, AffiliateLink, App } from './supabase';

export class AffiliateService {
  private static instance: AffiliateService;

  private constructor() {}

  public static getInstance(): AffiliateService {
    if (!AffiliateService.instance) {
      AffiliateService.instance = new AffiliateService();
    }
    return AffiliateService.instance;
  }

  /**
   * Verifica si un usuario tiene un registro de afiliado y lo crea si no existe
   * @param userId ID del usuario
   * @returns Objeto con el resultado de la operación
   */
  public async ensureAffiliateExists(userId: string) {
    try {
      if (!userId) {
        console.error('ID de usuario no proporcionado');
        return {
          success: false,
          error: 'ID de usuario no proporcionado',
          affiliate: {
            id: '',
            affiliate_code: '',
            status: 'inactive'
          }
        };
      }

      console.log('Verificando si el usuario tiene un registro de afiliado:', userId);

      // Verificar si el usuario ya tiene un registro de afiliado
      const { data: existingAffiliate, error: queryError } = await supabase
        .from('affiliates')
        .select('id, affiliate_code, status')
        .eq('user_id', userId)
        .single();

      // Si ya existe, devolver el registro existente
      if (!queryError && existingAffiliate) {
        console.log('El usuario ya tiene un registro de afiliado:', existingAffiliate);
        return {
          success: true,
          affiliate: existingAffiliate,
          isNew: false
        };
      }

      // Si hay un error pero no es de "no se encontró registro", es un error real
      if (queryError && !queryError.message.includes('No row found')) {
        console.error('Error al buscar afiliado:', queryError);
        return {
          success: false,
          error: 'Error al verificar si el usuario ya tiene un registro de afiliado',
          details: queryError,
          affiliate: {
            id: '',
            affiliate_code: '',
            status: 'inactive'
          }
        };
      }

      console.log('El usuario no tiene un registro de afiliado, creando uno nuevo...');

      // Generar un código de afiliado único
      const affiliateCode = this.generateAffiliateCode();

      // Intentar crear un nuevo registro de afiliado
      try {
        const { data: newAffiliate, error: insertError } = await supabase
          .from('affiliates')
          .insert({
            user_id: userId,
            affiliate_code: affiliateCode,
            status: 'active'
          })
          .select()
          .single();

        if (insertError) {
          // Verificar si es un error de permisos RLS
          if (insertError.message && insertError.message.includes('row-level security')) {
            console.error('Error de permisos RLS al crear afiliado:', insertError.message);
            return {
              success: false,
              error: 'No se pudo crear tu cuenta de afiliado: new row violates row-level security policy for table "affiliates"',
              details: insertError,
              needsRLSPolicy: true,
              affiliate: {
                id: '',
                affiliate_code: affiliateCode, // Devolver el código generado aunque no se haya guardado
                status: 'inactive'
              }
            };
          }

          console.error('Error al crear afiliado:', insertError);
          return {
            success: false,
            error: insertError.message,
            details: insertError,
            affiliate: {
              id: '',
              affiliate_code: affiliateCode,
              status: 'inactive'
            }
          };
        }

        if (!newAffiliate) {
          console.error('No se pudo crear el afiliado: no se devolvieron datos');
          return {
            success: false,
            error: 'No se pudo crear el afiliado',
            affiliate: {
              id: '',
              affiliate_code: affiliateCode,
              status: 'inactive'
            }
          };
        }

        console.log('Afiliado creado correctamente:', newAffiliate);
        return {
          success: true,
          affiliate: newAffiliate,
          isNew: true
        };
      } catch (insertError) {
        console.error('Excepción al crear afiliado:', insertError);
        return {
          success: false,
          error: 'Error al crear afiliado',
          details: insertError,
          affiliate: {
            id: '',
            affiliate_code: affiliateCode,
            status: 'inactive'
          }
        };
      }
    } catch (error) {
      console.error('Error en ensureAffiliateExists:', error);
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error,
        affiliate: {
          id: '',
          affiliate_code: '',
          status: 'inactive'
        }
      };
    }
  }

  /**
   * Genera un código de afiliado único
   * @returns Código de afiliado
   */
  private generateAffiliateCode(): string {
    // Generar un código único basado en un timestamp y caracteres aleatorios
    const timestamp = new Date().getTime().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}${randomStr}`;
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
      const url = `https://flasti.com/app/${appId}?ref=${userId}`;

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

      return { success: true, link: linkData as AffiliateLink, message: 'Enlace creado correctamente' };
    } catch (error) {
      console.error('Error al generar enlace de afiliado:', error);
      return { success: false, message: 'Error interno al generar enlace' };
    }
  }

  /**
   * Obtiene todos los enlaces de afiliado de un usuario
   */
  public async getUserAffiliateLinks(userId: string): Promise<AffiliateLink[]> {
    const { data } = await supabase
      .from('affiliate_links')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return data as AffiliateLink[] || [];
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
}

// Exportar instancia singleton
export const affiliateService = AffiliateService.getInstance();