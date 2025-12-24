-- Agregar columna instructions a custom_offers
ALTER TABLE custom_offers ADD COLUMN IF NOT EXISTS instructions TEXT DEFAULT '';

-- Actualizar las ofertas existentes con instrucciones por defecto según su tipo
UPDATE custom_offers 
SET instructions = 'Reproduce el audio|Escucha las palabras|Escríbelas en el campo|Presiona Confirmar'
WHERE task_type = 'Audio' AND (instructions IS NULL OR instructions = '');

UPDATE custom_offers 
SET instructions = 'Reproduce el video|Encuentra el error|Anota el tiempo|Presiona Confirmar'
WHERE task_type = 'Video' AND (instructions IS NULL OR instructions = '');

UPDATE custom_offers 
SET instructions = 'Lee el contenido|Analiza la información|Escribe tu respuesta|Presiona Confirmar'
WHERE task_type IN ('Texto', 'Encuesta', 'Formulario', 'Reseña') AND (instructions IS NULL OR instructions = '');

UPDATE custom_offers 
SET instructions = 'Toca para volar|Esquiva los obstáculos|Alcanza la meta|¡Buena suerte!'
WHERE task_type = 'Juego' AND (instructions IS NULL OR instructions = '');
