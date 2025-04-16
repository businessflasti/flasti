import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Extraer el ID de la conversación de la URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const conversationId = pathParts[pathParts.length - 1];

    const { status } = await request.json();

    // Validar datos
    if (!status || !['open', 'closed', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
    }

    // Obtener el token de la cookie
    const cookieStore = cookies();
    const supabaseToken = await cookieStore.get('supabase-auth-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Cambiar estado de la conversación
    const { error } = await supabase
      .from('chat_conversations')
      .update({ status })
      .eq('id', conversationId);

    if (error) {
      console.error('Error al cambiar estado de la conversación:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al cambiar estado de la conversación:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
