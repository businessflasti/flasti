-- Función para crear una solicitud de retiro (versión corregida)
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
BEGIN
  -- Verificar el balance del usuario (sin depender de la tabla users)
  SELECT balance INTO v_current_balance
  FROM user_profiles
  WHERE user_id = p_user_id;
  
  IF v_current_balance IS NULL THEN
    -- Intentar buscar en profiles
    SELECT balance INTO v_current_balance
    FROM profiles
    WHERE id = p_user_id;
    
    IF v_current_balance IS NULL THEN
      RETURN jsonb_build_object(
        'success', FALSE,
        'message', 'Perfil de usuario no encontrado'
      );
    END IF;
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
  
  -- Actualizar el balance del usuario en user_profiles
  BEGIN
    UPDATE user_profiles
    SET balance = balance - p_amount
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
      -- Si no se actualizó ninguna fila, intentar actualizar en profiles
      UPDATE profiles
      SET balance = balance - p_amount
      WHERE id = p_user_id;
    END IF;
  END;
  
  -- Calcular el nuevo balance
  v_new_balance := v_current_balance - p_amount;
  
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
