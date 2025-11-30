# Control de Visibilidad - Bloque de Bienvenida

## Descripción

El bloque de bienvenida (tareas premium) ahora puede ser controlado desde el panel de administración en `/dashboard/admin/visibility-control`.

## Ubicación del Bloque

El bloque de bienvenida aparece en la página principal del dashboard (`/dashboard`) y muestra las tareas personalizadas premium (Tarea #1 y Tarea #2).

### Posiciones:
- **Móvil**: Aparece en la parte superior, antes del contenido principal
- **Desktop**: Aparece en la columna derecha, junto al video tutorial

## Cómo Controlar la Visibilidad

### 1. Acceder al Panel de Control
Navega a: `/dashboard/admin/visibility-control`

### 2. Buscar el Elemento
En la sección "Página: Dashboard", encontrarás:
- **Nombre**: Bloque de Bienvenida (Tareas Premium)
- **Key**: `welcome_bonus`

### 3. Activar/Desactivar
- **Activado** (👁️): El bloque es visible para todos los usuarios
- **Desactivado** (👁️‍🗨️): El bloque está oculto para todos los usuarios

### 4. Guardar Cambios
Presiona el botón "Guardar Cambios" para aplicar la configuración.

## Comportamiento

### Cuando está Activado:
- Los usuarios ven el bloque con las tareas premium disponibles
- Pueden hacer clic en "Iniciar" para comenzar las tareas
- El bloque desaparece automáticamente después de reclamar el bono

### Cuando está Desactivado:
- El bloque no se muestra en ninguna parte del dashboard
- Los usuarios no pueden ver ni acceder a las tareas premium desde el dashboard
- El espacio se reacomoda automáticamente

## Lógica de Visibilidad

El bloque se muestra solo cuando:
1. ✅ El control de visibilidad está activado (`isVisible('welcome_bonus')`)
2. ✅ El usuario NO ha reclamado el bono (`!userStats.welcomeBonusClaimed`)

Si cualquiera de estas condiciones es falsa, el bloque no se muestra.

## Migración SQL

Para agregar el control de visibilidad, ejecuta:

```sql
-- Archivo: supabase/migrations/add_welcome_bonus_visibility.sql
INSERT INTO element_visibility (page_name, element_key, element_name, is_visible, display_order)
VALUES ('dashboard', 'welcome_bonus', 'Bloque de Bienvenida (Tareas Premium)', true, 1)
ON CONFLICT (page_name, element_key) DO NOTHING;
```

## Casos de Uso

### Ocultar Temporalmente las Tareas
Si necesitas pausar las tareas premium sin eliminarlas:
1. Desactiva el bloque desde el panel de control
2. Los usuarios no verán las tareas
3. Reactiva cuando estés listo

### Mantenimiento
Durante actualizaciones o cambios en las tareas:
1. Desactiva el bloque
2. Realiza los cambios necesarios en `/dashboard/admin/custom-offers`
3. Reactiva el bloque

### Testing
Para probar cambios sin afectar a todos los usuarios:
1. Desactiva el bloque
2. Prueba con cuentas específicas
3. Reactiva cuando todo funcione correctamente

## Notas Importantes

- Los cambios se aplican en tiempo real para todos los usuarios
- El bloque solo se muestra a usuarios que NO han reclamado el bono
- Una vez reclamado el bono, el bloque desaparece permanentemente para ese usuario
- El control de visibilidad es independiente del estado de las tareas en `/dashboard/admin/custom-offers`

## Elementos Relacionados

Otros elementos que puedes controlar en el dashboard:
- Balance Display
- Video Tutorial
- Estadísticas del día
- Estadísticas de la semana
- Estadísticas totales
- Mensaje diario
- Slider de servicios premium
