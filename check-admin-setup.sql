-- ============================================
-- SCRIPT DE VERIFICACIÓN Y CORRECCIÓN DE ADMIN
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Verificar si el usuario existe en auth.users
SELECT 
  id as user_id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'flasti.finanzas@gmail.com';

-- PASO 2: Verificar si existe el perfil y si es admin
SELECT 
  user_id,
  email,
  is_admin,
  is_premium,
  created_at
FROM user_profiles
WHERE email = 'flasti.finanzas@gmail.com';

-- PASO 3: Si el usuario existe pero no tiene perfil o no es admin, ejecuta esto:
-- (Reemplaza 'USER_ID_AQUI' con el ID del PASO 1)

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Obtener el user_id del email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'flasti.finanzas@gmail.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Insertar o actualizar el perfil como admin
    INSERT INTO user_profiles (user_id, email, is_admin, is_premium)
    VALUES (v_user_id, 'flasti.finanzas@gmail.com', true, false)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      is_admin = true,
      email = 'flasti.finanzas@gmail.com';
    
    RAISE NOTICE 'Usuario configurado como admin correctamente';
  ELSE
    RAISE NOTICE 'Usuario no encontrado en auth.users';
  END IF;
END $$;

-- PASO 4: Verificar que se aplicó correctamente
SELECT 
  user_id,
  email,
  is_admin,
  is_premium,
  created_at
FROM user_profiles
WHERE email = 'flasti.finanzas@gmail.com';

-- PASO 5: Verificar las políticas RLS
SELECT 
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- PASO 6: Verificar estructura de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles' 
  AND column_name IN ('user_id', 'email', 'is_admin', 'is_premium')
ORDER BY ordinal_position;
