import { NextRequest, NextResponse } from 'next/server';
import { getOffersFromCpaLead } from '@/lib/cpa-lead-api';

/**
 * GET - Obtener ofertas de CPALead
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener el país del usuario desde los parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const userCountry = searchParams.get('country');
    
    console.log('CPALead API: Solicitud recibida');
    console.log('CPALead API: URL completa:', request.nextUrl.toString());
    console.log('CPALead API: País solicitado:', userCountry || 'all');
    console.log('CPALead API: Todos los parámetros:', Object.fromEntries(searchParams.entries()));

    // Si el país es Argentina, forzar el código AR
    const countryCode = userCountry === 'Argentina' ? 'AR' : userCountry;
    
    console.log('CPALead API: Código de país a usar:', countryCode);

    // Obtener ofertas de CPALead con el país específico
    const offers = await getOffersFromCpaLead(countryCode);

    return NextResponse.json({
      success: true,
      data: offers,
      count: offers.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CPALead API: Error al obtener ofertas:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch offers',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    );
  }
}