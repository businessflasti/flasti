import { NextRequest, NextResponse } from 'next/server';
import { AffiliateTrackingService } from '@/lib/affiliate-tracking-service';
import { createServerClient } from '@/lib/supabase-server';

/**
 * Endpoint para crear un nuevo enlace de afiliado
 */
export async function POST(request: NextRequest) {
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
    
    // Obtener los datos del cuerpo de la solicitud
    const { name, slug, targetUrl } = await request.json();
    
    // Validar los datos
    if (!name || !slug || !targetUrl) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    
    // Crear el enlace
    const { success, error, link } = await AffiliateTrackingService.createAffiliateLink(
      session.user.id,
      name,
      slug,
      targetUrl
    );
    
    if (!success) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Error al crear enlace de afiliado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para obtener los enlaces de afiliado del usuario
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
    
    // Obtener los enlaces
    const { success, error, links } = await AffiliateTrackingService.getAffiliateLinks(session.user.id);
    
    if (!success) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error al obtener enlaces de afiliado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
