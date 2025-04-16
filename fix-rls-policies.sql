-- Eliminar las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;

-- Desactivar temporalmente RLS para permitir la inserción durante el registro
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Crear una política que permita a los usuarios autenticados insertar perfiles
CREATE POLICY "Permitir inserción de perfiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Crear una política que permita a los usuarios leer su propio perfil
CREATE POLICY "Permitir lectura de perfiles propios" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Crear una política que permita a los usuarios actualizar su propio perfil
CREATE POLICY "Permitir actualización de perfiles propios" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Crear una política que permita a los usuarios anónimos insertar perfiles durante el registro
CREATE POLICY "Permitir inserción anónima durante registro" ON public.profiles
  FOR INSERT TO anon
  WITH CHECK (true);

-- Volver a activar RLS con las nuevas políticas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
