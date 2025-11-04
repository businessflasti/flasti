# Solución al Error de Permisos de Admin

## Problema
Al ejecutar la migración `create_banner_config_table.sql`, aparece el error:
```
ERROR: 42703: column user_profiles.role does not exist
```

## Causa
La tabla `user_profiles` no tiene una columna `role`. El sistema usa una tabla separada llamada `user_roles` para gestionar permisos.

## Solución

### Paso 1: Ejecutar Migraciones en Orden

Ejecuta las migraciones en este orden específico:

```bash
# 1. Asegurar que existe la tabla user_roles
supabase migration up --file ensure_user_roles_table.sql

# 2. Crear la tabla de configuración del banner (ahora funcionará)
supabase migration up --file create_banner_config_table.sql

# 3. Verificar estructura de cpalead_transactions
supabase migration up --file verify_cpalead_transactions_structure.sql
```

### Paso 2: Agregar tu Usuario como Admin

Necesitas agregar tu usuario a la tabla `user_roles` como admin. Hay dos formas:

#### Opción A: Usando SQL Editor en Supabase (Recomendado)

1. Ve a tu proyecto en Supabase Dashboard
2. Abre el **SQL Editor**
3. Ejecuta esta consulta para obtener tu user_id:

```sql
SELECT id, email FROM auth.users WHERE email = 'tu-email@ejemplo.com';
```

4. Copia el `id` (UUID) que aparece
5. Ejecuta esta consulta reemplazando `TU_USER_ID_AQUI` con tu UUID:

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('TU_USER_ID_AQUI', 'super_admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin', updated_at = NOW();
```

6. Verifica que se agregó correctamente:

```sql
SELECT ur.*, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE ur.role IN ('admin', 'super_admin');
```

#### Opción B: Usando Variables de Entorno (Alternativa)

Si prefieres no usar la base de datos, puedes agregar tu user_id a las variables de entorno:

1. Obtén tu user_id como en el paso anterior
2. Agrega esta variable de entorno en tu proyecto:

```bash
ADMIN_USER_IDS=tu-user-id-aqui,otro-user-id-si-hay-mas
```

3. En Vercel/Netlify/tu hosting, agrega la variable de entorno
4. Reinicia tu aplicación

**Nota:** El sistema verifica ambos métodos (base de datos Y variables de entorno), así que puedes usar cualquiera o ambos.

### Paso 3: Verificar que Todo Funciona

1. Accede a `/dashboard/admin/banner-config`
2. Si ves la página de configuración, ¡todo está funcionando!
3. Si ves un error de permisos, verifica:
   - Que tu user_id está en `user_roles` con rol `admin` o `super_admin`
   - O que tu user_id está en la variable de entorno `ADMIN_USER_IDS`

## Verificación Rápida

Ejecuta estas consultas para verificar el estado:

```sql
-- 1. Verificar que la tabla user_roles existe
SELECT * FROM user_roles LIMIT 5;

-- 2. Verificar que la tabla banner_config existe
SELECT * FROM banner_config;

-- 3. Verificar tus permisos
SELECT ur.role, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
WHERE au.id = auth.uid();

-- 4. Verificar políticas RLS de banner_config
SELECT * FROM pg_policies WHERE tablename = 'banner_config';
```

## Troubleshooting

### Error: "user_roles table does not exist"
**Solución:** Ejecuta primero `ensure_user_roles_table.sql`

### Error: "permission denied for table banner_config"
**Solución:** Asegúrate de que tu usuario está en `user_roles` con rol admin

### Error: "infinite recursion detected in policy"
**Solución:** Esto puede pasar si hay políticas circulares. Usa variables de entorno como alternativa.

### No puedo acceder a /dashboard/admin/banner-config
**Solución:** 
1. Verifica que estás autenticado
2. Verifica que tu user_id está en `user_roles` como admin
3. Revisa la consola del navegador para ver el error específico

## Comandos Útiles

```bash
# Ver todas las migraciones aplicadas
supabase migration list

# Conectar a la base de datos
supabase db connect

# Ver logs en tiempo real
supabase logs --follow

# Resetear base de datos local (CUIDADO: borra todo)
supabase db reset
```

## Resumen de Archivos

- ✅ `ensure_user_roles_table.sql` - Crea tabla de roles (ejecutar PRIMERO)
- ✅ `create_banner_config_table.sql` - Crea tabla del banner (ejecutar SEGUNDO)
- ✅ `verify_cpalead_transactions_structure.sql` - Verifica transacciones (ejecutar TERCERO)
- 📝 `add_initial_admin.sql` - Plantilla para agregar admin (ejecutar manualmente)

## Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Accede a `/dashboard/admin/banner-config`
2. ✅ Configura el texto y logo del banner
3. ✅ Guarda los cambios
4. ✅ Verifica que aparece en la página principal
5. ✅ Continúa con las pruebas del bono de bienvenida

## Contacto

Si sigues teniendo problemas:
1. Verifica los logs de Supabase
2. Revisa la consola del navegador
3. Ejecuta las consultas de verificación arriba
4. Comparte el error específico que ves
