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

    // Obtener historial de transacciones de CPALead
    const { data: cpaLeadTransactions, error: cpaError } = await supabase
      .from('cpalead_transactions')
      .select(`
        id,
        transaction_id,
        offer_id,
        amount,
        currency,
        status,
        created_at,
        metadata
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (cpaError) {
      console.error('Error obteniendo transacciones CPALead:', cpaError);
      return NextResponse.json({ error: 'Error obteniendo historial' }, { status: 500 });
    }

    // Obtener historial de reversiones de CPALead
    const { data: cpaLeadReversals, error: reversalError } = await supabase
      .from('cpalead_reversals')
      .select(`
        id,
        transaction_id,
        offer_id,
        amount,
        reason,
        created_at
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (reversalError) {
      console.error('Error obteniendo reversiones CPALead:', reversalError);
    }

    // Formatear datos para la interfaz
    const rewards = [];

    // Agregar transacciones exitosas
    if (cpaLeadTransactions) {
      cpaLeadTransactions.forEach(transaction => {
        rewards.push({
          id: transaction.id,
          created_at: transaction.created_at,
          transaction_id: transaction.transaction_id,
          offer_name: transaction.metadata?.offer_name || `Oferta CPALead #${transaction.offer_id}`,
          program_name: 'CPALead',
          goal_name: transaction.metadata?.campaign_name || transaction.metadata?.description || `Oferta ${transaction.offer_id}`,
          payout: transaction.amount,
          currency: transaction.currency || 'USD',
          status: (transaction.status === 'completed' || transaction.status === 'approved') ? 'aprobado' : transaction.status,
          source: 'CPALead',
          type: 'ganancia'
        });
      });
    }

    // Agregar reversiones
    if (cpaLeadReversals) {
      cpaLeadReversals.forEach(reversal => {
        rewards.push({
          id: reversal.id,
          created_at: reversal.created_at,
          transaction_id: reversal.transaction_id,
          offer_name: `Oferta CPALead #${reversal.offer_id} (Revertida)`,
          program_name: 'CPALead',
          goal_name: `Reversión: ${reversal.reason || 'Sin especificar'}`,
          payout: -reversal.amount, // Negativo para reversiones
          currency: 'USD',
          status: 'revertido',
          source: 'CPALead',
          type: 'reversal'
        });
      });
    }

    // Ordenar por fecha (más reciente primero)
    rewards.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ 
      rewards,
      total: rewards.length,
      summary: {
        total_earnings: rewards
          .filter(r => r.type === 'ganancia')
          .reduce((sum, r) => sum + r.payout, 0),
        total_reversals: rewards
          .filter(r => r.type === 'reversal')
          .reduce((sum, r) => sum + Math.abs(r.payout), 0),
        approved_count: rewards.filter(r => r.status === 'aprobado').length,
        reversed_count: rewards.filter(r => r.status === 'revertido').length
      }
    });

  } catch (error) {
    console.error('Error en rewards-history endpoint:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
