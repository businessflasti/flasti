-- Script para habilitar permisos en las tablas
-- Ejecutar en la consola SQL de Supabase

-- Deshabilitar RLS (Row Level Security) para la tabla user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS para la tabla withdrawal_requests
ALTER TABLE withdrawal_requests DISABLE ROW LEVEL SECURITY;

-- Otorgar todos los permisos al rol anon
GRANT ALL ON TABLE user_profiles TO anon;
GRANT ALL ON TABLE withdrawal_requests TO anon;

-- Otorgar todos los permisos al rol authenticated
GRANT ALL ON TABLE user_profiles TO authenticated;
GRANT ALL ON TABLE withdrawal_requests TO authenticated;

-- Otorgar todos los permisos al rol service_role
GRANT ALL ON TABLE user_profiles TO service_role;
GRANT ALL ON TABLE withdrawal_requests TO service_role;
