-- Crear tabla de historias
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  avatar_url TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  duration INTEGER NOT NULL DEFAULT 5000,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para ordenamiento
CREATE INDEX IF NOT EXISTS stories_order_idx ON stories("order");

-- Habilitar RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer
CREATE POLICY "Anyone can view stories" ON stories
  FOR SELECT USING (true);

-- Política para que usuarios autenticados puedan gestionar historias
-- OPCIÓN 1: Permitir a cualquier usuario autenticado (temporal)
CREATE POLICY "Authenticated users can manage stories" ON stories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- OPCIÓN 2: Si quieres restringir a admins, primero agrega esta columna a user_profiles:
-- ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
-- Luego descomenta y usa esta política:
/*
CREATE POLICY "Only admins can manage stories" ON stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
*/

-- Crear buckets de storage si no existen
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('stories-avatars', 'stories-avatars', true),
  ('stories-media', 'stories-media', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para avatares
CREATE POLICY "Anyone can view story avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'stories-avatars');

CREATE POLICY "Authenticated users can upload story avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stories-avatars' AND
    auth.uid() IS NOT NULL
  );

-- Políticas de storage para media
CREATE POLICY "Anyone can view story media" ON storage.objects
  FOR SELECT USING (bucket_id = 'stories-media');

CREATE POLICY "Authenticated users can upload story media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stories-media' AND
    auth.uid() IS NOT NULL
  );
