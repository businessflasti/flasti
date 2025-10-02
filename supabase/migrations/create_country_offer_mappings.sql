-- Tabla para mapear países de usuarios a países de ofertas
CREATE TABLE IF NOT EXISTS country_offer_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_country VARCHAR(2) NOT NULL, -- País del usuario (ej: AR, PE, MX)
  offer_country VARCHAR(2) NOT NULL, -- País de las ofertas a mostrar (ej: ES, CO, MX)
  is_active BOOLEAN DEFAULT true, -- Activar/desactivar la asignación
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id), -- Admin que creó la asignación
  notes TEXT, -- Notas opcionales sobre por qué se hizo esta asignación
  
  -- Constraint: solo una asignación activa por país de usuario
  UNIQUE(user_country)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_country_mappings_user_country ON country_offer_mappings(user_country);
CREATE INDEX idx_country_mappings_active ON country_offer_mappings(is_active);

-- RLS (Row Level Security)
ALTER TABLE country_offer_mappings ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer las asignaciones activas
CREATE POLICY "Anyone can read active mappings" ON country_offer_mappings
  FOR SELECT USING (is_active = true);

-- Política: Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Only admins can modify mappings" ON country_offer_mappings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_country_mappings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_country_mappings_timestamp
  BEFORE UPDATE ON country_offer_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_country_mappings_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE country_offer_mappings IS 'Mapeo manual de países de usuarios a países de ofertas de CPALead';
COMMENT ON COLUMN country_offer_mappings.user_country IS 'Código ISO de 2 letras del país del usuario';
COMMENT ON COLUMN country_offer_mappings.offer_country IS 'Código ISO de 2 letras del país de las ofertas a mostrar';
COMMENT ON COLUMN country_offer_mappings.is_active IS 'Si está activo, se usa este mapeo; si no, se muestran ofertas del país real';
