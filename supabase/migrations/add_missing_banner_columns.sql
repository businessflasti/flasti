-- Script para agregar columnas faltantes a banner_config si ya existe

-- Agregar columna background_gradient si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banner_config' 
        AND column_name = 'background_gradient'
    ) THEN
        ALTER TABLE banner_config 
        ADD COLUMN background_gradient TEXT NOT NULL DEFAULT 'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]';
    END IF;
END $$;

-- Agregar columna background_image si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banner_config' 
        AND column_name = 'background_image'
    ) THEN
        ALTER TABLE banner_config 
        ADD COLUMN background_image TEXT;
    END IF;
END $$;

-- Agregar columna show_separator si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banner_config' 
        AND column_name = 'show_separator'
    ) THEN
        ALTER TABLE banner_config 
        ADD COLUMN show_separator BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Agregar columna logo_url si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banner_config' 
        AND column_name = 'logo_url'
    ) THEN
        ALTER TABLE banner_config 
        ADD COLUMN logo_url TEXT NOT NULL DEFAULT '/logo.svg';
    END IF;
END $$;

-- Agregar columna updated_by si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banner_config' 
        AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE banner_config 
        ADD COLUMN updated_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'banner_config'
ORDER BY ordinal_position;
