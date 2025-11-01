-- Verificar que la columna first_name y last_name existan y tengan datos
-- Esta migración ayuda a diagnosticar el problema

-- Ver cuántos usuarios tienen first_name
SELECT 
  COUNT(*) as total_users,
  COUNT(first_name) as users_with_first_name,
  COUNT(last_name) as users_with_last_name
FROM user_profiles;

-- Ver algunos ejemplos de usuarios con y sin nombre
SELECT 
  user_id,
  email,
  first_name,
  last_name,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;

-- Asegurarse de que las columnas existan (por si acaso)
DO $$ 
BEGIN
  -- Verificar si first_name existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
    RAISE NOTICE 'Columna first_name agregada';
  ELSE
    RAISE NOTICE 'Columna first_name ya existe';
  END IF;

  -- Verificar si last_name existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
    RAISE NOTICE 'Columna last_name agregada';
  ELSE
    RAISE NOTICE 'Columna last_name ya existe';
  END IF;
END $$;

-- Comentario
COMMENT ON COLUMN user_profiles.first_name IS 'Nombre del usuario (del registro)';
COMMENT ON COLUMN user_profiles.last_name IS 'Apellido del usuario (del registro)';
