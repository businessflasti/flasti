-- Función para decrementar el balance de un usuario
CREATE OR REPLACE FUNCTION decrement_balance(user_id_param UUID, amount_param NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    -- Obtener el balance actual
    SELECT balance INTO current_balance
    FROM user_profiles
    WHERE user_id = user_id_param;
    
    -- Si no hay balance, devolver 0
    IF current_balance IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Devolver el balance decrementado
    RETURN current_balance - amount_param;
END;
$$ LANGUAGE plpgsql;
