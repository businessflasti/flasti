import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Maneja las redirecciones de enlaces de afiliados personalizados
 */
export async function GET(request: NextRequest) {
  // Extraer el slug de la URL
  const slug = request.nextUrl.pathname.slice(1);
  try {
    // El slug ya se extrajo de la URL
    const refCode = request.nextUrl.searchParams.get('ref');

    // Buscar el enlace por slug
    const { data: linkData, error: linkError } = await supabase
      .from('affiliate_links')
      .select('target_url, affiliate_id, id')
      .eq('slug', slug)
      .single();

    if (linkError || !linkData) {
      // Si no se encuentra el enlace, redirigir a la página principal
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Obtener el código de afiliado si no se proporcionó en la URL
    let finalRefCode = refCode;

    if (!finalRefCode) {
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('affiliate_code')
        .eq('id', linkData.affiliate_id)
        .single();

      if (!affiliateError && affiliateData) {
        finalRefCode = affiliateData.affiliate_code;
      }
    }

    // Construir la URL de destino
    let targetUrl = linkData.target_url;

    // Añadir el código de afiliado como parámetro ref si no está ya en la URL
    if (finalRefCode && !targetUrl.includes('ref=')) {
      const separator = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${separator}ref=${finalRefCode}`;
    }

    // Incrementar el contador de clics
    if (linkData.id) {
      await supabase.rpc('increment_affiliate_link_clicks', {
        link_id_param: linkData.id
      });
    }

    // Redirigir a la URL de destino
    return NextResponse.redirect(new URL(targetUrl));
  } catch (error) {
    console.error('Error al procesar redirección de afiliado:', error);
    // En caso de error, redirigir a la página principal
    return NextResponse.redirect(new URL('/', request.url));
  }
}
