-- Solución definitiva para el problema de recursión infinita en user_roles
-- Ejecutar en Supabase SQL Editor

-- 1. Deshabilitar RLS temporalmente
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

-- 4. Crear políticas simples sin recursión
-- Habilitar RLS nuevamente
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: Solo permite ver roles propios o si eres admin
CREATE POLICY user_roles_select_policy ON user_roles
    FOR SELECT USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
            AND ur.user_id != user_roles.user_id  -- Evitar auto-referencia
        )
    );

-- Política para INSERT: Solo admins pueden insertar roles
CREATE POLICY user_roles_insert_policy ON user_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Política para UPDATE: Solo admins pueden actualizar roles
CREATE POLICY user_roles_update_policy ON user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Política para DELETE: Solo admins pueden eliminar roles
CREATE POLICY user_roles_delete_policy ON user_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- 5. Verificar que todo funciona
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