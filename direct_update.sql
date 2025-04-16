-- Script SQL para agregar saldo directamente a la cuenta del usuario fagibor419@provko.com
-- Ejecutar en la consola SQL de Supabase

-- Buscar el ID del usuario
SELECT id FROM auth.users WHERE email = 'fagibor419@provko.com';

-- Si el ID es 'abc123' (reemplazar con el ID real), ejecutar:
INSERT INTO user_profiles (user_id, balance, level)
VALUES ('abc123', 100, 1)
ON CONFLICT (user_id) 
DO UPDATE SET balance = user_profiles.balance + 100;
