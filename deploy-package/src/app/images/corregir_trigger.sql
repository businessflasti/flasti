-- Script para corregir el trigger de creación de perfiles
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- 1. Primero, desactivar temporalmente RLS para facilitar la depuración
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.images DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar el trigger existente si hay alguno
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Eliminar la función existente
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Crear una nueva función mejorada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name_val TEXT;
  is_premium_val BOOLEAN;
BEGIN
  -- Extraer valores de los metadatos con manejo de nulos
  full_name_val := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Intentar convertir is_premium a boolean, con valor predeterminado FALSE
  BEGIN
    is_premium_val := (NEW.raw_user_meta_data->>'is_premium')::BOOLEAN;
  EXCEPTION WHEN OTHERS THEN
    is_premium_val := FALSE;
  END;
  
  -- Insertar en la tabla profiles con manejo de errores
  BEGIN
    INSERT INTO public.profiles (id, full_name, email, is_premium, image_count)
    VALUES (
      NEW.id,
      full_name_val,
      NEW.email,
      is_premium_val,
      0
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al insertar perfil: %', SQLERRM;
    -- No propagamos el error para que el registro del usuario continúe
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear un nuevo trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar que la función existe
SELECT EXISTS(
  SELECT 1 
  FROM pg_proc 
  WHERE proname = 'handle_new_user'
) AS function_exists;

-- 7. Verificar que el trigger existe
SELECT EXISTS(
  SELECT 1 
  FROM pg_trigger 
  WHERE tgname = 'on_auth_user_created'
) AS trigger_exists;

-- 8. Crear una política que permita a todos los usuarios insertar en profiles
DROP POLICY IF EXISTS "Permitir inserción en profiles" ON public.profiles;
CREATE POLICY "Permitir inserción en profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- 9. Crear una política que permita a todos los usuarios seleccionar de profiles
DROP POLICY IF EXISTS "Permitir selección en profiles" ON public.profiles;
CREATE POLICY "Permitir selección en profiles"
ON public.profiles
FOR SELECT
USING (true);

-- 10. Volver a habilitar RLS pero con políticas más permisivas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
