import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para probar el webhook de Hotmart
 * Simula webhooks de Hotmart con los productos configurados
 */
export async function POST(req: NextRequest) {
  try {
    const { productId, eventType, affiliateId } = await req.json().catch(() => ({}));

    // Productos configurados
    const configuredProducts = ['4962378', '4968174', '4968671'];
    const selectedProductId = productId || configuredProducts[0];

    // Simular payload de Hotmart
    const testPayload = {
      event: eventType || 'PURCHASE_COMPLETE',
      version: '2.0.0',
      data: {
        buyer: {
          email: 'test@example.com',
          name: 'Juan',
          surname: 'Pérez',
          ucode: 'test_hotmart_user_' + Date.now(),
          ip: '192.168.1.1'
        },
        purchase: {
          transaction: 'HM_TEST_' + Date.now(),
          product: {
            id: selectedProductId,
            name: `Flasti - Producto ${configuredProducts.indexOf(selectedProductId) + 1}`
          },
          price: {
            value: 97.00,
            currency_code: 'USD'
          },
          buyer: {
            email: 'test@example.com',
            name: 'Juan',
            surname: 'Pérez',
            ip: '192.168.1.1'
          },
          ...(affiliateId && {
            affiliate: {
              id: affiliateId
            }
          })
        }
      }
    };

    console.log('🧪 Enviando webhook de prueba a Hotmart...', {
      event: testPayload.event,
      productId: selectedProductId,
      affiliateId
    });

    // Enviar el webhook a nuestro endpoint (sin token ya que Hotmart no lo proporciona)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/hotmart/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Hotmart-Webhook/1.0'
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
        configured_products: configuredProducts
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
    message: 'Endpoint para probar webhook de Hotmart',
    webhook_url: 'https://flasti.com/api/hotmart/webhook',
    configured_products: [
      { id: '4962378', name: 'Flasti - Producto 1' },
      { id: '4968174', name: 'Flasti - Producto 2' },
      { id: '4968671', name: 'Flasti - Producto 3' }
    ],
    supported_events: [
      'PURCHASE_COMPLETE',
      'PURCHASE_APPROVED'
    ],
    usage: {
      description: 'Envía un POST a este endpoint para simular una compra de Hotmart',
      examples: {
        basic: {
          method: 'POST',
          body: {}
        },
        with_product: {
          method: 'POST',
          body: {
            productId: '4962378',
            eventType: 'PURCHASE_COMPLETE'
          }
        },
        with_affiliate: {
          method: 'POST',
          body: {
            productId: '4968174',
            eventType: 'PURCHASE_APPROVED',
            affiliateId: 'TEST_AFFILIATE_123'
          }
        }
      }
    },
    hotmart_configuration: {
      webhook_url: 'https://flasti.com/api/hotmart/webhook',
      events: ['PURCHASE_COMPLETE', 'PURCHASE_APPROVED'],
      authentication: 'None (Hotmart no proporciona webhook secret)',
      validation: 'Por estructura de payload y IPs permitidas'
    }
  });
}
