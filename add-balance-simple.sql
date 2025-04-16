-- Script SQL simplificado para agregar saldo a la cuenta de un usuario
-- Ejecutar en la consola SQL de Supabase

-- Buscar el ID del usuario por correo electrónico
SELECT id FROM auth.users WHERE email = 'fagibor419@provko.com';

-- Una vez que tengas el ID, ejecuta una de estas consultas:

-- Si el usuario ya tiene un perfil en user_profiles:
UPDATE user_profiles
SET balance = balance + 100
WHERE user_id = 'PEGA_AQUÍ_EL_ID_DEL_USUARIO';

-- Si el usuario no tiene un perfil en user_profiles:
INSERT INTO user_profiles (user_id, balance, level)
VALUES ('PEGA_AQUÍ_EL_ID_DEL_USUARIO', 100, 1);
