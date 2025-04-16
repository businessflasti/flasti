-- Script para insertar datos directamente en las tablas de afiliados

-- Verificar si hay datos en la tabla affiliate_apps
DO $$
DECLARE
    app_count INTEGER;
BEGIN
    -- Verificar si la tabla existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) THEN
        -- Contar cuántas apps hay en la tabla
        EXECUTE 'SELECT COUNT(*) FROM affiliate_apps' INTO app_count;
        
        -- Si no hay apps, insertar algunas de ejemplo
        IF app_count = 0 THEN
            -- Insertar apps
            EXECUTE '
                INSERT INTO affiliate_apps (name, description, image_url, hotmart_offer_code, base_price, is_active)
                VALUES 
                    (''Flasti Images'', ''Genera imágenes con IA de alta calidad para tus proyectos. Ideal para marketing, diseño y contenido creativo.'', ''/images/apps/flasti-images.png'', ''mz63zpyh'', 49.99, true),
                    (''Flasti AI'', ''Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.'', ''/images/apps/flasti-ai.png'', ''abcdefg'', 39.99, true),
                    (''Flasti Pro'', ''Suite completa de herramientas de IA para profesionales. Incluye todas las funcionalidades premium.'', ''/images/apps/flasti-pro.png'', ''pro123'', 99.99, true)
            ';
            
            RAISE NOTICE 'Apps insertadas correctamente';
            
            -- Obtener los IDs de las apps insertadas
            DECLARE
                flasti_images_id UUID;
                flasti_ai_id UUID;
                flasti_pro_id UUID;
            BEGIN
                EXECUTE 'SELECT id FROM affiliate_apps WHERE name = ''Flasti Images''' INTO flasti_images_id;
                EXECUTE 'SELECT id FROM affiliate_apps WHERE name = ''Flasti AI''' INTO flasti_ai_id;
                EXECUTE 'SELECT id FROM affiliate_apps WHERE name = ''Flasti Pro''' INTO flasti_pro_id;
                
                -- Verificar si la tabla affiliate_commission_rates existe
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
                ) THEN
                    -- Insertar comisiones para Flasti Images
                    IF flasti_images_id IS NOT NULL THEN
                        EXECUTE '
                            INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
                            VALUES 
                                (''' || flasti_images_id || ''', 1, 0.30),
                                (''' || flasti_images_id || ''', 2, 0.35),
                                (''' || flasti_images_id || ''', 3, 0.40)
                        ';
                        RAISE NOTICE 'Comisiones para Flasti Images insertadas';
                    END IF;
                    
                    -- Insertar comisiones para Flasti AI
                    IF flasti_ai_id IS NOT NULL THEN
                        EXECUTE '
                            INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
                            VALUES 
                                (''' || flasti_ai_id || ''', 1, 0.30),
                                (''' || flasti_ai_id || ''', 2, 0.35),
                                (''' || flasti_ai_id || ''', 3, 0.40)
                        ';
                        RAISE NOTICE 'Comisiones para Flasti AI insertadas';
                    END IF;
                    
                    -- Insertar comisiones para Flasti Pro
                    IF flasti_pro_id IS NOT NULL THEN
                        EXECUTE '
                            INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
                            VALUES 
                                (''' || flasti_pro_id || ''', 1, 0.30),
                                (''' || flasti_pro_id || ''', 2, 0.35),
                                (''' || flasti_pro_id || ''', 3, 0.40)
                        ';
                        RAISE NOTICE 'Comisiones para Flasti Pro insertadas';
                    END IF;
                ELSE
                    RAISE NOTICE 'La tabla affiliate_commission_rates no existe';
                END IF;
            END;
        ELSE
            RAISE NOTICE 'Ya existen % apps en la tabla. No se insertaron nuevas apps.', app_count;
        END IF;
    ELSE
        RAISE NOTICE 'La tabla affiliate_apps no existe';
    END IF;
END
$$;
