-- Recrear el trigger de updated_at para tutorial_video

-- Eliminar trigger existente
DROP TRIGGER IF EXISTS trigger_update_tutorial_video_updated_at ON tutorial_video;

-- Eliminar función existente
DROP FUNCTION IF EXISTS update_tutorial_video_updated_at();

-- Recrear función
CREATE OR REPLACE FUNCTION update_tutorial_video_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recrear trigger
CREATE TRIGGER trigger_update_tutorial_video_updated_at
    BEFORE UPDATE ON tutorial_video
    FOR EACH ROW
    EXECUTE FUNCTION update_tutorial_video_updated_at();

-- Verificar que se creó correctamente
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgrelid = 'tutorial_video'::regclass;
