import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, amount, method, destination } = body;
  if (!user_id || !amount || !method || !destination) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
  }
  // Validar saldo suficiente
  const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user_id).single();
  if (!profile || Number(profile.balance) < Number(amount)) {
    return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 400 });
  }
  // Insertar solicitud de retiro
  const { error } = await supabase.from('withdrawals').insert({
    user_id,
    amount,
    method,
    destination,
    status: 'pendiente',
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
