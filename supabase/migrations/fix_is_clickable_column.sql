-- Verificar si la columna is_clickable existe
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tutorial_video'
ORDER BY ordinal_position;

-- Agregar la columna is_clickable si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tutorial_video' 
        AND column_name = 'is_clickable'
    ) THEN
        ALTER TABLE tutorial_video 
        ADD COLUMN is_clickable BOOLEAN DEFAULT true;
        
        RAISE NOTICE 'Columna is_clickable agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna is_clickable ya existe';
    END IF;
END $$;

-- Verificar nuevamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tutorial_video'
ORDER BY ordinal_position;

-- Ver los datos actuales
SELECT id, title, is_clickable, is_active 
FROM tutorial_video;
