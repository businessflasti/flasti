import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint para el pixel de seguimiento de afiliados
 * Devuelve una imagen transparente de 1x1 pixel
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref');
    const pageUrl = url.searchParams.get('url');
    
    if (ref) {
      // Registrar el clic en segundo plano sin bloquear la respuesta
      setTimeout(async () => {
        try {
          // Buscar el afiliado por código
          const { data: affiliateData } = await supabase
            .from('affiliates')
            .select('id')
            .eq('affiliate_code', ref)
            .eq('status', 'active')
            .single();
          
          if (affiliateData) {
            // Registrar el clic
            await supabase
              .from('affiliate_clicks')
              .insert({
                affiliate_id: affiliateData.id,
                ip_address: request.ip || null,
                user_agent: request.headers.get('user-agent') || null,
                referrer: request.headers.get('referer') || null,
                url: pageUrl || url.origin
              });
          }
        } catch (error) {
          // Ignorar errores, no queremos bloquear la respuesta
          console.error('Error al registrar clic (no crítico):', error);
        }
      }, 10);
    }
    
    // Crear una imagen transparente de 1x1 pixel
    const transparentPixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    // Devolver la imagen con las cabeceras adecuadas
    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // En caso de error, devolver igualmente la imagen transparente
    const transparentPixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    
    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
}
