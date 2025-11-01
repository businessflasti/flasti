-- Forzar actualización del schema cache de Supabase

-- Notificar a PostgREST que recargue el schema
NOTIFY pgrst, 'reload schema';

-- Verificar que todo está correcto
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'tutorial_video'
ORDER BY ordinal_position;

-- Verificar políticas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies
WHERE tablename = 'tutorial_video';
