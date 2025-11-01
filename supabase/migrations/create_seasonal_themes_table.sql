-- Crear tabla para gestionar temas estacionales
CREATE TABLE IF NOT EXISTS seasonal_themes (
  id SERIAL PRIMARY KEY,
  theme_name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar temas predefinidos
INSERT INTO seasonal_themes (theme_name, is_active) VALUES
  ('default', TRUE),
  ('halloween', FALSE),
  ('christmas', FALSE)
ON CONFLICT (theme_name) DO NOTHING;

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_seasonal_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS seasonal_themes_updated_at ON seasonal_themes;
CREATE TRIGGER seasonal_themes_updated_at
  BEFORE UPDATE ON seasonal_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_seasonal_themes_updated_at();

-- Políticas RLS
ALTER TABLE seasonal_themes ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Usuarios pueden ver temas"
  ON seasonal_themes
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden actualizar
CREATE POLICY "Solo admins pueden actualizar temas"
  ON seasonal_themes
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
COMMENT ON TABLE seasonal_themes IS 'Gestión de temas estacionales para la interfaz';
COMMENT ON COLUMN seasonal_themes.theme_name IS 'Nombre del tema (default, halloween, christmas)';
COMMENT ON COLUMN seasonal_themes.is_active IS 'Indica si el tema está activo';
