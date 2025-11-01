-- Crear bucket para videos si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de videos

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete videos" ON storage.objects;

-- Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Permitir subida solo a admins
CREATE POLICY "Admin can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' 
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Permitir actualización solo a admins
CREATE POLICY "Admin can update videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Permitir eliminación solo a admins
CREATE POLICY "Admin can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Verificar que se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'videos';
