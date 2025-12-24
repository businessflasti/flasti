-- Agregar columna usd_exchange_rate a country_prices
-- Esta columna almacena el tipo de cambio: 1 USD = X moneda local

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'country_prices' 
        AND column_name = 'usd_exchange_rate'
    ) THEN
        ALTER TABLE country_prices ADD COLUMN usd_exchange_rate DECIMAL(12, 4) DEFAULT 1.0;
    END IF;
END $$;

-- Actualizar tipos de cambio aproximados para países existentes
-- Estos valores son aproximados y deben ser actualizados por el admin

UPDATE country_prices SET usd_exchange_rate = 1.0 WHERE currency_code = 'USD';
UPDATE country_prices SET usd_exchange_rate = 20.0 WHERE country_code = 'MX'; -- México
UPDATE country_prices SET usd_exchange_rate = 4000.0 WHERE country_code = 'CO'; -- Colombia
UPDATE country_prices SET usd_exchange_rate = 950.0 WHERE country_code = 'CL'; -- Chile
UPDATE country_prices SET usd_exchange_rate = 1000.0 WHERE country_code = 'AR'; -- Argentina
UPDATE country_prices SET usd_exchange_rate = 5.5 WHERE country_code = 'BR'; -- Brasil
UPDATE country_prices SET usd_exchange_rate = 3.8 WHERE country_code = 'PE'; -- Perú
UPDATE country_prices SET usd_exchange_rate = 40.0 WHERE country_code = 'UY'; -- Uruguay
UPDATE country_prices SET usd_exchange_rate = 7500.0 WHERE country_code = 'PY'; -- Paraguay
UPDATE country_prices SET usd_exchange_rate = 7.0 WHERE country_code = 'BO'; -- Bolivia
UPDATE country_prices SET usd_exchange_rate = 4000.0 WHERE country_code = 'CR'; -- Costa Rica (colones)
UPDATE country_prices SET usd_exchange_rate = 37.0 WHERE country_code = 'HN'; -- Honduras
UPDATE country_prices SET usd_exchange_rate = 8.0 WHERE country_code = 'GT'; -- Guatemala
UPDATE country_prices SET usd_exchange_rate = 18.0 WHERE country_code = 'NI'; -- Nicaragua
UPDATE country_prices SET usd_exchange_rate = 60.0 WHERE country_code = 'DO'; -- República Dominicana
UPDATE country_prices SET usd_exchange_rate = 135.0 WHERE country_code = 'JM'; -- Jamaica
UPDATE country_prices SET usd_exchange_rate = 7.0 WHERE country_code = 'TT'; -- Trinidad y Tobago
UPDATE country_prices SET usd_exchange_rate = 0.85 WHERE country_code = 'ES'; -- España (EUR)

-- Verificar la columna
SELECT country_code, country_name, price, currency_code, usd_exchange_rate 
FROM country_prices 
ORDER BY country_name;
