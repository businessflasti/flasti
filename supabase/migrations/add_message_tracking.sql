-- Crear tabla para tracking de mensajes leídos por usuario
CREATE TABLE IF NOT EXISTS user_message_reads (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id INTEGER NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_type TEXT, -- 'thanks' o 'like'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, message_id)
);

-- Agregar campo message_id a daily_message para tracking
ALTER TABLE daily_message 
ADD COLUMN IF NOT EXISTS message_version INTEGER DEFAULT 1;

-- Función para incrementar version cuando se actualiza el mensaje
CREATE OR REPLACE FUNCTION increment_message_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.message != OLD.message THEN
    NEW.message_version = OLD.message_version + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar version
DROP TRIGGER IF EXISTS increment_message_version_trigger ON daily_message;
CREATE TRIGGER increment_message_version_trigger
  BEFORE UPDATE ON daily_message
  FOR EACH ROW
  EXECUTE FUNCTION increment_message_version();

-- Políticas RLS para user_message_reads
ALTER TABLE user_message_reads ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver y crear sus propios registros
CREATE POLICY "Usuarios pueden ver sus lecturas"
  ON user_message_reads
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden crear sus lecturas"
  ON user_message_reads
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Comentarios
COMMENT ON TABLE user_message_reads IS 'Tracking de mensajes leídos y respuestas de usuarios';
COMMENT ON COLUMN user_message_reads.response_type IS 'Tipo de respuesta: thanks o like';
COMMENT ON COLUMN daily_message.message_version IS 'Versión del mensaje, se incrementa al actualizar';
