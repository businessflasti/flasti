-- Verificar si la columna url existe en la tabla affiliate_clicks y añadirla si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'affiliate_clicks' AND column_name = 'url'
    ) THEN
        ALTER TABLE affiliate_clicks ADD COLUMN url TEXT;
        RAISE NOTICE 'Columna url añadida a la tabla affiliate_clicks';
    ELSE
        RAISE NOTICE 'La columna url ya existe en la tabla affiliate_clicks';
    END IF;
END $$;

-- Añadir política para permitir la inserción de clics desde el cliente
DO $$
BEGIN
    -- Verificar si la política ya existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_clicks' AND policyname = 'affiliate_clicks_insert_policy'
    ) THEN
        -- Crear política para permitir inserciones
        CREATE POLICY affiliate_clicks_insert_policy ON affiliate_clicks
            FOR INSERT WITH CHECK (true);
        
        RAISE NOTICE 'Política de inserción añadida a la tabla affiliate_clicks';
    ELSE
        RAISE NOTICE 'La política de inserción ya existe en la tabla affiliate_clicks';
    END IF;
END $$;
