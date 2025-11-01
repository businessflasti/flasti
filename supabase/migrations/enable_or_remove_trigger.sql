-- Opción 1: Eliminar completamente el trigger y la función
-- (Recomendado si no necesitas que updated_at se actualice automáticamente)

DROP TRIGGER IF EXISTS trigger_update_tutorial_video_updated_at ON tutorial_video;
DROP FUNCTION IF EXISTS update_tutorial_video_updated_at();

-- Verificar que se eliminó
SELECT tgname, tgtype, tgenabled 
FROM pg_trigger 
WHERE tgrelid = 'tutorial_video'::regclass;

-- Ahora las actualizaciones deberían funcionar sin problemas
