-- Primero, vamos a verificar la estructura actual de la tabla
DO $$
BEGIN
    -- Verificar si la columna slug existe y añadirla si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'slug'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN slug TEXT;
        RAISE NOTICE 'Columna slug añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna slug ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna url existe y añadirla si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'url'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN url TEXT;
        RAISE NOTICE 'Columna url añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna url ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna image_url existe y añadirla si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE affiliate_apps ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Columna image_url añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna image_url ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna price existe y añadirla si no existe
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

-- Ahora, verificar si Flasti Images ya existe y añadirla o actualizarla
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
            slug,
            url,
            image_url,
            price,
            commission_rate,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            'Flasti Images',
            'Genera imágenes impresionantes con IA en segundos',
            'images',
            'https://flasti.com/images',
            'https://flasti.com/images/og-image.jpg',
            50.00, -- Precio base: $50
            0.30, -- 30% de comisión
            true,
            NOW(),
            NOW()
        ) RETURNING id INTO app_id;
        
        RAISE NOTICE 'Flasti Images añadida correctamente a las apps promocionables con ID: %', app_id;
    ELSE
        -- Obtener el ID de la app existente
        SELECT id INTO app_id FROM affiliate_apps WHERE name = 'Flasti Images' LIMIT 1;
        
        -- Actualizar los campos de la app existente
        UPDATE affiliate_apps 
        SET 
            description = 'Genera imágenes impresionantes con IA en segundos',
            slug = 'images',
            url = 'https://flasti.com/images',
            image_url = 'https://flasti.com/images/og-image.jpg',
            price = 50.00,
            commission_rate = 0.30,
            is_active = true,
            updated_at = NOW()
        WHERE id = app_id;
        
        RAISE NOTICE 'Flasti Images actualizada correctamente con ID: %', app_id;
    END IF;
END $$;
