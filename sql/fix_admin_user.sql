-- Verificar y actualizar el usuario admin
-- Reemplaza 'TU_USER_ID' con tu ID de usuario actual

-- 1. Primero, verifica tu usuario actual
SELECT user_id, email, is_admin 
FROM user_profiles 
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- 2. Si no existe el registro, créalo
INSERT INTO user_profiles (user_id, is_admin, balance, is_premium)
SELECT '77c9957d-8c4c-4e16-8da6-e0d2353532ba', true, 0, false
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba'
);

-- 3. Si existe, actualiza is_admin a true
UPDATE user_profiles 
SET is_admin = true 
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';

-- 4. Verifica que se actualizó correctamente
SELECT user_id, email, is_admin, balance, is_premium 
FROM user_profiles 
WHERE user_id = '77c9957d-8c4c-4e16-8da6-e0d2353532ba';
