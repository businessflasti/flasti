-- Script para resetear y corregir la base de datos de Supabase

-- 1. Desactivar temporalmente los triggers que podrían interferir
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
ALTER TABLE auth.users DISABLE TRIGGER create_affiliate_on_user_creation_trigger;

-- 2. Limpiar las tablas de perfiles para evitar conflictos
TRUNCATE public.profiles CASCADE;
TRUNCATE public.user_profiles CASCADE;

-- 3. Corregir las políticas de seguridad para la tabla profiles
DROP POLICY IF EXISTS "Allow all operations on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Permitir actualización de perfiles propios" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción anónima durante registro" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción de perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Permitir lectura de perfiles propios" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Crear políticas simplificadas y correctas
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- 4. Corregir la función handle_new_user para que sea más robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Insertar en profiles de manera segura
    INSERT INTO public.profiles (id, email, created_at, level, balance)
    VALUES (NEW.id, NEW.email, NOW(), 1, 0)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Reactivar los triggers
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
-- Mantener desactivado el trigger de afiliados hasta que se necesite
-- ALTER TABLE auth.users ENABLE TRIGGER create_affiliate_on_user_creation_trigger;

-- 6. Verificar y corregir la configuración de autenticación
UPDATE auth.config
SET 
    site_url = 'https://flasti.com',
    mailer_autoconfirm = true,
    disable_signup = false;

-- 7. Crear un usuario administrador para pruebas (opcional)
-- Esto solo crea el perfil, no el usuario en auth.users
INSERT INTO public.profiles (id, email, name, level, balance, created_at)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'admin@flasti.com', 'Admin', 3, 100, NOW())
ON CONFLICT (id) DO NOTHING;
