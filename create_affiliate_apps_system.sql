-- Sistema de apps promocionables para afiliados
-- Este script crea las tablas necesarias para gestionar las apps que los afiliados pueden promocionar

-- Tabla de apps promocionables
CREATE TABLE IF NOT EXISTS affiliate_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    hotmart_offer_code TEXT NOT NULL UNIQUE,
    base_price DECIMAL NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comisiones por nivel
CREATE TABLE IF NOT EXISTS affiliate_commission_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id UUID REFERENCES affiliate_apps(id) NOT NULL,
    user_level INTEGER NOT NULL,
    commission_rate DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(app_id, user_level)
);

-- Insertar algunas apps de ejemplo
INSERT INTO affiliate_apps (name, description, image_url, hotmart_offer_code, base_price)
VALUES
    ('Flasti Images', 'Genera imágenes con IA', '/images/apps/flasti-images.png', 'mz63zpyh', 49.99),
    ('Flasti AI', 'Asistente de IA avanzado', '/images/apps/flasti-ai.png', 'abcdefg', 39.99);

-- Insertar comisiones por nivel para cada app
-- Flasti Images
INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
VALUES
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 1, 0.30),
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 2, 0.35),
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti Images'), 3, 0.40);

-- Flasti AI
INSERT INTO affiliate_commission_rates (app_id, user_level, commission_rate)
VALUES
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 1, 0.30),
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 2, 0.35),
    ((SELECT id FROM affiliate_apps WHERE name = 'Flasti AI'), 3, 0.40);

-- Función para obtener la tasa de comisión según el nivel del usuario
CREATE OR REPLACE FUNCTION get_commission_rate(app_id_param UUID, user_level_param INTEGER)
RETURNS DECIMAL AS $$
DECLARE
    commission_rate DECIMAL;
BEGIN
    -- Obtener la tasa de comisión para el nivel específico
    SELECT acr.commission_rate INTO commission_rate
    FROM affiliate_commission_rates acr
    WHERE acr.app_id = app_id_param AND acr.user_level = user_level_param;

    -- Si no se encuentra una tasa para el nivel específico, usar la del nivel 1
    IF commission_rate IS NULL THEN
        SELECT acr.commission_rate INTO commission_rate
        FROM affiliate_commission_rates acr
        WHERE acr.app_id = app_id_param AND acr.user_level = 1;
    END IF;

    RETURN commission_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de seguridad para las tablas
ALTER TABLE affiliate_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commission_rates ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla affiliate_apps (solo lectura para usuarios normales)
-- Permitir a todos los usuarios ver las apps activas
CREATE POLICY affiliate_apps_select_policy ON affiliate_apps
    FOR SELECT USING (is_active = true);

-- Permitir a los administradores ver todas las apps (activas e inactivas)
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_apps_admin_select_policy ON affiliate_apps
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE is_admin = true))';
    END IF;
END
$$;

-- Opción 2: Si tienes una tabla user_profiles con una columna role
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'role'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_apps_admin_role_select_policy ON affiliate_apps
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;

-- Políticas para la tabla affiliate_commission_rates (solo lectura para usuarios normales)
DO $$
BEGIN
    -- Verificar si la tabla existe antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_commission_rates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_commission_rates_select_policy ON affiliate_commission_rates
                 FOR SELECT USING (true)';
    END IF;
END
$$;
