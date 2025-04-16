-- Script para verificar los datos en las tablas de afiliados

-- Verificar si las tablas existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'affiliate%';

-- Verificar datos en affiliate_apps
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Contando registros en affiliate_apps...';
        EXECUTE 'SELECT COUNT(*) FROM affiliate_apps';

        RAISE NOTICE 'Mostrando registros en affiliate_apps...';
        EXECUTE 'SELECT * FROM affiliate_apps';
    ELSE
        RAISE NOTICE 'La tabla affiliate_apps no existe';
    END IF;
END
$$;

-- Verificar datos en affiliate_commission_rates
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Contando registros en affiliate_commission_rates...';
        EXECUTE 'SELECT COUNT(*) FROM affiliate_commission_rates';
    ELSE
        RAISE NOTICE 'La tabla affiliate_commission_rates no existe';
    END IF;
END
$$;

-- Verificar la relación entre apps y comisiones
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_apps' AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'affiliate_commission_rates' AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'Mostrando relación entre apps y comisiones...';
        EXECUTE '
            SELECT
                a.id AS app_id,
                a.name AS app_name,
                a.is_active,
                cr.user_level,
                cr.commission_rate
            FROM
                affiliate_apps a
            LEFT JOIN
                affiliate_commission_rates cr ON a.id = cr.app_id
            ORDER BY
                a.name, cr.user_level
        ';
    ELSE
        RAISE NOTICE 'No se pueden mostrar las relaciones porque alguna de las tablas no existe';
    END IF;
END
$$;
