-- ============================================
-- ACTUALIZAR TEMA PREMIUM PARA TODOS LOS USUARIOS PREMIUM
-- ============================================

-- Ver TODOS los usuarios premium actuales
SELECT 
    user_id, 
    email, 
    is_premium, 
    preferred_theme,
    premium_activated_at
FROM user_profiles 
WHERE is_premium = true
ORDER BY premium_activated_at DESC;

-- Contar cuántos usuarios premium hay
SELECT COUNT(*) as total_premium_users
FROM user_profiles 
WHERE is_premium = true;

-- Contar cuántos ya tienen el tema premium
SELECT COUNT(*) as users_with_premium_theme
FROM user_profiles 
WHERE is_premium = true AND preferred_theme = 'premium';

-- Contar cuántos necesitan actualización
SELECT COUNT(*) as users_need_update
FROM user_profiles 
WHERE is_premium = true AND (preferred_theme IS NULL OR preferred_theme != 'premium');

-- ACTUALIZAR TODOS los usuarios premium para que tengan el tema premium
UPDATE user_profiles 
SET preferred_theme = 'premium' 
WHERE is_premium = true 
  AND (preferred_theme IS NULL OR preferred_theme != 'premium');

-- Verificar que todos los usuarios premium ahora tienen el tema premium
SELECT 
    user_id, 
    email, 
    is_premium, 
    preferred_theme,
    premium_activated_at
FROM user_profiles 
WHERE is_premium = true
ORDER BY premium_activated_at DESC;

-- Resumen final
SELECT 
    COUNT(*) as total_premium_users,
    COUNT(CASE WHEN preferred_theme = 'premium' THEN 1 END) as with_premium_theme,
    COUNT(CASE WHEN preferred_theme != 'premium' OR preferred_theme IS NULL THEN 1 END) as without_premium_theme
FROM user_profiles 
WHERE is_premium = true;

-- ============================================
-- ✅ TODOS LOS USUARIOS PREMIUM ACTUALIZADOS
-- ============================================
