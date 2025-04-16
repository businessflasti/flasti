// Servicio mejorado para la integración con Hotmart
import { supabase, User, Sale } from './supabase';
import { trackingServiceEnhanced } from './tracking-service-enhanced';

export class HotmartServiceEnhanced {
  private static instance: HotmartServiceEnhanced;

  private constructor() {}

  public static getInstance(): HotmartServiceEnhanced {
    if (!HotmartServiceEnhanced.instance) {
      HotmartServiceEnhanced.instance = new HotmartServiceEnhanced();
    }
    return HotmartServiceEnhanced.instance;
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
      const buyerId = purchase.buyer?.id;
      const affiliateId = purchase.affiliate?.id;
      const amount = purchase.price?.value || 0;

      // Verificar si la transacción ya existe para evitar duplicados
      const { data: existingSale } = await supabase
        .from('sales')
        .select('id')
        .eq('hotmart_transaction_id', transactionId)
        .single();

      if (existingSale) {
        return { success: false, message: 'Transacción ya procesada' };
      }

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
          buyer_email: buyerEmail,
          buyer_id: buyerId,
        });
        return { success: true, message: 'Venta directa registrada correctamente' };
      }

      // Buscar el afiliado en la base de datos
      const { data: affiliate, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', affiliateId)
        .single();

      if (error || !affiliate) {
        return { success: false, message: 'Afiliado no encontrado' };
      }

      // Verificar si es una auto-compra
      if (affiliate.hotmart_id === buyerId || affiliate.email === buyerEmail) {
        // Registrar actividad sospechosa
        await trackingServiceEnhanced.logSuspiciousActivity(affiliate.id, 'auto_purchase_attempt', {
          transaction_id: transactionId,
          affiliate_id: affiliate.id,
          buyer_id: buyerId,
          buyer_email: buyerEmail
        });
        
        return { success: false, message: 'Auto-compra detectada' };
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
        buyer_email: buyerEmail,
        buyer_id: buyerId,
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
      const hotmartId = buyer.ucode || buyer.id || '';

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
  private async registerSale(sale: Omit<Sale, 'id' | 'created_at'> & { buyer_email?: string; buyer_id?: string }): Promise<void> {
    // Extraer campos adicionales que no están en el tipo Sale
    const { buyer_email, buyer_id, ...saleData } = sale;
    
    // Insertar la venta
    await supabase.from('sales').insert([saleData]);
    
    // Registrar información adicional para auditoría si es necesario
    if (buyer_email || buyer_id) {
      await supabase.from('sales_audit').insert([{
        hotmart_transaction_id: sale.hotmart_transaction_id,
        buyer_email,
        buyer_id,
        timestamp: new Date().toISOString()
      }]);
    }
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
    
    // Registrar la transacción para auditoría
    await supabase.from('balance_transactions').insert([{
      user_id: affiliateId,
      amount,
      type: 'commission',
      description: 'Comisión por venta',
      timestamp: new Date().toISOString()
    }]);
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
export const hotmartServiceEnhanced = HotmartServiceEnhanced.getInstance();