-- Agregar columna email a user_profiles si no existe
-- Ejecutar en Supabase SQL Editor

-- Agregar columna email si no existe
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Actualizar emails existentes desde auth.users
UPDATE user_profiles 
SET email = au.email
FROM auth.users au 
WHERE user_profiles.user_id = au.id 
AND user_profiles.email IS NULL;

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Verificar que se actualizaron los emails
SELECT 
    user_id,
    email,
    balance,
    created_at
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 10;