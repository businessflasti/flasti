-- Crear función y trigger para sincronizar email automáticamente
-- Ejecutar en Supabase SQL Editor

-- Función para sincronizar email
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Cuando se inserta un nuevo perfil, obtener el email desde auth.users
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles 
    SET email = (
      SELECT email 
      FROM auth.users 
      WHERE id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger que se ejecuta después de insertar en user_profiles
DROP TRIGGER IF EXISTS trigger_sync_user_email ON user_profiles;
CREATE TRIGGER trigger_sync_user_email
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- Verificar que el trigger se creó correctamente
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_sync_user_email';