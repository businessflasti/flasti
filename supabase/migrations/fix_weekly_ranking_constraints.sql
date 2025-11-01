-- Eliminar la restricción UNIQUE en rank para permitir múltiples usuarios
ALTER TABLE public.weekly_top_ranking DROP CONSTRAINT IF EXISTS weekly_top_ranking_rank_key;

-- Verificar que las políticas estén correctas
-- Política de lectura pública
DROP POLICY IF EXISTS "Allow public read access to weekly_top_ranking" ON public.weekly_top_ranking;
CREATE POLICY "Allow public read access to weekly_top_ranking"
  ON public.weekly_top_ranking
  FOR SELECT
  USING (true);

-- Política de actualización para admins
DROP POLICY IF EXISTS "Allow admin update access to weekly_top_ranking" ON public.weekly_top_ranking;
CREATE POLICY "Allow admin update access to weekly_top_ranking"
  ON public.weekly_top_ranking
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política de inserción para admins
DROP POLICY IF EXISTS "Allow admin insert access to weekly_top_ranking" ON public.weekly_top_ranking;
CREATE POLICY "Allow admin insert access to weekly_top_ranking"
  ON public.weekly_top_ranking
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Política de eliminación para admins
DROP POLICY IF EXISTS "Allow admin delete access to weekly_top_ranking" ON public.weekly_top_ranking;
CREATE POLICY "Allow admin delete access to weekly_top_ranking"
  ON public.weekly_top_ranking
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
