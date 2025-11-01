-- Tabla para gestionar el video tutorial del dashboard
CREATE TABLE IF NOT EXISTS tutorial_video (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slider_video_url TEXT NOT NULL, -- Video del slider (bucle)
  player_video_url TEXT NOT NULL, -- Video del reproductor completo
  title TEXT DEFAULT 'Tutorial de Bienvenida',
  description TEXT DEFAULT 'Aprende cómo ganar dinero en Flasti',
  is_clickable BOOLEAN DEFAULT true, -- Si se puede hacer click para abrir el reproductor
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_tutorial_video_active ON tutorial_video(is_active);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_tutorial_video_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tutorial_video_updated_at
    BEFORE UPDATE ON tutorial_video
    FOR EACH ROW
    EXECUTE FUNCTION update_tutorial_video_updated_at();

-- Políticas RLS
ALTER TABLE tutorial_video ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow read access to all authenticated users"
  ON tutorial_video
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden modificar
CREATE POLICY "Allow admin to update tutorial_video"
  ON tutorial_video
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Allow admin to insert tutorial_video"
  ON tutorial_video
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Allow admin to delete tutorial_video"
  ON tutorial_video
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Insertar video por defecto
INSERT INTO tutorial_video (slider_video_url, player_video_url, title, description, is_clickable, is_active)
VALUES (
  '/video/tutorial-bienvenida.mp4',
  '/video/tutorial-bienvenida.mp4',
  'Tutorial de Bienvenida',
  'Aprende cómo ganar dinero en Flasti',
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Verificar
SELECT * FROM tutorial_video;

COMMENT ON TABLE tutorial_video IS 'Gestión del video tutorial del dashboard';
