-- Añadir columna updated_at a la tabla affiliate_links si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'affiliate_links'
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.affiliate_links 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        
        -- Actualizar los registros existentes
        UPDATE public.affiliate_links
        SET updated_at = created_at;
    END IF;
END
$$;
