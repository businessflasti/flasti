-- Script para arreglar las políticas de banner_config si ya existe la tabla

-- Eliminar política de INSERT si existe
DROP POLICY IF EXISTS "Authenticated users can insert banner config" ON banner_config;

-- Crear política de INSERT
CREATE POLICY "Authenticated users can insert banner config"
  ON banner_config
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Verificar que existe el registro por defecto, si no, crearlo
INSERT INTO banner_config (id, banner_text, logo_url, background_gradient, background_image, show_separator, is_active)
VALUES (
  1,
  '¡Bienvenido a Flasti! Gana dinero completando microtareas', 
  '/logo.svg', 
  'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
  NULL,
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'banner_config';
