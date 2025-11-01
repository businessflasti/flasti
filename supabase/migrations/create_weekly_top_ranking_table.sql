-- Crear tabla para el Top 3 Ranking Semanal
CREATE TABLE IF NOT EXISTS public.weekly_top_ranking (
  id SERIAL PRIMARY KEY,
  rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 3),
  name VARCHAR(100) NOT NULL,
  earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
  country_code VARCHAR(2),
  city VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rank)
);

-- Insertar datos iniciales
INSERT INTO public.weekly_top_ranking (rank, name, earnings, country_code, city, avatar_url) VALUES
  (1, 'Carlos Rodríguez', 647.00, 'MX', 'Ciudad de México', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'),
  (2, 'Ana Martínez', 479.00, 'ES', 'Madrid', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'),
  (3, 'Juan García', 312.00, 'AR', 'Buenos Aires', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan')
ON CONFLICT (rank) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.weekly_top_ranking ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Allow public read access to weekly_top_ranking"
  ON public.weekly_top_ranking
  FOR SELECT
  USING (true);

-- Política para que solo admins puedan actualizar
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

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_weekly_top_ranking_rank ON public.weekly_top_ranking(rank);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_weekly_top_ranking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_weekly_top_ranking_updated_at_trigger ON public.weekly_top_ranking;
CREATE TRIGGER update_weekly_top_ranking_updated_at_trigger
  BEFORE UPDATE ON public.weekly_top_ranking
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_top_ranking_updated_at();
