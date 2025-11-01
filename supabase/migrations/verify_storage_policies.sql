-- Verificar y arreglar políticas de storage

-- Ver políticas actuales (ejecuta esto primero para ver qué hay)
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Eliminar todas las políticas existentes de stories
DROP POLICY IF EXISTS "Anyone can view story avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload story avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete story avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view story media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload story media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete story media" ON storage.objects;

-- Recrear políticas para avatares
CREATE POLICY "Public can view story avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories-avatars');

CREATE POLICY "Authenticated can upload story avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'stories-avatars' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can delete story avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'stories-avatars' AND
    auth.role() = 'authenticated'
  );

-- Recrear políticas para media
CREATE POLICY "Public can view story media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories-media');

CREATE POLICY "Authenticated can upload story media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'stories-media' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated can delete story media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'stories-media' AND
    auth.role() = 'authenticated'
  );

-- Verificar que los buckets existan y sean públicos
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('stories-avatars', 'stories-media');
