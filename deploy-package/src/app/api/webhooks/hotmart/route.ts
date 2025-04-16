import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AffiliateTrackingService } from '@/lib/affiliate-tracking-service';

// Secreto para verificar las solicitudes de Hotmart (debe configurarse en las variables de entorno)
const HOTMART_SECRET = process.env.HOTMART_SECRET || 'your-secret-key';

/**
 * Verifica la firma de Hotmart para asegurar que la solicitud es legítima
 * @param req Solicitud entrante
 * @returns Booleano indicando si la firma es válida
 */
function verifyHotmartSignature(req: NextRequest): boolean {
  // En producción, implementar la verificación real de la firma
  // https://developers.hotmart.com/docs/en/webhooks/security/

  // Para desarrollo, aceptamos todas las solicitudes
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  // Verificar que la solicitud viene de Hotmart usando el secreto compartido
  const authorization = req.headers.get('Authorization');
  if (!authorization || authorization !== `Bearer ${HOTMART_SECRET}`) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar la firma de Hotmart
    if (!verifyHotmartSignature(request)) {
      return NextResponse.json(
        { error: 'Firma inválida o no autorizado' },
        { status: 401 }
      );
    }

    // Obtener el cuerpo de la solicitud
    const data = await request.json();

    // Verificar que sea un evento de compra aprobada
    if (data.event !== 'PURCHASE_APPROVED' && data.event !== 'PURCHASE_COMPLETE') {
      return NextResponse.json(
        { status: 'ignorado', message: 'Evento no procesado' },
        { status: 200 }
      );
    }

    // Extraer datos relevantes
    const {
      purchase: {
        transaction: transactionCode,
        offer: { code: offerCode },
        price: { currency, value },
        buyer: { email }
      }
    } = data;

    // Mapear el código de oferta de Hotmart al ID del producto
    let productId = offerCode;

    // Obtener el código de afiliado de la cookie
    const affiliateCode = request.cookies.get('flasti_affiliate')?.value;

    // Registrar la transacción en la base de datos independientemente del código de afiliado
    await supabase.from('transactions').insert({
      transaction_id: transactionCode,
      product_id: productId,
      amount: value,
      currency,
      buyer_email: email,
      payment_processor: 'hotmart',
      status: 'completed',
      affiliate_code: affiliateCode || null,
      raw_data: JSON.stringify(data)
    });

    if (!affiliateCode) {
      console.log('No se encontró código de afiliado en la cookie');
      return NextResponse.json(
        { status: 'success', message: 'Venta registrada sin afiliado' },
        { status: 200 }
      );
    }

    // Buscar el afiliado por código
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, commission_rate')
      .eq('affiliate_code', affiliateCode)
      .eq('status', 'active')
      .single();

    if (affiliateError || !affiliateData) {
      console.error('Error al buscar afiliado:', affiliateError);
      return NextResponse.json(
        { status: 'error', message: 'Afiliado no encontrado o inactivo' },
        { status: 200 }
      );
    }

    // Registrar la venta
    const { success, error, commissionAmount } = await AffiliateTrackingService.registerSale(
      affiliateData.id,
      email,
      transactionCode,
      productId,
      value,
      affiliateData.commission_rate
    );

    if (!success) {
      console.error('Error al registrar venta:', error);
      return NextResponse.json(
        { status: 'error', message: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Venta registrada correctamente',
        data: {
          affiliateId: affiliateData.id,
          orderId: transactionCode,
          amount: value,
          commissionAmount
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al procesar webhook de Hotmart:', error);
    return NextResponse.json(
      { status: 'error', message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
