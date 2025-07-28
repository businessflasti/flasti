-- Solución simple: Deshabilitar RLS en user_roles temporalmente
-- Ejecutar en Supabase SQL Editor

-- 1. Deshabilitar RLS completamente en user_roles
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar todas las políticas existentes
DROP POLICY IF EXISTS user_roles_select_policy ON user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON user_roles;

-- 3. Insertar el rol de administrador para el usuario actual
INSERT INTO user_roles (user_id, role, created_at) 
VALUES ('77c9957d-8c4c-4e16-8da6-e0d2353532ba', 'admin', NOW())
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Verificar que el administrador fue creado
SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role IN ('admin', 'super_admin')
ORDER BY ur.created_at DESC;

-- NOTA: La tabla user_roles ahora NO tiene RLS habilitado
-- Esto significa que cualquier usuario autenticado puede leer los roles
-- Pero solo los administradores deberían poder modificarlos a través de la aplicación