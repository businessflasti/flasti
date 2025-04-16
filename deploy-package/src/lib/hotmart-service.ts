// Servicio para la integración con Hotmart
import { supabase, User, Sale } from './supabase';

export class HotmartService {
  private static instance: HotmartService;

  private constructor() {}

  public static getInstance(): HotmartService {
    if (!HotmartService.instance) {
      HotmartService.instance = new HotmartService();
    }
    return HotmartService.instance;
  }

  /**
   * Procesa un webhook de Hotmart para una nueva venta
   */
  public async processHotmartSale(payload: any): Promise<{ success: boolean; message: string }> {
    try {
      // Validar que el payload tenga la estructura esperada
      if (!payload || !payload.data || !payload.data.purchase) {
        return { success: false, message: 'Payload inválido' };
      }

      const purchase = payload.data.purchase;
      const productId = purchase.product?.id;
      const transactionId = purchase.transaction;
      const buyerEmail = purchase.buyer?.email;
      const affiliateId = purchase.affiliate?.id;
      const amount = purchase.price?.value || 0;

      // Si no hay ID de afiliado, es una venta directa
      if (!affiliateId) {
        // Registrar la venta sin afiliado
        await this.registerSale({
          hotmart_transaction_id: transactionId,
          affiliate_id: null,
          app_id: productId,
          amount,
          commission: 0,
          ip_address: payload.data.purchase.buyer?.ip || '',
        });
        return { success: true, message: 'Venta directa registrada correctamente' };
      }

      // Buscar el afiliado en la base de datos
      const { data: affiliate, error } = await supabase
        .from('users')
        .select('*')
        .eq('hotmart_id', affiliateId)
        .single();

      if (error || !affiliate) {
        return { success: false, message: 'Afiliado no encontrado' };
      }

      // Calcular comisión según el nivel del afiliado
      const commissionPercentage = this.getCommissionPercentage(affiliate.level);
      const commissionAmount = (amount * commissionPercentage) / 100;

      // Registrar la venta con el afiliado
      await this.registerSale({
        hotmart_transaction_id: transactionId,
        affiliate_id: affiliate.id,
        app_id: productId,
        amount,
        commission: commissionAmount,
        ip_address: payload.data.purchase.buyer?.ip || '',
      });

      // Actualizar el balance del afiliado
      await this.updateAffiliateBalance(affiliate.id, commissionAmount);

      return { success: true, message: 'Venta y comisión registradas correctamente' };
    } catch (error) {
      console.error('Error al procesar venta de Hotmart:', error);
      return { success: false, message: 'Error interno al procesar la venta' };
    }
  }

  /**
   * Registra un nuevo usuario desde Hotmart
   */
  public async registerUserFromHotmart(payload: any): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      // Validar que el payload tenga la estructura esperada
      if (!payload || !payload.data || !payload.data.buyer) {
        return { success: false, message: 'Payload inválido' };
      }

      const buyer = payload.data.buyer;
      const email = buyer.email;
      const name = `${buyer.name || ''} ${buyer.surname || ''}`.trim();
      const hotmartId = buyer.ucode || '';

      // Verificar si el usuario ya existe
      const { data: existingUser, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Generar token de acceso
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: process.env.DEFAULT_USER_PASSWORD || 'password123', // En un caso real, esto sería más seguro
        });

        if (signInError) {
          return { success: false, message: 'Error al iniciar sesión' };
        }

        return { 
          success: true, 
          user: existingUser as User, 
          token: session?.access_token,
          message: 'Usuario existente, sesión iniciada' 
        };
      }

      // Crear nuevo usuario en Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: process.env.DEFAULT_USER_PASSWORD || 'password123', // En un caso real, esto sería más seguro
      });

      if (signUpError) {
        return { success: false, message: 'Error al crear usuario en autenticación' };
      }

      // Crear perfil de usuario en la tabla users
      const newUser: Omit<User, 'id' | 'created_at'> = {
        email,
        name,
        hotmart_id: hotmartId,
        level: 1, // Nivel inicial
        balance: 0,
      };

      const { data: userData, error: insertError } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (insertError) {
        return { success: false, message: 'Error al crear perfil de usuario' };
      }

      return { 
        success: true, 
        user: userData as User, 
        token: authData.session?.access_token,
        message: 'Usuario registrado correctamente' 
      };
    } catch (error) {
      console.error('Error al registrar usuario desde Hotmart:', error);
      return { success: false, message: 'Error interno al registrar usuario' };
    }
  }

  /**
   * Registra una nueva venta en la base de datos
   */
  private async registerSale(sale: Omit<Sale, 'id' | 'created_at'>): Promise<void> {
    await supabase.from('sales').insert([sale]);
  }

  /**
   * Actualiza el balance de un afiliado
   */
  private async updateAffiliateBalance(affiliateId: string, amount: number): Promise<void> {
    // Obtener balance actual
    const { data } = await supabase
      .from('users')
      .select('balance')
      .eq('id', affiliateId)
      .single();

    const currentBalance = data?.balance || 0;
    const newBalance = currentBalance + amount;

    // Actualizar balance
    await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', affiliateId);
  }

  /**
   * Obtiene el porcentaje de comisión según el nivel del afiliado
   */
  private getCommissionPercentage(level: number): number {
    switch (level) {
      case 1:
        return 50; // 50%
      case 2:
        return 60; // 60%
      case 3:
        return 70; // 70%
      default:
        return 50; // Nivel por defecto
    }
  }
}

// Exportar instancia singleton
export const hotmartService = HotmartService.getInstance();