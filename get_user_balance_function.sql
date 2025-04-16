-- Función para obtener el balance de un usuario
CREATE OR REPLACE FUNCTION get_user_balance(user_id_param UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    -- Buscar el balance en user_profiles
    SELECT balance INTO v_balance
    FROM user_profiles
    WHERE user_id = user_id_param;
    
    -- Si no se encuentra, devolver 0
    IF v_balance IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql;
