-- Función para crear una solicitud de retiro
CREATE OR REPLACE FUNCTION create_withdrawal_request(
  p_user_id UUID,
  p_amount NUMERIC,
  p_payment_method TEXT,
  p_payment_details JSONB
) RETURNS JSONB AS $$
DECLARE
  v_current_balance NUMERIC;
  v_request_id UUID;
  v_new_balance NUMERIC;
  v_user_email TEXT;
  v_user_name TEXT;
BEGIN
  -- Verificar que el usuario exista
  SELECT email, name INTO v_user_email, v_user_name
  FROM users
  WHERE id = p_user_id;
  
  IF v_user_email IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Usuario no encontrado'
    );
  END IF;
  
  -- Verificar el balance del usuario
  SELECT balance INTO v_current_balance
  FROM user_profiles
  WHERE user_id = p_user_id;
  
  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Perfil de usuario no encontrado'
    );
  END IF;
  
  -- Verificar que tenga suficiente balance
  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Balance insuficiente'
    );
  END IF;
  
  -- Generar ID para la solicitud
  v_request_id := gen_random_uuid();
  
  -- Crear la solicitud de retiro
  INSERT INTO withdrawal_requests (
    id,
    user_id,
    amount,
    payment_method,
    payment_details,
    status,
    created_at,
    updated_at
  ) VALUES (
    v_request_id,
    p_user_id,
    p_amount,
    p_payment_method,
    p_payment_details,
    'pending',
    NOW(),
    NOW()
  );
  
  -- Actualizar el balance del usuario
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE user_profiles
  SET balance = v_new_balance
  WHERE user_id = p_user_id;
  
  -- Devolver resultado exitoso
  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Solicitud de retiro creada correctamente',
    'request_id', v_request_id,
    'new_balance', v_new_balance
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'message', 'Error al procesar la solicitud: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
