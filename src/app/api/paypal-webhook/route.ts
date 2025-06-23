import { NextRequest, NextResponse } from 'next/server';
import hotmartTrackingService from '@/lib/hotmart-tracking-service';

/**
 * Webhook para recibir notificaciones de PayPal
 * Cuando se confirma una compra, dispara el evento Purchase a la API de conversiones de Meta
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Extraer datos relevantes de PayPal
    const {
      id: transactionId,
      payer = {},
      purchase_units = [],
      status
    } = data;
    const amount = purchase_units[0]?.amount?.value || 0;
    const currency = purchase_units[0]?.amount?.currency_code || 'USD';
    const buyerEmail = payer.email_address || '';
    const firstName = payer.name?.given_name || '';
    const lastName = payer.name?.surname || '';

    // Solo procesar pagos completados
    if (status !== 'COMPLETED') {
      return NextResponse.json({ message: 'Pago no completado, evento ignorado' }, { status: 200 });
    }

    // Preparar datos para el evento
    const pixelEventData = {
      value: parseFloat(amount),
      currency,
      content_ids: [transactionId],
      content_name: 'Compra PayPal',
      content_type: 'product',
      num_items: 1
    };
    const userData = {
      email: buyerEmail,
      firstName,
      lastName
    };
    // Obtener la IP del request
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
    // Enviar evento a la API de conversiones
    await hotmartTrackingService['sendServerSidePixelEvent']('Purchase', pixelEventData, userData, ip);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de PayPal:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
