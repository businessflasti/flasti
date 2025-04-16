-- Función para agregar saldo a un usuario por correo electrónico
CREATE OR REPLACE FUNCTION add_balance_to_user(p_email TEXT, p_amount NUMERIC)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_current_balance NUMERIC;
BEGIN
    -- Buscar el ID del usuario en auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado con el correo: %', p_email;
    END IF;
    
    -- Verificar si el usuario tiene un perfil en user_profiles
    SELECT balance INTO v_current_balance
    FROM user_profiles
    WHERE user_id = v_user_id;
    
    IF v_current_balance IS NULL THEN
        -- Crear un nuevo perfil si no existe
        INSERT INTO user_profiles (user_id, balance, level)
        VALUES (v_user_id, p_amount, 1);
    ELSE
        -- Actualizar el balance existente
        UPDATE user_profiles
        SET balance = balance + p_amount
        WHERE user_id = v_user_id;
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
