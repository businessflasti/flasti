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

    // Buscar o crear perfil de usuario
    let { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Si no existe el perfil, crearlo
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          balance: 0.00,
          total_earnings: 0.00,
          total_withdrawals: 0.00
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creando perfil de usuario:', createError);
        return NextResponse.json(
          { error: 'Error creando perfil de usuario' },
          { status: 500 }
        );
      }

      userProfile = newProfile;
    } else if (profileError) {
      console.error('Error obteniendo perfil de usuario:', profileError);
      return NextResponse.json(
        { error: 'Error obteniendo perfil de usuario' },
        { status: 500 }
      );
    }

    // Obtener estadísticas de CPALead
    let cpaLeadStats = {
      total_earnings: 0,
      total_transactions: 0,
      today_earnings: 0,
      week_earnings: 0,
      today_transactions: 0,
      week_transactions: 0,
      last_updated: new Date().toISOString()
    };

    try {
      // Obtener todas las transacciones del usuario
      const { data: transactions, error: transError } = await supabase
        .from('cpalead_transactions')
        .select('amount, created_at')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (!transError && transactions) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        cpaLeadStats = {
          total_earnings: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
          total_transactions: transactions.length,
          today_earnings: transactions
            .filter(t => new Date(t.created_at) >= today)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0),
          week_earnings: transactions
            .filter(t => new Date(t.created_at) >= weekAgo)
            .reduce((sum, t) => sum + parseFloat(t.amount), 0),
          today_transactions: transactions.filter(t => new Date(t.created_at) >= today).length,
          week_transactions: transactions.filter(t => new Date(t.created_at) >= weekAgo).length,
          last_updated: new Date().toISOString()
        };
      }
    } catch (statsError) {
      console.error('Error obteniendo estadísticas CPALead:', statsError);
      // Usar valores por defecto si hay error
    }

    return NextResponse.json({
      profile: userProfile,
      cpalead_stats: cpaLeadStats
    });

  } catch (error) {
    console.error('Error en endpoint de perfil:', error);
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

    // Crear perfil de usuario si no existe
    const { data: userProfile, error: createError } = await supabase
      .from('user_profiles')
      .upsert([{
        user_id: user.id,
        balance: 0.00,
        total_earnings: 0.00,
        total_withdrawals: 0.00
      }], {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creando/actualizando perfil:', createError);
      return NextResponse.json(
        { error: 'Error creando perfil de usuario' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: userProfile,
      message: 'Perfil creado/actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error en endpoint de perfil POST:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}