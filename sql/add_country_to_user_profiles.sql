-- ============================================
-- AGREGAR COLUMNA country A user_profiles
-- ============================================

-- PASO 1: Verificar que la columna NO existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'country';

-- PASO 2: Agregar la columna country (código de país ISO de 2 letras)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS country TEXT;

-- PASO 3: Crear un índice para búsquedas por país
CREATE INDEX IF NOT EXISTS idx_user_profiles_country 
ON user_profiles(country);

-- PASO 4: Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
  AND column_name = 'country';

-- PASO 5: Ver usuarios con país (después de que se empiece a guardar)
SELECT user_id, email, country, created_at
FROM user_profiles
WHERE country IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
