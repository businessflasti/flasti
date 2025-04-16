-- Verificar si Flasti Images ya existe en la tabla
DO $$
DECLARE
    app_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM affiliate_apps WHERE slug = 'images'
    ) INTO app_exists;
    
    IF NOT app_exists THEN
        -- Insertar Flasti Images en la tabla de apps promocionables
        INSERT INTO affiliate_apps (
            name,
            slug,
            description,
            url,
            image_url,
            commission_rate,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            'Flasti Images',
            'images',
            'Genera imágenes impresionantes con IA en segundos',
            'https://flasti.com/images',
            'https://flasti.com/images/og-image.jpg',
            0.30, -- 30% de comisión
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Flasti Images añadida correctamente a las apps promocionables';
    ELSE
        RAISE NOTICE 'Flasti Images ya existe en la tabla de apps promocionables';
    END IF;
END $$;
