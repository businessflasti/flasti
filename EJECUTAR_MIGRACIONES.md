# Instrucciones para Ejecutar las Migraciones

## Tu usuario ya es admin ✅

Como ya puedes acceder a `/dashboard/admin`, tu usuario `flasti.finanzas@gmail.com` ya está configurado como administrador. Solo necesitas ejecutar las migraciones.

## Orden de Ejecución

Ejecuta estos comandos en tu terminal o en el SQL Editor de Supabase:

### Opción A: Usando Supabase CLI (Recomendado)

```bash
# 1. Crear tabla de configuración del banner
supabase migration up --file create_banner_config_table.sql

# 2. Verificar estructura de cpalead_transactions
supabase migration up --file verify_cpalead_transactions_structure.sql
```

### Opción B: Usando SQL Editor en Supabase Dashboard

Si prefieres usar la interfaz web de Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Abre **SQL Editor**
3. Copia y pega el contenido de `create_banner_config_table.sql`
4. Ejecuta
5. Luego copia y pega el contenido de `verify_cpalead_transactions_structure.sql`
6. Ejecuta

## Verificar que Todo Funcionó

Ejecuta estas consultas en SQL Editor para verificar:

```sql
-- 1. Verificar que la tabla banner_config existe
SELECT * FROM banner_config;

-- 2. Verificar que tiene el registro inicial
SELECT banner_text, logo_url, is_active FROM banner_config;

-- 3. Verificar que puedes actualizar (como admin)
UPDATE banner_config 
SET banner_text = 'Prueba de actualización' 
WHERE id = 1;

-- 4. Verificar columnas de cpalead_transactions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cpalead_transactions'
AND column_name IN ('metadata', 'transaction_id', 'currency');
```

## Probar la Funcionalidad

1. **Accede a la página de configuración del banner:**
   - Ve a: `https://tu-dominio.com/dashboard/admin/banner-config`
   - Deberías ver la interfaz de configuración

2. **Edita el banner:**
   - Cambia el texto
   - Cambia la URL del logo si quieres
   - Haz clic en "Guardar Cambios"

3. **Verifica en la página principal:**
   - Abre `/` en otra pestaña
   - Deberías ver el banner con tu nuevo texto

4. **Prueba el tiempo real:**
   - Deja abierta la página principal
   - En otra pestaña, cambia el texto del banner desde admin
   - El banner debería actualizarse automáticamente sin recargar

## Si Hay Algún Error

### Error: "relation banner_config does not exist"
**Solución:** La migración no se ejecutó. Ejecuta `create_banner_config_table.sql`

### Error: "permission denied"
**Solución:** Verifica que estás autenticado. La política permite a cualquier usuario autenticado actualizar (la verificación de admin se hace en el código)

### Error: "duplicate key value violates unique constraint"
**Solución:** La tabla ya existe. Puedes omitir este error o ejecutar:
```sql
DROP TABLE IF EXISTS banner_config CASCADE;
```
Y luego volver a ejecutar la migración.

## Archivos que NO Necesitas Ejecutar

Como tu usuario ya es admin, estos archivos son opcionales:
- ❌ `ensure_user_roles_table.sql` (solo si no existe la tabla user_roles)
- ❌ `add_flasti_admin.sql` (tu usuario ya es admin)
- ❌ `add_initial_admin.sql` (plantilla, no necesaria)

## Resumen

Solo necesitas ejecutar:
1. ✅ `create_banner_config_table.sql`
2. ✅ `verify_cpalead_transactions_structure.sql`

¡Y listo! Después de esto podrás:
- Editar el banner desde `/dashboard/admin/banner-config`
- Ver los cambios reflejados en tiempo real
- El bono de bienvenida funcionará correctamente en todas las estadísticas
- La asesora tendrá mejor contraste visual
