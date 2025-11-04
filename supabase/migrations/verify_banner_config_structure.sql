-- Verificar estructura actual de la tabla banner_config

-- Ver todas las columnas de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'banner_config'
ORDER BY ordinal_position;

-- Ver todos los registros
SELECT * FROM banner_config;

-- Ver políticas RLS
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'banner_config';
