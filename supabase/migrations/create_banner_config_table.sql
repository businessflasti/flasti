-- Crear tabla para configuración del banner editable desde admin
CREATE TABLE IF NOT EXISTS banner_config (
  id SERIAL PRIMARY KEY,
  banner_text TEXT NOT NULL DEFAULT '¡Bienvenido a Flasti! Gana dinero completando microtareas',
  logo_url TEXT NOT NULL DEFAULT '/logo.svg',
  background_gradient TEXT NOT NULL DEFAULT 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
  background_image TEXT,
  show_separator BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insertar configuración por defecto
INSERT INTO banner_config (banner_text, logo_url, background_gradient, background_image, show_separator, is_active)
VALUES (
  '¡Bienvenido a Flasti! Gana dinero completando microtareas', 
  '/logo.svg', 
  'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
  NULL,
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_banner_config_active ON banner_config(is_active);

-- Habilitar RLS
ALTER TABLE banner_config ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Anyone can read banner config"
  ON banner_config
  FOR SELECT
  USING (true);

-- Política: Solo usuarios autenticados pueden actualizar
-- (La verificación de admin se hace en el frontend/API)
CREATE POLICY "Authenticated users can update banner config"
  ON banner_config
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Authenticated users can insert banner config"
  ON banner_config
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Comentarios
COMMENT ON TABLE banner_config IS 'Configuración del banner superior editable desde admin';
COMMENT ON COLUMN banner_config.banner_text IS 'Texto del banner';
COMMENT ON COLUMN banner_config.logo_url IS 'URL del logo en la esquina izquierda';
COMMENT ON COLUMN banner_config.background_gradient IS 'Clases de Tailwind para el degradado de fondo';
COMMENT ON COLUMN banner_config.background_image IS 'URL de imagen de fondo (anula el degradado si está presente)';
COMMENT ON COLUMN banner_config.show_separator IS 'Si se muestra el separador entre logo y texto';
COMMENT ON COLUMN banner_config.is_active IS 'Si el banner está activo';
