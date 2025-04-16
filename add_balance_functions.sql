-- Función para incrementar el balance de un usuario
CREATE OR REPLACE FUNCTION increment_balance(user_id_param UUID, amount_param NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
    current_balance NUMERIC;
BEGIN
    -- Obtener el balance actual
    SELECT balance INTO current_balance
    FROM user_profiles
    WHERE user_id = user_id_param;
    
    -- Si no hay balance, devolver el monto
    IF current_balance IS NULL THEN
        RETURN amount_param;
    END IF;
    
    -- Devolver el balance incrementado
    RETURN current_balance + amount_param;
END;
$$ LANGUAGE plpgsql;

-- Función para agregar saldo a un usuario por correo electrónico
CREATE OR REPLACE FUNCTION add_balance_to_user_simple(email_param TEXT, amount_param NUMERIC)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_current_balance NUMERIC;
BEGIN
    -- Buscar el ID del usuario en auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = email_param;
    
    IF v_user_id IS NULL THEN
        -- Buscar en la tabla users
        SELECT id INTO v_user_id
        FROM users
        WHERE email = email_param;
        
        IF v_user_id IS NULL THEN
            RAISE EXCEPTION 'Usuario no encontrado con el correo: %', email_param;
        END IF;
    END IF;
    
    -- Verificar si el usuario tiene un perfil en user_profiles
    SELECT balance INTO v_current_balance
    FROM user_profiles
    WHERE user_id = v_user_id;
    
    IF v_current_balance IS NULL THEN
        -- Crear un nuevo perfil si no existe
        INSERT INTO user_profiles (user_id, balance, level)
        VALUES (v_user_id, amount_param, 1);
    ELSE
        -- Actualizar el balance existente
        UPDATE user_profiles
        SET balance = balance + amount_param
        WHERE user_id = v_user_id;
    END IF;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;
