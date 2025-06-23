import { NextRequest, NextResponse } from 'next/server';
import hotmartTrackingService from '@/lib/hotmart-tracking-service';

/**
 * Endpoint para recibir eventos del frontend y enviarlos a la API de conversiones de Meta
 * Recibe: { event: string, params: any }
 */
export async function POST(req: NextRequest) {
  try {
    const { event, params } = await req.json();
    // Obtener la IP del request
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
    // Enviar el evento a la API de conversiones
    await hotmartTrackingService['sendServerSidePixelEvent'](event, params, {
      email: params.user_email || params.email || '',
      firstName: params.user_name?.split(' ')[0] || '',
      lastName: params.user_name?.split(' ').slice(1).join(' ') || ''
    }, ip);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/tracking/meta-event:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
