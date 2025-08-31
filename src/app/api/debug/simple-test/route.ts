import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== SIMPLE TEST API ===');
    
    // Verificar variables de entorno
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:', {
      hasSupabaseUrl,
      hasSupabaseKey,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    });
    
    // Intentar crear cliente básico
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Hacer una consulta simple
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('*')
      .limit(1);
    
    console.log('Simple query result:', { data, error });
    
    return NextResponse.json({
      environment: {
        hasSupabaseUrl,
        hasSupabaseKey
      },
      query: {
        success: !error,
        error: error?.message,
        data
      }
    });
    
  } catch (error) {
    console.error('Error en simple test:', error);
    return NextResponse.json(
      { error: 'Error en test', details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE POST TEST ===');
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('Token received:', !!token, token?.substring(0, 20) + '...');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    
    // Verificar token
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    console.log('User verification:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    });
    
    return NextResponse.json({
      token: {
        provided: !!token,
        valid: !!user && !userError
      },
      user: {
        id: user?.id,
        email: user?.email,
        error: userError?.message
      }
    });
    
  } catch (error) {
    console.error('Error en POST test:', error);
    return NextResponse.json(
      { error: 'Error en POST test', details: error },
      { status: 500 }
    );
  }
}