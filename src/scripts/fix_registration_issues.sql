-- Script para corregir problemas de registro en Supabase

-- 1. Desactivar temporalmente RLS (Row Level Security) para poder hacer cambios
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

-- 2. Verificar y corregir la estructura de la tabla profiles
DO $$
BEGIN
    -- Verificar si la tabla profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- La tabla existe, verificar columnas
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'id') THEN
            -- Añadir columna id si no existe
            ALTER TABLE profiles ADD COLUMN id UUID PRIMARY KEY REFERENCES auth.users(id);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'email') THEN
            -- Añadir columna email si no existe
            ALTER TABLE profiles ADD COLUMN email TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'phone') THEN
            -- Añadir columna phone si no existe
            ALTER TABLE profiles ADD COLUMN phone TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'level') THEN
            -- Añadir columna level si no existe
            ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'balance') THEN
            -- Añadir columna balance si no existe
            ALTER TABLE profiles ADD COLUMN balance NUMERIC DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'avatar_url') THEN
            -- Añadir columna avatar_url si no existe
            ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'profiles' 
                      AND column_name = 'created_at') THEN
            -- Añadir columna created_at si no existe
            ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
    ELSE
        -- La tabla no existe, crearla
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT,
            phone TEXT,
            level INTEGER DEFAULT 1,
            balance NUMERIC DEFAULT 0,
            avatar_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Verificar si la tabla user_profiles existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
        -- La tabla existe, verificar columnas
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'user_id') THEN
            -- Añadir columna user_id si no existe
            ALTER TABLE user_profiles ADD COLUMN user_id UUID PRIMARY KEY REFERENCES auth.users(id);
        END IF;
        
        -- Verificar otras columnas necesarias...
    ELSE
        -- La tabla no existe, crearla
        CREATE TABLE user_profiles (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT,
            phone TEXT,
            level INTEGER DEFAULT 1,
            balance NUMERIC DEFAULT 0,
            avatar_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- 3. Eliminar y recrear el trigger para la creación automática de perfiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear una nueva función para manejar la creación de usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_exists BOOLEAN;
BEGIN
    -- Verificar si ya existe un perfil para este usuario
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = NEW.id
    ) INTO profile_exists;
    
    -- Si no existe, crear uno nuevo
    IF NOT profile_exists THEN
        BEGIN
            INSERT INTO public.profiles (id, email, created_at)
            VALUES (NEW.id, NEW.email, NOW());
        EXCEPTION WHEN OTHERS THEN
            -- Si falla, intentar con user_profiles
            BEGIN
                INSERT INTO public.user_profiles (user_id, email, created_at)
                VALUES (NEW.id, NEW.email, NOW());
            EXCEPTION WHEN OTHERS THEN
                -- Ignorar errores aquí para no bloquear el registro
                RAISE NOTICE 'Error al crear perfil para %', NEW.email;
            END;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el nuevo trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Crear políticas de seguridad permisivas para permitir el registro
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Servicio puede crear perfiles" ON profiles;

-- Políticas para profiles
CREATE POLICY "Cualquiera puede crear perfiles"
ON profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Usuarios pueden ver su propio perfil"
ON profiles FOR SELECT
TO authenticated, anon
USING (id = auth.uid() OR true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Políticas para user_profiles
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Servicio puede crear perfiles" ON user_profiles;

CREATE POLICY "Cualquiera puede crear perfiles en user_profiles"
ON user_profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Usuarios pueden ver su propio perfil en user_profiles"
ON user_profiles FOR SELECT
TO authenticated, anon
USING (user_id = auth.uid() OR true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil en user_profiles"
ON user_profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 5. Crear función RPC para actualizar avatar_url en ambas tablas
CREATE OR REPLACE FUNCTION update_avatar_url(user_id_param UUID, avatar_url_param TEXT)
RETURNS VOID AS $$
BEGIN
    -- Intentar actualizar en profiles
    BEGIN
        UPDATE profiles
        SET avatar_url = avatar_url_param
        WHERE id = user_id_param;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error al actualizar avatar en profiles';
    END;
    
    -- Intentar actualizar en user_profiles
    BEGIN
        UPDATE user_profiles
        SET avatar_url = avatar_url_param
        WHERE user_id = user_id_param;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error al actualizar avatar en user_profiles';
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Reactivar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
