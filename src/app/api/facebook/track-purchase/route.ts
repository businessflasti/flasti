import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PurchaseEventData {
  value: number;
  currency: string;
  content_ids: string[];
  content_name: string;
  content_type: string;
  num_items: number;
}

interface TrackPurchaseRequest {
  eventData: PurchaseEventData;
  eventId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { eventData, eventId }: TrackPurchaseRequest = await request.json();
    
    // Obtener IP del cliente
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Configuración de Facebook Conversions API
    const pixelId = process.env.FACEBOOK_PIXEL_ID || "738700458549300";
    const accessToken = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
    
    if (!accessToken) {
      console.log('⚠️ Facebook Conversions API token no configurado');
      return NextResponse.json({ success: false, error: 'Token no configurado' }, { status: 400 });
    }

    // Verificar si debemos trackear (excluir IPs locales y específicas)
    const shouldTrack = await checkShouldTrack(ip);
    if (!shouldTrack) {
      console.log(`🚫 Tracking bloqueado para IP: ${ip}`);
      return NextResponse.json({ success: true, message: 'Tracking bloqueado' });
    }

    // Preparar payload para Conversions API
    const payload = {
      data: [{
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // ID único para deduplicación con el pixel del cliente
        action_source: 'website',
        event_source_url: `${request.nextUrl.origin}/payment-confirmation-9d4e7b2a8f1c6e3b`,
        user_data: {
          client_ip_address: ip,
          client_user_agent: request.headers.get('user-agent') || undefined,
          fbc: request.cookies.get('_fbc')?.value || undefined, // Facebook click ID
          fbp: request.cookies.get('_fbp')?.value || undefined, // Facebook browser ID
        },
        custom_data: {
          value: eventData.value,
          currency: eventData.currency,
          content_ids: eventData.content_ids,
          content_name: eventData.content_name,
          content_type: eventData.content_type,
          num_items: eventData.num_items
        }
      }],
      access_token: accessToken
    };

    // Enviar a Facebook Conversions API
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Evento Purchase enviado a Facebook Conversions API');
      console.log('📊 Datos del evento:', {
        eventId,
        value: eventData.value,
        currency: eventData.currency,
        content_name: eventData.content_name,
        ip: ip
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Evento enviado correctamente',
        eventId,
        result 
      });
    } else {
      const error = await response.text();
      console.error('❌ Error al enviar a Facebook Conversions API:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Error al enviar evento',
        details: error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Error en endpoint de tracking:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

async function checkShouldTrack(ip: string): Promise<boolean> {
  // Lista de IPs excluidas
  const excludedIps = [
    '201.235.207.156', // IP específica excluida
    '127.0.0.1',
    '::1',
    'localhost'
  ];

  // Verificar IP excluida
  if (excludedIps.includes(ip)) {
    return false;
  }

  // Verificar redes locales
  if (
    /^192\.168\./.test(ip) ||
    /^10\./.test(ip) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
  ) {
    return false;
  }

  // Verificar si estamos en entorno de desarrollo
  if (process.env.NODE_ENV === 'development') {
    return false;
  }

  return true;
}