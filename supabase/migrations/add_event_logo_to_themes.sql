-- Agregar columna event_logo_url a seasonal_themes
ALTER TABLE seasonal_themes 
ADD COLUMN IF NOT EXISTS event_logo_url TEXT;

-- Actualizar con valores por defecto para cada tema
UPDATE seasonal_themes 
SET event_logo_url = '/images/eventos/event-halloween.png'
WHERE theme_name = 'halloween';

UPDATE seasonal_themes 
SET event_logo_url = '/images/eventos/event-navidad.png'
WHERE theme_name = 'christmas';

UPDATE seasonal_themes 
SET event_logo_url = '/images/eventos/event-default.png'
WHERE theme_name = 'default';

-- Comentario
COMMENT ON COLUMN seasonal_themes.event_logo_url IS 'URL del logo del evento que aparece en el banner superior';
