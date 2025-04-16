import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Extraer el ID de la conversación de la URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const conversationId = pathParts[pathParts.length - 1];
    const { userId } = await request.json();

    // Obtener el token de la cookie
    const cookieStore = cookies();
    const supabaseToken = await cookieStore.get('supabase-auth-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Marcar mensajes como leídos
    const { error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error al marcar mensajes como leídos:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al marcar mensajes como leídos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
