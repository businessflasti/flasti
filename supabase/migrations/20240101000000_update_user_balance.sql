-- Función para actualizar el balance del usuario y su nivel automáticamente
CREATE OR REPLACE FUNCTION update_user_balance(user_id_param UUID, amount_param DECIMAL)
RETURNS VOID AS $$
DECLARE
    current_balance DECIMAL;
    new_balance DECIMAL;
    new_level INTEGER;
BEGIN
    -- Obtener el balance actual
    SELECT balance INTO current_balance FROM user_profiles WHERE user_id = user_id_param;
    
    -- Si no existe el usuario, salir
    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
    
    -- Calcular el nuevo balance
    new_balance := current_balance + amount_param;
    
    -- Determinar el nuevo nivel basado en el balance
    IF new_balance >= 30 THEN
        new_level := 3;
    ELSIF new_balance >= 20 THEN
        new_level := 2;
    ELSE
        new_level := 1;
    END IF;
    
    -- Actualizar el balance y nivel del usuario
    UPDATE user_profiles 
    SET 
        balance = new_balance,
        level = new_level
    WHERE user_id = user_id_param;
    
    -- Registrar la transacción
    INSERT INTO balance_transactions (
        user_id,
        amount,
        type,
        description,
        balance_before,
        balance_after
    ) VALUES (
        user_id_param,
        amount_param,
        'commission',
        'Comisión por venta',
        current_balance,
        new_balance
    );
END;
$$ LANGUAGE plpgsql;
