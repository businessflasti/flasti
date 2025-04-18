-- Script corregido para resetear y corregir la base de datos de Supabase

-- 1. Desactivar temporalmente los triggers que podrían interferir
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_affiliate_on_user_creation_trigger') THEN
    ALTER TABLE auth.users DISABLE TRIGGER create_affiliate_on_user_creation_trigger;
  END IF;
END
$$;

-- 2. Limpiar las tablas de perfiles para evitar conflictos
TRUNCATE public.profiles CASCADE;

-- Verificar si la tabla user_profiles existe antes de truncarla
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
    EXECUTE 'TRUNCATE public.user_profiles CASCADE';
  END IF;
END
$$;

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
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON public.profiles;

-- Crear políticas simplificadas y correctas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable read access for all users') THEN
    CREATE POLICY "Enable read access for all users" ON public.profiles
      FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable insert for authenticated users only') THEN
    CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable update for users based on id') THEN
    CREATE POLICY "Enable update for users based on id" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable delete for users based on id') THEN
    CREATE POLICY "Enable delete for users based on id" ON public.profiles
      FOR DELETE USING (auth.uid() = id);
  END IF;
END
$$;

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
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
  END IF;
  
  -- Mantener desactivado el trigger de afiliados hasta que se necesite
  -- IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_affiliate_on_user_creation_trigger') THEN
  --   ALTER TABLE auth.users ENABLE TRIGGER create_affiliate_on_user_creation_trigger;
  -- END IF;
END
$$;
