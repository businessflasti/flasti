-- Script para desactivar RLS en las tablas de afiliados

-- Desactivar RLS para affiliate_apps
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE affiliate_apps DISABLE ROW LEVEL SECURITY';
            RAISE NOTICE 'RLS desactivado para affiliate_apps';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al desactivar RLS para affiliate_apps: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'La tabla affiliate_apps no existe';
    END IF;
END
$$;

-- Desactivar RLS para affiliate_commission_rates
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
    ) THEN
        BEGIN
            EXECUTE 'ALTER TABLE affiliate_commission_rates DISABLE ROW LEVEL SECURITY';
            RAISE NOTICE 'RLS desactivado para affiliate_commission_rates';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al desactivar RLS para affiliate_commission_rates: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'La tabla affiliate_commission_rates no existe';
    END IF;
END
$$;
