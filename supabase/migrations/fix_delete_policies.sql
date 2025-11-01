-- Agregar políticas de DELETE para storage

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Authenticated users can delete story avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete story media" ON storage.objects;

-- Permitir eliminar avatares
CREATE POLICY "Authenticated users can delete story avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'stories-avatars' AND
    auth.uid() IS NOT NULL
  );

-- Permitir eliminar media
CREATE POLICY "Authenticated users can delete story media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'stories-media' AND
    auth.uid() IS NOT NULL
  );

-- Asegurar que la política de DELETE en stories funcione
DROP POLICY IF EXISTS "Authenticated users can manage stories" ON stories;
DROP POLICY IF EXISTS "Authenticated users can insert stories" ON stories;
DROP POLICY IF EXISTS "Authenticated users can update stories" ON stories;
DROP POLICY IF EXISTS "Authenticated users can delete stories" ON stories;

CREATE POLICY "Authenticated users can insert stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update stories" ON stories
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete stories" ON stories
  FOR DELETE USING (auth.uid() IS NOT NULL);
