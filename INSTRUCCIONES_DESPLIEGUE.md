# Instrucciones de Despliegue

## Orden de Aplicación

### 1. Migraciones de Base de Datos (PRIMERO)

**IMPORTANTE:** Aplicar en este orden específico:

```bash
# 1. Asegurar que existe la tabla user_roles (PRIMERO)
supabase migration up --file ensure_user_roles_table.sql

# 2. Crear tabla de configuración del banner (SEGUNDO)
supabase migration up --file create_banner_config_table.sql

# 3. Verificar estructura de cpalead_transactions (TERCERO)
supabase migration up --file verify_cpalead_transactions_structure.sql
```

**Nota:** Si obtienes un error sobre `user_profiles.role does not exist`, consulta `SOLUCION_ERROR_ADMIN.md`

### 2. Verificar Tablas Creadas

```sql
-- Verificar que banner_config existe
SELECT * FROM banner_config;

-- Verificar columnas de cpalead_transactions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cpalead_transactions';
```

### 3. Desplegar Código

Los archivos ya están listos para desplegar:

**Nuevos Archivos:**
- `src/app/dashboard/admin/banner-config/page.tsx`
- `supabase/migrations/create_banner_config_table.sql`
- `supabase/migrations/verify_cpalead_transactions_structure.sql`

**Archivos Modificados:**
- `src/components/dashboard/WelcomeBonus.tsx`
- `src/components/dashboard/DailyMessage.tsx`
- `src/app/dashboard/withdrawals/page.tsx`
- `src/app/api/user/profile/route.ts`
- `src/app/api/rewards-history/route.ts`
- `src/components/ui/sticky-banner-demo.tsx`

### 4. Configuración Inicial del Banner

Después de desplegar, configurar el banner:

1. Acceder a `/dashboard/admin/banner-config`
2. Configurar el texto inicial
3. Configurar la ruta del logo
4. Activar el banner

## Verificación Post-Despliegue

### 1. Verificar Base de Datos

```sql
-- Verificar que la tabla banner_config tiene datos
SELECT * FROM banner_config;

-- Verificar que los índices se crearon
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'cpalead_transactions';

-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'banner_config';
```

### 2. Verificar Funcionalidad

- [ ] El banner aparece en la página principal
- [ ] El banner se puede editar desde admin
- [ ] Los cambios se reflejan en tiempo real
- [ ] El bono de bienvenida se acredita correctamente
- [ ] Las estadísticas se actualizan correctamente
- [ ] El bloque de bienvenida no parpadea
- [ ] La asesora en gris es visible
- [ ] El mensaje de error en withdrawals es correcto

### 3. Monitoreo

```bash
# Ver logs de Supabase
supabase logs --follow

# Ver logs de Next.js (si aplica)
npm run logs

# Verificar errores en Sentry (si está configurado)
```

## Rollback (Si es Necesario)

### Revertir Migraciones

```sql
-- Eliminar tabla banner_config
DROP TABLE IF EXISTS banner_config CASCADE;

-- Revertir cambios en cpalead_transactions (si es necesario)
-- Nota: Solo si causa problemas, generalmente no es necesario
```

### Revertir Código

```bash
# Revertir al commit anterior
git revert HEAD

# O restaurar archivos específicos
git checkout HEAD~1 -- src/components/dashboard/WelcomeBonus.tsx
git checkout HEAD~1 -- src/components/dashboard/DailyMessage.tsx
# ... etc
```

## Notas Importantes

### Compatibilidad
- ✅ Compatible con la estructura actual de la base de datos
- ✅ No rompe funcionalidad existente
- ✅ Cambios son aditivos (no destructivos)

### Rendimiento
- ✅ Los índices mejoran el rendimiento de consultas
- ✅ La suscripción en tiempo real es eficiente
- ✅ No hay consultas N+1

### Seguridad
- ✅ RLS habilitado en banner_config
- ✅ Solo admins pueden editar el banner
- ✅ Todos pueden leer la configuración
- ✅ Validación de datos en el frontend y backend

## Contacto y Soporte

Si hay problemas durante el despliegue:

1. Verificar logs de Supabase
2. Verificar logs de Next.js
3. Revisar la consola del navegador
4. Verificar que las migraciones se aplicaron correctamente
5. Verificar que los índices se crearon

## Checklist de Despliegue

- [ ] Backup de base de datos realizado
- [ ] Migraciones aplicadas correctamente
- [ ] Tablas verificadas
- [ ] Índices creados
- [ ] Políticas RLS verificadas
- [ ] Código desplegado
- [ ] Banner configurado
- [ ] Pruebas básicas realizadas
- [ ] Monitoreo activo
- [ ] Documentación actualizada
- [ ] Equipo notificado

## Tiempo Estimado

- Aplicar migraciones: 2-3 minutos
- Desplegar código: 5-10 minutos
- Configurar banner: 2 minutos
- Pruebas básicas: 10-15 minutos
- **Total: ~20-30 minutos**

## Ambiente de Prueba

Se recomienda probar primero en un ambiente de desarrollo o staging antes de producción.

```bash
# Ambiente local
supabase start
npm run dev

# Ambiente staging (si existe)
# ... comandos específicos del proyecto
```
