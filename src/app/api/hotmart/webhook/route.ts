// API para manejar webhooks de Hotmart
import { NextRequest, NextResponse } from 'next/server';
import { hotmartService } from '@/lib/hotmart-service';
import { trackingService } from '@/lib/tracking-service';
import hotmartTrackingService from '@/lib/hotmart-tracking-service';

// IDs de productos de Hotmart configurados
const HOTMART_PRODUCT_IDS = [
  '4962378', // Producto 1
  '4968174', // Producto 2
  '4968671'  // Producto 3
];

/**
 * Procesa los webhooks de Hotmart
 * Esta API recibe notificaciones de Hotmart cuando ocurre una venta
 * URL: https://flasti.com/api/hotmart/webhook
 * Eventos: PURCHASE_COMPLETE, PURCHASE_APPROVED
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔔 Webhook de Hotmart recibido');
    console.log('📅 Timestamp:', new Date().toISOString());

    // Hotmart no proporciona webhook secret ni token de autenticación
    // Validaremos por otros medios (IP, estructura del payload, etc.)

    // Obtener información de la request
    const userAgent = req.headers.get('user-agent') || '';
    const contentType = req.headers.get('content-type') || '';
    const origin = req.headers.get('origin') || '';

    console.log('📋 Headers del webhook:', {
      userAgent,
      contentType,
      origin,
      ip: req.ip || 'unknown'
    });

    // Obtener el payload del webhook
    const payload = await req.json();
    console.log('📦 Payload del webhook de Hotmart:', JSON.stringify(payload, null, 2));

    // Validar estructura básica del payload de Hotmart
    if (!payload || !payload.event || !payload.data) {
      console.error('❌ Payload inválido - estructura incorrecta');
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    // Verificar el tipo de evento
    const eventType = payload.event;
    const productId = payload.data?.purchase?.product?.id || payload.data?.product?.id;

    console.log('🎯 Tipo de evento:', eventType);
    console.log('🛍️ ID del producto:', productId);

    // Validar que el producto esté en nuestra lista de productos configurados
    if (productId && !HOTMART_PRODUCT_IDS.includes(String(productId))) {
      console.log('⚠️ Producto no configurado:', productId);
      return NextResponse.json({ message: 'Producto no configurado' }, { status: 200 });
    }

    // Procesar eventos de compra
    if (eventType === 'PURCHASE_COMPLETE') {
      console.log('🎉 Procesando PURCHASE_COMPLETE');

      // Registrar nuevo usuario/comprador desde Hotmart
      const result = await hotmartService.registerUserFromHotmart(payload);

      if (!result.success) {
        console.error('❌ Error al registrar usuario:', result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // Trackear la compra completada en Facebook Pixel y otros sistemas
      await hotmartTrackingService.trackHotmartPurchaseComplete(payload);

      // Trackear el registro del usuario
      if (result.user?.email && result.user?.name) {
        await hotmartTrackingService.trackHotmartUserRegistration(
          result.user.email,
          result.user.name
        );
      }

      console.log('✅ Usuario registrado exitosamente');
      return NextResponse.json({
        success: true,
        message: result.message,
        user: result.user,
        token: result.token
      });

    } else if (eventType === 'PURCHASE_APPROVED') {
      console.log('💰 Procesando PURCHASE_APPROVED');

      // Verificar si la venta debe atribuirse a un afiliado
      const { shouldAttribute, affiliateId, appId } = await trackingService.shouldAttributeSale(
        req,
        payload.data?.buyer?.id || payload.data?.buyer?.email || ''
      );

      console.log('🔍 Verificación de afiliado:', { shouldAttribute, affiliateId, appId });

      // Si hay un afiliado, añadir la información al payload
      if (shouldAttribute && affiliateId && appId) {
        payload.data.purchase.affiliate = { id: affiliateId };
        payload.data.purchase.product = { id: appId };
        console.log('👥 Venta atribuida al afiliado:', affiliateId);
      }

      // Procesar la venta
      const result = await hotmartService.processHotmartSale(payload);

      if (!result.success) {
        console.error('❌ Error al procesar venta:', result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // Trackear la compra aprobada en Facebook Pixel y otros sistemas
      await hotmartTrackingService.trackHotmartPurchaseApproved(payload);

      console.log('✅ Venta procesada exitosamente');
      return NextResponse.json({ success: true, message: result.message });
    }

    // Tipo de evento no soportado
    console.log('⚠️ Evento no procesado:', eventType);
    return NextResponse.json({ message: 'Evento no procesado' }, { status: 200 });

  } catch (error) {
    console.error('💥 Error al procesar webhook de Hotmart:', error);
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}