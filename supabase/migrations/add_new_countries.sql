-- Agregar nuevos países a country_prices
-- Países: Estados Unidos, Venezuela, El Salvador, Ecuador, Puerto Rico

-- Primero, verificar si la columna is_locked existe, si no, agregarla
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'country_prices' 
        AND column_name = 'is_locked'
    ) THEN
        ALTER TABLE country_prices ADD COLUMN is_locked BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Insertar los nuevos países
INSERT INTO public.country_prices (country_code, country_name, price, currency_code, currency_symbol, is_locked) VALUES
    ('US', 'Estados Unidos', 3.90, 'USD', '$', false),
    ('VE', 'Venezuela', 3.90, 'USD', '$', false),  -- Venezuela usa USD por la situación económica
    ('SV', 'El Salvador', 3.90, 'USD', '$', false), -- El Salvador usa USD oficialmente
    ('EC', 'Ecuador', 3.90, 'USD', '$', false),     -- Ecuador usa USD oficialmente
    ('PR', 'Puerto Rico', 3.90, 'USD', '$', false)  -- Puerto Rico usa USD (territorio de USA)
ON CONFLICT (country_code) DO UPDATE SET
    country_name = EXCLUDED.country_name,
    price = EXCLUDED.price,
    currency_code = EXCLUDED.currency_code,
    currency_symbol = EXCLUDED.currency_symbol,
    is_locked = EXCLUDED.is_locked,
    updated_at = NOW();

-- Verificar que se insertaron correctamente
SELECT 
    country_code,
    country_name,
    price,
    currency_code,
    currency_symbol,
    is_locked
FROM country_prices
WHERE country_code IN ('US', 'VE', 'SV', 'EC', 'PR')
ORDER BY country_name;

-- Contar total de países
SELECT COUNT(*) as total_countries FROM country_prices;
