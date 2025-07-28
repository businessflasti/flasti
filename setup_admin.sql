-- Script para configurar administradores en el sistema
-- Ejecutar este SQL en Supabase para crear la tabla de roles y configurar administradores

-- 1. Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role)
);

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 3. Configurar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de seguridad para roles
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id OR 
           EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
CREATE POLICY user_roles_insert_policy ON public.user_roles
    FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
CREATE POLICY user_roles_update_policy ON public.user_roles
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));

DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;
CREATE POLICY user_roles_delete_policy ON public.user_roles
    FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));

-- 5. CONFIGURAR PRIMER ADMINISTRADOR
-- IMPORTANTE: Reemplaza 'TU_USER_ID_AQUI' con tu ID de usuario real

-- Para encontrar tu ID de usuario, ejecuta primero esta consulta:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Luego reemplaza el ID y ejecuta esta línea:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('TU_USER_ID_AQUI', 'super_admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Verificar que se creó correctamente
SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role IN ('admin', 'super_admin')
ORDER BY ur.created_at DESC;