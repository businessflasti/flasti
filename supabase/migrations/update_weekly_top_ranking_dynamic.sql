-- Actualizar tabla para permitir rankings dinámicos
-- Eliminar la restricción de solo 3 usuarios
ALTER TABLE public.weekly_top_ranking DROP CONSTRAINT IF EXISTS weekly_top_ranking_rank_check;

-- Agregar nueva restricción más flexible
ALTER TABLE public.weekly_top_ranking ADD CONSTRAINT weekly_top_ranking_rank_check CHECK (rank >= 1);

-- Eliminar columna city ya que no se usará
ALTER TABLE public.weekly_top_ranking DROP COLUMN IF EXISTS city;

-- Agregar columnas para título y subtítulo personalizables
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT 'Top 3 semanal';
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS subtitle VARCHAR(200) DEFAULT 'Los que más ganaron';

-- Política para que admins puedan insertar
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

-- Política para que admins puedan eliminar
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
