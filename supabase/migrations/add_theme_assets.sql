-- Agregar campos para logo y fondo de cada tema
ALTER TABLE seasonal_themes
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS background_url TEXT;

-- Comentarios
COMMENT ON COLUMN seasonal_themes.logo_url IS 'URL del logo tematizado (se muestra en header principal y dashboard)';
COMMENT ON COLUMN seasonal_themes.background_url IS 'URL de la imagen de fondo del contenedor principal del dashboard';

-- Actualizar temas existentes con rutas por defecto
-- Estas rutas apuntan a archivos que el admin debe colocar manualmente en public/images/themes/

UPDATE seasonal_themes
SET 
  logo_url = '/images/themes/logo-default.png',
  background_url = '/images/themes/bg-default.jpg'
WHERE theme_name = 'default';

UPDATE seasonal_themes
SET 
  logo_url = '/images/themes/logo-hall.png',
  background_url = '/images/themes/bg-halloween.jpg'
WHERE theme_name = 'halloween';

UPDATE seasonal_themes
SET 
  logo_url = '/images/themes/logo-christmas.png',
  background_url = '/images/themes/bg-christmas.jpg'
WHERE theme_name = 'christmas';
