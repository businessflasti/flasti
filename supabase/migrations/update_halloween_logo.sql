-- Actualizar el logo de Halloween a la nueva ruta
UPDATE seasonal_themes
SET logo_url = '/images/themes/logo-hall.png'
WHERE theme_name = 'halloween';

-- Verificar el cambio
SELECT theme_name, logo_url, background_url, is_active
FROM seasonal_themes
WHERE theme_name = 'halloween';
