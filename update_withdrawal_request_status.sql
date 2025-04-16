-- Función para actualizar el estado de una solicitud de retiro
CREATE OR REPLACE FUNCTION update_withdrawal_request_status(
  p_request_id UUID,
  p_status TEXT,
  p_admin_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_request_exists BOOLEAN;
BEGIN
  -- Verificar que la solicitud exista
  SELECT EXISTS(
    SELECT 1 FROM withdrawal_requests WHERE id = p_request_id
  ) INTO v_request_exists;
  
  IF NOT v_request_exists THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Solicitud de retiro no encontrada'
    );
  END IF;
  
  -- Actualizar el estado de la solicitud
  UPDATE withdrawal_requests
  SET 
    status = p_status,
    admin_notes = COALESCE(p_admin_notes, admin_notes),
    updated_at = NOW()
  WHERE id = p_request_id;
  
  -- Devolver resultado exitoso
  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Estado de solicitud actualizado correctamente'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Error al actualizar estado: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
