-- Actualizar la divisa de Panamá de USD a Balboa panameño (PAB)
UPDATE public.country_prices 
SET 
    currency_code = 'PAB',
    currency_symbol = 'B/.',
    updated_at = NOW()
WHERE country_code = 'PA';