-- Verificar datos de investment_metrics
SELECT * FROM investment_metrics ORDER BY display_order;

-- Si no hay datos, insertarlos
INSERT INTO investment_metrics (id, metric_key, label, value, display_order, is_active)
VALUES 
    (gen_random_uuid()::text, 'min_investment', 'Inversión Mínima', '$5', 1, true),
    (gen_random_uuid()::text, 'max_investment', 'Inversión Máxima', '$10,000', 2, true),
    (gen_random_uuid()::text, 'annual_rate_90d', 'Tasa Anual (90d)', '12%', 3, true),
    (gen_random_uuid()::text, 'active_users', 'Usuarios Activos', '+100K', 4, true)
ON CONFLICT (metric_key) DO UPDATE SET
    label = EXCLUDED.label,
    value = EXCLUDED.value,
    display_order = EXCLUDED.display_order,
    is_active = EXCLUDED.is_active;

-- Verificar de nuevo
SELECT * FROM investment_metrics ORDER BY display_order;
