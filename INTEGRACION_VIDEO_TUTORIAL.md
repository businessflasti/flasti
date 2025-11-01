# 🎬 Integración del Sistema de Video Tutorial

## ✅ Lo que ya está hecho:

1. ✅ Migración de base de datos creada
2. ✅ Servicio TutorialVideoService creado
3. ✅ Página admin creada
4. ✅ Botón en menú admin agregado
5. ✅ Estado en Dashboard agregado
6. ✅ Función para cargar video agregada

---

## 🔧 Lo que falta: Actualizar Referencias al Video

Necesitas reemplazar las 4 referencias hardcodeadas al video por el estado `tutorialVideo`.

### **Ubicación:** `src/app/dashboard/page.tsx`

---

### **Cambio 1: Video móvil en bucle (línea ~447)**

**Buscar:**
```typescript
<source src="/video/tutorial-bienvenida.mp4" type="video/mp4" />
```

**Reemplazar por:**
```typescript
<source src={tutorialVideo.url} type="video/mp4" />
```

**Y agregar key al video:**
```typescript
<video
  className="w-full h-full object-cover"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  key={tutorialVideo.url}  // ← Agregar esta línea
>
```

---

### **Cambio 2: Reproductor móvil completo (línea ~480)**

**Buscar:**
```typescript
<source src="/video/tutorial-bienvenida.mp4" type="video/mp4" />
```

**Reemplazar por:**
```typescript
<source src={tutorialVideo.url} type="video/mp4" />
```

**Y agregar key al video:**
```typescript
<video
  className="w-full h-full object-cover"
  controls
  autoPlay
  preload="metadata"
  key={tutorialVideo.url}  // ← Agregar esta línea
>
```

---

### **Cambio 3: Video desktop en bucle (línea ~556)**

**Buscar:**
```typescript
<source src="/video/tutorial-bienvenida.mp4" type="video/mp4" />
```

**Reemplazar por:**
```typescript
<source src={tutorialVideo.url} type="video/mp4" />
```

**Y agregar key al video:**
```typescript
<video
  className="w-full h-full object-cover"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  key={tutorialVideo.url}  // ← Agregar esta línea
>
```

---

### **Cambio 4: Reproductor desktop completo (línea ~589)**

**Buscar:**
```typescript
<source src="/video/tutorial-bienvenida.mp4" type="video/mp4" />
```

**Reemplazar por:**
```typescript
<source src={tutorialVideo.url} type="video/mp4" />
```

**Y agregar key al video:**
```typescript
<video
  className="w-full h-full object-cover"
  controls
  autoPlay
  preload="metadata"
  key={tutorialVideo.url}  // ← Agregar esta línea
>
```

---

### **Cambio 5: Actualizar títulos dinámicos**

**Buscar (hay 2 ocurrencias):**
```typescript
<h3 className="text-white font-bold text-sm flex items-center gap-2">
  ...
  Tutorial de Bienvenida
</h3>
<p className="text-white/80 text-xs mt-1">Click para ver el tutorial completo</p>
```

**Reemplazar por:**
```typescript
<h3 className="text-white font-bold text-sm flex items-center gap-2">
  ...
  {tutorialVideo.title}
</h3>
<p className="text-white/80 text-xs mt-1">{tutorialVideo.description}</p>
```

---

## 🚀 Cómo Ejecutar:

### **Paso 1: Ejecutar la Migración**

1. Ve a Supabase → SQL Editor
2. Abre: `supabase/migrations/create_tutorial_video_table.sql`
3. Copia TODO el contenido
4. Pega y ejecuta (Run)

**Resultado esperado:**
```
✅ Tabla tutorial_video creada
✅ 1 video por defecto insertado
✅ Políticas RLS configuradas
```

---

### **Paso 2: Crear Bucket de Storage (Opcional)**

Si quieres subir videos directamente:

1. Ve a Supabase → Storage
2. Click en "New bucket"
3. Nombre: `videos`
4. Public: ✅ (activado)
5. Click en "Create bucket"

---

### **Paso 3: Hacer los Cambios en el Código**

Sigue las instrucciones de arriba para actualizar las 4 referencias al video.

---

### **Paso 4: Probar**

1. Ve a: `/dashboard/admin/tutorial-video`
2. Verás el video actual
3. Puedes:
   - Cambiar la URL del video
   - Subir un nuevo video
   - Cambiar título y descripción
   - Click en "Guardar Cambios"
4. Ve al dashboard
5. El video debería actualizarse automáticamente

---

## 📊 Estructura de la Base de Datos

```sql
tutorial_video
├─ id (UUID)
├─ video_url (TEXT) ← URL del video
├─ thumbnail_url (TEXT) ← Miniatura
├─ title (TEXT) ← Título
├─ description (TEXT) ← Descripción
├─ is_active (BOOLEAN) ← Si está activo
├─ created_at (TIMESTAMPTZ)
└─ updated_at (TIMESTAMPTZ)
```

---

## 🎯 Funcionalidades

### **En el Admin:**

1. ✅ Ver preview del video actual
2. ✅ Cambiar URL del video
3. ✅ Subir nuevo video (hasta 100MB)
4. ✅ Cambiar miniatura
5. ✅ Editar título y descripción
6. ✅ Ver todos los videos
7. ✅ Activar/desactivar videos

### **En el Dashboard:**

1. ✅ Video en bucle automático
2. ✅ Click para abrir reproductor
3. ✅ Título y descripción dinámicos
4. ✅ Se actualiza en tiempo real

---

## 🔄 Flujo Completo:

```
Admin sube/cambia video
    ↓
Guarda en la base de datos
    ↓
Dashboard carga el video activo
    ↓
Muestra el nuevo video
    ↓
Usuarios ven el video actualizado
```

---

## 📁 Archivos Creados:

1. ✅ `supabase/migrations/create_tutorial_video_table.sql`
2. ✅ `src/lib/tutorial-video-service.ts`
3. ✅ `src/app/dashboard/admin/tutorial-video/page.tsx`
4. ✅ `src/app/dashboard/admin/page.tsx` (actualizado)
5. ✅ `src/app/dashboard/page.tsx` (parcialmente actualizado)

---

## ✅ Checklist:

- [ ] Ejecuté la migración en Supabase
- [ ] Veo la tabla tutorial_video
- [ ] Creé el bucket "videos" (opcional)
- [ ] Actualicé las 4 referencias al video
- [ ] Actualicé los títulos dinámicos
- [ ] Probé en /dashboard/admin/tutorial-video
- [ ] Cambié el video y funcionó
- [ ] El dashboard muestra el nuevo video

---

## 🎉 Resultado Final:

Tendrás control total sobre el video tutorial desde el admin:

- 🎬 Cambiar video cuando quieras
- 📝 Editar título y descripción
- 🖼️ Cambiar miniatura
- ☁️ Subir videos directamente
- 🔄 Cambios en tiempo real

¡Sin tocar código nunca más!
