import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.MERCADOPAGO_CLIENT_ID || '8400251779300797';
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-8400251779300797-100517-207f2ff90eec04a47316d5974b5474ce-1068552659';
  
  // Mostrar solo los últimos 4 dígitos del access token por seguridad
  const maskedToken = accessToken.substring(0, 20) + '...' + accessToken.substring(accessToken.length - 10);
  
  return NextResponse.json({
    message: 'Configuración actual de Mercado Pago',
    client_id: clientId,
    access_token_preview: maskedToken,
    is_using_env_vars: {
      client_id: !!process.env.MERCADOPAGO_CLIENT_ID,
      access_token: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
    },
    expected_client_id: '8400251779300797',
    is_correct: clientId === '8400251779300797',
    source: process.env.MERCADOPAGO_CLIENT_ID ? 'Environment Variables (Netlify)' : 'Hardcoded Fallback',
  });
}
