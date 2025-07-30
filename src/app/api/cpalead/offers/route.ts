import { NextRequest, NextResponse } from 'next/server';
import { getOffersFromCpaLead } from '@/lib/cpa-lead-api';

/**
 * GET - Obtener ofertas de CPALead
 */
export async function GET(request: NextRequest) {
  try {
    console.log('CPALead API: Solicitando ofertas...');

    // Obtener ofertas de CPALead
    const offers = await getOffersFromCpaLead();

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