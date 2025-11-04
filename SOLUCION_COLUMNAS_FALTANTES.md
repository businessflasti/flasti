# Solución: Columnas Faltantes en banner_config

## 🔴 Error Actual

```
Error al actualizar la configuración: Could not find the 'background_gradient' column of 'banner_config' in the schema cache
```

---

## 🔍 Causa

La tabla `banner_config` existe pero **le faltan columnas**. Esto puede pasar si:
1. Se creó la tabla con una versión anterior de la migración
2. La migración no se ejecutó completamente
3. Se creó la tabla manualmente sin todas las columnas

---

## ✅ Solución en 2 Pasos

### **Paso 1: Verificar Estructura Actual**

Ejecuta este SQL en Supabase SQL Editor para ver qué columnas tienes:

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'banner_config'
ORDER BY ordinal_position;
```

---

### **Paso 2: Agregar Columnas Faltantes**

Ejecuta este script completo en Supabase SQL Editor:

```sql
-- Script para agregar columnas faltantes a banner_config

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

-- Agregar política de INSERT si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'banner_config' 
        AND policyname = 'Authenticated users can insert banner config'
    ) THEN
        CREATE POLICY "Authenticated users can insert banner config"
          ON banner_config
          FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Asegurar que existe el registro inicial
INSERT INTO banner_config (id, banner_text, logo_url, background_gradient, background_image, show_separator, is_active)
VALUES (
  1,
  '¡Bienvenido a Flasti! Gana dinero completando microtareas', 
  '/logo.svg', 
  'from-[#FF1493] via-[#2DE2E6] to-[#8B5CF6]',
  NULL,
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  logo_url = EXCLUDED.logo_url,
  background_gradient = EXCLUDED.background_gradient,
  show_separator = EXCLUDED.show_separator;

-- Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'banner_config'
ORDER BY ordinal_position;
```

---

## 📋 Estructura Esperada

Después de ejecutar el script, la tabla debe tener estas columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | SERIAL | ID único |
| `banner_text` | TEXT | Texto del banner |
| `logo_url` | TEXT | URL del logo |
| `background_gradient` | TEXT | Clases Tailwind del degradado |
| `background_image` | TEXT | URL de imagen de fondo (opcional) |
| `show_separator` | BOOLEAN | Mostrar separador entre logo y texto |
| `is_active` | BOOLEAN | Si el banner está activo |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `updated_by` | UUID | Usuario que actualizó |

---

## 🧪 Verificar que Funciona

### **1. Verificar columnas:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'banner_config'
ORDER BY ordinal_position;
```

Debe mostrar todas las columnas listadas arriba.

### **2. Verificar registro:**
```sql
SELECT * FROM banner_config WHERE id = 1;
```

Debe mostrar 1 registro con todos los campos.

### **3. Probar en la aplicación:**
1. Ir a `/dashboard/admin/banner-config`
2. Modificar cualquier campo
3. Clic en "Guardar Cambios"
4. Debe aparecer: ✅ "Configuración del banner actualizada correctamente"

---

## 🔄 Alternativa: Recrear la Tabla

Si prefieres empezar de cero (⚠️ esto borrará los datos existentes):

```sql
-- CUIDADO: Esto borra la tabla y todos sus datos
DROP TABLE IF EXISTS banner_config CASCADE;

-- Luego ejecuta la migración completa:
-- supabase/migrations/create_banner_config_table.sql
```

---

## 📝 Archivos de Ayuda

- `supabase/migrations/verify_banner_config_structure.sql` - Ver estructura actual
- `supabase/migrations/add_missing_banner_columns.sql` - Agregar columnas faltantes
- `supabase/migrations/create_banner_config_table.sql` - Migración completa

---

## ✅ Checklist de Solución

- [ ] Ejecutar script de verificación para ver columnas actuales
- [ ] Ejecutar script para agregar columnas faltantes
- [ ] Verificar que todas las columnas existen
- [ ] Verificar que existe registro con `id = 1`
- [ ] Verificar políticas RLS (SELECT, UPDATE, INSERT)
- [ ] Probar guardar cambios en `/dashboard/admin/banner-config`
- [ ] Verificar mensaje de éxito
- [ ] Verificar que cambios se reflejan en página principal

---

## 🎯 Resultado Esperado

Después de aplicar la solución:

1. ✅ La tabla tiene todas las columnas necesarias
2. ✅ Existe el registro inicial con `id = 1`
3. ✅ Las políticas RLS están configuradas
4. ✅ Puedes guardar cambios sin errores
5. ✅ Los cambios se reflejan en la página principal

---

¡Con estos pasos el error debería estar completamente solucionado! 🎉
