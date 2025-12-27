-- OPCIONAL: Ejecuta este archivo si quieres restringir la gestión de historias solo a admins

-- Agregar columna is_admin a user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON user_profiles(is_admin) WHERE is_admin = true;

-- Hacer admin a tu usuario
UPDATE user_profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'flasti.business@gmail.com'
);

-- Ahora puedes actualizar las políticas de stories para usar is_admin:
DROP POLICY IF EXISTS "Authenticated users can manage stories" ON stories;

CREATE POLICY "Only admins can manage stories" ON stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Actualizar políticas de storage
DROP POLICY IF EXISTS "Authenticated users can upload story avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload story media" ON storage.objects;

CREATE POLICY "Only admins can upload story avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stories-avatars' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can upload story media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stories-media' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
