import { NextRequest, NextResponse } from 'next/server';
import { getOffersFromCpaLead, detectUserCountry } from '@/lib/cpa-lead-api';
import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase con service role para leer asignaciones
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // 🆕 NUEVO SISTEMA: Verificar si hay una asignación manual para este país
    let offerCountry = targetCountry; // Por defecto, usar el país del usuario
    let isUsingManualMapping = false;
    let mappingInfo = null;

    if (!getRealOffers) {
      const { data: mapping } = await supabaseAdmin
        .from('country_offer_mappings')
        .select('*')
        .eq('user_country', targetCountry)
        .eq('is_active', true)
        .single();

      if (mapping) {
        offerCountry = mapping.offer_country;
        isUsingManualMapping = true;
        mappingInfo = {
          userCountry: targetCountry,
          offerCountry: mapping.offer_country,
          notes: mapping.notes,
          reason: 'Asignación manual del administrador'
        };
        console.log(`🎯 CPALead API: Asignación manual encontrada: ${targetCountry} → ${offerCountry}`);
      }
    }

    // Obtener ofertas del país asignado (puede ser el original o el mapeado)
    const offers = await getOffersFromCpaLead(offerCountry, forceRefresh);
    
    // Ya no usamos la lógica automática de España, solo las asignaciones manuales
    let displayOffers = offers;
    let originalOffers = offers;

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
      country: targetCountry, // País del usuario
      offerCountry: offerCountry, // País de las ofertas mostradas
      timestamp: new Date().toISOString(),
      cached: !forceRefresh,
      // 🆕 Nueva información sobre asignaciones manuales
      isUsingManualMapping,
      mappingInfo,
      // Mantener compatibilidad con código anterior
      isUsingSpainFallback: false, // Ya no se usa
      originalCount: originalOffers.length,
      fallbackInfo: null
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