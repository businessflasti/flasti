-- Script de verificación para el sistema premium
-- Ejecutar después de aplicar add_premium_field.sql

-- 1. Verificar que las columnas premium se agregaron correctamente
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
  AND column_name IN ('is_premium', 'premium_activated_at', 'premium_payment_method')
ORDER BY column_name;

-- 2. Verificar que las funciones se crearon correctamente
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name IN ('activate_user_premium', 'is_user_premium', 'get_user_by_email')
  AND routine_schema = 'public';

-- 3. Verificar que los índices se crearon
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('user_profiles', 'checkout_leads')
  AND indexname LIKE '%premium%' OR indexname LIKE '%user_id%';

-- 4. Mostrar estadísticas actuales de usuarios premium
SELECT * FROM premium_users_stats;

-- 5. Verificar estructura de checkout_leads
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'checkout_leads' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Contar usuarios actuales
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_premium = TRUE) as premium_users,
  COUNT(*) FILTER (WHERE is_premium = FALSE OR is_premium IS NULL) as free_users
FROM public.user_profiles;

-- 7. Mostrar algunos usuarios de ejemplo (sin datos sensibles)
SELECT 
  user_id,
  is_premium,
  premium_activated_at,
  premium_payment_method,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- 8. Verificar que las políticas RLS están activas
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'checkout_leads')
  AND schemaname = 'public';

-- 9. Probar función de activación premium (con usuario de prueba)
-- NOTA: Solo ejecutar si tienes un usuario de prueba
/*
SELECT activate_user_premium(
  (SELECT user_id FROM public.user_profiles LIMIT 1),
  'test'
);
*/

-- 10. Verificar que la vista de estadísticas funciona
SELECT 
  total_premium_users,
  total_free_users,
  total_users,
  premium_conversion_rate
FROM premium_users_stats;