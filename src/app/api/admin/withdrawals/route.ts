import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
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

    // Obtener todas las solicitudes de retiro
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select(`
        id,
        user_id,
        amount,
        payment_method,
        payment_details,
        status,
        created_at,
        processed_at
      `)
      .order('created_at', { ascending: false });

    if (withdrawalsError) {
      console.error('Error obteniendo retiros:', withdrawalsError);
      return NextResponse.json({ error: 'Error obteniendo retiros' }, { status: 500 });
    }

    // Obtener información de usuarios desde user_profiles
    const userIds = withdrawals?.map(w => w.user_id) || [];
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, email')
      .in('user_id', userIds);

    if (profilesError) {
      console.error('Error obteniendo perfiles:', profilesError);
    }

    // Si no hay perfiles, obtener emails desde auth.users usando una consulta directa
    let userEmails: { [key: string]: string } = {};
    
    if (userProfiles && userProfiles.length > 0) {
      userProfiles.forEach(profile => {
        if (profile.email) {
          userEmails[profile.user_id] = profile.email;
        }
      });
    }

    // Para usuarios sin email en user_profiles, usar una consulta SQL directa
    if (Object.keys(userEmails).length < userIds.length) {
      try {
        const { data: authData, error: authError } = await supabase
          .from('auth.users')
          .select('id, email')
          .in('id', userIds);

        if (!authError && authData) {
          authData.forEach((user: any) => {
            if (user.email && !userEmails[user.id]) {
              userEmails[user.id] = user.email;
            }
          });
        }
      } catch (authError) {
        console.log('No se pudo obtener emails desde auth.users, usando fallback');
      }
    }

    // Formatear respuesta
    const formattedWithdrawals = withdrawals?.map(withdrawal => ({
      id: withdrawal.id,
      user_id: withdrawal.user_id,
      user_email: userEmails[withdrawal.user_id] || 'No disponible',
      amount: withdrawal.amount,
      payment_method: withdrawal.payment_method,
      payment_details: withdrawal.payment_details,
      status: withdrawal.status,
      created_at: withdrawal.created_at,
      processed_at: withdrawal.processed_at
    })) || [];

    return NextResponse.json({ 
      success: true, 
      withdrawals: formattedWithdrawals 
    });

  } catch (error) {
    console.error('Error en endpoint de retiros admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { withdrawal_id, status, notes } = body;
    
    if (!withdrawal_id || !status) {
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

    // Obtener detalles del retiro actual
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawal_id)
      .single();

    if (withdrawalError || !withdrawal) {
      return NextResponse.json({ error: 'Retiro no encontrado' }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'El retiro ya fue procesado' }, { status: 400 });
    }

    // Preparar datos de actualización
    const updateData: any = {
      status,
      processed_at: new Date().toISOString()
    };

    if (notes) {
      updateData.payment_details = {
        ...withdrawal.payment_details,
        notes: notes,
        ...(status === 'rejected' && { rejection_reason: notes })
      };
    }

    // Actualizar estado del retiro
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update(updateData)
      .eq('id', withdrawal_id);

    if (updateError) {
      console.error('Error actualizando retiro:', updateError);
      return NextResponse.json({ error: 'Error actualizando retiro' }, { status: 500 });
    }

    // Si se aprueba, descontar del saldo del usuario
    if (status === 'approved' || status === 'completed') {
      // Obtener saldo actual del usuario
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('balance, total_withdrawals')
        .eq('user_id', withdrawal.user_id)
        .single();

      if (profileError || !userProfile) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      if (userProfile.balance < withdrawal.amount) {
        return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
      }

      // Actualizar saldo del usuario
      const newBalance = userProfile.balance - withdrawal.amount;
      const newTotalWithdrawals = (userProfile.total_withdrawals || 0) + withdrawal.amount;

      const { error: balanceError } = await supabase
        .from('user_profiles')
        .update({
          balance: newBalance,
          total_withdrawals: newTotalWithdrawals,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', withdrawal.user_id);

      if (balanceError) {
        console.error('Error actualizando saldo:', balanceError);
        return NextResponse.json({ error: 'Error actualizando saldo del usuario' }, { status: 500 });
      }

      // Registrar en logs de actividad
      await supabase
        .from('affiliate_activity_logs')
        .insert({
          user_id: withdrawal.user_id,
          activity_type: status === 'approved' ? 'withdrawal_approved' : 'withdrawal_rejected',
          details: {
            withdrawal_id: withdrawal_id,
            amount: withdrawal.amount,
            previous_balance: userProfile.balance,
            new_balance: newBalance,
            notes: notes
          },
          created_at: new Date().toISOString()
        });

      // Crear notificación para el usuario
      const notificationTitle = status === 'approved' ? 'Retiro aprobado' : 'Retiro rechazado';
      const notificationMessage = status === 'approved' 
        ? `Tu solicitud de retiro por $${withdrawal.amount} USD ha sido aprobada y procesada.`
        : `Tu solicitud de retiro por $${withdrawal.amount} USD ha sido rechazada. ${notes ? 'Motivo: ' + notes : ''}`;
      
      await supabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          type: status === 'approved' ? 'success' : 'error',
          title: notificationTitle,
          message: notificationMessage,
          read: false,
          created_at: new Date().toISOString()
        });
    } else {
      // Para rechazos, solo crear notificación
      await supabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          type: 'error',
          title: 'Retiro rechazado',
          message: `Tu solicitud de retiro por $${withdrawal.amount} USD ha sido rechazada. ${notes ? 'Motivo: ' + notes : ''}`,
          read: false,
          created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({ 
      success: true,
      message: `Retiro ${status === 'approved' ? 'aprobado' : 'rechazado'} correctamente`
    });

  } catch (error) {
    console.error('Error en endpoint de actualización de retiros:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}