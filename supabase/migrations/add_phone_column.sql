-- Agregar columna phone a user_profiles si no existe
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Crear índice para búsquedas por teléfono (opcional)
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
