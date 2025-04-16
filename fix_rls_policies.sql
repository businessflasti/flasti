-- Habilitar RLS en las tablas si no está habilitado
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS profiles_select_policy ON profiles;
DROP POLICY IF EXISTS profiles_insert_policy ON profiles;
DROP POLICY IF EXISTS profiles_update_policy ON profiles;
DROP POLICY IF EXISTS profiles_delete_policy ON profiles;

DROP POLICY IF EXISTS user_profiles_select_policy ON user_profiles;
DROP POLICY IF EXISTS user_profiles_insert_policy ON user_profiles;
DROP POLICY IF EXISTS user_profiles_update_policy ON user_profiles;
DROP POLICY IF EXISTS user_profiles_delete_policy ON user_profiles;

-- Crear políticas para la tabla profiles
-- Política para SELECT: cualquier usuario autenticado puede ver perfiles
CREATE POLICY profiles_select_policy ON profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para INSERT: un usuario solo puede insertar su propio perfil
CREATE POLICY profiles_insert_policy ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para UPDATE: un usuario solo puede actualizar su propio perfil
CREATE POLICY profiles_update_policy ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política para DELETE: un usuario solo puede eliminar su propio perfil
CREATE POLICY profiles_delete_policy ON profiles
    FOR DELETE USING (auth.uid() = id);

-- Crear políticas para la tabla user_profiles
-- Política para SELECT: cualquier usuario autenticado puede ver perfiles
CREATE POLICY user_profiles_select_policy ON user_profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Política para INSERT: un usuario solo puede insertar su propio perfil
CREATE POLICY user_profiles_insert_policy ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: un usuario solo puede actualizar su propio perfil
CREATE POLICY user_profiles_update_policy ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE: un usuario solo puede eliminar su propio perfil
CREATE POLICY user_profiles_delete_policy ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Configurar políticas para el bucket de storage 'avatars'
-- Nota: Esto debe ejecutarse en la consola de SQL de Supabase
-- ya que las políticas de storage se manejan de manera diferente

-- Ejemplo de política para el bucket 'avatars' (esto es pseudocódigo)
-- CREATE POLICY "Usuarios pueden ver avatares" ON storage.objects
--     FOR SELECT USING (bucket_id = 'avatars');

-- CREATE POLICY "Usuarios pueden subir sus propios avatares" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'avatars' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- CREATE POLICY "Usuarios pueden actualizar sus propios avatares" ON storage.objects
--     FOR UPDATE USING (
--         bucket_id = 'avatars' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- CREATE POLICY "Usuarios pueden eliminar sus propios avatares" ON storage.objects
--     FOR DELETE USING (
--         bucket_id = 'avatars' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );
