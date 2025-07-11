import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Recibe el postback de MyLead y guarda todos los parámetros relevantes
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const player_id = searchParams.get('player_id');
  const payout_decimal = parseFloat(searchParams.get('payout_decimal') || '0');
  const payout = payout_decimal;
  const transaction_id = searchParams.get('transaction_id');
  const currency = searchParams.get('currency');
  const status = searchParams.get('status');
  const program_id = searchParams.get('program_id');
  const program_name = searchParams.get('program_name');
  const goal_id = searchParams.get('goal_id');
  const goal_name = searchParams.get('goal_name');
  const country_code = searchParams.get('country_code');
  const ip = searchParams.get('ip');
  const virtual_amount = searchParams.get('virtual_amount');
  const cart_value = searchParams.get('cart_value');
  const cart_value_original = searchParams.get('cart_value_original');

  // Guardar todos los parámetros recibidos como raw_data
  const raw_data: any = {};
  searchParams.forEach((value, key) => {
    raw_data[key] = value;
  });

  if (!player_id || !transaction_id || !payout || isNaN(payout)) {
    return NextResponse.json({ error: 'Parámetros obligatorios faltantes o inválidos' }, { status: 400 });
  }

  // Evitar duplicados
  const { data: existing } = await supabase
    .from('rewards_history')
    .select('id')
    .eq('user_id', player_id)
    .eq('transaction_id', transaction_id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: 'Recompensa ya registrada' }, { status: 409 });
  }

  // Sumar el monto al balance del usuario
  await supabase.rpc('add_balance', { user_id: player_id, amount: payout });

  // Guardar historial de recompensa
  const { error } = await supabase.from('rewards_history').insert({
    user_id: player_id,
    transaction_id,
    payout,
    currency,
    status,
    program_id,
    program_name,
    goal_id,
    goal_name,
    country_code,
    ip,
    virtual_amount,
    cart_value,
    cart_value_original,
    raw_data
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export const POST = GET;
