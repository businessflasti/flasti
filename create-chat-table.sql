-- Crear la tabla de mensajes de chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY,
  userId TEXT NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Permitir lectura de mensajes" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserción de mensajes" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización de mensajes propios" ON public.chat_messages
  FOR UPDATE USING (auth.uid()::text = userId OR auth.uid() IN (
    SELECT id FROM auth.users WHERE is_admin = true
  ));

CREATE POLICY "Permitir eliminación de mensajes propios" ON public.chat_messages
  FOR DELETE USING (auth.uid()::text = userId OR auth.uid() IN (
    SELECT id FROM auth.users WHERE is_admin = true
  ));

-- Habilitar Realtime para esta tabla
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
