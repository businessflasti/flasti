import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint para registrar clics de afiliados
 * Diseñado para ser llamado de forma no bloqueante
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener datos del clic
    const clickData = await request.json();
    const { ref, url, referrer, userAgent } = clickData;

    if (!ref) {
      return NextResponse.json({ error: 'Código de afiliado no proporcionado' }, { status: 400 });
    }

    // Buscar el afiliado por código
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('affiliate_code', ref)
      .eq('status', 'active')
      .single();

    if (affiliateError || !affiliateData) {
      console.error('Código de afiliado inválido:', affiliateError || 'No encontrado');
      // Devolver éxito aunque haya error para no bloquear al cliente
      return NextResponse.json({ success: false, message: 'Código de afiliado inválido' });
    }

    // Registrar el clic
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        affiliate_id: affiliateData.id,
        ip_address: request.ip || null,
        user_agent: userAgent,
        referrer: referrer,
        url: url
      });

    if (clickError) {
      console.error('Error al registrar clic:', clickError);
      // Devolver éxito aunque haya error para no bloquear al cliente
      return NextResponse.json({ success: false, message: 'Error al registrar clic' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en el endpoint de registro de clics:', error);
    // Devolver éxito aunque haya error para no bloquear al cliente
    return NextResponse.json({ success: false, message: 'Error interno' });
  }
}

// También manejar solicitudes OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
