-- Script SQL para insertar datos de prueba
-- Ejecutar en la consola SQL de Supabase

-- Insertar perfil para el usuario de prueba
INSERT INTO user_profiles (user_id, balance, level)
SELECT id, 100, 1
FROM auth.users
WHERE email = 'fagibor419@provko.com'
ON CONFLICT (user_id) 
DO UPDATE SET balance = 100;

-- Verificar que el perfil se haya creado correctamente
SELECT * FROM user_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'fagibor419@provko.com'
);
