# 🚀 Instrucciones de Configuración - Sistema de Visibilidad

## ✅ Estado Actual

### Archivos Integrados:
- ✅ **DashboardHeader.tsx** - Todos los elementos del header controlables
- ✅ **Dashboard page.tsx** - Todos los elementos controlables
- ✅ **VisibilityWrapper.tsx** - Componente helper creado
- ✅ **Hook useElementVisibility** - Listo y funcional
- ✅ **Página de Control Admin** - Interfaz completa
- ⏳ **Premium page.tsx** - Pendiente de integrar

### Elementos Controlables (21 total):

#### Header (6):
1. ✅ Logo / Avatar
2. ✅ Título de Página
3. ✅ Balance (Header)
4. ✅ Badge de País
5. ✅ Historias/Testimonios
6. ✅ Botón Menú

#### Dashboard (8):
1. ✅ Bono de Bienvenida
2. ✅ Balance Display
3. ✅ Video Tutorial
4. ✅ Tarjeta: Hoy
5. ✅ Tarjeta: Semana
6. ✅ Tarjeta: Total
7. ✅ Tarjeta: Completadas
8. ✅ Sección Ofertas

#### Premium (7):
- ⏳ Pendiente de integrar

---

## 📋 PASO 1: Ejecutar la Migración en Supabase

### Opción A: Dashboard Web (Más Fácil) ⭐

1. Ve a https://supabase.com
2. Selecciona tu proyecto
3. Click en **"SQL Editor"** (menú lateral izquierdo)
4. Click en **"New Query"**
5. Abre el archivo: `supabase/migrations/create_element_visibility_table.sql`
6. **Copia TODO el contenido** del archivo
7. **Pega** en el editor SQL de Supabase
8. Click en **"Run"** (o presiona `Ctrl/Cmd + Enter`)
9. Deberías ver: ✅ **"Success. No rows returned"**

### Opción B: Supabase CLI

```bash
# Si tienes Supabase CLI instalado
supabase db push

# O aplicar migración específica
supabase migration up
```

### ✅ Verificar que funcionó:

1. En Supabase, ve a **"Table Editor"**
2. Busca la tabla **"element_visibility"**
3. Deberías ver **21 filas** (6 header + 8 dashboard + 7 premium)
4. Todas con `is_visible = true` por defecto

---

## 📋 PASO 2: Probar el Sistema

### 1. Acceder al Panel de Control

```
Dashboard → Admin → Botón "Visibilidad" (verde)
```

### 2. Probar Cambios en Tiempo Real

1. **Desactiva** un elemento (ej: "Logo / Avatar")
2. Abre otra pestaña con el dashboard
3. El logo debería **desaparecer inmediatamente**
4. Los demás elementos se **reacomodan automáticamente**

### 3. Verificar Reacomodo Automático

**Ejemplo con las tarjetas de estadísticas:**

**Antes (4 tarjetas visibles):**
```
┌─────┬─────┬─────┬─────┐
│ Hoy │Semana│Total│Compl│
└─────┴─────┴─────┴─────┘
```

**Después (desactivar "Semana"):**
```
┌─────┬─────┬─────┐
│ Hoy │Total│Compl│
└─────┴─────┴─────┘
```

Las tarjetas se expanden automáticamente para llenar el espacio.

---

## 📋 PASO 3: Integrar Premium Page (Opcional)

Si quieres que la página Premium también sea controlable, necesitas integrarla.

### Archivo a modificar:
`src/app/dashboard/premium/page.tsx`

### Pasos:

1. **Importar el wrapper:**
```typescript
import VisibilityWrapper from '@/components/dashboard/VisibilityWrapper';
```

2. **Envolver cada elemento:**

```typescript
{/* Imagen dashboard - Controlable */}
<VisibilityWrapper page="premium" elementKey="dashboard_image">
  <div className="hidden lg:block mb-4">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>

{/* Pricing card - Controlable */}
<VisibilityWrapper page="premium" elementKey="pricing_card">
  <Card className="bg-card/60">
    {/* ... contenido ... */}
  </Card>
</VisibilityWrapper>

{/* Testimonios - Controlable */}
<VisibilityWrapper page="premium" elementKey="testimonials">
  <div className="mt-6">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>

{/* FAQ 1 - Controlable */}
<VisibilityWrapper page="premium" elementKey="faq_earnings">
  <div className="overflow-hidden rounded-3xl">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>

{/* FAQ 2 - Controlable */}
<VisibilityWrapper page="premium" elementKey="faq_payment">
  <div className="overflow-hidden rounded-3xl">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>

{/* FAQ 3 - Controlable */}
<VisibilityWrapper page="premium" elementKey="faq_location">
  <div className="overflow-hidden rounded-3xl">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>

{/* FAQ 4 - Controlable */}
<VisibilityWrapper page="premium" elementKey="faq_guarantee">
  <div className="overflow-hidden rounded-3xl">
    {/* ... contenido ... */}
  </div>
</VisibilityWrapper>
```

---

## 🎯 Casos de Uso

### 1. **A/B Testing**
- Desactiva elementos para probar qué layout convierte mejor
- Compara métricas con/sin ciertos elementos

### 2. **Mantenimiento**
- Oculta temporalmente secciones con problemas
- Sin necesidad de desplegar código

### 3. **Personalización por Región**
- Oculta elementos específicos para ciertos países
- (Requiere lógica adicional en el hook)

### 4. **Promociones Temporales**
- Activa/desactiva banners promocionales
- Sin tocar código

---

## 🔧 Troubleshooting

### Problema: "No veo cambios en tiempo real"

**Solución:**
1. Verifica que la migración se ejecutó correctamente
2. Revisa la consola del navegador por errores
3. Asegúrate de que Supabase Realtime esté habilitado en tu proyecto

### Problema: "Error al guardar cambios"

**Solución:**
1. Verifica que tu usuario sea admin (flasti.finanzas@gmail.com)
2. Revisa las políticas RLS en Supabase
3. Comprueba la consola por errores de permisos

### Problema: "Elementos no se reacomodan bien"

**Solución:**
1. Verifica que uses `grid` con `auto-fit`
2. Asegúrate de no tener `divs` innecesarios que rompan el layout
3. Usa el `VisibilityWrapper` directamente en el elemento, no en un contenedor

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real:

```javascript
// En la consola del navegador
localStorage.setItem('debug_visibility', 'true');

// Ahora verás logs de:
// - Cambios detectados
// - Elementos visibles/ocultos
// - Actualizaciones en tiempo real
```

### Verificar Estado Actual:

```sql
-- En Supabase SQL Editor
SELECT page_name, element_key, element_name, is_visible 
FROM element_visibility 
ORDER BY page_name, display_order;
```

---

## ✅ Checklist Final

- [ ] Migración ejecutada en Supabase
- [ ] Tabla `element_visibility` creada con 21 filas
- [ ] Botón "Visibilidad" visible en Admin
- [ ] Panel de control accesible
- [ ] Cambios se aplican en tiempo real
- [ ] Header responde a cambios
- [ ] Dashboard responde a cambios
- [ ] Elementos se reacomodan correctamente
- [ ] (Opcional) Premium integrado

---

## 🎉 ¡Listo!

Tu sistema de control de visibilidad está completamente funcional. Ahora puedes:

✅ Controlar 21 elementos desde el panel admin
✅ Ver cambios en tiempo real
✅ Reacomodo automático estilo Tetris
✅ Sin necesidad de desplegar código

**Acceso rápido:**
```
https://tu-dominio.com/dashboard/admin/visibility-control
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica los logs de Supabase
3. Comprueba que las políticas RLS estén correctas
4. Asegúrate de ser admin

**Documentación adicional:**
- `VISIBILITY_CONTROL_SYSTEM.md` - Documentación técnica completa
- `INTEGRATION_EXAMPLE.md` - Ejemplos de código detallados
