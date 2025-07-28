-- Script de prueba para verificar que el sistema de retiros funciona correctamente
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que existen retiros en la base de datos
SELECT 
    COUNT(*) as total_withdrawals,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_withdrawals,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_withdrawals,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_withdrawals
FROM public.withdrawals;

-- 2. Ver todos los retiros con información del usuario
SELECT 
    w.id,
    w.user_id,
    au.email,
    w.amount,
    w.payment_method,
    w.status,
    w.created_at,
    w.processed_at
FROM public.withdrawals w
JOIN auth.users au ON w.user_id = au.id
ORDER BY w.created_at DESC
LIMIT 10;

-- 3. Verificar políticas RLS actuales en withdrawals
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'withdrawals';

-- 4. Verificar si RLS está habilitado en withdrawals
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'withdrawals';

-- 5. Verificar que el usuario administrador existe en user_roles
SELECT 
    ur.user_id,
    ur.role,
    au.email,
    ur.created_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role IN ('admin', 'super_admin');

-- 6. Crear un retiro de prueba si no existe ninguno (opcional)
-- Descomenta las siguientes líneas si necesitas datos de prueba
/*
INSERT INTO public.withdrawals (user_id, amount, payment_method, payment_details, status)
SELECT 
    id,
    25.00,
    'PayPal',
    '{"destination": "test@paypal.com", "method": "PayPal"}',
    'pending'
FROM auth.users 
WHERE email = 'flasti.finanzas@gmail.com'
LIMIT 1;
*/