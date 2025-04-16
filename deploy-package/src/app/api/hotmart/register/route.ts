// API para registrar usuarios desde Hotmart y generar tokens de acceso
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hotmartService } from '@/lib/hotmart-service';
import { trackingService } from '@/lib/tracking-service';

/**
 * Procesa el registro de un usuario desde Hotmart y genera un token de acceso
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar la autenticación del webhook (en un caso real, verificaríamos firmas o tokens)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extraer el token
    const token = authHeader.substring(7);
    
    // En un caso real, verificaríamos este token con Hotmart
    if (token !== process.env.HOTMART_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Obtener el payload del webhook
    const payload = await req.json();
    
    // Verificar que el payload tenga la estructura esperada
    if (!payload || !payload.data || !payload.data.buyer) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }
    
    // Verificar si la compra debe atribuirse a un afiliado
    const { shouldAttribute, affiliateId, appId } = await trackingService.shouldAttributeSale(
      req,
      payload.data?.buyer?.id || ''
    );
    
    // Si hay un afiliado, añadir la información al payload
    if (shouldAttribute && affiliateId && appId) {
      payload.data.purchase = payload.data.purchase || {};
      payload.data.purchase.affiliate = { id: affiliateId };
      payload.data.purchase.product = { id: appId };
    }
    
    // Registrar el usuario
    const result = await hotmartService.registerUserFromHotmart(payload);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    
    // Establecer cookie de autenticación
    if (result.token) {
      const cookieStore = cookies();
      cookieStore.set({
        name: 'auth_token',
        value: result.token,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }
    
    // Devolver respuesta exitosa con datos del usuario
    return NextResponse.json({
      success: true,
      message: result.message,
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        level: result.user?.level,
        balance: result.user?.balance
      }
    });
  } catch (error) {
    console.error('Error al procesar registro desde Hotmart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}