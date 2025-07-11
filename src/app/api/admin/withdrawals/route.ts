import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Listar todos los retiros pendientes
export async function GET() {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ withdrawals: data });
}

// POST: Aprobar o rechazar retiro
export async function POST(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !['aprobado', 'rechazado'].includes(status)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Obtener el retiro y el usuario
  const { data: withdrawal, error: getError } = await supabase
    .from('withdrawals')
    .select('user_id, amount, status')
    .eq('id', id)
    .maybeSingle();
  if (getError || !withdrawal) {
    return NextResponse.json({ error: 'Retiro no encontrado' }, { status: 404 });
  }
  // Si se aprueba y antes estaba pendiente, descontar saldo y notificar
  if (status === 'aprobado' && withdrawal.status === 'pendiente') {
    await supabase.rpc('add_balance', { user_id: withdrawal.user_id, amount: -Math.abs(Number(withdrawal.amount)) });
    await supabase.from('notifications').insert({
      user_id: withdrawal.user_id,
      type: 'retiro',
      title: 'Retiro aprobado',
      message: `Tu retiro de $${withdrawal.amount} ha sido aprobado y procesado.`
    });
  }
  // Si se rechaza y antes estaba pendiente, notificar
  if (status === 'rechazado' && withdrawal.status === 'pendiente') {
    await supabase.from('notifications').insert({
      user_id: withdrawal.user_id,
      type: 'retiro',
      title: 'Retiro rechazado',
      message: `Tu retiro de $${withdrawal.amount} ha sido rechazado. Si tienes dudas, contacta soporte.`
    });
  }
  // Actualizar estado
  const { error } = await supabase
    .from('withdrawals')
    .update({ status, processed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
