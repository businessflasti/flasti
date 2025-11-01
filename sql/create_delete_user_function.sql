-- Función para eliminar un usuario completamente
-- Esta función debe ejecutarse con privilegios de service_role

CREATE OR REPLACE FUNCTION delete_user_completely(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Eliminar notificaciones
  DELETE FROM notifications WHERE user_id = target_user_id;
  
  -- Eliminar historial de recompensas
  DELETE FROM rewards_history WHERE user_id = target_user_id;
  
  -- Eliminar solicitudes de retiro
  DELETE FROM withdrawal_requests WHERE user_id = target_user_id;
  
  -- Eliminar balance de games
  DELETE FROM games_balance WHERE user_id = target_user_id;
  
  -- Eliminar actividad de games
  DELETE FROM games_activity WHERE user_id = target_user_id;
  
  -- Eliminar retiros de games
  DELETE FROM games_withdrawals WHERE user_id = target_user_id;
  
  -- Eliminar clicks de afiliados
  DELETE FROM affiliate_clicks WHERE user_id = target_user_id;
  
  -- Eliminar conversiones de afiliados
  DELETE FROM affiliate_conversions WHERE user_id = target_user_id;
  
  -- Eliminar perfil de usuario
  DELETE FROM user_profiles WHERE user_id = target_user_id;
  
  -- Eliminar de profiles si existe
  DELETE FROM profiles WHERE id = target_user_id;
  
  -- Eliminar de auth.users (requiere extensión)
  DELETE FROM auth.users WHERE id = target_user_id;
  
  result := json_build_object(
    'success', true,
    'message', 'Usuario eliminado completamente'
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'error', SQLERRM
  );
  RETURN result;
END;
$$;

-- Dar permisos a la función
GRANT EXECUTE ON FUNCTION delete_user_completely(UUID) TO service_role;
