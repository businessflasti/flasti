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
    const getRealOffers = searchParams.get('real') === 'true'; // Nuevo parámetro para obtener ofertas reales
    
    console.log('🚀 CPALead API: Solicitando ofertas...', { country, forceRefresh, getRealOffers });

    // Detectar país si no se proporciona
    let targetCountry = country;
    if (!targetCountry) {
      targetCountry = await detectUserCountry();
      console.log('🌍 CPALead API: País detectado automáticamente:', targetCountry);
    }

    // Obtener ofertas filtradas por país
    const offers = await getOffersFromCpaLead(targetCountry, forceRefresh);
    
    // Lógica de respaldo: si el país tiene 0 o 10 o menos ofertas, usar España como respaldo visual
    // PERO solo si no se solicitan las ofertas reales (real=true)
    let displayOffers = offers;
    let isUsingSpainFallback = false;
    let originalOffers = offers; // Guardar las ofertas originales
    
    if (!getRealOffers && offers.length <= 10 && targetCountry !== 'ES') {
      console.log(`🇪🇸 CPALead API: País ${targetCountry} tiene ${offers.length} ofertas (≤10), usando España como respaldo visual`);
      const spainOffers = await getOffersFromCpaLead('ES', forceRefresh);
      if (spainOffers.length > 0) {
        displayOffers = spainOffers;
        isUsingSpainFallback = true;
        console.log(`🇪🇸 CPALead API: Mostrando ${spainOffers.length} ofertas de España para ${targetCountry}`);
      }
    } else if (getRealOffers) {
      console.log(`👑 CPALead API: Solicitadas ofertas reales para ${targetCountry}, omitiendo respaldo`);
    }

    // Estadísticas detalladas (usar las ofertas que se van a mostrar)
    const stats = {
      total: displayOffers.length,
      fastPay: displayOffers.filter(o => o.is_fast_pay).length,
      avgPayout: displayOffers.length > 0 ? 
        (displayOffers.reduce((sum, o) => sum + parseFloat(o.amount || '0'), 0) / displayOffers.length).toFixed(2) : '0',
      maxPayout: displayOffers.length > 0 ? 
        Math.max(...displayOffers.map(o => parseFloat(o.amount || '0'))).toFixed(2) : '0',
      minPayout: displayOffers.length > 0 ? 
        Math.min(...displayOffers.map(o => parseFloat(o.amount || '0'))).toFixed(2) : '0',
      devices: [...new Set(displayOffers.map(o => o.device))],
      payoutTypes: [...new Set(displayOffers.map(o => o.payout_type))],
      fastPayPercentage: displayOffers.length > 0 ? 
        ((displayOffers.filter(o => o.is_fast_pay).length / displayOffers.length) * 100).toFixed(1) : '0'
    };

    console.log('📊 CPALead API: Estadísticas de ofertas:', stats);

    return NextResponse.json({
      success: true,
      data: displayOffers,
      count: displayOffers.length,
      stats,
      country: targetCountry, // Mantener el país original en la respuesta
      timestamp: new Date().toISOString(),
      cached: !forceRefresh,
      // Información adicional para el frontend
      isUsingSpainFallback,
      originalCount: originalOffers.length, // Cantidad real de ofertas del país
      fallbackInfo: isUsingSpainFallback ? {
        originalCountry: targetCountry,
        fallbackCountry: 'ES',
        reason: `País ${targetCountry} tiene ${originalOffers.length} ofertas (≤10)`
      } : null
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