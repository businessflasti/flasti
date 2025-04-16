-- Verificar si ya existen apps en la tabla
DO $$
DECLARE
    app_count INTEGER;
BEGIN
    -- Contar cuántas apps hay en la tabla
    SELECT COUNT(*) INTO app_count FROM affiliate_apps;
    
    -- Si no hay apps, insertar algunas de ejemplo
    IF app_count = 0 THEN
        -- Insertar apps
        INSERT INTO affiliate_apps (name, description, image_url, hotmart_offer_code, base_price, is_active)
        VALUES 
            ('Flasti Images', 'Genera imágenes con IA de alta calidad para tus proyectos. Ideal para marketing, diseño y contenido creativo.', '/images/apps/flasti-images.png', 'mz63zpyh', 49.99, true),
            ('Flasti AI', 'Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.', '/images/apps/flasti-ai.png', 'abcdefg', 39.99, true),
            ('Flasti Pro', 'Suite completa de herramientas de IA para profesionales. Incluye todas las funcionalidades premium.', '/images/apps/flasti-pro.png', 'pro123', 99.99, true);
        
        -- Insertar comisiones por nivel para cada app
        -- Flasti Images
        INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
        VALUES 
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 1, 0.30),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 2, 0.35),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 3, 0.40);
        
        -- Flasti AI
        INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
        VALUES 
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 1, 0.30),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 2, 0.35),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 3, 0.40);
        
        -- Flasti Pro
        INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
        VALUES 
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Pro'), 1, 0.30),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Pro'), 2, 0.35),
            ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Pro'), 3, 0.40);
        
        RAISE NOTICE 'Apps de ejemplo insertadas correctamente';
    ELSE
        RAISE NOTICE 'Ya existen % apps en la tabla. No se insertaron nuevas apps.', app_count;
    END IF;
END
$$;
