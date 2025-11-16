-- Actualizar el texto del banner cambiando "Empieza" por "Cerra"
UPDATE banner_config
SET banner_text = REPLACE(banner_text, 'Empieza', 'Cerra')
WHERE banner_text LIKE '%Empieza%';

-- Verificar el cambio
SELECT id, banner_text, is_active, updated_at
FROM banner_config
ORDER BY updated_at DESC;
