-- Arreglar políticas RLS para que los administradores puedan ver todas las solicitudes de retiro
-- Ejecutar en Supabase SQL Editor

-- Eliminar políticas existentes de withdrawals
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios retiros" ON public.withdrawals;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propios retiros" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_select_policy" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_insert_policy" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_update_policy" ON public.withdrawals;

-- Crear nuevas políticas que permitan acceso a administradores
-- Política para SELECT: usuarios pueden ver sus propios retiros, admins pueden ver todos
CREATE POLICY "withdrawals_select_policy" ON public.withdrawals
    FOR SELECT USING (
        auth.uid() = user_id 
        OR 
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Política para INSERT: usuarios pueden crear sus propios retiros
CREATE POLICY "withdrawals_insert_policy" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: solo admins pueden actualizar retiros
CREATE POLICY "withdrawals_update_policy" ON public.withdrawals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'withdrawals';

-- Verificar que el administrador puede ver retiros
SELECT 
    w.id,
    w.user_id,
    w.amount,
    w.status,
    w.created_at,
    au.email
FROM public.withdrawals w
JOIN auth.users au ON w.user_id = au.id
ORDER BY w.created_at DESC
LIMIT 5;