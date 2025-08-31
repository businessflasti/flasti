import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG AUTH API ===');
    
    // Mostrar todas las cookies
    const allCookies = request.cookies.getAll();
    console.log('Todas las cookies:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' })));
    
    // Filtrar cookies de Supabase
    const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.startsWith('sb-'));
    console.log('Cookies de Supabase:', supabaseCookies.map(c => c.name));
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Intentar obtener la sesión
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Resultado de getSession:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      sessionError: sessionError?.message
    });
    
    // Intentar obtener el usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Resultado de getUser:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userError: userError?.message
    });
    
    return NextResponse.json({
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.length,
        names: supabaseCookies.map(c => c.name)
      },
      session: {
        exists: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: sessionError?.message
      },
      user: {
        exists: !!user,
        userId: user?.id,
        email: user?.email,
        error: userError?.message
      }
    });
    
  } catch (error) {
    console.error('Error en debug auth:', error);
    return NextResponse.json(
      { error: 'Error en debug', details: error },
      { status: 500 }
    );
  }
}