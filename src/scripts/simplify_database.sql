-- Script para simplificar la estructura de la base de datos

-- 1. Crear una tabla unificada de perfiles si no existe
CREATE TABLE IF NOT EXISTS public.unified_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    level INTEGER DEFAULT 1,
    balance NUMERIC DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS en la tabla unificada
ALTER TABLE public.unified_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad para la tabla unificada
CREATE POLICY "Enable read access for all users" ON public.unified_profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.unified_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.unified_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON public.unified_profiles
    FOR DELETE USING (auth.uid() = id);

-- 4. Migrar datos de las tablas existentes a la tabla unificada
INSERT INTO public.unified_profiles (id, email, name, phone, level, balance, avatar_url, created_at)
SELECT 
    p.id, 
    p.email, 
    p.name, 
    p.phone, 
    p.level, 
    p.balance, 
    p.avatar_url, 
    p.created_at
FROM 
    public.profiles p
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.unified_profiles (id, email, name, phone, level, balance, avatar_url, created_at)
SELECT 
    up.user_id, 
    up.email, 
    NULL, 
    up.phone, 
    CASE WHEN up.level ~ E'^\\d+$' THEN up.level::INTEGER ELSE 1 END, 
    up.balance, 
    up.avatar_url, 
    up.created_at
FROM 
    public.user_profiles up
ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(unified_profiles.email, EXCLUDED.email),
    name = COALESCE(unified_profiles.name, EXCLUDED.name),
    phone = COALESCE(unified_profiles.phone, EXCLUDED.phone),
    level = COALESCE(unified_profiles.level, EXCLUDED.level),
    balance = COALESCE(unified_profiles.balance, EXCLUDED.balance),
    avatar_url = COALESCE(unified_profiles.avatar_url, EXCLUDED.avatar_url),
    created_at = LEAST(unified_profiles.created_at, EXCLUDED.created_at);

-- 5. Crear una función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user_unified()
RETURNS trigger AS $$
BEGIN
    -- Insertar en unified_profiles de manera segura
    INSERT INTO public.unified_profiles (id, email, created_at, level, balance)
    VALUES (NEW.id, NEW.email, NOW(), 1, 0)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear un trigger para la tabla auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_unified ON auth.users;
CREATE TRIGGER on_auth_user_created_unified
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_unified();

-- 7. Crear una vista para mantener compatibilidad con el código existente
CREATE OR REPLACE VIEW public.profiles_view AS
SELECT 
    id, 
    email, 
    name, 
    phone, 
    level, 
    balance, 
    avatar_url, 
    created_at
FROM 
    public.unified_profiles;

-- 8. Crear funciones para actualizar el perfil
CREATE OR REPLACE FUNCTION public.update_profile(
    user_id_param UUID,
    name_param TEXT DEFAULT NULL,
    phone_param TEXT DEFAULT NULL,
    avatar_url_param TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Actualizar el perfil
    UPDATE public.unified_profiles
    SET
        name = COALESCE(name_param, name),
        phone = COALESCE(phone_param, phone),
        avatar_url = COALESCE(avatar_url_param, avatar_url),
        updated_at = NOW()
    WHERE id = user_id_param;
    
    -- Devolver resultado
    SELECT jsonb_build_object(
        'success', TRUE,
        'message', 'Perfil actualizado correctamente'
    ) INTO result;
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', FALSE,
        'error', SQLERRM,
        'message', 'Error al actualizar perfil'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
