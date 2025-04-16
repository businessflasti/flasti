-- Crear tabla de conversaciones
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  admin_id UUID,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Crear políticas para chat_conversations
CREATE POLICY chat_conversations_select ON public.chat_conversations
    FOR SELECT USING (true);

CREATE POLICY chat_conversations_insert ON public.chat_conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY chat_conversations_update ON public.chat_conversations
    FOR UPDATE USING (true);

-- Crear políticas para chat_messages
CREATE POLICY chat_messages_select ON public.chat_messages
    FOR SELECT USING (true);

CREATE POLICY chat_messages_insert ON public.chat_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY chat_messages_update ON public.chat_messages
    FOR UPDATE USING (true);
