import { NextResponse } from 'next/server';

// Configuración de Mercado Pago - Nueva Cuenta
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-8400251779300797-100517-207f2ff90eec04a47316d5974b5474ce-1068552659';
const CLIENT_ID = process.env.MERCADOPAGO_CLIENT_ID || '8400251779300797';

export async function POST(request: Request) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { price, title, quantity = 1, currency = 'ARS', unitPrice } = body;

  // Si es moneda ARS y no se envía unitPrice, usar el precio fijo AR$9900
  const resolvedUnitPrice = (currency === 'ARS' && (unitPrice === undefined || unitPrice === null)) ? 9900 : (unitPrice || (price ? parseFloat(price) : 0));

    // Validar los datos
    if (!price && !unitPrice) {
      return NextResponse.json(
        { error: 'Se requiere price o unitPrice' },
        { status: 400 }
      );
    }

    // Crear la preferencia en Mercado Pago
    const preference = {
      items: [
        {
          title: title || 'Acceso completo a Flasti – Microtareas ilimitadas',
          description: 'Acceso completo a la plataforma Flasti para generar ingresos con microtareas',
          picture_url: 'https://flasti.com/logo/logo-web.png',
          category_id: 'services',
          quantity: quantity,
          currency_id: currency,
          unit_price: resolvedUnitPrice,
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://flasti.com'}/payment-confirmation-9d4e7b2a8f1c6e3b`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://flasti.com'}/dashboard/checkout`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://flasti.com'}/dashboard/checkout`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://flasti.com'}/api/mercadopago/webhook`,
      auto_return: 'approved',
      statement_descriptor: 'FLASTI',
      external_reference: 'FLASTI-' + Date.now(),
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };

    // Realizar la solicitud a la API de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al crear preferencia en Mercado Pago:', errorData);
      return NextResponse.json(
        { error: 'Error al crear preferencia en Mercado Pago', details: errorData },
        { status: response.status }
      );
    }

    // Obtener la preferencia creada
    const data = await response.json();

    // Devolver la respuesta
    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
