import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para probar webhooks manualmente
 * POST /api/test-webhooks
 */
export async function POST(request: NextRequest) {
  try {
    const { provider, testData } = await request.json();

    if (!provider) {
      return NextResponse.json({ error: 'Provider requerido' }, { status: 400 });
    }

    let webhookUrl = '';
    let testPayload = {};

    switch (provider) {
      case 'mercadopago':
        webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mercadopago/webhook`;
        testPayload = testData || {
          type: 'payment',
          data: { id: 'test_payment_' + Date.now() }
        };
        break;

      case 'paypal':
        webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/paypal-webhook`;
        testPayload = testData || {
          id: 'test_transaction_' + Date.now(),
          status: 'COMPLETED',
          payer: {
            email_address: 'test@example.com',
            name: { given_name: 'Test', surname: 'User' }
          },
          purchase_units: [{
            amount: { value: '3.90', currency_code: 'USD' }
          }]
        };
        break;

      case 'hotmart':
        webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/hotmart`;
        testPayload = testData || {
          event: 'PURCHASE_APPROVED',
          purchase: {
            transaction: 'test_transaction_' + Date.now(),
            offer: { code: 'test_offer' },
            price: { currency: 'USD', value: 3.90 },
            buyer: { email: 'test@example.com' }
          }
        };
        break;

      default:
        return NextResponse.json({ error: 'Provider no soportado' }, { status: 400 });
    }

    // Enviar webhook de prueba
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `Test-Webhook-${provider}/1.0`,
        'X-Test-Webhook': 'true'
      },
      body: JSON.stringify(testPayload)
    });

    const responseData = await response.text();
    let parsedResponse;
    
    try {
      parsedResponse = JSON.parse(responseData);
    } catch {
      parsedResponse = responseData;
    }

    return NextResponse.json({
      success: true,
      provider,
      webhookUrl,
      testPayload,
      response: {
        status: response.status,
        statusText: response.statusText,
        data: parsedResponse
      }
    });

  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint para obtener ejemplos de payloads
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  const examples = {
    mercadopago: {
      type: 'payment',
      data: { id: 'PAYMENT_ID_HERE' }
    },
    paypal: {
      id: 'TRANSACTION_ID_HERE',
      status: 'COMPLETED',
      payer: {
        email_address: 'buyer@example.com',
        name: { given_name: 'John', surname: 'Doe' }
      },
      purchase_units: [{
        amount: { value: '7.00', currency_code: 'USD' }
      }]
    },
    hotmart: {
      event: 'PURCHASE_APPROVED',
      purchase: {
        transaction: 'TRANSACTION_ID_HERE',
        offer: { code: 'OFFER_CODE_HERE' },
        price: { currency: 'USD', value: 7.00 },
        buyer: { email: 'buyer@example.com' }
      }
    }
  };

  if (provider && examples[provider as keyof typeof examples]) {
    return NextResponse.json({
      provider,
      example: examples[provider as keyof typeof examples]
    });
  }

  return NextResponse.json({
    providers: Object.keys(examples),
    examples
  });
}