-- ============================================
-- FIX: Políticas RLS para permitir actualizaciones
-- ============================================

-- Eliminar políticas existentes que puedan estar bloqueando
DROP POLICY IF EXISTS "Anyone can read investment_config" ON investment_config;
DROP POLICY IF EXISTS "Anyone can read investment_periods" ON investment_periods;
DROP POLICY IF EXISTS "Anyone can read fund_allocation" ON fund_allocation;
DROP POLICY IF EXISTS "Anyone can read chart_data_points" ON chart_data_points;
DROP POLICY IF EXISTS "Anyone can read investment_metrics" ON investment_metrics;
DROP POLICY IF EXISTS "Anyone can read investment_faqs" ON investment_faqs;

-- Crear políticas de lectura (todos pueden leer)
CREATE POLICY "Anyone can read investment_config" 
ON investment_config FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read investment_periods" 
ON investment_periods FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read fund_allocation" 
ON fund_allocation FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read chart_data_points" 
ON chart_data_points FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read investment_metrics" 
ON investment_metrics FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read investment_faqs" 
ON investment_faqs FOR SELECT 
USING (true);

-- Crear políticas de escritura (usuarios autenticados pueden escribir)
CREATE POLICY "Authenticated users can update investment_config" 
ON investment_config FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update investment_periods" 
ON investment_periods FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update fund_allocation" 
ON fund_allocation FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update chart_data_points" 
ON chart_data_points FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update investment_metrics" 
ON investment_metrics FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update investment_faqs" 
ON investment_faqs FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN (
    'investment_config',
    'investment_periods',
    'fund_allocation',
    'chart_data_points',
    'investment_metrics',
    'investment_faqs'
)
ORDER BY tablename, policyname;

-- ============================================
-- ✅ POLÍTICAS RLS ACTUALIZADAS
-- ============================================
