-- ============================================
-- AGREGAR COLUMNA preferred_theme A user_profiles
-- ============================================

-- Agregar columna para guardar el tema preferido del usuario
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS preferred_theme TEXT DEFAULT 'default';

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_theme 
ON user_profiles(preferred_theme);

-- Actualizar usuarios premium existentes para que tengan el tema premium
UPDATE user_profiles 
SET preferred_theme = 'premium' 
WHERE is_premium = true AND (preferred_theme IS NULL OR preferred_theme = 'default');

-- Verificar cambios
SELECT user_id, email, is_premium, preferred_theme 
FROM user_profiles 
WHERE is_premium = true
LIMIT 10;

-- ============================================
-- ✅ COLUMNA preferred_theme AGREGADA
-- ============================================
-- Ahora cada usuario puede tener su tema preferido
-- Los usuarios premium automáticamente tendrán el tema premium
-- ============================================
