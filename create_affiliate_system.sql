-- Sistema de afiliados cerrado para Flasti
-- Este script crea todas las tablas necesarias para el sistema de afiliados

-- Tabla de afiliados
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    affiliate_code TEXT NOT NULL UNIQUE,
    commission_rate DECIMAL NOT NULL DEFAULT 0.30,
    status TEXT NOT NULL DEFAULT 'active',
    total_sales INTEGER NOT NULL DEFAULT 0,
    total_commission DECIMAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de enlaces de afiliados
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    target_url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(affiliate_id, slug)
);

-- Tabla de clics en enlaces de afiliados
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    link_id UUID REFERENCES affiliate_links(id),
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ventas atribuidas a afiliados
CREATE TABLE IF NOT EXISTS affiliate_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    customer_email TEXT NOT NULL,
    order_id TEXT NOT NULL UNIQUE,
    product_id TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    commission_amount DECIMAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos a afiliados
CREATE TABLE IF NOT EXISTS affiliate_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    amount DECIMAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para crear automáticamente un registro de afiliado cuando se crea un usuario
CREATE OR REPLACE FUNCTION create_affiliate_on_user_creation()
RETURNS TRIGGER AS $$
DECLARE
    new_affiliate_code TEXT;
BEGIN
    -- Generar un código de afiliado único basado en el ID del usuario
    new_affiliate_code := 'FL' || substring(NEW.id::text, 1, 8);

    -- Insertar el nuevo afiliado
    INSERT INTO affiliates (user_id, affiliate_code)
    VALUES (NEW.id, new_affiliate_code);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear automáticamente un afiliado cuando se crea un usuario
DROP TRIGGER IF EXISTS create_affiliate_on_user_creation_trigger ON auth.users;
CREATE TRIGGER create_affiliate_on_user_creation_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_affiliate_on_user_creation();

-- Función para actualizar las estadísticas del afiliado cuando se registra una venta
CREATE OR REPLACE FUNCTION update_affiliate_stats(
    affiliate_id_param UUID,
    sale_amount_param DECIMAL,
    commission_amount_param DECIMAL
)
RETURNS VOID AS $$
BEGIN
    UPDATE affiliates
    SET
        total_sales = total_sales + 1,
        total_commission = total_commission + commission_amount_param,
        updated_at = NOW()
    WHERE id = affiliate_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar el contador de clics de un enlace
CREATE OR REPLACE FUNCTION increment_affiliate_link_clicks(link_id_param UUID)
RETURNS VOID AS $$
BEGIN
    -- Verificar si la tabla y la columna existen antes de intentar actualizar
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'clicks'
    ) THEN
        UPDATE affiliate_links
        SET
            clicks = clicks + 1,
            updated_at = NOW()
        WHERE id = link_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar el contador de conversiones de un enlace
CREATE OR REPLACE FUNCTION increment_affiliate_link_conversions(link_id_param UUID)
RETURNS VOID AS $$
BEGIN
    -- Verificar si la tabla y la columna existen antes de intentar actualizar
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'conversions'
    ) THEN
        UPDATE affiliate_links
        SET
            conversions = conversions + 1,
            updated_at = NOW()
        WHERE id = link_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener las estadísticas de un afiliado
CREATE OR REPLACE FUNCTION get_affiliate_stats(affiliate_id_param UUID)
RETURNS TABLE (
    total_clicks BIGINT,
    total_sales BIGINT,
    total_commission DECIMAL,
    conversion_rate DECIMAL
) AS $$
DECLARE
    clicks BIGINT := 0;
    sales BIGINT := 0;
    commission DECIMAL := 0;
BEGIN
    -- Verificar si las tablas existen antes de consultar
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_clicks'
    ) THEN
        -- Verificar si la columna affiliate_id existe
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'affiliate_clicks' AND column_name = 'affiliate_id'
        ) THEN
            -- Obtener total de clics
            SELECT COUNT(*) INTO clicks
            FROM affiliate_clicks
            WHERE affiliate_id = affiliate_id_param;
        END IF;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_sales'
    ) THEN
        -- Verificar si las columnas necesarias existen
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'affiliate_sales' AND column_name = 'affiliate_id'
        ) AND EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'affiliate_sales' AND column_name = 'commission_amount'
        ) AND EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'affiliate_sales' AND column_name = 'status'
        ) THEN
            -- Obtener total de ventas
            SELECT COUNT(*), COALESCE(SUM(commission_amount), 0)
            INTO sales, commission
            FROM affiliate_sales
            WHERE affiliate_id = affiliate_id_param
            AND status = 'approved';
        END IF;
    END IF;

    -- Calcular tasa de conversión
    RETURN QUERY SELECT
        clicks AS total_clicks,
        sales AS total_sales,
        commission AS total_commission,
        CASE WHEN clicks > 0 THEN (sales::DECIMAL / clicks) * 100 ELSE 0 END AS conversion_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de seguridad para las tablas
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payments ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla affiliates
-- Permitir a los usuarios ver sus propios registros de afiliados
CREATE POLICY affiliates_select_policy ON affiliates
    FOR SELECT USING (auth.uid() = user_id);

-- Permitir a los administradores ver todos los registros de afiliados
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliates_admin_select_policy ON affiliates
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
        EXECUTE 'CREATE POLICY affiliates_admin_role_select_policy ON affiliates
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;

-- Políticas para la tabla affiliate_links
-- Permitir a los usuarios ver sus propios enlaces de afiliados
DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_links_select_policy ON affiliate_links
                 FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

-- Permitir a los administradores ver todos los enlaces de afiliados
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_links_admin_select_policy ON affiliate_links
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
        EXECUTE 'CREATE POLICY affiliate_links_admin_role_select_policy ON affiliate_links
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;

DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_links_insert_policy ON affiliate_links
                 FOR INSERT WITH CHECK (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_links_update_policy ON affiliate_links
                 FOR UPDATE USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_links'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_links' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_links_delete_policy ON affiliate_links
                 FOR DELETE USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

-- Políticas para la tabla affiliate_clicks (solo lectura para usuarios normales)
-- Permitir a los usuarios ver sus propios clics de afiliados
DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_clicks'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_clicks' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_clicks_select_policy ON affiliate_clicks
                 FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

-- Permitir a los administradores ver todos los clics de afiliados
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_clicks_admin_select_policy ON affiliate_clicks
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
        EXECUTE 'CREATE POLICY affiliate_clicks_admin_role_select_policy ON affiliate_clicks
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;

-- Políticas para la tabla affiliate_sales (solo lectura para usuarios normales)
-- Permitir a los usuarios ver sus propias ventas de afiliados
DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_sales'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_sales' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_sales_select_policy ON affiliate_sales
                 FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

-- Permitir a los administradores ver todas las ventas de afiliados
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_sales_admin_select_policy ON affiliate_sales
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
        EXECUTE 'CREATE POLICY affiliate_sales_admin_role_select_policy ON affiliate_sales
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;

-- Políticas para la tabla affiliate_payments (solo lectura para usuarios normales)
-- Permitir a los usuarios ver sus propios pagos de afiliados
DO $$
BEGIN
    -- Verificar si las tablas y columnas existen antes de crear la política
    IF EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliate_payments'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_payments' AND column_name = 'affiliate_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'affiliates'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_payments_select_policy ON affiliate_payments
                 FOR SELECT USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()))';
    END IF;
END
$$;

-- Permitir a los administradores ver todos los pagos de afiliados
-- Nota: Ajusta esta política según tu estructura de base de datos para identificar administradores
-- Opción 1: Si tienes una tabla user_profiles con una columna is_admin
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
    ) THEN
        EXECUTE 'CREATE POLICY affiliate_payments_admin_select_policy ON affiliate_payments
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
        EXECUTE 'CREATE POLICY affiliate_payments_admin_role_select_policy ON affiliate_payments
                 FOR SELECT USING (auth.uid() IN (SELECT user_id FROM user_profiles WHERE role = ''admin''))';
    END IF;
END
$$;
