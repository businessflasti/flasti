-- Actualizar la precisión de la columna price para soportar 3 decimales
-- Esto permite precios como 16.958 para Colombia, Paraguay y otros países

-- Cambiar el tipo de dato de DECIMAL(10,2) a DECIMAL(10,3)
ALTER TABLE public.country_prices 
ALTER COLUMN price TYPE DECIMAL(10,3);

-- Verificar el cambio
-- SELECT column_name, data_type, numeric_precision, numeric_scale 
-- FROM information_schema.columns 
-- WHERE table_name = 'country_prices' AND column_name = 'price';

-- Nota: Este cambio permite hasta 3 decimales en todos los precios
-- Ejemplos válidos:
-- - Colombia: 16.958 COP
-- - Paraguay: 123.456 PYG
-- - Otros países: 10.99 (seguirán funcionando con 2 decimales)
