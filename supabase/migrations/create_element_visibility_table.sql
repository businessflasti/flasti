-- Tabla para controlar la visibilidad de elementos en las páginas
CREATE TABLE IF NOT EXISTS element_visibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name TEXT NOT NULL, -- 'dashboard' o 'premium'
  element_key TEXT NOT NULL, -- identificador único del elemento
  element_name TEXT NOT NULL, -- nombre descriptivo
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0, -- para ordenamiento manual
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_name, element_key)
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_element_visibility_page ON element_visibility(page_name);
CREATE INDEX IF NOT EXISTS idx_element_visibility_visible ON element_visibility(is_visible);
CREATE INDEX IF NOT EXISTS idx_element_visibility_order ON element_visibility(display_order);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_element_visibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_element_visibility_updated_at ON element_visibility;
CREATE TRIGGER trigger_update_element_visibility_updated_at
  BEFORE UPDATE ON element_visibility
  FOR EACH ROW
  EXECUTE FUNCTION update_element_visibility_updated_at();

-- Políticas RLS
ALTER TABLE element_visibility ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow read access to all authenticated users"
  ON element_visibility
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden modificar (usando el email del admin)
CREATE POLICY "Allow admin to update visibility"
  ON element_visibility
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'flasti.business@gmail.com'
    )
  );

CREATE POLICY "Allow admin to insert visibility"
  ON element_visibility
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'flasti.business@gmail.com'
    )
  );

-- Insertar elementos por defecto para Header
INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order) VALUES
  ('header', 'logo', 'Logo / Avatar', true, 1),
  ('header', 'page_title', 'Título de Página', true, 2),
  ('header', 'balance_display', 'Display de Balance (Header)', true, 3),
  ('header', 'country_badge', 'Badge de País/Ubicación', true, 4),
  ('header', 'stories', 'Historias/Testimonios', true, 5),
  ('header', 'menu_button', 'Botón de Menú (Móvil)', true, 6)
ON CONFLICT (page_name, element_key) DO NOTHING;

-- Insertar elementos por defecto para Dashboard
INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order) VALUES
  ('dashboard', 'welcome_bonus', 'Bono de Bienvenida', true, 1),
  ('dashboard', 'balance_display', 'Display de Balance', true, 2),
  ('dashboard', 'video_tutorial', 'Video Tutorial', true, 3),
  ('dashboard', 'stat_today', 'Tarjeta: Ganancias de Hoy', true, 4),
  ('dashboard', 'stat_week', 'Tarjeta: Esta Semana', true, 5),
  ('dashboard', 'stat_total', 'Tarjeta: Total Ganado', true, 6),
  ('dashboard', 'stat_completed', 'Tarjeta: Completadas', true, 7),
  ('dashboard', 'offers_section', 'Sección de Microtareas', true, 8)
ON CONFLICT (page_name, element_key) DO NOTHING;

-- Insertar elementos por defecto para Premium
INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order) VALUES
  ('premium', 'dashboard_image', 'Bloque de Imagen Dashboard', true, 1),
  ('premium', 'pricing_card', 'Tarjeta de Pricing', true, 2),
  ('premium', 'testimonials', 'Bloque de Testimonios', true, 3),
  ('premium', 'faq_earnings', 'FAQ: ¿Cuánto dinero puedo ganar?', true, 4),
  ('premium', 'faq_payment', 'FAQ: ¿Por qué debo hacer un pago único?', true, 5),
  ('premium', 'faq_location', 'FAQ: ¿Puedo empezar desde mi ubicación?', true, 6),
  ('premium', 'faq_guarantee', 'FAQ: ¿Cómo me respalda la garantía?', true, 7)
ON CONFLICT (page_name, element_key) DO NOTHING;

COMMENT ON TABLE element_visibility IS 'Control de visibilidad de elementos en las páginas de la plataforma';
