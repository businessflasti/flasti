import { NextRequest, NextResponse } from 'next/server';
import { getOffersFromCpaLead, detectUserCountry } from '@/lib/cpa-lead-api';

/**
 * GET - Obtener ofertas de CPALead filtradas por país del usuario
 * Query parameters:
 * - country: Código de país opcional (ej: 'US', 'ES', 'MX')
 * - refresh: 'true' para forzar actualización del cache
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    console.log('🚀 CPALead API: Solicitando ofertas...', { country, forceRefresh });

    // Detectar país si no se proporciona
    let targetCountry = country;
    if (!targetCountry) {
      targetCountry = await detectUserCountry();
      console.log('🌍 CPALead API: País detectado automáticamente:', targetCountry);
    }

    // Obtener ofertas filtradas por país
    const offers = await getOffersFromCpaLead(targetCountry, forceRefresh);

    // Estadísticas detalladas
    const stats = {
      total: offers.length,
      fastPay: offers.filter(o => o.is_fast_pay).length,
      avgPayout: offers.length > 0 ? 
        (offers.reduce((sum, o) => sum + parseFloat(o.amount || '0'), 0) / offers.length).toFixed(2) : '0',
      maxPayout: offers.length > 0 ? 
        Math.max(...offers.map(o => parseFloat(o.amount || '0'))).toFixed(2) : '0',
      minPayout: offers.length > 0 ? 
        Math.min(...offers.map(o => parseFloat(o.amount || '0'))).toFixed(2) : '0',
      devices: [...new Set(offers.map(o => o.device))],
      payoutTypes: [...new Set(offers.map(o => o.payout_type))],
      fastPayPercentage: offers.length > 0 ? 
        ((offers.filter(o => o.is_fast_pay).length / offers.length) * 100).toFixed(1) : '0'
    };

    console.log('📊 CPALead API: Estadísticas de ofertas:', stats);

    return NextResponse.json({
      success: true,
      data: offers,
      count: offers.length,
      stats,
      country: targetCountry,
      timestamp: new Date().toISOString(),
      cached: !forceRefresh
    });

  } catch (error) {
    console.error('❌ CPALead API: Error al obtener ofertas:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch offers',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        count: 0,
        stats: { 
          total: 0, 
          fastPay: 0, 
          avgPayout: '0', 
          maxPayout: '0', 
          minPayout: '0',
          devices: [],
          payoutTypes: [],
          fastPayPercentage: '0'
        },
        country: null,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}