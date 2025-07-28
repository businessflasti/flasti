-- Script para diagnosticar problemas de administrador
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar que el usuario existe en auth.users
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'flasti.finanzas@gmail.com';

-- 2. Verificar que el rol de administrador existe
SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'flasti.finanzas@gmail.com';

-- 3. Verificar todos los administradores configurados
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

-- 4. Verificar la estructura de la tabla user_roles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_roles' 
AND table_schema = 'public'
ORDER BY ordinal_position;