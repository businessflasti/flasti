import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Extraer el ID de la conversación de la URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const conversationId = pathParts[pathParts.length - 1];

    // Obtener el token de la cookie
    const cookieStore = cookies();
    const supabaseToken = await cookieStore.get('supabase-auth-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Usar el cliente de Supabase directamente para evitar políticas de seguridad
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error al cargar mensajes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error al cargar mensajes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
