const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupChatTables() {
  try {
    console.log('Iniciando configuración de tablas de chat...');
    
    // Crear tabla de conversaciones
    const { error: createConversationsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.chat_conversations (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          subject TEXT,
          status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'archived')),
          last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_admin_id ON public.chat_conversations(admin_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at ON public.chat_conversations(last_message_at);
      `
    });
    
    if (createConversationsError) {
      console.error('Error al crear tabla de conversaciones:', createConversationsError);
    } else {
      console.log('Tabla de conversaciones creada o ya existente');
    }
    
    // Crear tabla de mensajes
    const { error: createMessagesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.chat_messages (
          id UUID PRIMARY KEY,
          conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
          sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          sender_name TEXT,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          read BOOLEAN NOT NULL DEFAULT FALSE
        );
        
        CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_read ON public.chat_messages(read);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
      `
    });
    
    if (createMessagesError) {
      console.error('Error al crear tabla de mensajes:', createMessagesError);
    } else {
      console.log('Tabla de mensajes creada o ya existente');
    }
    
    // Configurar políticas de seguridad
    const { error: securityPoliciesError } = await supabase.rpc('execute_sql', {
      sql: `
        -- Conversaciones de chat: los usuarios solo pueden ver sus propias conversaciones
        ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS chat_conversations_select_policy ON public.chat_conversations;
        CREATE POLICY chat_conversations_select_policy ON public.chat_conversations
            FOR SELECT
            USING (auth.uid() = user_id OR auth.uid() = admin_id OR 
                  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));
        
        DROP POLICY IF EXISTS chat_conversations_insert_policy ON public.chat_conversations;
        CREATE POLICY chat_conversations_insert_policy ON public.chat_conversations
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS chat_conversations_update_policy ON public.chat_conversations;
        CREATE POLICY chat_conversations_update_policy ON public.chat_conversations
            FOR UPDATE
            USING (auth.uid() = user_id OR auth.uid() = admin_id OR 
                  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));
        
        -- Mensajes de chat: los usuarios solo pueden ver mensajes de sus conversaciones
        ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS chat_messages_select_policy ON public.chat_messages;
        CREATE POLICY chat_messages_select_policy ON public.chat_messages
            FOR SELECT
            USING (EXISTS (
                SELECT 1 FROM public.chat_conversations 
                WHERE id = conversation_id AND (
                    user_id = auth.uid() OR admin_id = auth.uid() OR
                    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
                )
            ));
        
        DROP POLICY IF EXISTS chat_messages_insert_policy ON public.chat_messages;
        CREATE POLICY chat_messages_insert_policy ON public.chat_messages
            FOR INSERT
            WITH CHECK (
                auth.uid() = sender_id AND
                EXISTS (
                    SELECT 1 FROM public.chat_conversations 
                    WHERE id = conversation_id AND (
                        user_id = auth.uid() OR admin_id = auth.uid() OR
                        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
                    )
                )
            );
        
        DROP POLICY IF EXISTS chat_messages_update_policy ON public.chat_messages;
        CREATE POLICY chat_messages_update_policy ON public.chat_messages
            FOR UPDATE
            USING (
                EXISTS (
                    SELECT 1 FROM public.chat_conversations 
                    WHERE id = conversation_id AND (
                        user_id = auth.uid() OR admin_id = auth.uid() OR
                        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
                    )
                )
            );
      `
    });
    
    if (securityPoliciesError) {
      console.error('Error al configurar políticas de seguridad:', securityPoliciesError);
    } else {
      console.log('Políticas de seguridad configuradas correctamente');
    }
    
    console.log('Configuración de tablas de chat completada');
  } catch (error) {
    console.error('Error general:', error);
  }
}

setupChatTables();
