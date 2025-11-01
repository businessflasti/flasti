-- Eliminar tabla anterior y recrear limpia
DROP TABLE IF EXISTS tutorial_video CASCADE;

-- Crear tabla limpia
CREATE TABLE tutorial_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slider_video_url TEXT NOT NULL DEFAULT '/video/tutorial-slider.mp4',
  player_video_url TEXT NOT NULL DEFAULT '/video/tutorial-player.mp4',
  title TEXT DEFAULT 'Tutorial de Bienvenida',
  description TEXT DEFAULT 'Aprende cómo ganar dinero en Flasti',
  is_clickable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE tutorial_video ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Anyone can read tutorial_video"
  ON tutorial_video
  FOR SELECT
  USING (true);

-- Política: Solo admins pueden actualizar
CREATE POLICY "Admins can update tutorial_video"
  ON tutorial_video
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política: Solo admins pueden insertar
CREATE POLICY "Admins can insert tutorial_video"
  ON tutorial_video
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Insertar registro por defecto
INSERT INTO tutorial_video (slider_video_url, player_video_url, title, description, is_clickable, is_active)
VALUES (
  '/video/tutorial-slider.mp4',
  '/video/tutorial-player.mp4',
  'Tutorial de Bienvenida',
  'Aprende cómo ganar dinero en Flasti',
  true,
  true
);

-- Verificar
SELECT * FROM tutorial_video;
