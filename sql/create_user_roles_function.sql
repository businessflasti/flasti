-- Función para crear la tabla user_roles si no existe
CREATE OR REPLACE FUNCTION public.create_user_roles_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'user_roles'
  ) THEN
    -- Crear la tabla si no existe
    CREATE TABLE public.user_roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Crear índice para búsquedas rápidas por user_id
    CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

    -- Establecer permisos
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

    -- Política para permitir a los usuarios ver sus propios roles
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles
      FOR SELECT
      USING (auth.uid() = user_id);

    -- Política para permitir a los administradores ver todos los roles
    CREATE POLICY "Admins can view all roles"
      ON public.user_roles
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );

    -- Política para permitir a los administradores insertar roles
    CREATE POLICY "Admins can insert roles"
      ON public.user_roles
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );

    -- Política para permitir a los administradores actualizar roles
    CREATE POLICY "Admins can update roles"
      ON public.user_roles
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );

    -- Política para permitir a los administradores eliminar roles
    CREATE POLICY "Admins can delete roles"
      ON public.user_roles
      FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
        )
      );
      
    -- Política especial para permitir a cualquier usuario autenticado crear su propio rol
    -- (necesario para la página de acceso administrativo)
    CREATE POLICY "Users can create their own role"
      ON public.user_roles
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    -- Política especial para permitir a cualquier usuario autenticado actualizar su propio rol
    -- (necesario para la página de acceso administrativo)
    CREATE POLICY "Users can update their own role"
      ON public.user_roles
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END;
$$;
