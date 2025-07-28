import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });
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

    // Obtener historial de retiros
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select(`
        id,
        amount,
        payment_method,
        payment_details,
        status,
        created_at,
        processed_at
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo historial de retiros:', error);
      return NextResponse.json({ error: 'Error obteniendo historial' }, { status: 500 });
    }

    // Formatear datos para la interfaz
    const formattedWithdrawals = withdrawals?.map(withdrawal => ({
      id: withdrawal.id,
      amount: withdrawal.amount,
      currency: 'USD',
      method: withdrawal.payment_method,
      destination: withdrawal.payment_details?.destination || 'No especificado',
      status: withdrawal.status,
      created_at: withdrawal.created_at,
      processed_at: withdrawal.processed_at
    })) || [];

    // Calcular estadísticas
    const summary = {
      total_requested: formattedWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      total_approved: formattedWithdrawals
        .filter(w => w.status === 'approved' || w.status === 'completed')
        .reduce((sum, w) => sum + w.amount, 0),
      pending_count: formattedWithdrawals.filter(w => w.status === 'pending').length,
      approved_count: formattedWithdrawals.filter(w => w.status === 'approved' || w.status === 'completed').length,
      rejected_count: formattedWithdrawals.filter(w => w.status === 'rejected').length
    };

    return NextResponse.json({ 
      withdrawals: formattedWithdrawals,
      total: formattedWithdrawals.length,
      summary
    });

  } catch (error) {
    console.error('Error en endpoint de historial de retiros:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
