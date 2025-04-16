import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Endpoint para registrar visitas a la página de checkout
 * 
 * Este endpoint registra cuando un usuario llega a la página de checkout
 * a través de un enlace de afiliado, lo que ayuda a mejorar la atribución
 * de ventas.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const ref = searchParams.get('ref');
    const product = searchParams.get('product');
    
    if (!ref || !product) {
      return NextResponse.json({ error: 'Parámetros faltantes' }, { status: 400 });
    }
    
    // Convertir el ID del producto a número
    const productId = parseInt(product, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID de producto inválido' }, { status: 400 });
    }
    
    // Registrar la visita a checkout
    await supabase.from('affiliate_checkout_visits').insert({
      affiliate_id: ref,
      app_id: productId,
      ip_address: req.ip || '0.0.0.0',
      user_agent: req.headers.get('user-agent') || 'Unknown'
    });
    
    // Establecer una cookie específica para checkout
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'flasti_checkout_affiliate',
      value: `${ref}_${productId}`,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Error al registrar visita a checkout:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
