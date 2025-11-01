# Sistema de Historias (Testimonios en Video)

## 🐛 Fix: Problema de Eliminación

Si las historias no se eliminan correctamente, ejecuta este SQL en Supabase:

```sql
-- Contenido de: supabase/migrations/fix_delete_policies.sql
```

Esto arregla las políticas RLS para permitir DELETE correctamente.

## ✅ Implementación Completa

### Características:
- ✅ Círculos pequeños sin nombre (estilo Instagram)
- ✅ Soporte para videos e imágenes verticales
- ✅ Videos centrados en pantalla completa
- ✅ Gestión completa desde panel admin
- ✅ Barra de progreso única
- ✅ Navegación manual (clic izquierdo/derecho)
- ✅ Pausar al mantener presionado
- ✅ Solo visible en desktop en página principal

## 📋 Pasos para Activar

### 1. Ejecutar la migración de base de datos

Ejecuta el archivo SQL en tu Supabase:
```bash
# Opción 1: Desde Supabase Dashboard
# Ve a SQL Editor y ejecuta el contenido de:
supabase/migrations/create_stories_table.sql

# Opción 2: Desde CLI de Supabase
supabase db push
```

### 2. Acceder al panel de administración

Ve a: `/dashboard/admin/stories`

### 3. Agregar historias

En el panel admin puedes:
- Subir avatar (imagen circular)
- Subir video o imagen vertical (formato 9:16 recomendado)
- Configurar duración en segundos
- Ver todas las historias actuales
- Eliminar historias

### 4. Formato recomendado para videos

- **Resolución**: 1080x1920 (vertical)
- **Formato**: MP4, WebM
- **Duración**: 5-30 segundos
- **Peso**: Máximo 10MB

## 🎨 Personalización

### Cambiar tamaño de círculos
En `src/components/ui/Stories.tsx` línea ~75:
```tsx
<div className="w-10 h-10 rounded-full overflow-hidden">
```
Cambia `w-10 h-10` por el tamaño deseado.

### Cambiar espaciado entre círculos
En `src/components/ui/Stories.tsx` línea ~70:
```tsx
<div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
```
Cambia `gap-3` por el espaciado deseado.

### Mostrar en otras páginas
En `src/components/layout/DashboardHeader.tsx` línea ~260:
```tsx
{isMainDashboard && !isMobile && stories.length > 0 && (
```
Cambia la condición según necesites.

## 🔒 Seguridad

- Solo usuarios con rol `admin` pueden gestionar historias
- Todos los usuarios pueden ver las historias
- Los archivos se almacenan en buckets públicos de Supabase

## 📱 Responsive

- Desktop: Historias visibles en header
- Móvil: Historias ocultas (puedes cambiar esto si lo deseas)

## 🎥 Uso

1. Los usuarios ven círculos con gradiente en el header
2. Al hacer clic, se abre el visor en pantalla completa
3. El video/imagen se reproduce automáticamente
4. Pueden navegar con clics o esperar el avance automático
5. Presionar y mantener pausa la reproducción
