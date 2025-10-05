import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para probar el webhook de Mercado Pago
 * Simula notificaciones de Mercado Pago
 */
export async function POST(req: NextRequest) {
  try {
    const { paymentId, status, amount, email } = await req.json().catch(() => ({}));

    // Simular payload de Mercado Pago
    const testPayload = {
      id: Date.now(),
      live_mode: true,
      type: 'payment',
      date_created: new Date().toISOString(),
      application_id: process.env.MERCADOPAGO_CLIENT_ID || '8400251779300797',
      user_id: '1068552659',
      version: 1,
      api_version: 'v1',
      action: 'payment.updated',
      data: {
        id: paymentId || 'TEST_PAYMENT_' + Date.now()
      }
    };

    console.log('🧪 Enviando webhook de prueba a Mercado Pago...', {
      paymentId: testPayload.data.id,
      status: status || 'approved',
      amount: amount || 97.00
    });

    // Enviar el webhook a nuestro endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mercadopago/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MercadoPago-Webhook/1.0',
        'X-Request-Id': 'test-request-' + Date.now()
      },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Webhook de prueba enviado exitosamente',
        payload: testPayload,
        response: result,
        webhook_url: 'https://flasti.com/api/mercadopago/webhook'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error al procesar webhook de prueba',
        error: result,
        status: response.status,
        payload: testPayload
      }, { status: 400 });
    }
  } catch (error) {
    console.error('💥 Error al enviar webhook de prueba:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno al enviar webhook de prueba',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para probar webhook de Mercado Pago',
    webhook_url: 'https://flasti.com/api/mercadopago/webhook',
    configuration: {
      client_id: process.env.MERCADOPAGO_CLIENT_ID || '8400251779300797',
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN ? 'configurado' : 'no configurado',
      webhook_secret: process.env.MERCADOPAGO_WEBHOOK_SECRET ? 'configurado' : 'no configurado',
      environment: process.env.MERCADOPAGO_ENVIRONMENT || 'production'
    },
    usage: {
      description: 'Envía un POST a este endpoint para simular una notificación de Mercado Pago',
      examples: {
        basic: {
          method: 'POST',
          body: {}
        },
        custom: {
          method: 'POST',
          body: {
            paymentId: 'CUSTOM_PAYMENT_123',
            status: 'approved',
            amount: 97.00,
            email: 'test@example.com'
          }
        }
      }
    },
    mercadopago_configuration: {
      webhook_url: 'https://flasti.com/api/mercadopago/webhook',
      events: ['payment'],
      authentication: 'Webhook Secret (configurado)',
      validation: 'Por firma HMAC SHA256'
    }
  });
}
