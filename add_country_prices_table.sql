-- Crear tabla para precios por país
CREATE TABLE IF NOT EXISTS public.country_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    country_code TEXT NOT NULL UNIQUE,
    country_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency_code TEXT NOT NULL,
    currency_symbol TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por código de país
CREATE INDEX IF NOT EXISTS idx_country_prices_country_code ON public.country_prices(country_code);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_country_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_country_prices_updated_at
    BEFORE UPDATE ON country_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_country_prices_updated_at();

-- Insertar países por defecto
INSERT INTO public.country_prices (country_code, country_name, price, currency_code, currency_symbol) VALUES
    ('CO', 'Colombia', 0, 'COP', '$'),
    ('PE', 'Perú', 0, 'PEN', 'S/'),
    ('MX', 'México', 0, 'MXN', '$'),
    ('PA', 'Panamá', 0, 'USD', '$'),
    ('GT', 'Guatemala', 0, 'GTQ', 'Q'),
    ('DO', 'República Dominicana', 0, 'DOP', 'RD$'),
    ('PY', 'Paraguay', 0, 'PYG', '₲'),
    ('ES', 'España', 0, 'EUR', '€'),
    ('CR', 'Costa Rica', 0, 'CRC', '₡'),
    ('CL', 'Chile', 0, 'CLP', '$'),
    ('UY', 'Uruguay', 0, 'UYU', '$U'),
    ('BO', 'Bolivia', 0, 'BOB', 'Bs'),
    ('HN', 'Honduras', 0, 'HNL', 'L'),
    ('AR', 'Argentina', 0, 'ARS', '$')
ON CONFLICT (country_code) DO NOTHING;

-- No aplicamos RLS ya que el acceso se controla a nivel de aplicación
