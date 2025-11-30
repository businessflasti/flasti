-- Tabla para ofertas personalizadas (independientes de CPALead)
CREATE TABLE IF NOT EXISTS public.custom_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  -- Campos para el contenido del modal
  modal_title TEXT NOT NULL DEFAULT '¡Tu primera tarea!',
  modal_subtitle TEXT NOT NULL DEFAULT 'Escucha el audio y escribe las 5 palabras que se mencionan',
  audio_url TEXT NOT NULL DEFAULT '/audios/bienvenida.mp3',
  input_placeholder TEXT DEFAULT 'Ejemplo: PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5',
  input_label TEXT DEFAULT 'Escribe las 5 palabras (separadas por espacios):',
  help_text TEXT DEFAULT 'Las palabras deben estar en el orden mencionado en el audio',
  partner_name TEXT DEFAULT 'StudioVA',
  partner_logo TEXT,
  objective TEXT DEFAULT 'Ayúdanos a mejorar nuestros servicios completando esta tarea',
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0, -- Para ordenar (1 o 2)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agregar columnas nuevas si no existen (para tablas existentes)
DO $$ 
BEGIN
  -- Eliminar columna link_url si existe (ya no se usa)
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'custom_offers' 
             AND column_name = 'link_url') THEN
    ALTER TABLE public.custom_offers DROP COLUMN link_url;
  END IF;

  -- Agregar modal_title si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'modal_title') THEN
    ALTER TABLE public.custom_offers ADD COLUMN modal_title TEXT NOT NULL DEFAULT '¡Tu primera tarea!';
  END IF;

  -- Agregar modal_subtitle si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'modal_subtitle') THEN
    ALTER TABLE public.custom_offers ADD COLUMN modal_subtitle TEXT NOT NULL DEFAULT 'Escucha el audio y escribe las 5 palabras que se mencionan';
  END IF;

  -- Agregar audio_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'audio_url') THEN
    ALTER TABLE public.custom_offers ADD COLUMN audio_url TEXT NOT NULL DEFAULT '/audios/bienvenida.mp3';
  END IF;

  -- Agregar input_placeholder si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'input_placeholder') THEN
    ALTER TABLE public.custom_offers ADD COLUMN input_placeholder TEXT DEFAULT 'Ejemplo: PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5';
  END IF;

  -- Agregar input_label si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'input_label') THEN
    ALTER TABLE public.custom_offers ADD COLUMN input_label TEXT DEFAULT 'Escribe las 5 palabras (separadas por espacios):';
  END IF;

  -- Agregar help_text si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'help_text') THEN
    ALTER TABLE public.custom_offers ADD COLUMN help_text TEXT DEFAULT 'Las palabras deben estar en el orden mencionado en el audio';
  END IF;

  -- Agregar partner_name si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'partner_name') THEN
    ALTER TABLE public.custom_offers ADD COLUMN partner_name TEXT DEFAULT 'StudioVA';
  END IF;

  -- Agregar partner_logo si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'partner_logo') THEN
    ALTER TABLE public.custom_offers ADD COLUMN partner_logo TEXT;
  END IF;

  -- Agregar objective si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'custom_offers' 
                 AND column_name = 'objective') THEN
    ALTER TABLE public.custom_offers ADD COLUMN objective TEXT DEFAULT 'Ayúdanos a mejorar nuestros servicios completando esta tarea';
  END IF;
END $$;

-- Índice para ordenar por posición
CREATE INDEX IF NOT EXISTS idx_custom_offers_position ON public.custom_offers(position);
CREATE INDEX IF NOT EXISTS idx_custom_offers_active ON public.custom_offers(is_active);

-- Políticas RLS
ALTER TABLE public.custom_offers ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Todos pueden ver ofertas activas" ON public.custom_offers;
DROP POLICY IF EXISTS "Solo admins pueden gestionar ofertas" ON public.custom_offers;

-- Todos pueden ver las ofertas activas
CREATE POLICY "Todos pueden ver ofertas activas" ON public.custom_offers
  FOR SELECT USING (is_active = true);

-- Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Solo admins pueden gestionar ofertas" ON public.custom_offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_custom_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS update_custom_offers_updated_at ON public.custom_offers;

CREATE TRIGGER update_custom_offers_updated_at
  BEFORE UPDATE ON public.custom_offers
  FOR EACH ROW EXECUTE FUNCTION update_custom_offers_updated_at();

-- Limpiar ofertas existentes y crear las 2 ofertas predeterminadas
DELETE FROM public.custom_offers;

-- Insertar 2 ofertas de ejemplo
INSERT INTO public.custom_offers (
  title, 
  description, 
  amount, 
  image_url, 
  modal_title, 
  modal_subtitle, 
  audio_url, 
  input_placeholder, 
  input_label, 
  help_text, 
  is_active, 
  position
)
VALUES 
  (
    'Audio a texto', 
    'Escucha y escribe las palabras', 
    1.50, 
    '/images/offer-placeholder.png', 
    '¡Tu primera tarea!', 
    'Escucha el audio y escribe las 5 palabras que se mencionan', 
    '/audios/bienvenida.mp3', 
    'Ejemplo: PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5', 
    'Escribe las 5 palabras (separadas por espacios):', 
    'Las palabras deben estar en el orden mencionado en el audio', 
    true, 
    1
  ),
  (
    'Oferta Personalizada 2', 
    'Otra oportunidad para generar ingresos', 
    2.00, 
    '/images/offer-placeholder.png', 
    '¡Segunda tarea!', 
    'Completa esta tarea para ganar más', 
    '/audios/bienvenida.mp3', 
    'Escribe tu respuesta aquí', 
    'Respuesta:', 
    'Sigue las instrucciones del audio', 
    true, 
    2
  );
