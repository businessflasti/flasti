-- Verificar y agregar todas las columnas necesarias para weekly_top_ranking

-- Agregar columna avatar_url si no existe
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Agregar columna title si no existe
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS title VARCHAR(200) DEFAULT 'Top 3 semanal';

-- Agregar columna subtitle si no existe
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS subtitle VARCHAR(200) DEFAULT 'Los que más ganaron';

-- Agregar columna country_code si no existe
ALTER TABLE public.weekly_top_ranking ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);

-- Verificar estructura de la tabla
-- Puedes ejecutar esto para ver todas las columnas:
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'weekly_top_ranking' 
-- ORDER BY ordinal_position;
