-- Verificar que la columna avatar_url existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'avatar_url';

-- Ver políticas de user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'user_profiles';

-- Ver tu perfil actual
SELECT user_id, avatar_url, created_at
FROM user_profiles
WHERE is_admin = true;
