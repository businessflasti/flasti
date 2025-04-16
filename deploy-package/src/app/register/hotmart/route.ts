// API para procesar registros desde Hotmart
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hotmartService } from '@/lib/hotmart-service';

/**
 * Procesa el registro de un usuario desde Hotmart
 */
export async function GET(req: NextRequest) {
  try {
    // Obtener el token de Hotmart de los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const hotmartToken = searchParams.get('token');
    
    if (!hotmartToken) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
    }
    
    // En un caso real, aquí verificaríamos el token con Hotmart
    // y obtendríamos los datos de la compra
    
    // Simular datos de compra para el ejemplo
    const mockPurchaseData = {
      event: 'PURCHASE_COMPLETE',
      data: {
        buyer: {
          id: `hotmart_${Date.now()}`,
          email: `usuario${Date.now()}@example.com`,
          name: 'Usuario',
          surname: 'Ejemplo',
          ucode: `hotmart_${Date.now()}`
        },
        purchase: {
          product: {
            id: 1
          },
          price: {
            value: 5
          }
        }
      }
    };
    
    // Registrar el usuario
    const result = await hotmartService.registerUserFromHotmart(mockPurchaseData);
    
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
      });
    }
    
    // Redirigir al dashboard
    const response = NextResponse.redirect(new URL('/dashboard', req.url));
    return response;
  } catch (error) {
    console.error('Error al procesar registro desde Hotmart:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}