-- Crear tabla para los bloques de noticias CTA
CREATE TABLE IF NOT EXISTS public.cta_news_blocks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar los 3 bloques por defecto
INSERT INTO public.cta_news_blocks (title, description, image_url, display_order) VALUES
('Octubre 2025: Más microtareas disponibles', 'Nuevas tareas se están sumando al ecosistema de Flasti este mes. Eso significa más microtareas disponibles a diario para todos los usuarios registrados', '/images/principal/bannerdotttt1.png', 1),
('Nueva función activa', 'Ya está disponible la nueva modalidad de tareas rápidas. Se pueden completar en menos de tres minutos, desde cualquier dispositivo', '/images/principal/bannerdot2.png', 2),
('+4.800 usuarios nuevos esta semana', 'Porque unidos somos más. Esta semana, miles de personas comenzaron a trabajar desde flasti en todo el mundo', '/images/principal/banner3.png', 3);

-- Habilitar RLS
ALTER TABLE public.cta_news_blocks ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Cualquiera puede ver los bloques CTA activos"
  ON public.cta_news_blocks
  FOR SELECT
  USING (is_active = true);

-- Política para que solo admins puedan modificar
CREATE POLICY "Solo admins pueden modificar bloques CTA"
  ON public.cta_news_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_cta_news_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cta_news_blocks_updated_at
  BEFORE UPDATE ON public.cta_news_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_cta_news_blocks_updated_at();
