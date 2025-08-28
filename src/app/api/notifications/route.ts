import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Notificaciones del usuario
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ notifications: data });
}

// PATCH: Marcar notificaciones como leídas
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, notification_ids, mark_all } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });
    }

    let query = supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user_id);

    if (mark_all) {
      // Marcar todas las notificaciones del usuario como leídas
      query = query.eq('read', false);
    } else if (notification_ids && notification_ids.length > 0) {
      // Marcar notificaciones específicas como leídas
      query = query.in('id', notification_ids);
    } else {
      return NextResponse.json({ error: 'notification_ids o mark_all requerido' }, { status: 400 });
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
