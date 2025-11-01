-- Agregar columna device_type a user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS device_type TEXT;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_user_profiles_device_type 
ON user_profiles(device_type);

-- Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'device_type';
