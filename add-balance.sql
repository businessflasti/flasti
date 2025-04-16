-- Script SQL para agregar saldo a la cuenta de un usuario
-- Ejecutar en la consola SQL de Supabase

-- Primero, buscar el ID del usuario por correo electrónico
DO $$
DECLARE
    user_id UUID;
    current_balance NUMERIC;
    amount_to_add NUMERIC := 100; -- $100 USD
    user_email TEXT := 'fagibor419@provko.com';
BEGIN
    -- Buscar el ID del usuario
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado con el correo: %', user_email;
    END IF;
    
    -- Verificar si el usuario tiene un perfil en user_profiles
    SELECT balance INTO current_balance
    FROM user_profiles
    WHERE user_id = user_id;
    
    IF current_balance IS NULL THEN
        -- Crear un nuevo perfil si no existe
        INSERT INTO user_profiles (user_id, balance, level)
        VALUES (user_id, amount_to_add, 1);
        
        RAISE NOTICE 'Perfil creado para el usuario % con balance inicial: $%', user_email, amount_to_add;
    ELSE
        -- Actualizar el balance existente
        UPDATE user_profiles
        SET balance = balance + amount_to_add
        WHERE user_id = user_id;
        
        RAISE NOTICE 'Balance actualizado para el usuario %. Nuevo balance: $%', user_email, (current_balance + amount_to_add);
    END IF;
    
    RAISE NOTICE 'Operación completada con éxito';
END $$;
