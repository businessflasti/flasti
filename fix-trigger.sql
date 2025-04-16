-- Eliminar el trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear la función que manejará la creación automática de perfiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe un perfil para este usuario
  PERFORM id FROM public.profiles WHERE id = NEW.id;
  
  -- Si no existe, crear uno nuevo
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, name, level, balance, created_at)
    VALUES (
      NEW.id,
      NEW.email,
      split_part(NEW.email, '@', 1),
      1,
      0,
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que se activará cuando se cree un nuevo usuario
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Desactivar temporalmente RLS para permitir la inserción durante el registro
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Eliminar las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción de perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Permitir lectura de perfiles propios" ON public.profiles;
DROP POLICY IF EXISTS "Permitir actualización de perfiles propios" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserción anónima durante registro" ON public.profiles;
