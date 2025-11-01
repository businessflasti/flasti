-- Verificar configuración de tutorial_video

-- 1. Ver si existe la tabla
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'tutorial_video'
) as table_exists;

-- 2. Ver estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tutorial_video'
ORDER BY ordinal_position;

-- 3. Ver políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tutorial_video';

-- 4. Ver si RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'tutorial_video';

-- 5. Ver registros existentes
SELECT id, title, is_active, created_at
FROM tutorial_video;

-- 6. Verificar usuarios admin (reemplaza con tu email)
SELECT user_id, is_admin, created_at
FROM user_profiles
WHERE is_admin = true;

-- 7. Probar si el usuario actual puede actualizar (ejecuta esto cuando estés logueado)
-- SELECT auth.uid() as current_user_id;
-- SELECT * FROM user_profiles WHERE user_id = auth.uid();
