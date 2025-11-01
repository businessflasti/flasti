-- Verificar políticas de la tabla seasonal_themes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'seasonal_themes';

-- Verificar si hay temas activos
SELECT theme_name, is_active, logo_url, created_at, updated_at
FROM seasonal_themes
ORDER BY updated_at DESC;

-- Si no hay políticas de lectura pública, crear una:
-- DROP POLICY IF EXISTS "Allow public read access to seasonal_themes" ON seasonal_themes;

CREATE POLICY IF NOT EXISTS "Allow public read access to seasonal_themes"
ON seasonal_themes
FOR SELECT
TO public
USING (true);

-- Verificar que la política se creó
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'seasonal_themes';
