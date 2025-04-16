-- Políticas para el bucket 'avatars'
-- Estas políticas deben ejecutarse en la consola SQL de Supabase

-- Permitir a cualquier usuario ver avatares
CREATE POLICY "Usuarios pueden ver avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Permitir a usuarios autenticados subir sus propios avatares
CREATE POLICY "Usuarios pueden subir sus propios avatares"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
);

-- Permitir a usuarios autenticados actualizar sus propios avatares
CREATE POLICY "Usuarios pueden actualizar sus propios avatares"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
);

-- Permitir a usuarios autenticados eliminar sus propios avatares
CREATE POLICY "Usuarios pueden eliminar sus propios avatares"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
);
