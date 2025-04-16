import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Crear tabla de conversaciones directamente
    const { error: error1 } = await supabase
      .from('chat_conversations')
      .insert({
        id: 'test_conversation',
        user_id: '00000000-0000-0000-0000-000000000000',
        subject: 'Test Conversation',
        status: 'open',
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    // Si el error es que la tabla no existe, intentar crearla manualmente
    if (error1 && error1.message.includes('does not exist')) {
      console.log('La tabla chat_conversations no existe, creando manualmente...');

      // Crear tabla de conversaciones manualmente
      await supabase.schema.createTable('chat_conversations', {
        id: { type: 'text', primaryKey: true },
        user_id: { type: 'uuid', notNull: true },
        admin_id: { type: 'uuid' },
        subject: { type: 'text' },
        status: { type: 'text', notNull: true, default: "'open'" },
        last_message_at: { type: 'timestamptz', notNull: true, default: 'now()' },
        created_at: { type: 'timestamptz', notNull: true, default: 'now()' }
      });

      // Crear tabla de mensajes manualmente
      await supabase.schema.createTable('chat_messages', {
        id: { type: 'text', primaryKey: true },
        conversation_id: { type: 'text', notNull: true, references: 'chat_conversations(id)' },
        sender_id: { type: 'uuid', notNull: true },
        sender_name: { type: 'text' },
        content: { type: 'text', notNull: true },
        created_at: { type: 'timestamptz', notNull: true, default: 'now()' },
        read: { type: 'boolean', notNull: true, default: false }
      });

      return NextResponse.json({ success: true, message: 'Tablas creadas manualmente' });
    } else if (error1 && error1.message.includes('duplicate key')) {
      // Si el error es de clave duplicada, significa que la tabla existe y tiene datos
      console.log('La tabla chat_conversations ya existe y tiene datos');
      return NextResponse.json({ success: true, message: 'Las tablas ya existen' });
    } else if (error1) {
      // Otro tipo de error
      console.error('Error al verificar/crear tabla de conversaciones:', error1);
      return NextResponse.json({ error: error1.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Operación completada' });
  } catch (error: any) {
    console.error('Error al crear tablas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
