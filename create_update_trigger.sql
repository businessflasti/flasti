-- Crear función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para la tabla affiliate_links
DROP TRIGGER IF EXISTS update_affiliate_links_timestamp ON public.affiliate_links;
CREATE TRIGGER update_affiliate_links_timestamp
BEFORE UPDATE ON public.affiliate_links
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
