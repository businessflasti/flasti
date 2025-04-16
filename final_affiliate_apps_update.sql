-- Primero, vamos a examinar la estructura actual de la tabla
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verificar si la columna slug existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'slug'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN slug TEXT;
        RAISE NOTICE 'Columna slug añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna slug ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna url existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'url'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN url TEXT;
        RAISE NOTICE 'Columna url añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna url ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna image_url existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'image_url'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Columna image_url añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna image_url ya existe en la tabla affiliate_apps';
    END IF;

    -- Verificar si la columna price existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'price'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN price DECIMAL DEFAULT 50;
        RAISE NOTICE 'Columna price añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna price ya existe en la tabla affiliate_apps';
    END IF;
    
    -- Verificar si la columna commission_rate existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'commission_rate'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN commission_rate DECIMAL DEFAULT 0.3;
        RAISE NOTICE 'Columna commission_rate añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna commission_rate ya existe en la tabla affiliate_apps';
    END IF;
    
    -- Verificar si la columna is_active existe y añadirla si no existe
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_apps' AND column_name = 'is_active'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE affiliate_apps ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna is_active añadida a la tabla affiliate_apps';
    ELSE
        RAISE NOTICE 'La columna is_active ya existe en la tabla affiliate_apps';
    END IF;
END $$;

-- Ahora, vamos a examinar las columnas existentes en la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'affiliate_apps';

-- Finalmente, verificar si Flasti Images ya existe y añadirla o actualizarla
DO $$
DECLARE
    app_exists BOOLEAN;
    app_id UUID;
    column_names TEXT[];
    update_query TEXT := 'UPDATE affiliate_apps SET ';
    first_column BOOLEAN := TRUE;
BEGIN
    -- Obtener los nombres de las columnas existentes
    SELECT array_agg(column_name) INTO column_names
    FROM information_schema.columns 
    WHERE table_name = 'affiliate_apps';
    
    -- Verificar si existe por nombre
    SELECT EXISTS (
        SELECT 1 FROM affiliate_apps WHERE name = 'Flasti Images'
    ) INTO app_exists;
    
    IF NOT app_exists THEN
        -- Construir la consulta de inserción dinámicamente
        DECLARE
            insert_columns TEXT := '';
            insert_values TEXT := '';
            first_col BOOLEAN := TRUE;
        BEGIN
            -- Añadir name (siempre debe existir)
            insert_columns := 'name';
            insert_values := '''Flasti Images''';
            
            -- Añadir description si existe
            IF 'description' = ANY(column_names) THEN
                insert_columns := insert_columns || ', description';
                insert_values := insert_values || ', ''Genera imágenes impresionantes con IA en segundos''';
            END IF;
            
            -- Añadir slug si existe
            IF 'slug' = ANY(column_names) THEN
                insert_columns := insert_columns || ', slug';
                insert_values := insert_values || ', ''images''';
            END IF;
            
            -- Añadir url si existe
            IF 'url' = ANY(column_names) THEN
                insert_columns := insert_columns || ', url';
                insert_values := insert_values || ', ''https://flasti.com/images''';
            END IF;
            
            -- Añadir image_url si existe
            IF 'image_url' = ANY(column_names) THEN
                insert_columns := insert_columns || ', image_url';
                insert_values := insert_values || ', ''https://flasti.com/images/og-image.jpg''';
            END IF;
            
            -- Añadir price si existe
            IF 'price' = ANY(column_names) THEN
                insert_columns := insert_columns || ', price';
                insert_values := insert_values || ', 50.00';
            END IF;
            
            -- Añadir commission_rate si existe
            IF 'commission_rate' = ANY(column_names) THEN
                insert_columns := insert_columns || ', commission_rate';
                insert_values := insert_values || ', 0.30';
            END IF;
            
            -- Añadir is_active si existe
            IF 'is_active' = ANY(column_names) THEN
                insert_columns := insert_columns || ', is_active';
                insert_values := insert_values || ', true';
            END IF;
            
            -- Añadir created_at y updated_at si existen
            IF 'created_at' = ANY(column_names) THEN
                insert_columns := insert_columns || ', created_at';
                insert_values := insert_values || ', NOW()';
            END IF;
            
            IF 'updated_at' = ANY(column_names) THEN
                insert_columns := insert_columns || ', updated_at';
                insert_values := insert_values || ', NOW()';
            END IF;
            
            -- Ejecutar la consulta de inserción
            EXECUTE 'INSERT INTO affiliate_apps (' || insert_columns || ') VALUES (' || insert_values || ') RETURNING id' INTO app_id;
        END;
        
        RAISE NOTICE 'Flasti Images añadida correctamente a las apps promocionables con ID: %', app_id;
    ELSE
        -- Obtener el ID de la app existente
        SELECT id INTO app_id FROM affiliate_apps WHERE name = 'Flasti Images' LIMIT 1;
        
        -- Construir la consulta de actualización dinámicamente
        IF 'description' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'description = ''Genera imágenes impresionantes con IA en segundos''';
            first_column := FALSE;
        END IF;
        
        IF 'slug' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'slug = ''images''';
            first_column := FALSE;
        END IF;
        
        IF 'url' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'url = ''https://flasti.com/images''';
            first_column := FALSE;
        END IF;
        
        IF 'image_url' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'image_url = ''https://flasti.com/images/og-image.jpg''';
            first_column := FALSE;
        END IF;
        
        IF 'price' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'price = 50.00';
            first_column := FALSE;
        END IF;
        
        IF 'commission_rate' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'commission_rate = 0.30';
            first_column := FALSE;
        END IF;
        
        IF 'is_active' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'is_active = true';
            first_column := FALSE;
        END IF;
        
        IF 'updated_at' = ANY(column_names) THEN
            IF NOT first_column THEN update_query := update_query || ', '; END IF;
            update_query := update_query || 'updated_at = NOW()';
            first_column := FALSE;
        END IF;
        
        -- Completar y ejecutar la consulta de actualización
        update_query := update_query || ' WHERE id = ''' || app_id || '''';
        EXECUTE update_query;
        
        RAISE NOTICE 'Flasti Images actualizada correctamente con ID: %', app_id;
        RAISE NOTICE 'Consulta ejecutada: %', update_query;
    END IF;
END $$;
