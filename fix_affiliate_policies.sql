-- Script para verificar y corregir las políticas de seguridad de las tablas de afiliados

-- Verificar si la tabla affiliate_apps tiene RLS habilitado y crear política permisiva
DO $$
BEGIN
    -- Verificar si la tabla existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) THEN
        -- Eliminar políticas existentes (si las hay)
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS affiliate_apps_all_access ON affiliate_apps';
            RAISE NOTICE 'Política anterior eliminada para affiliate_apps';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al eliminar política: %', SQLERRM;
        END;

        -- Crear política permisiva
        BEGIN
            EXECUTE 'CREATE POLICY affiliate_apps_all_access ON affiliate_apps FOR ALL USING (true)';
            RAISE NOTICE 'Política permisiva creada para affiliate_apps';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al crear política: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'La tabla affiliate_apps no existe';
    END IF;
END
$$;

-- Verificar si la tabla affiliate_commission_rates tiene RLS habilitado y crear política permisiva
DO $$
BEGIN
    -- Verificar si la tabla existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
    ) THEN
        -- Eliminar políticas existentes (si las hay)
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS affiliate_commission_rates_all_access ON affiliate_commission_rates';
            RAISE NOTICE 'Política anterior eliminada para affiliate_commission_rates';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al eliminar política: %', SQLERRM;
        END;

        -- Crear política permisiva
        BEGIN
            EXECUTE 'CREATE POLICY affiliate_commission_rates_all_access ON affiliate_commission_rates FOR ALL USING (true)';
            RAISE NOTICE 'Política permisiva creada para affiliate_commission_rates';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al crear política: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'La tabla affiliate_commission_rates no existe';
    END IF;
END
$$;

-- Desactivar temporalmente RLS para las tablas si es necesario
-- Esto es útil para depuración, pero debe volver a habilitarse en producción
-- ALTER TABLE affiliate_apps DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE affiliate_commission_rates DISABLE ROW LEVEL SECURITY;

-- Asegurarse de que RLS esté habilitado para las tablas
DO $$
BEGIN
    -- Habilitar RLS para affiliate_apps si existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE affiliate_apps ENABLE ROW LEVEL SECURITY';
            RAISE NOTICE 'RLS habilitado para affiliate_apps';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al habilitar RLS para affiliate_apps: %', SQLERRM;
        END;
    END IF;

    -- Habilitar RLS para affiliate_commission_rates si existe
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE affiliate_commission_rates ENABLE ROW LEVEL SECURITY';
            RAISE NOTICE 'RLS habilitado para affiliate_commission_rates';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al habilitar RLS para affiliate_commission_rates: %', SQLERRM;
        END;
    END IF;
END
$$;
