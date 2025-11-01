-- ============================================
-- PASO 1: Verificar tu usuario en auth.users
-- ============================================
-- Esto debe mostrar tu usuario autenticado
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- ============================================
-- PASO 2: Verificar si existe en user_profiles
-- ============================================
-- Esto debe mostrar si tienes un perfil creado
SELECT user_id, email, is_admin, balance, is_premium, created_at
FROM user_profiles
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- ============================================
-- PASO 3: Ver TODOS los registros de user_profiles
-- ============================================
-- Para ver qué usuarios tienen perfil
SELECT user_id, email, is_admin, balance, is_premium
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- PASO 4: Verificar la estructura de la tabla
-- ============================================
-- Para confirmar que la columna is_admin existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND table_schema = 'public'
ORDER BY ordinal_position;
