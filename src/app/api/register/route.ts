import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { email, password, phone, country, deviceType, debug } = await request.json();

    console.log('API de registro recibió solicitud para:', email);

    // Si estamos en modo debug, devolver información de diagnóstico
    if (debug) {
      return NextResponse.json({
        debug: true,
        message: 'Modo de depuración activado',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    }

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Intentar registrar al usuario directamente con la API de Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'X-Client-Info': 'supabase-js/2.x'
      },
      body: JSON.stringify({
        email,
        password,
        data: { phone }
      })
    });

    const result = await response.json();

    // Si hay un error, verificar si el usuario ya existe
    if (!response.ok || result.error) {
      console.error('Error en registro directo:', result.error);

      // Si el error indica que el usuario ya existe, intentar iniciar sesión
      if (result.error?.message?.includes('already') || result.error?.message?.includes('exists')) {
        // Intentar iniciar sesión
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'X-Client-Info': 'supabase-js/2.x'
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok && loginResult.access_token) {
          return NextResponse.json({
            success: true,
            message: 'Usuario ya existe, inicio de sesión exitoso',
            user: loginResult.user,
            session: {
              access_token: loginResult.access_token,
              refresh_token: loginResult.refresh_token
            }
          });
        }
      }

      return NextResponse.json(
        { error: result.error?.message || 'Error desconocido en el registro' },
        { status: 400 }
      );
    }

    // Si el registro fue exitoso, crear un perfil básico
    if (result.user && result.user.id) {
      const now = new Date().toISOString();
      const profileData = {
        id: result.user.id,
        email,
        phone: phone || '',
        level: 1,
        balance: 0,
        avatar_url: null,
        created_at: now
      };

      // Intentar crear el perfil en la tabla profiles
      try {
        await supabase.from('profiles').insert(profileData);
      } catch (err) {
        console.error('Error al crear perfil, pero continuando:', err);
      }

      // Intentar crear el perfil en la tabla user_profiles con país y dispositivo
      try {
        await supabase.from('user_profiles').insert({
          ...profileData,
          user_id: result.user.id,
          country: country || null,
          device_type: deviceType || null,
          last_login: now
        });
      } catch (err) {
        console.error('Error al crear user_profile, pero continuando:', err);
      }
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error('Error inesperado en API de registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
