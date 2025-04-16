import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AffiliateTrackingService } from '@/lib/affiliate-tracking-service';
import { createServerClient } from '@/lib/supabase-server';

/**
 * Endpoint para obtener las estadísticas de afiliados del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Crear cliente de Supabase con cookies para autenticación
    const supabaseServerClient = createServerClient();
    
    // Verificar si el usuario está autenticado
    const { data: { session } } = await supabaseServerClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }
    
    // Obtener las estadísticas del afiliado
    const { success, error, stats } = await AffiliateTrackingService.getAffiliateStats(session.user.id);
    
    if (!success) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    
    // Obtener el código de afiliado
    const { success: codeSuccess, affiliateCode } = await AffiliateTrackingService.getAffiliateCode(session.user.id);
    
    if (!codeSuccess) {
      return NextResponse.json(
        { error: 'Error al obtener código de afiliado' },
        { status: 500 }
      );
    }
    
    // Obtener las ventas recientes
    const { success: salesSuccess, sales } = await AffiliateTrackingService.getAffiliateSales(session.user.id);
    
    // Obtener los enlaces
    const { success: linksSuccess, links } = await AffiliateTrackingService.getAffiliateLinks(session.user.id);
    
    // Construir la URL de afiliado
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flasti.co';
    const affiliateUrl = `${baseUrl}?ref=${affiliateCode}`;
    
    return NextResponse.json({
      stats,
      affiliateCode,
      affiliateUrl,
      recentSales: salesSuccess ? sales.slice(0, 5) : [],
      links: linksSuccess ? links : []
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de afiliado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
