-- Crear tabla para mensaje del día
CREATE TABLE IF NOT EXISTS daily_message (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar mensaje predeterminado
INSERT INTO daily_message (message, is_active) VALUES
  ('¡Hola {nombre}! Bienvenido a Flasti. Completa tus tareas diarias y gana recompensas.', TRUE)
ON CONFLICT DO NOTHING;

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_daily_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS daily_message_updated_at ON daily_message;
CREATE TRIGGER daily_message_updated_at
  BEFORE UPDATE ON daily_message
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_message_updated_at();

-- Políticas RLS
ALTER TABLE daily_message ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Usuarios pueden ver mensaje del día"
  ON daily_message
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Solo admins pueden actualizar
CREATE POLICY "Solo admins pueden actualizar mensaje"
  ON daily_message
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Comentarios
COMMENT ON TABLE daily_message IS 'Mensaje del día mostrado a todos los usuarios';
COMMENT ON COLUMN daily_message.message IS 'Texto del mensaje (puede incluir {nombre} para personalización)';
COMMENT ON COLUMN daily_message.is_active IS 'Indica si el mensaje está activo';
