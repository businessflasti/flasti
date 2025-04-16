import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Función para generar un UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: Request) {
  try {
    const { conversationId, senderId, content } = await request.json();

    // Validar datos
    if (!conversationId || !senderId || !content) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Obtener el token de la cookie
    const cookieStore = cookies();
    const supabaseToken = await cookieStore.get('supabase-auth-token')?.value;

    if (!supabaseToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener información del remitente
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', senderId)
      .single();

    if (userError) {
      console.error('Error al obtener datos del usuario:', userError);
    }

    const messageId = generateUUID();

    // Insertar el mensaje
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        id: messageId,
        conversation_id: conversationId,
        sender_id: senderId,
        sender_name: userData?.email || 'Soporte',
        content: content,
        created_at: new Date().toISOString(),
        read: true
      });

    if (error) {
      console.error('Error al enviar mensaje:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Actualizar la fecha del último mensaje en la conversación
    const { error: updateError } = await supabase
      .from('chat_conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (updateError) {
      console.error('Error al actualizar conversación:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId });
  } catch (error: any) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
