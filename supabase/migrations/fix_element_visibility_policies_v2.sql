-- Script mejorado para políticas de element_visibility
-- Usa is_admin de user_profiles en lugar de verificar email directamente

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to update visibility" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to insert visibility" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to delete visibility" ON element_visibility;

-- Asegurar que RLS esté habilitado
ALTER TABLE element_visibility ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Todos los usuarios autenticados pueden leer
CREATE POLICY "Allow read access to all authenticated users"
  ON element_visibility
  FOR SELECT
  TO authenticated
  USING (true);

-- Política de actualización: Solo usuarios con is_admin = true
CREATE POLICY "Allow admin to update visibility"
  ON element_visibility
  FOR UPDATE
  TO authenticated
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

-- Política de inserción: Solo admins
CREATE POLICY "Allow admin to insert visibility"
  ON element_visibility
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política de eliminación: Solo admins
CREATE POLICY "Allow admin to delete visibility"
  ON element_visibility
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Verificar que tu usuario tenga is_admin = true
-- Si no lo tiene, ejecuta esto (reemplaza con tu user_id):
-- UPDATE user_profiles SET is_admin = true WHERE user_id = 'TU_USER_ID_AQUI';

-- Ver políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename = 'element_visibility';

-- Verificar tu estado de admin
SELECT 
  user_id,
  email,
  is_admin
FROM user_profiles
WHERE user_id = auth.uid();
