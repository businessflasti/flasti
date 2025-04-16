import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar si la tabla de conversaciones existe
    const { error: conversationsError } = await supabase
      .from('chat_conversations')
      .select('count(*)', { count: 'exact', head: true });

    // Verificar si la tabla de mensajes existe
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .select('count(*)', { count: 'exact', head: true });

    // Si alguna de las tablas no existe, devolver error
    if (conversationsError || messagesError) {
      return NextResponse.json({ 
        exists: false, 
        conversationsError: conversationsError?.message,
        messagesError: messagesError?.message
      });
    }

    // Si ambas tablas existen, devolver éxito
    return NextResponse.json({ exists: true });
  } catch (error: any) {
    console.error('Error al verificar tablas de chat:', error);
    return NextResponse.json({ 
      exists: false, 
      error: error.message 
    }, { status: 500 });
  }
}
