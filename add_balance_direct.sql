-- Script SQL para agregar saldo directamente a la cuenta de un usuario específico
-- Ejecutar en la consola SQL de Supabase

-- Insertar un registro en la tabla user_profiles para el usuario con correo fagibor419@provko.com
INSERT INTO user_profiles (user_id, balance, level)
SELECT id, 100, 1
FROM auth.users
WHERE email = 'fagibor419@provko.com'
ON CONFLICT (user_id) 
DO UPDATE SET balance = user_profiles.balance + 100;

-- Si el usuario no existe en auth.users, ejecutar:
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
-- VALUES ('fagibor419@provko.com', 'contraseña_encriptada', NOW())
-- RETURNING id;
-- Y luego insertar en user_profiles con el ID devuelto
