-- Verificar si la columna slug existe y añadirla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'slug'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN slug TEXT;
        RAISE NOTICE 'Columna slug añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna slug ya existe en la tabla affiliate_apps';
    END IF;
END $$;

-- Verificar si la columna image_url existe y añadirla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Columna image_url añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna image_url ya existe en la tabla affiliate_apps';
    END IF;
END $$;

-- Verificar si la columna price existe y añadirla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'price'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN price DECIMAL DEFAULT 50;
        RAISE NOTICE 'Columna price añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna price ya existe en la tabla affiliate_apps';
    END IF;
END $$;

-- Verificar si Flasti Images ya existe en la tabla
DO $$
DECLARE
    app_exists BOOLEAN;
    app_id UUID;
BEGIN
    -- Verificar si existe por nombre
    SELECT EXISTS (
        SELECT 1 FROM affiliate_apps WHERE name = 'Flasti Images'
    ) INTO app_exists;
    
    IF NOT app_exists THEN
        -- Insertar Flasti Images en la tabla de apps promocionables
        INSERT INTO affiliate_apps (
            name,
            description,
            url,
            image_url,
            slug,
            price,
            commission_rate,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            'Flasti Images',
            'Genera imágenes impresionantes con IA en segundos',
            'https://flasti.com/images',
            'https://flasti.com/images/og-image.jpg',
            'images',
            50.00, -- Precio base: $50
            0.30, -- 30% de comisión
            true,
            NOW(),
            NOW()
        ) RETURNING id INTO app_id;
        
        RAISE NOTICE 'Flasti Images añadida correctamente a las apps promocionables con ID: %', app_id;
    ELSE
        -- Actualizar la app existente para añadir el slug si no lo tiene
        UPDATE affiliate_apps 
        SET 
            slug = 'images',
            url = 'https://flasti.com/images',
            image_url = 'https://flasti.com/images/og-image.jpg',
            price = 50.00,
            updated_at = NOW()
        WHERE name = 'Flasti Images' AND (slug IS NULL OR slug = '');
        
        RAISE NOTICE 'Flasti Images ya existe en la tabla de apps promocionables y ha sido actualizada';
    END IF;
END $$;
