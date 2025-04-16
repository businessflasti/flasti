// API para manejar webhooks de Hotmart
import { NextRequest, NextResponse } from 'next/server';
import { hotmartService } from '@/lib/hotmart-service';
import { trackingService } from '@/lib/tracking-service';

/**
 * Procesa los webhooks de Hotmart
 * Esta API recibe notificaciones de Hotmart cuando ocurre una venta
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar la autenticación del webhook (en un caso real, verificaríamos firmas o tokens)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extraer el token
    const token = authHeader.substring(7);
    
    // En un caso real, verificaríamos este token con Hotmart
    // Por ahora, usamos un token de ejemplo
    if (token !== process.env.HOTMART_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Obtener el payload del webhook
    const payload = await req.json();
    
    // Verificar el tipo de evento
    const eventType = payload.event;
    
    if (eventType === 'PURCHASE_APPROVED') {
      // Verificar si la venta debe atribuirse a un afiliado
      const { shouldAttribute, affiliateId, appId } = await trackingService.shouldAttributeSale(
        req,
        payload.data?.buyer?.id || ''
      );
      
      // Si hay un afiliado, añadir la información al payload
      if (shouldAttribute && affiliateId && appId) {
        payload.data.purchase.affiliate = { id: affiliateId };
        payload.data.purchase.product = { id: appId };
      }
      
      // Procesar la venta
      const result = await hotmartService.processHotmartSale(payload);
      
      if (!result.success) {
        console.error('Error al procesar venta:', result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      
      return NextResponse.json({ success: true, message: result.message });
    } else if (eventType === 'PURCHASE_COMPLETE' || eventType === 'SUBSCRIPTION_STARTED') {
      // Registrar nuevo usuario desde Hotmart
      const result = await hotmartService.registerUserFromHotmart(payload);
      
      if (!result.success) {
        console.error('Error al registrar usuario:', result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      
      return NextResponse.json({
        success: true,
        message: result.message,
        user: result.user,
        token: result.token
      });
    }
    
    // Tipo de evento no soportado
    return NextResponse.json({ message: 'Evento no procesado' }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar webhook de Hotmart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}