-- Script para corregir permisos en Supabase

-- 1. Desactivar RLS para todas las tablas relevantes
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar todas las políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Servicio puede crear perfiles" ON profiles;
DROP POLICY IF EXISTS "Cualquiera puede crear perfiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles;

DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Servicio puede crear perfiles" ON user_profiles;
DROP POLICY IF EXISTS "Cualquiera puede crear perfiles en user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON user_profiles;

-- 3. Crear políticas extremadamente permisivas para permitir todas las operaciones
-- Políticas para profiles
CREATE POLICY "Allow all operations on profiles"
ON profiles
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Políticas para user_profiles
CREATE POLICY "Allow all operations on user_profiles"
ON user_profiles
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 4. Habilitar RLS pero con políticas permisivas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Verificar que las tablas tienen las columnas correctas
DO $$
BEGIN
    -- Verificar si la tabla profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Verificar columnas
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'id') THEN
            ALTER TABLE profiles ADD COLUMN id UUID PRIMARY KEY REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'email') THEN
            ALTER TABLE profiles ADD COLUMN email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'phone') THEN
            ALTER TABLE profiles ADD COLUMN phone TEXT;
        END IF;
    END IF;
    
    -- Verificar si la tabla user_profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        -- Verificar columnas
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'user_id') THEN
            ALTER TABLE user_profiles ADD COLUMN user_id UUID PRIMARY KEY REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'email') THEN
            ALTER TABLE user_profiles ADD COLUMN email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'phone') THEN
            ALTER TABLE user_profiles ADD COLUMN phone TEXT;
        END IF;
    END IF;
END $$;
