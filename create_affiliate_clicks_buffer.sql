-- Crear una tabla buffer para los clics de afiliados
-- Esta tabla no tendrá RLS y será procesada por una función programada
CREATE TABLE IF NOT EXISTS affiliate_clicks_buffer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_code TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    url TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegurarse de que la tabla no tenga RLS
ALTER TABLE affiliate_clicks_buffer DISABLE ROW LEVEL SECURITY;

-- Crear una función para procesar los clics del buffer
CREATE OR REPLACE FUNCTION process_affiliate_clicks_buffer()
RETURNS INTEGER AS $$
DECLARE
    processed INTEGER := 0;
    affiliate_id UUID;
    buffer_record RECORD;
BEGIN
    -- Procesar cada registro en el buffer
    FOR buffer_record IN SELECT * FROM affiliate_clicks_buffer LIMIT 100
    LOOP
        -- Buscar el ID del afiliado basado en el código
        SELECT id INTO affiliate_id
        FROM affiliates
        WHERE affiliate_code = buffer_record.affiliate_code
        AND status = 'active';
        
        -- Si encontramos un afiliado válido, insertar en la tabla principal
        IF affiliate_id IS NOT NULL THEN
            INSERT INTO affiliate_clicks (
                affiliate_id,
                ip_address,
                user_agent,
                referrer,
                url,
                created_at
            ) VALUES (
                affiliate_id,
                buffer_record.ip_address,
                buffer_record.user_agent,
                buffer_record.referrer,
                buffer_record.url,
                buffer_record.created_at
            );
            
            -- Eliminar el registro del buffer
            DELETE FROM affiliate_clicks_buffer WHERE id = buffer_record.id;
            
            -- Incrementar contador
            processed := processed + 1;
        ELSE
            -- Si el código no es válido, simplemente eliminar el registro
            DELETE FROM affiliate_clicks_buffer WHERE id = buffer_record.id;
        END IF;
    END LOOP;
    
    RETURN processed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear un trigger para procesar automáticamente el buffer
CREATE OR REPLACE FUNCTION trigger_process_affiliate_clicks_buffer()
RETURNS TRIGGER AS $$
BEGIN
    -- Programar la ejecución de la función de procesamiento
    PERFORM pg_notify('process_affiliate_clicks', '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Añadir el trigger a la tabla buffer
DROP TRIGGER IF EXISTS affiliate_clicks_buffer_trigger ON affiliate_clicks_buffer;
CREATE TRIGGER affiliate_clicks_buffer_trigger
AFTER INSERT ON affiliate_clicks_buffer
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_process_affiliate_clicks_buffer();
