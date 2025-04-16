// API para rastrear visitas de afiliados
import { NextRequest, NextResponse } from 'next/server';
import { trackingService } from '@/lib/tracking-service';

/**
 * Registra una visita de afiliado cuando un usuario llega a través de un enlace de afiliado
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const affiliateId = searchParams.get('ref');
    const appId = searchParams.get('app');
    
    if (!affiliateId || !appId) {
      return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 });
    }
    
    // Registrar la visita
    await trackingService.trackAffiliateVisit(req, affiliateId, parseInt(appId, 10));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al registrar visita de afiliado:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}