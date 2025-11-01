# 🔧 Troubleshooting - Error al Guardar Cambios

## ❌ Problema: "Error al guardar cambios"

Este error ocurre cuando intentas guardar cambios en el panel de control de visibilidad.

---

## 🔍 Diagnóstico

### Paso 1: Verificar si la tabla existe

1. Ve a Supabase Dashboard
2. Click en **"Table Editor"**
3. Busca la tabla **"element_visibility"**

**Si NO existe:**
- ❌ La migración no se ejecutó
- ✅ **Solución:** Ejecuta la migración (ver abajo)

**Si SÍ existe:**
- ✅ Continúa al Paso 2

---

### Paso 2: Verificar datos en la tabla

1. En **"Table Editor"**, abre la tabla **"element_visibility"**
2. Deberías ver **21 filas**

**Si está vacía o tiene menos filas:**
- ❌ La migración se ejecutó parcialmente
- ✅ **Solución:** Ejecuta la migración completa de nuevo

---

### Paso 3: Verificar permisos (RLS)

1. Ve a **"Authentication"** → **"Policies"**
2. Busca la tabla **"element_visibility"**
3. Deberías ver 4 políticas:
   - ✅ Allow read access to all authenticated users
   - ✅ Allow admin to update visibility
   - ✅ Allow admin to insert visibility
   - ✅ Allow admin to delete visibility

**Si faltan políticas:**
- ❌ Las políticas RLS no se crearon
- ✅ **Solución:** Ejecuta el script de fix (ver abajo)

---

### Paso 4: Verificar tu email de admin

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Console"**
3. Busca mensajes que digan tu email

**Tu email debe ser exactamente:**
```
flasti.finanzas@gmail.com
```

**Si es diferente:**
- ❌ No tienes permisos de admin
- ✅ **Solución:** Actualiza las políticas con tu email correcto

---

## ✅ Soluciones

### Solución 1: Ejecutar la Migración Principal

**Archivo:** `supabase/migrations/create_element_visibility_table.sql`

1. Ve a Supabase Dashboard
2. Click en **"SQL Editor"**
3. Click en **"New Query"**
4. Copia TODO el contenido del archivo
5. Pega en el editor
6. Click en **"Run"**

**Resultado esperado:**
```
✅ Success. No rows returned
```

---

### Solución 2: Arreglar Políticas RLS

**Archivo:** `supabase/migrations/fix_element_visibility_policies.sql`

1. Ve a Supabase Dashboard
2. Click en **"SQL Editor"**
3. Click en **"New Query"**
4. Copia TODO el contenido del archivo
5. Pega en el editor
6. Click en **"Run"**

**Resultado esperado:**
```
✅ 4 políticas mostradas
✅ Tu email mostrado
```

---

### Solución 3: Verificar Email de Admin

Si tu email NO es `flasti.finanzas@gmail.com`, necesitas actualizar las políticas:

1. Abre `supabase/migrations/fix_element_visibility_policies.sql`
2. Reemplaza TODAS las ocurrencias de:
   ```sql
   auth.email() = 'flasti.finanzas@gmail.com'
   ```
   Por:
   ```sql
   auth.email() = 'TU_EMAIL_AQUI@gmail.com'
   ```
3. Ejecuta el script modificado en Supabase

---

### Solución 4: Deshabilitar RLS Temporalmente (Solo para Testing)

**⚠️ ADVERTENCIA: Solo para desarrollo, NO para producción**

```sql
-- Deshabilitar RLS temporalmente
ALTER TABLE element_visibility DISABLE ROW LEVEL SECURITY;
```

Esto permitirá que cualquier usuario autenticado pueda modificar la tabla.

**Para volver a habilitar:**
```sql
ALTER TABLE element_visibility ENABLE ROW LEVEL SECURITY;
```

---

## 🔍 Debug Avanzado

### Ver logs en la consola del navegador

1. Abre la consola (F12)
2. Ve a la pestaña **"Console"**
3. Intenta guardar cambios
4. Busca mensajes que empiecen con:
   - 💾 Guardando cambios...
   - ✅ Actualizado: ...
   - ❌ Error en elemento: ...

### Verificar políticas manualmente

```sql
-- Ver todas las políticas de la tabla
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'element_visibility';

-- Ver tu email actual
SELECT auth.email();

-- Probar si puedes actualizar
UPDATE element_visibility 
SET is_visible = true 
WHERE element_key = 'logo';
```

---

## 📋 Checklist de Verificación

Marca cada item cuando lo verifiques:

- [ ] Tabla `element_visibility` existe
- [ ] Tabla tiene 21 filas
- [ ] RLS está habilitado
- [ ] 4 políticas existen
- [ ] Tu email es el correcto en las políticas
- [ ] Puedes ver los elementos en el panel
- [ ] La consola muestra logs de guardado
- [ ] No hay errores en la consola

---

## 🆘 Si Nada Funciona

### Opción Nuclear: Recrear Todo

```sql
-- 1. Eliminar tabla existente
DROP TABLE IF EXISTS element_visibility CASCADE;

-- 2. Ejecutar migración completa de nuevo
-- (Copia y pega todo el contenido de create_element_visibility_table.sql)
```

---

## 📞 Información para Soporte

Si necesitas ayuda, proporciona:

1. **Mensaje de error completo** de la consola
2. **Resultado de esta query:**
   ```sql
   SELECT COUNT(*) FROM element_visibility;
   SELECT auth.email();
   ```
3. **Screenshot** del error en el navegador
4. **Políticas existentes:**
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'element_visibility';
   ```

---

## ✅ Solución Rápida (Más Común)

**El 90% de los casos se resuelve con:**

1. Ejecutar la migración principal
2. Verificar que tu email sea el correcto
3. Ejecutar el script de fix de políticas

**Comandos en orden:**

```bash
# 1. Ejecutar en Supabase SQL Editor:
# Contenido de: create_element_visibility_table.sql

# 2. Verificar:
SELECT COUNT(*) FROM element_visibility;
# Debe retornar: 21

# 3. Si hay error de permisos:
# Contenido de: fix_element_visibility_policies.sql

# 4. Verificar políticas:
SELECT policyname FROM pg_policies WHERE tablename = 'element_visibility';
# Debe mostrar 4 políticas
```

---

## 🎯 Resultado Esperado

Después de aplicar las soluciones:

1. ✅ Puedes ver los 21 elementos en el panel
2. ✅ Puedes activar/desactivar switches
3. ✅ Al guardar, ves: "Cambios guardados exitosamente"
4. ✅ Los cambios se aplican en tiempo real
5. ✅ No hay errores en la consola
