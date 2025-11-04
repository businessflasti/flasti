# Solución: Error al Guardar Banner Config

## 🔴 Problema

Al intentar guardar cambios en `/dashboard/admin/banner-config`, aparece el error:
```
Error al actualizar la configuración
```

---

## 🔍 Causa

El problema tiene 2 posibles causas:

### **1. Falta política RLS para INSERT**
La tabla `banner_config` tiene política para `UPDATE` pero no para `INSERT`, y el código usa `upsert` que necesita ambas.

### **2. No existe el registro con id = 1**
Si la migración no se ejecutó correctamente, puede que no exista el registro inicial.

---

## ✅ Solución

### **Opción A: Ejecutar Script de Corrección (Recomendado)**

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta este script:

```sql
-- Script para arreglar las políticas de banner_config

-- Eliminar política de INSERT si existe
DROP POLICY IF EXISTS "Authenticated users can insert banner config" ON banner_config;

-- Crear política de INSERT
CREATE POLICY "Authenticated users can insert banner config"
  ON banner_config
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Verificar que existe el registro por defecto, si no, crearlo
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
ON CONFLICT (id) DO NOTHING;

-- Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'banner_config';
```

3. Verifica que aparezcan 3 políticas:
   - `Anyone can read banner config` (SELECT)
   - `Authenticated users can update banner config` (UPDATE)
   - `Authenticated users can insert banner config` (INSERT)

---

### **Opción B: Ejecutar Migración Completa**

Si la tabla no existe o quieres empezar de cero:

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el archivo completo: `supabase/migrations/create_banner_config_table.sql`

---

## 🧪 Verificar que Funciona

### **1. Verificar que existe la tabla:**
```sql
SELECT * FROM banner_config;
```

Debe mostrar 1 registro con `id = 1`.

### **2. Verificar políticas RLS:**
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'banner_config';
```

Debe mostrar 3 políticas:
- SELECT
- UPDATE
- INSERT

### **3. Probar en la aplicación:**
1. Ir a `/dashboard/admin/banner-config`
2. Modificar el texto del banner
3. Clic en "Guardar Cambios"
4. Debe aparecer: "Configuración del banner actualizada correctamente" ✅

---

## 🔧 Cambios en el Código

Se actualizó el código para usar `upsert` en lugar de `update`:

### **Antes:**
```typescript
const { error } = await supabase
  .from('banner_config')
  .update({ ... })
  .eq('id', 1);
```

### **Ahora:**
```typescript
const { error } = await supabase
  .from('banner_config')
  .upsert({
    id: 1,
    ...
  }, {
    onConflict: 'id'
  });
```

**Beneficio:** Si no existe el registro, lo crea. Si existe, lo actualiza.

---

## 📋 Checklist de Solución

- [ ] Ejecutar script de corrección en Supabase SQL Editor
- [ ] Verificar que existen 3 políticas RLS
- [ ] Verificar que existe registro con `id = 1`
- [ ] Probar guardar cambios en `/dashboard/admin/banner-config`
- [ ] Verificar que aparece mensaje de éxito
- [ ] Verificar que los cambios se reflejan en la página principal

---

## 🎯 Resultado Esperado

Después de aplicar la solución:

1. ✅ Puedes editar el texto del banner
2. ✅ Puedes cambiar el logo
3. ✅ Puedes modificar el degradado
4. ✅ Puedes agregar imagen de fondo
5. ✅ Los cambios se guardan correctamente
6. ✅ Aparece mensaje de éxito

---

## 🆘 Si Sigue Sin Funcionar

### **Revisar consola del navegador:**
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Intentar guardar cambios
4. Copiar el error que aparece

### **Revisar permisos de usuario:**
```sql
-- Verificar que tu usuario está autenticado
SELECT auth.uid();

-- Debe retornar tu user_id, no NULL
```

### **Verificar que eres admin:**
```sql
SELECT is_admin 
FROM user_profiles 
WHERE user_id = auth.uid();

-- Debe retornar true
```

---

## 📝 Archivos Relacionados

- `supabase/migrations/create_banner_config_table.sql` - Migración original (actualizada)
- `supabase/migrations/fix_banner_config_policies.sql` - Script de corrección
- `src/app/dashboard/admin/banner-config/page.tsx` - Código actualizado con upsert

---

¡Con estos pasos el error debería estar solucionado! 🎉
