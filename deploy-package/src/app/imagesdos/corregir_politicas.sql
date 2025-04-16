-- Desactivar temporalmente RLS para diagnóstico
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE images DISABLE ROW LEVEL SECURITY;

-- Crear una política que permita a cualquiera insertar en profiles (solo para diagnóstico)
DROP POLICY IF EXISTS "Permitir inserción en profiles" ON profiles;
CREATE POLICY "Permitir inserción en profiles"
    ON profiles FOR INSERT
    WITH CHECK (true);

-- Crear una política que permita a cualquiera seleccionar de profiles (solo para diagnóstico)
DROP POLICY IF EXISTS "Permitir selección en profiles" ON profiles;
CREATE POLICY "Permitir selección en profiles"
    ON profiles FOR SELECT
    USING (true);

-- Crear una política que permita a cualquiera actualizar profiles (solo para diagnóstico)
DROP POLICY IF EXISTS "Permitir actualización en profiles" ON profiles;
CREATE POLICY "Permitir actualización en profiles"
    ON profiles FOR UPDATE
    USING (true);

-- Verificar si el trigger existe
SELECT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
) AS trigger_exists;

-- Verificar si la función existe
SELECT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'handle_new_user'
) AS function_exists;

-- Mostrar la definición de la función
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Verificar permisos en la tabla profiles
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'profiles';

-- Verificar estructura de la tabla profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Habilitar RLS nuevamente (comentar estas líneas si quieres mantener RLS desactivado para pruebas)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE images ENABLE ROW LEVEL SECURITY;
