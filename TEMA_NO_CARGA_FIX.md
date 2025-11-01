# 🐛 Fix: Tema no carga en páginas públicas

## Problema
El tema estacional no se muestra en páginas públicas (principal, login, register) pero sí funciona en dashboard después de login.

## Causa probable
**Políticas RLS (Row Level Security) en Supabase** están bloqueando el acceso público a la tabla `seasonal_themes`.

## Solución

### 1. Verificar en Supabase Dashboard

1. Ve a tu proyecto en Supabase
2. Ve a **Table Editor** → `seasonal_themes`
3. Verifica que haya un tema con `is_active = true`
4. Anota el `theme_name` (debe ser: `halloween`, `christmas`, o `default`)

### 2. Verificar/Crear política de lectura pública

1. Ve a **Authentication** → **Policies**
2. Busca la tabla `seasonal_themes`
3. Debe haber una política de **SELECT** para **public** (anon)

Si NO existe, créala:

```sql
CREATE POLICY "Allow public read access to seasonal_themes"
ON seasonal_themes
FOR SELECT
TO public
USING (true);
```

### 3. Ejecutar SQL de verificación

En **SQL Editor** de Supabase, ejecuta:

```sql
-- Ver políticas actuales
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'seasonal_themes';

-- Ver temas activos
SELECT theme_name, is_active 
FROM seasonal_themes 
WHERE is_active = true;
```

### 4. Si la política existe pero no funciona

Ejecuta esto para recrearla:

```sql
-- Eliminar política existente
DROP POLICY IF EXISTS "Allow public read access to seasonal_themes" ON seasonal_themes;

-- Crear nueva política
CREATE POLICY "Allow public read access to seasonal_themes"
ON seasonal_themes
FOR SELECT
TO anon, authenticated
USING (true);

-- Verificar
SELECT policyname FROM pg_policies WHERE tablename = 'seasonal_themes';
```

### 5. Verificar en el navegador

1. Abre la consola del navegador (F12)
2. Ve a `https://flasti.com` en incógnito
3. Busca en la consola:
   - `🎨 [useSeasonalTheme] Todos los temas en DB:` → Debe mostrar los temas
   - `✅ [useSeasonalTheme] Tema activo encontrado:` → Debe mostrar el tema activo
   - Si ves `⚠️ Sin tema activo` → Problema de políticas RLS

### 6. Botón "Volver" va a /dashboard/admin

Este problema puede ser caché del navegador. Para solucionarlo:

1. Limpia caché del navegador (Ctrl+Shift+Delete)
2. O fuerza recarga: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
3. El código ya está corregido: `router.push('/dashboard')`

## Logs para debugging

En la consola del navegador verás:
- `🎨 [useSeasonalTheme] Iniciando carga desde Supabase...`
- `🎨 [useSeasonalTheme] Todos los temas en DB: [...]`
- `🎨 [useSeasonalTheme] Respuesta de Supabase: {...}`
- `✅ [useSeasonalTheme] Tema activo encontrado: halloween`

Si ves errores de permisos, es definitivamente un problema de RLS.

## Contacto

Si después de seguir estos pasos sigue sin funcionar, comparte los logs de la consola del navegador.
