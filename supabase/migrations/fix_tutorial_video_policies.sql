-- Corregir políticas de tutorial_video para permitir UPDATE a admins

-- Eliminar política existente
DROP POLICY IF EXISTS "Allow admin to update tutorial_video" ON tutorial_video;

-- Recrear con WITH CHECK
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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tutorial_video';
