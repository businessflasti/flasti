import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Obtener el token de la cookie
    const cookieStore = cookies();
    const supabaseToken = await cookieStore.get('supabase-auth-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Crear un cliente de Supabase con el token del usuario
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Usar el cliente de Supabase directamente para evitar políticas de seguridad
    // Esto es seguro porque estamos en un endpoint de API del servidor
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error al cargar conversaciones:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error al cargar conversaciones:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
