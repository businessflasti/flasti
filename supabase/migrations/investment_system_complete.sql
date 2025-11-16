-- ============================================
-- SISTEMA COMPLETO DE INVERSIONES CON CONTROL ADMIN
-- ============================================

-- 1. Actualizar investment_config con TODOS los campos necesarios
ALTER TABLE investment_config 
ADD COLUMN IF NOT EXISTS active_users_count TEXT DEFAULT '+100K',
ADD COLUMN IF NOT EXISTS total_capital_invested TEXT DEFAULT '$2.5M+',
ADD COLUMN IF NOT EXISTS launch_date DATE DEFAULT '2025-01-15',
ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION DEFAULT 4.8,
ADD COLUMN IF NOT EXISTS token_name TEXT DEFAULT 'Flasti Capital Token',
ADD COLUMN IF NOT EXISTS token_description TEXT DEFAULT 'Economía Digital Global',
ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Invierte en el Futuro',
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Sé parte de la revolución de la economía digital con Flasti Capital',
ADD COLUMN IF NOT EXISTS token_current_value DOUBLE PRECISION DEFAULT 132.25,
ADD COLUMN IF NOT EXISTS token_daily_change DOUBLE PRECISION DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS token_daily_change_percentage DOUBLE PRECISION DEFAULT 1.93;

-- 2. Actualizar investment_periods con todos los campos
ALTER TABLE investment_periods 
ADD COLUMN IF NOT EXISTS annual_rate DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS label TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Crear tabla para destino de fondos (editable desde admin)
CREATE TABLE IF NOT EXISTS fund_allocation (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    icon_type TEXT NOT NULL,
    color_from TEXT NOT NULL,
    color_to TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Actualizar chart_data_points para soportar múltiples períodos
ALTER TABLE chart_data_points 
ADD COLUMN IF NOT EXISTS period TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS date DATE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 5. Crear tabla para métricas principales (las 4 tarjetas superiores)
CREATE TABLE IF NOT EXISTS investment_metrics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    metric_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Actualizar configuración existente
UPDATE investment_config 
SET 
    active_users_count = '+100K',
    total_capital_invested = '$2.5M+',
    launch_date = '2025-01-15',
    rating = 4.8,
    token_name = 'Flasti Capital Token',
    token_description = 'Economía Digital Global',
    hero_title = 'Invierte en el Futuro',
    hero_subtitle = 'Sé parte de la revolución de la economía digital con Flasti Capital',
    token_current_value = 132.25,
    token_daily_change = 2.5,
    token_daily_change_percentage = 1.93
WHERE id IS NOT NULL;

-- Actualizar períodos existentes
UPDATE investment_periods SET annual_rate = rate_annual WHERE annual_rate IS NULL;
UPDATE investment_periods SET is_active = enabled WHERE enabled IS NOT NULL;
UPDATE investment_periods SET is_recommended = (days = 90);
UPDATE investment_periods SET display_order = 1, label = 'Corto plazo', description = 'Ideal para comenzar' WHERE days = 30;
UPDATE investment_periods SET display_order = 2, label = 'Mediano plazo', description = 'Balance perfecto' WHERE days = 45;
UPDATE investment_periods SET display_order = 3, label = 'Largo plazo', description = 'Mejor rendimiento' WHERE days = 90;

-- Insertar destino de fondos
INSERT INTO fund_allocation (id, name, description, percentage, icon_type, color_from, color_to, display_order, is_active)
VALUES 
    (gen_random_uuid()::text, 'Infraestructura & Hosting', 'Servidores, CDN, seguridad', 40, 'server', 'blue-500', 'cyan-500', 1, true),
    (gen_random_uuid()::text, 'Marketing & Adquisición', 'Publicidad, crecimiento', 30, 'megaphone', 'purple-500', 'pink-500', 2, true),
    (gen_random_uuid()::text, 'Desarrollo Tecnológico', 'Nuevas funcionalidades, IA', 20, 'code', 'green-500', 'emerald-500', 3, true),
    (gen_random_uuid()::text, 'Reservas de Liquidez', 'Fondo de seguridad', 10, 'shield', 'yellow-500', 'orange-500', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Insertar métricas principales
INSERT INTO investment_metrics (metric_key, label, value, display_order, is_active)
VALUES 
    ('min_investment', 'Inversión Mínima', '$5', 1, true),
    ('max_investment', 'Inversión Máxima', '$10,000', 2, true),
    ('annual_rate_90d', 'Tasa Anual (90d)', '12%', 3, true),
    ('active_users', 'Usuarios Activos', '+100K', 4, true)
ON CONFLICT (metric_key) DO UPDATE SET
    label = EXCLUDED.label,
    value = EXCLUDED.value;

-- Limpiar datos antiguos del gráfico
DELETE FROM chart_data_points;

-- Insertar datos del gráfico para diferentes períodos
-- Diario (últimos 7 días)
INSERT INTO chart_data_points (id, month, value, "order", period, date, is_active)
VALUES 
    (gen_random_uuid()::text, 'Lun', 130.00, 1, 'daily', CURRENT_DATE - INTERVAL '6 days', true),
    (gen_random_uuid()::text, 'Mar', 131.20, 2, 'daily', CURRENT_DATE - INTERVAL '5 days', true),
    (gen_random_uuid()::text, 'Mié', 130.80, 3, 'daily', CURRENT_DATE - INTERVAL '4 days', true),
    (gen_random_uuid()::text, 'Jue', 132.50, 4, 'daily', CURRENT_DATE - INTERVAL '3 days', true),
    (gen_random_uuid()::text, 'Vie', 131.90, 5, 'daily', CURRENT_DATE - INTERVAL '2 days', true),
    (gen_random_uuid()::text, 'Sáb', 133.10, 6, 'daily', CURRENT_DATE - INTERVAL '1 day', true),
    (gen_random_uuid()::text, 'Dom', 132.25, 7, 'daily', CURRENT_DATE, true);

-- Semanal (últimas 8 semanas)
INSERT INTO chart_data_points (id, month, value, "order", period, date, is_active)
VALUES 
    (gen_random_uuid()::text, 'S1', 120.00, 1, 'weekly', CURRENT_DATE - INTERVAL '7 weeks', true),
    (gen_random_uuid()::text, 'S2', 122.50, 2, 'weekly', CURRENT_DATE - INTERVAL '6 weeks', true),
    (gen_random_uuid()::text, 'S3', 124.30, 3, 'weekly', CURRENT_DATE - INTERVAL '5 weeks', true),
    (gen_random_uuid()::text, 'S4', 126.75, 4, 'weekly', CURRENT_DATE - INTERVAL '4 weeks', true),
    (gen_random_uuid()::text, 'S5', 128.20, 5, 'weekly', CURRENT_DATE - INTERVAL '3 weeks', true),
    (gen_random_uuid()::text, 'S6', 130.00, 6, 'weekly', CURRENT_DATE - INTERVAL '2 weeks', true),
    (gen_random_uuid()::text, 'S7', 131.50, 7, 'weekly', CURRENT_DATE - INTERVAL '1 week', true),
    (gen_random_uuid()::text, 'S8', 132.25, 8, 'weekly', CURRENT_DATE, true);

-- Mensual (últimos 6 meses)
INSERT INTO chart_data_points (id, month, value, "order", period, date, is_active)
VALUES 
    (gen_random_uuid()::text, 'Ago', 120.00, 1, 'monthly', CURRENT_DATE - INTERVAL '5 months', true),
    (gen_random_uuid()::text, 'Sep', 122.30, 2, 'monthly', CURRENT_DATE - INTERVAL '4 months', true),
    (gen_random_uuid()::text, 'Oct', 125.50, 3, 'monthly', CURRENT_DATE - INTERVAL '3 months', true),
    (gen_random_uuid()::text, 'Nov', 128.75, 4, 'monthly', CURRENT_DATE - INTERVAL '2 months', true),
    (gen_random_uuid()::text, 'Dic', 130.20, 5, 'monthly', CURRENT_DATE - INTERVAL '1 month', true),
    (gen_random_uuid()::text, 'Ene', 132.25, 6, 'monthly', CURRENT_DATE, true);

-- Anual (últimos 5 años)
INSERT INTO chart_data_points (id, month, value, "order", period, date, is_active)
VALUES 
    (gen_random_uuid()::text, '2021', 80.00, 1, 'yearly', CURRENT_DATE - INTERVAL '4 years', true),
    (gen_random_uuid()::text, '2022', 95.50, 2, 'yearly', CURRENT_DATE - INTERVAL '3 years', true),
    (gen_random_uuid()::text, '2023', 110.30, 3, 'yearly', CURRENT_DATE - INTERVAL '2 years', true),
    (gen_random_uuid()::text, '2024', 125.75, 4, 'yearly', CURRENT_DATE - INTERVAL '1 year', true),
    (gen_random_uuid()::text, '2025', 132.25, 5, 'yearly', CURRENT_DATE, true);

-- ============================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ============================================

DROP TRIGGER IF EXISTS update_fund_allocation_updated_at ON fund_allocation;
CREATE TRIGGER update_fund_allocation_updated_at 
BEFORE UPDATE ON fund_allocation 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_investment_metrics_updated_at ON investment_metrics;
CREATE TRIGGER update_investment_metrics_updated_at 
BEFORE UPDATE ON investment_metrics 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE investment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_faqs ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer, solo admins pueden escribir
CREATE POLICY "Anyone can read investment_config" ON investment_config FOR SELECT USING (true);
CREATE POLICY "Anyone can read investment_periods" ON investment_periods FOR SELECT USING (true);
CREATE POLICY "Anyone can read fund_allocation" ON fund_allocation FOR SELECT USING (true);
CREATE POLICY "Anyone can read chart_data_points" ON chart_data_points FOR SELECT USING (true);
CREATE POLICY "Anyone can read investment_metrics" ON investment_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can read investment_faqs" ON investment_faqs FOR SELECT USING (true);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT 'investment_config' as tabla, COUNT(*) as registros FROM investment_config
UNION ALL
SELECT 'investment_periods', COUNT(*) FROM investment_periods
UNION ALL
SELECT 'fund_allocation', COUNT(*) FROM fund_allocation
UNION ALL
SELECT 'chart_data_points', COUNT(*) FROM chart_data_points
UNION ALL
SELECT 'investment_metrics', COUNT(*) FROM investment_metrics
UNION ALL
SELECT 'investment_faqs', COUNT(*) FROM investment_faqs
ORDER BY tabla;

-- ============================================
-- ✅ SISTEMA COMPLETO LISTO
-- ============================================
