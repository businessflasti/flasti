-- ============================================
-- FIX: Asegurar que investment_config tenga un registro
-- ============================================

-- Verificar si existe algún registro
DO $$
DECLARE
    config_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO config_count FROM investment_config;
    
    -- Si no hay registros, insertar uno
    IF config_count = 0 THEN
        INSERT INTO investment_config (
            id,
            current_value,
            daily_change,
            min_investment,
            max_investment,
            is_system_locked,
            active_users_count,
            total_capital_invested,
            launch_date,
            rating,
            token_name,
            token_description,
            hero_title,
            hero_subtitle,
            token_current_value,
            token_daily_change,
            token_daily_change_percentage
        ) VALUES (
            gen_random_uuid()::text,
            132.25,
            2.5,
            5,
            10000,
            false,
            '+100K',
            '$2.5M+',
            '2025-01-15',
            4.8,
            'Flasti Capital Token',
            'Economía Digital Global',
            'Invierte en el Futuro',
            'Sé parte de la revolución de la economía digital con Flasti Capital',
            132.25,
            2.5,
            1.93
        );
        RAISE NOTICE 'Registro de configuración creado';
    ELSE
        -- Si existe, actualizar para asegurar que tenga todos los campos
        UPDATE investment_config 
        SET 
            active_users_count = COALESCE(active_users_count, '+100K'),
            total_capital_invested = COALESCE(total_capital_invested, '$2.5M+'),
            launch_date = COALESCE(launch_date, '2025-01-15'::date),
            rating = COALESCE(rating, 4.8),
            token_name = COALESCE(token_name, 'Flasti Capital Token'),
            token_description = COALESCE(token_description, 'Economía Digital Global'),
            hero_title = COALESCE(hero_title, 'Invierte en el Futuro'),
            hero_subtitle = COALESCE(hero_subtitle, 'Sé parte de la revolución de la economía digital con Flasti Capital'),
            token_current_value = COALESCE(token_current_value, 132.25),
            token_daily_change = COALESCE(token_daily_change, 2.5),
            token_daily_change_percentage = COALESCE(token_daily_change_percentage, 1.93);
        RAISE NOTICE 'Registro de configuración actualizado';
    END IF;
END $$;

-- Mostrar el registro actual
SELECT 
    id,
    token_name,
    token_current_value,
    token_daily_change,
    token_daily_change_percentage,
    min_investment,
    max_investment,
    active_users_count,
    total_capital_invested,
    rating
FROM investment_config;

-- ============================================
-- ✅ FIX COMPLETADO
-- ============================================
