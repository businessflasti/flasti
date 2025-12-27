-- Script para verificar y arreglar políticas de element_visibility

-- Primero, eliminar políticas existentes si hay problemas
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to update visibility" ON element_visibility;
DROP POLICY IF EXISTS "Allow admin to insert visibility" ON element_visibility;

-- Verificar que RLS esté habilitado
ALTER TABLE element_visibility ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Todos los usuarios autenticados pueden leer
CREATE POLICY "Allow read access to all authenticated users"
  ON element_visibility
  FOR SELECT
  TO authenticated
  USING (true);

-- Política de actualización: Solo admin puede actualizar
CREATE POLICY "Allow admin to update visibility"
  ON element_visibility
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() = 'flasti.business@gmail.com'
  )
  WITH CHECK (
    auth.email() = 'flasti.business@gmail.com'
  );

-- Política de inserción: Solo admin puede insertar
CREATE POLICY "Allow admin to insert visibility"
  ON element_visibility
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() = 'flasti.business@gmail.com'
  );

-- Política de eliminación: Solo admin puede eliminar
CREATE POLICY "Allow admin to delete visibility"
  ON element_visibility
  FOR DELETE
  TO authenticated
  USING (
    auth.email() = 'flasti.business@gmail.com'
  );

-- Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'element_visibility';

-- Mostrar el email del usuario actual para debug
SELECT auth.email() as current_user_email;
