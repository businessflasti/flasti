-- ============================================
-- ACTUALIZACIÓN PARA PANEL DE ADMINISTRACIÓN
-- Ejecutar después de investment_system.sql
-- ============================================

-- 1. Agregar columnas faltantes a investment_config
ALTER TABLE investment_config 
ADD COLUMN IF NOT EXISTS active_users_count TEXT DEFAULT '+100K',
ADD COLUMN IF NOT EXISTS total_capital_invested TEXT DEFAULT '$2.5M+',
ADD COLUMN IF NOT EXISTS launch_date DATE DEFAULT '2025-01-15',
ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION DEFAULT 4.8;

-- 2. Agregar columnas faltantes a investment_periods
ALTER TABLE investment_periods 
ADD COLUMN IF NOT EXISTS annual_rate DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 3. Actualizar datos existentes de investment_periods
-- Copiar rate_annual a annual_rate si existe
UPDATE investment_periods 
SET annual_rate = rate_annual 
WHERE annual_rate IS NULL AND rate_annual IS NOT NULL;

-- Copiar enabled a is_active si existe
UPDATE investment_periods 
SET is_active = enabled 
WHERE enabled IS NOT NULL;

-- 4. Establecer el período de 90 días como recomendado
UPDATE investment_periods 
SET is_recommended = true 
WHERE days = 90;

-- 5. Establecer orden de visualización
UPDATE investment_periods SET display_order = 1 WHERE days = 30;
UPDATE investment_periods SET display_order = 2 WHERE days = 45;
UPDATE investment_periods SET display_order = 3 WHERE days = 90;

-- 6. Actualizar configuración inicial con los nuevos campos
UPDATE investment_config 
SET 
    active_users_count = '+100K',
    total_capital_invested = '$2.5M+',
    launch_date = '2025-01-15',
    rating = 4.8
WHERE id IS NOT NULL;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Mostrar configuración actualizada
SELECT * FROM investment_config LIMIT 1;

-- Mostrar períodos actualizados
SELECT 
    id,
    days,
    annual_rate,
    is_active,
    is_recommended,
    display_order
FROM investment_periods
ORDER BY display_order;

-- ============================================
-- ✅ ACTUALIZACIÓN COMPLETADA
-- ============================================
