# Configuración de Bloques CTA Bento Grid - Instrucciones

## ✅ Funcionalidad Implementada

Se agregó la capacidad de editar los **3 bloques del Bento Grid** que aparecen en la sección CTA al final de la página principal desde el panel de administración.

---

## 🗄️ Paso 1: Ejecutar Migración en Supabase

### **Opción A: Desde Supabase Dashboard (Recomendado)**

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo: `supabase/migrations/create_cta_news_blocks_table.sql`
4. Haz clic en **Run** para ejecutar la migración

### **Opción B: Desde Terminal (Si tienes Supabase CLI)**

```bash
# Ejecutar la migración
supabase db push

# O ejecutar el archivo específico
psql -h [TU_HOST] -U postgres -d postgres -f supabase/migrations/create_cta_news_blocks_table.sql
```

---

## 📊 Qué Crea la Migración

### **Tabla: `cta_news_blocks`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | ID único del bloque |
| `title` | TEXT | Título del bloque |
| `description` | TEXT | Descripción del bloque |
| `image_url` | TEXT | URL de la imagen |
| `display_order` | INTEGER | Orden de visualización (1, 2, 3) |
| `is_active` | BOOLEAN | Si el bloque está activo |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### **Datos Iniciales (3 bloques por defecto):**

1. **"Octubre 2025: Más microtareas disponibles"**
   - Imagen: `/images/principal/bannerdotttt1.png`
   
2. **"Nueva función activa"**
   - Imagen: `/images/principal/bannerdot2.png`
   
3. **"+4.800 usuarios nuevos esta semana"**
   - Imagen: `/images/principal/banner3.png`

---

## 🎨 Paso 2: Acceder al Editor

### **Ruta:**
```
/dashboard/admin/banner-config
```

### **Ubicación:**
- Ir al panel de administración
- Clic en el botón **"Banner"** (rosa-morado)
- Scroll hasta la sección **"Bloques CTA Bento Grid"**

---

## 🖼️ Cómo Editar los Bloques

### **Cada bloque tiene:**

1. **Checkbox "Activo"**
   - Activa/desactiva el bloque sin eliminarlo
   
2. **Vista previa de la imagen**
   - Muestra la imagen actual
   
3. **URL de la Imagen**
   - Ruta de la imagen (ej: `/images/principal/banner1.png`)
   - Las imágenes deben estar en `/public/images/principal/`
   
4. **Título**
   - Texto principal del bloque
   - Ejemplo: "Octubre 2025: Más microtareas disponibles"
   
5. **Descripción**
   - Texto descriptivo del bloque
   - Ejemplo: "Nuevas tareas se están sumando..."
   
6. **Botón "Guardar Bloque"**
   - Guarda los cambios de ese bloque específico

---

## 📝 Ejemplos de Uso

### **Ejemplo 1: Cambiar el título del Bloque 1**

```
1. Ir a /dashboard/admin/banner-config
2. Scroll hasta "Bloques CTA Bento Grid"
3. En "Bloque 1", cambiar el título:
   Antes: "Octubre 2025: Más microtareas disponibles"
   Después: "Noviembre 2025: Nuevas oportunidades"
4. Clic en "Guardar Bloque 1"
5. Los cambios se reflejan inmediatamente en la página principal
```

### **Ejemplo 2: Cambiar la imagen del Bloque 2**

```
1. Subir nueva imagen a /public/images/principal/nueva-imagen.png
2. En "Bloque 2", cambiar la URL:
   Antes: "/images/principal/bannerdot2.png"
   Después: "/images/principal/nueva-imagen.png"
3. Clic en "Guardar Bloque 2"
4. La nueva imagen aparece en la página principal
```

### **Ejemplo 3: Desactivar el Bloque 3**

```
1. En "Bloque 3", desmarcar el checkbox "Activo"
2. Clic en "Guardar Bloque 3"
3. El bloque 3 ya no aparece en la página principal
4. Los bloques 1 y 2 siguen visibles
```

---

## 🔧 Detalles Técnicos

### **Frontend:**

#### **Componente Actualizado:**
- `src/components/ui/cta-news-bento-grid.tsx`
- Ahora lee desde la base de datos en lugar de datos hardcodeados
- Incluye fallback a valores por defecto si no hay datos

#### **Editor Agregado:**
- `src/app/dashboard/admin/banner-config/page.tsx`
- Nueva sección `CTANewsBlocksEditor` al final de la página
- Permite editar cada bloque individualmente

### **Backend:**

#### **Tabla en Supabase:**
- `cta_news_blocks`
- RLS habilitado
- Políticas:
  - Lectura pública (solo bloques activos)
  - Escritura solo para admins

#### **Trigger:**
- Actualiza automáticamente `updated_at` en cada modificación

---

## 🎯 Casos de Uso

### **1. Actualizar Estadísticas Mensuales**
```
Bloque 1:
Título: "Noviembre 2025: Más microtareas disponibles"
Descripción: "Este mes se agregaron 500 nuevas tareas..."
```

### **2. Anunciar Nueva Función**
```
Bloque 2:
Título: "Función Premium Activada"
Descripción: "Ahora los usuarios premium tienen acceso a..."
```

### **3. Mostrar Crecimiento de Usuarios**
```
Bloque 3:
Título: "+10.000 usuarios nuevos este mes"
Descripción: "La comunidad de Flasti sigue creciendo..."
```

### **4. Promoción Temporal**
```
Bloque 1:
Título: "Black Friday: Bonos Especiales"
Descripción: "Durante noviembre, todos los usuarios reciben..."
Imagen: "/images/principal/black-friday.png"
```

---

## 📊 Estructura Visual

### **Página Principal (Final):**

```
┌─────────────────────────────────────┐
│  [Imagen Bloque 1]                  │
│  Título Bloque 1                    │
│  Descripción Bloque 1               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Imagen Bloque 2]                  │
│  Título Bloque 2                    │
│  Descripción Bloque 2               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Imagen Bloque 3]                  │
│  Título Bloque 3                    │
│  Descripción Bloque 3               │
└─────────────────────────────────────┘
```

### **Panel de Admin:**

```
┌─────────────────────────────────────┐
│ Bloques CTA Bento Grid              │
├─────────────────────────────────────┤
│ Bloque 1                    [✓] Activo│
│ [Vista previa imagen]               │
│ URL Imagen: [input]                 │
│ Título: [input]                     │
│ Descripción: [textarea]             │
│ [Guardar Bloque 1]                  │
├─────────────────────────────────────┤
│ Bloque 2                    [✓] Activo│
│ ...                                 │
├─────────────────────────────────────┤
│ Bloque 3                    [✓] Activo│
│ ...                                 │
└─────────────────────────────────────┘
```

---

## ⚠️ Notas Importantes

### **Imágenes:**
- Las imágenes deben estar en `/public/images/principal/`
- Formatos recomendados: PNG, JPG, WEBP
- Tamaño recomendado: 800x200px (ancho x alto)
- Peso máximo recomendado: 200KB

### **Textos:**
- Título: Máximo 100 caracteres
- Descripción: Máximo 250 caracteres
- Usar textos concisos para mejor visualización en móviles

### **Orden:**
- Los bloques se muestran en orden: 1, 2, 3
- El orden está definido por el campo `display_order`
- No se puede cambiar el orden desde el admin (por ahora)

### **Activación:**
- Desactivar un bloque lo oculta pero no lo elimina
- Los datos se mantienen en la base de datos
- Se puede reactivar en cualquier momento

---

## 🔍 Troubleshooting

### **Los bloques no aparecen en la página:**

1. **Verificar que la migración se ejecutó:**
   ```sql
   SELECT * FROM cta_news_blocks;
   ```

2. **Verificar que los bloques están activos:**
   ```sql
   SELECT id, title, is_active FROM cta_news_blocks;
   ```

3. **Verificar permisos RLS:**
   - Los bloques deben tener `is_active = true`
   - La política de lectura pública debe estar habilitada

### **No puedo editar los bloques:**

1. **Verificar que eres admin:**
   ```sql
   SELECT is_admin FROM user_profiles WHERE user_id = '[TU_USER_ID]';
   ```

2. **Verificar política de escritura:**
   - Solo usuarios con `is_admin = true` pueden editar

### **Las imágenes no se ven:**

1. **Verificar ruta de la imagen:**
   - Debe empezar con `/images/`
   - La imagen debe existir en `/public/images/`

2. **Verificar formato:**
   - Usar rutas relativas: `/images/principal/banner1.png`
   - No usar rutas absolutas: `https://...`

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migración en Supabase
- [ ] Verificar que la tabla `cta_news_blocks` existe
- [ ] Verificar que hay 3 registros por defecto
- [ ] Acceder a `/dashboard/admin/banner-config`
- [ ] Verificar que aparece la sección "Bloques CTA Bento Grid"
- [ ] Editar un bloque de prueba
- [ ] Verificar que los cambios se reflejan en la página principal
- [ ] Probar desactivar/activar un bloque
- [ ] Verificar que las imágenes se muestran correctamente

---

## 🎉 Resultado Final

Ahora puedes editar los 3 bloques del Bento Grid desde el panel de administración:

- ✅ **Editar títulos** de cada bloque
- ✅ **Editar descripciones** de cada bloque
- ✅ **Cambiar imágenes** de cada bloque
- ✅ **Activar/desactivar** bloques individuales
- ✅ **Vista previa** de las imágenes
- ✅ **Cambios en tiempo real** en la página principal

**¡Todo listo para personalizar tu sección CTA!** 🚀
