-- Solución simple: Deshabilitar RLS en withdrawals para permitir acceso completo
-- Ejecutar en Supabase SQL Editor

-- Deshabilitar RLS en la tabla withdrawals
ALTER TABLE public.withdrawals DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios retiros" ON public.withdrawals;
DROP POLICY IF EXISTS "Usuarios pueden crear sus propios retiros" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_select_policy" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_insert_policy" ON public.withdrawals;
DROP POLICY IF EXISTS "withdrawals_update_policy" ON public.withdrawals;

-- Verificar que se pueden ver todos los retiros
SELECT 
    w.id,
    w.user_id,
    w.amount,
    w.status,
    w.created_at,
    au.email
FROM public.withdrawals w
JOIN auth.users au ON w.user_id = au.id
ORDER BY w.created_at DESC;