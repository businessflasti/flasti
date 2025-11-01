# 🔍 Debug - Dashboard No Oculta Elementos

## 📋 Pasos para Diagnosticar

### Paso 1: Abrir la Consola del Navegador

1. Abre el dashboard en tu navegador
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **"Console"**

### Paso 2: Buscar Logs de Debug

Deberías ver mensajes como estos:

```
🔄 Fetching visibility for pages: ['dashboard']
✅ Visibility data received: [...]
  - welcome_bonus: true
  - balance_display: true
  - video_tutorial: true
  - stat_today: true
  - stat_week: true
  - stat_total: true
  - stat_completed: true
  - offers_section: true
📊 Final visibility map: {...}
🔍 Dashboard - Estado de visibilidad: {...}
```

---

## 🔍 Diagnóstico por Síntomas

### Síntoma 1: No veo NINGÚN log

**Problema:** El hook no se está ejecutando

**Solución:**
1. Verifica que el archivo se guardó correctamente
2. Recarga la página con Ctrl+Shift+R (hard reload)
3. Verifica que no haya errores de compilación

---

### Síntoma 2: Veo "Fetching..." pero NO veo "Visibility data received"

**Problema:** La query a Supabase está fallando

**Posibles causas:**
- La tabla no existe
- No tienes permisos de lectura
- La conexión a Supabase falló

**Solución:**
1. Ve a Supabase → Table Editor
2. Verifica que la tabla `element_visibility` existe
3. Verifica que tiene 21 filas
4. Ejecuta esta query en SQL Editor:
   ```sql
   SELECT * FROM element_visibility WHERE page_name = 'dashboard';
   ```
   Deberías ver 8 filas

---

### Síntoma 3: Veo los datos pero todos están en "true"

**Problema:** Los cambios no se están guardando

**Solución:**
1. Ve al panel de control de visibilidad
2. Desactiva un elemento
3. Abre la consola (F12)
4. Click en "Guardar Cambios"
5. Busca logs que digan:
   ```
   💾 Guardando cambios para 21 elementos...
   Actualizando welcome_bonus: false
   ✅ Actualizado: welcome_bonus
   ```

Si NO ves estos logs:
- El problema está en el panel de control
- Revisa `SOLUCION_FINAL.md`

---

### Síntoma 4: Los datos cambian en la consola pero NO en la UI

**Problema:** El componente no se está re-renderizando

**Solución:**
1. Verifica que el hook esté DENTRO del componente
2. Verifica que uses `isVisible()` correctamente
3. Busca en el código:
   ```typescript
   {isVisible('welcome_bonus') && (
     <WelcomeBonus />
   )}
   ```

---

### Síntoma 5: Funciona en Header pero NO en Dashboard

**Problema:** Diferencia en cómo se usa el hook

**Comparación:**

**Header (Funciona):**
```typescript
const { isVisible } = useElementVisibility('header');

{isVisible('logo') && (
  <Logo />
)}
```

**Dashboard (Debería funcionar igual):**
```typescript
const { isVisible } = useElementVisibility('dashboard');

{isVisible('welcome_bonus') && (
  <WelcomeBonus />
)}
```

**Verifica:**
- ¿El hook está al inicio del componente?
- ¿No está dentro de un `if` o `useEffect`?
- ¿El componente se está renderizando?

---

## 🧪 Pruebas Manuales

### Prueba 1: Verificar que el hook funciona

Agrega esto temporalmente en el dashboard:

```typescript
console.log('TEST - welcome_bonus visible?', isVisible('welcome_bonus'));
console.log('TEST - elements:', elements);
```

### Prueba 2: Forzar un valor

Cambia temporalmente:

```typescript
// Antes
{isVisible('welcome_bonus') && (
  <WelcomeBonus />
)}

// Después (para probar)
{false && (
  <WelcomeBonus />
)}
```

Si el componente desaparece, el problema NO es el hook, es otra cosa.

### Prueba 3: Verificar en la base de datos

```sql
-- Ver estado actual de los elementos del dashboard
SELECT 
  element_key,
  element_name,
  is_visible
FROM element_visibility
WHERE page_name = 'dashboard'
ORDER BY display_order;
```

---

## 📊 Información a Proporcionar

Si necesitas ayuda, proporciona:

### 1. Logs de la Consola

Copia TODOS los logs que empiecen con:
- 🔄 Fetching...
- ✅ Visibility data...
- 📊 Final visibility...
- 🔍 Dashboard - Estado...

### 2. Estado de la Base de Datos

```sql
SELECT element_key, is_visible 
FROM element_visibility 
WHERE page_name = 'dashboard';
```

### 3. Captura de Pantalla

- De la consola con los logs
- Del panel de control mostrando el elemento desactivado

---

## ✅ Solución Rápida

Si nada funciona, prueba esto:

### 1. Hard Reload

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### 2. Limpiar Cache

```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

### 3. Verificar que el cambio se guardó

```sql
-- En Supabase SQL Editor
UPDATE element_visibility 
SET is_visible = false 
WHERE page_name = 'dashboard' 
AND element_key = 'welcome_bonus';

-- Verificar
SELECT element_key, is_visible 
FROM element_visibility 
WHERE page_name = 'dashboard' 
AND element_key = 'welcome_bonus';
```

Luego recarga el dashboard. Si el bono desaparece, el problema era que los cambios no se estaban guardando.

---

## 🎯 Checklist de Verificación

- [ ] Veo logs en la consola
- [ ] Los logs muestran los datos correctos
- [ ] Los valores de `is_visible` son correctos
- [ ] El hook está al inicio del componente
- [ ] No hay errores en la consola
- [ ] Hice hard reload (Ctrl+Shift+R)
- [ ] Los cambios se guardan en la base de datos
- [ ] El header funciona correctamente
- [ ] Probé con diferentes elementos

---

## 🆘 Si Todo Falla

Comparte:
1. Screenshot de la consola con los logs
2. Resultado de la query SQL
3. Screenshot del panel de control
4. Versión del navegador que usas
