-- ============================================
-- CREAR COLUMNA is_admin EN user_profiles
-- ============================================

-- PASO 1: Verificar que la columna NO existe (debe dar error o 0 resultados)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'is_admin';

-- PASO 2: Agregar la columna is_admin
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- PASO 3: Crear un índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
ON user_profiles(is_admin) 
WHERE is_admin = true;

-- PASO 4: Actualizar tu usuario como admin
UPDATE user_profiles 
SET is_admin = true 
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- PASO 5: Verificar que todo quedó bien
SELECT user_id, email, is_admin, balance, is_premium
FROM user_profiles
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- PASO 6: Ver todos los usuarios admin (debe aparecer solo tú)
SELECT user_id, email, is_admin
FROM user_profiles
WHERE is_admin = true;
