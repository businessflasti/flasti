-- Script para agregar el primer usuario admin
-- IMPORTANTE: Reemplaza 'TU_USER_ID_AQUI' con tu user_id real de Supabase Auth

-- Para obtener tu user_id, ejecuta primero:
-- SELECT id, email FROM auth.users WHERE email = 'tu-email@ejemplo.com';

-- Luego reemplaza el UUID abajo con tu user_id real
-- Ejemplo: INSERT INTO user_roles (user_id, role) VALUES ('12345678-1234-1234-1234-123456789012', 'super_admin');

-- DESCOMENTAR Y REEMPLAZAR CON TU USER_ID:
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('TU_USER_ID_AQUI', 'super_admin')
-- ON CONFLICT (user_id) 
-- DO UPDATE SET role = 'super_admin', updated_at = NOW();

-- Alternativamente, puedes ejecutar esto manualmente en la consola de Supabase:
-- 1. Ve a SQL Editor en Supabase
-- 2. Ejecuta: SELECT id, email FROM auth.users;
-- 3. Copia tu user_id
-- 4. Ejecuta: INSERT INTO user_roles (user_id, role) VALUES ('tu-user-id', 'super_admin') ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Verificar que se agregó correctamente:
-- SELECT ur.*, au.email 
-- FROM user_roles ur 
-- JOIN auth.users au ON ur.user_id = au.id 
-- WHERE ur.role IN ('admin', 'super_admin');
