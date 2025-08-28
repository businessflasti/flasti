import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Crear cliente de Supabase con el token del usuario
    const token = authorization.replace('Bearer ', '');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error de autenticación:', authError);
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Obtener el estado premium del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('is_premium, premium_activated_at, premium_payment_method')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      // Si no existe el perfil, crear uno con estado gratuito
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: user.id,
            balance: 0.00,
            total_earnings: 0.00,
            total_withdrawals: 0.00,
            is_premium: false
          }])
          .select('is_premium, premium_activated_at, premium_payment_method')
          .single();

        if (createError) {
          console.error('Error creando perfil de usuario:', createError);
          return NextResponse.json(
            { error: 'Error creando perfil de usuario' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          isPremium: false,
          subscriptionType: 'free',
          features: [],
          activatedAt: null,
          paymentMethod: null
        });
      }

      console.error('Error obteniendo perfil de usuario:', profileError);
      return NextResponse.json(
        { error: 'Error obteniendo estado premium' },
        { status: 500 }
      );
    }

    // Determinar el tipo de suscripción y características
    const isPremium = userProfile.is_premium || false;
    const subscriptionType = isPremium ? 'premium' : 'free';
    const features = isPremium ? [
      'unlimited_microtasks',
      'priority_support',
      'advanced_analytics',
      'exclusive_offers'
    ] : [];

    return NextResponse.json({
      isPremium,
      subscriptionType,
      features,
      activatedAt: userProfile.premium_activated_at,
      paymentMethod: userProfile.premium_payment_method
    });

  } catch (error) {
    console.error('Error en endpoint de estado premium:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Crear cliente de Supabase con el token del usuario
    const token = authorization.replace('Bearer ', '');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error de autenticación:', authError);
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la solicitud
    const { paymentMethod } = await request.json();

    // Activar premium para el usuario
    const { data, error } = await supabase.rpc('activate_user_premium', {
      user_id_param: user.id,
      payment_method_param: paymentMethod || 'manual'
    });

    if (error) {
      console.error('Error activando premium:', error);
      return NextResponse.json(
        { error: 'Error activando premium' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Premium activado exitosamente',
      isPremium: true,
      subscriptionType: 'premium',
      features: [
        'unlimited_microtasks',
        'priority_support',
        'advanced_analytics',
        'exclusive_offers'
      ]
    });

  } catch (error) {
    console.error('Error en endpoint POST de estado premium:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}