import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, amount, method, destination } = body;
    
    if (!user_id || !amount || !method || !destination) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Obtener token de autorización
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
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

    // Validar que el monto sea válido
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json({ error: 'Monto inválido' }, { status: 400 });
    }

    // Validar saldo suficiente en user_profiles (saldo de CPALead)
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('user_id', user_id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (userProfile.balance < amountNumber) {
      return NextResponse.json({ 
        error: 'Saldo insuficiente',
        available_balance: userProfile.balance,
        requested_amount: amountNumber
      }, { status: 400 });
    }

    // Insertar solicitud de retiro
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawals')
      .insert({
        user_id,
        amount: amountNumber,
        payment_method: method,
        payment_details: {
          destination: destination,
          method: method
        },
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error insertando retiro:', insertError);
      return NextResponse.json({ error: 'Error al procesar solicitud de retiro' }, { status: 500 });
    }

    // Registrar en el log de actividad
    await supabase
      .from('affiliate_activity_logs')
      .insert({
        user_id,
        activity_type: 'withdrawal_request',
        details: {
          withdrawal_id: withdrawal.id,
          amount: amountNumber,
          method: method,
          destination: destination,
          previous_balance: userProfile.balance
        },
        created_at: new Date().toISOString()
      });

    // Crear notificación para el usuario
    await supabase
      .from('notifications')
      .insert({
        user_id,
        type: 'info',
        title: 'Solicitud de retiro enviada',
        message: `Tu solicitud de retiro por $${amountNumber.toFixed(2)} USD ha sido enviada y está pendiente de revisión.`,
        read: false,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ 
      success: true,
      withdrawal_id: withdrawal.id,
      message: 'Solicitud de retiro enviada correctamente'
    });

  } catch (error) {
    console.error('Error en endpoint de retiros:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
