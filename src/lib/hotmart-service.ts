// Servicio para la integración con Hotmart
import { supabase, User, Sale } from './supabase';

// Configuración de productos de Hotmart
const HOTMART_PRODUCTS = {
  '4962378': {
    name: 'Flasti - Producto 1',
    baseCommission: 50 // Porcentaje base de comisión
  },
  '4968174': {
    name: 'Flasti - Producto 2',
    baseCommission: 50
  },
  '4968671': {
    name: 'Flasti - Producto 3',
    baseCommission: 50
  }
} as const;

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
      console.log('🔄 Iniciando procesamiento de venta de Hotmart');

      // Validar que el payload tenga la estructura esperada
      if (!payload || !payload.data || !payload.data.purchase) {
        console.error('❌ Payload inválido - estructura incorrecta');
        return { success: false, message: 'Payload inválido' };
      }

      const purchase = payload.data.purchase;
      const productId = String(purchase.product?.id || '');
      const transactionId = purchase.transaction;
      const buyerEmail = purchase.buyer?.email;
      const buyerName = `${purchase.buyer?.name || ''} ${purchase.buyer?.surname || ''}`.trim();
      const affiliateId = purchase.affiliate?.id;
      const amount = purchase.price?.value || 0;

      console.log('📊 Datos de la venta:', {
        productId,
        transactionId,
        buyerEmail,
        buyerName,
        affiliateId,
        amount
      });

      // Validar que el producto esté configurado
      if (!HOTMART_PRODUCTS[productId as keyof typeof HOTMART_PRODUCTS]) {
        console.error('❌ Producto no configurado:', productId);
        return { success: false, message: `Producto ${productId} no configurado` };
      }

      // Si no hay ID de afiliado, es una venta directa
      if (!affiliateId) {
        console.log('🏪 Procesando venta directa (sin afiliado)');

        // Registrar la venta sin afiliado
        await this.registerSale({
          hotmart_transaction_id: transactionId,
          affiliate_id: null,
          app_id: productId,
          amount,
          commission: 0,
          ip_address: payload.data.purchase.buyer?.ip || '',
        });

        // Enviar email de bienvenida para venta directa
        if (buyerEmail && buyerName) {
          await this.sendWelcomeEmail(buyerEmail, buyerName, transactionId);
          console.log('📧 Email de bienvenida enviado para venta directa');
        }

        return { success: true, message: 'Venta directa registrada correctamente y email enviado' };
      }

      console.log('👥 Procesando venta con afiliado:', affiliateId);

      // Buscar el afiliado en la base de datos
      const { data: affiliate, error } = await supabase
        .from('users')
        .select('*')
        .eq('hotmart_id', affiliateId)
        .single();

      if (error || !affiliate) {
        console.error('❌ Afiliado no encontrado:', affiliateId, error);
        return { success: false, message: `Afiliado ${affiliateId} no encontrado` };
      }

      console.log('✅ Afiliado encontrado:', {
        id: affiliate.id,
        email: affiliate.email,
        level: affiliate.level
      });

      // Calcular comisión según el nivel del afiliado y producto
      const baseCommission = HOTMART_PRODUCTS[productId as keyof typeof HOTMART_PRODUCTS]?.baseCommission || 50;
      const levelMultiplier = this.getLevelMultiplier(affiliate.level);
      const commissionPercentage = baseCommission * levelMultiplier;
      const commissionAmount = (amount * commissionPercentage) / 100;

      console.log('💰 Cálculo de comisión:', {
        baseCommission,
        levelMultiplier,
        commissionPercentage,
        commissionAmount
      });

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

      // Enviar email de bienvenida al comprador
      if (buyerEmail && buyerName) {
        await this.sendWelcomeEmail(buyerEmail, buyerName, transactionId);
        console.log('📧 Email de bienvenida enviado');
      }

      console.log('✅ Venta procesada exitosamente');
      return { success: true, message: 'Venta y comisión registradas correctamente, email enviado' };

    } catch (error) {
      console.error('💥 Error al procesar venta de Hotmart:', error);
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
      const transactionId = payload.data.purchase?.transaction || '';

      console.log('Procesando usuario de Hotmart:', { email, name, transactionId });

      // PRIORIDAD: Enviar email de bienvenida inmediatamente
      if (email && name && transactionId) {
        await this.sendWelcomeEmail(email, name, transactionId);
        console.log('Email de bienvenida enviado para:', email);
      }

      // Guardar datos de la compra en tabla de ventas (NO crear usuario)
      try {
        await this.registerSale({
          hotmart_transaction_id: transactionId,
          affiliate_id: null, // Sin afiliado para compras directas
          app_id: payload.data.purchase?.product?.id || '',
          amount: payload.data.purchase?.price?.value || 0,
          commission: 0,
          ip_address: '',
        });
        console.log('Venta de Hotmart registrada:', transactionId);
      } catch (saleError) {
        console.log('No se pudo registrar venta (tabla puede no existir):', saleError);
      }

      // Guardar datos del comprador para referencia futura (NO crear usuario)
      try {
        const { data, error } = await supabase
          .from('hotmart_purchases')
          .insert([{
            email,
            full_name: name,
            hotmart_id: hotmartId,
            transaction_id: transactionId,
            product_id: payload.data.purchase?.product?.id || '',
            amount: payload.data.purchase?.price?.value || 0,
            status: 'completed',
            created_at: new Date().toISOString(),
            metadata: {
              buyer_data: buyer,
              purchase_data: payload.data.purchase
            }
          }])
          .select()
          .single();

        if (error) {
          console.log('No se pudo guardar datos del comprador (tabla puede no existir):', error);
        } else {
          console.log('Datos del comprador de Hotmart guardados:', email);
        }
      } catch (dbError) {
        console.log('Error al guardar datos del comprador:', dbError);
      }

      return {
        success: true,
        message: 'Email de bienvenida enviado y datos guardados (sin crear usuario)'
      };
    } catch (error) {
      console.error('Error al procesar usuario desde Hotmart:', error);
      return { success: false, message: 'Error interno al procesar usuario' };
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
   * Envía email de bienvenida usando el endpoint de la aplicación
   */
  private async sendWelcomeEmail(email: string, fullName: string, transactionId: string): Promise<void> {
    try {
      console.log('Enviando email de bienvenida para Hotmart...', { email, fullName, transactionId });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          fullName,
          transactionId
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Email de bienvenida enviado exitosamente para Hotmart');
      } else {
        console.error('Error al enviar email de bienvenida:', result.error);
      }
    } catch (error) {
      console.error('Error inesperado al enviar email de bienvenida:', error);
    }
  }

  /**
   * Obtiene el multiplicador de nivel para calcular comisiones
   */
  private getLevelMultiplier(level: number): number {
    switch (level) {
      case 1:
        return 1.0; // 100% de la comisión base
      case 2:
        return 1.2; // 120% de la comisión base
      case 3:
        return 1.4; // 140% de la comisión base
      default:
        return 1.0; // Nivel por defecto
    }
  }

  /**
   * Obtiene el porcentaje de comisión según el nivel del afiliado (método legacy)
   * @deprecated Usar getLevelMultiplier en su lugar
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