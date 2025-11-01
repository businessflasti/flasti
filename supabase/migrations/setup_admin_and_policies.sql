-- Script completo para configurar admin y políticas de element_visibility
-- Para: flasti.finanzas@gmail.com

-- PASO 1: Asegurar que el usuario admin tenga is_admin = true
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'flasti.finanzas@gmail.com';

-- Verificar que se actualizó
SELECT user_id, email, is_admin 
FROM user_profiles 
WHERE email = 'flasti.finanzas@gmail.com';

-- PASO 2: Eliminar políticas existentes de element_visibility
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to update visibility" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to insert visibility" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to delete visibility" ON element_visibility;

-- PASO 3: Asegurar que RLS esté habilitado
ALTER TABLE element_visibility ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear políticas nuevas usando is_admin

-- Lectura: Todos los usuarios autenticados
CREATE POLICY "Allow read access to all authenticated users"
  ON element_visibility
  FOR SELECT
  TO authenticated
  USING (true);

-- Actualización: Solo usuarios con is_admin = true
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

-- Inserción: Solo admins
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

-- Eliminación: Solo admins
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

-- PASO 5: Verificar que todo está correcto

-- Ver políticas creadas
SELECT 
  tablename,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'element_visibility'
ORDER BY policyname;

-- Ver tu usuario admin
SELECT 
  user_id,
  email,
  is_admin,
  created_at
FROM user_profiles 
WHERE email = 'flasti.finanzas@gmail.com';

-- Contar elementos en la tabla
SELECT COUNT(*) as total_elements FROM element_visibility;

-- Ver todos los elementos
SELECT 
  page_name,
  element_key,
  element_name,
  is_visible
FROM element_visibility
ORDER BY page_name, display_order;
