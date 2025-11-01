# Sistema de Temas Estacionales 🎃🎄

## Descripción
Sistema completo para gestionar temas visuales estacionales en Flasti, permitiendo personalizar la interfaz para fechas especiales como Halloween y Navidad.

## Características

### Temas Disponibles

#### 1. **Default** (Predeterminado)
- Tema estándar de Flasti
- Sin decoraciones especiales
- Siempre disponible

#### 2. **Halloween** 🎃
**Efectos visuales:**
- 🦇 Murciélagos flotantes animados
- 🎃 Calabazas en las esquinas con efecto pulse
- 🕸️ Telarañas decorativas
- Colores: Naranja (#ff6b00), Morado (#8b00ff), Verde (#00ff00)
- Fondo oscuro temático

#### 3. **Navidad** 🎄
**Efectos visuales:**
- ❄️ Copos de nieve cayendo (30 copos animados)
- 🎄 Árbol de Navidad animado
- 🎅 Santa Claus
- 🎁 Regalos
- ⭐ Estrellas
- 💡 Luces navideñas parpadeantes en la parte superior
- Colores: Rojo (#c41e3a), Verde (#0f8b3a), Dorado (#ffd700)
- Fondo festivo

## Páginas Afectadas
Los temas se aplican **únicamente** en:
1. **Dashboard** (`/dashboard`)
2. **Página Principal** (`/`)

## Panel de Control Admin

### Ubicación
`/dashboard/admin/themes`

### Funcionalidades
- ✅ Ver todos los temas disponibles
- ✅ Activar/Desactivar temas con un click
- ✅ Visualizar tema activo actual
- ✅ Descripciones detalladas de cada tema
- ✅ Iconos representativos para cada tema
- ✅ Cambios en tiempo real para todos los usuarios

### Acceso
Solo usuarios con permisos de **administrador** pueden gestionar temas.

## Arquitectura Técnica

### Base de Datos
**Tabla:** `seasonal_themes`
```sql
- id: SERIAL PRIMARY KEY
- theme_name: TEXT (default, halloween, christmas)
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Componentes

#### 1. `SeasonalThemeEffects.tsx`
Componente que renderiza los efectos visuales según el tema activo.
- Animaciones CSS personalizadas
- Efectos de partículas
- Decoraciones temáticas
- Estilos globales dinámicos

#### 2. `useSeasonalTheme.ts`
Hook personalizado para gestionar el tema activo.
- Carga el tema desde Supabase
- Suscripción en tiempo real a cambios
- Estado global del tema

#### 3. Página Admin (`/dashboard/admin/themes/page.tsx`)
Interfaz de administración para gestionar temas.
- Grid de tarjetas temáticas
- Botones de activación
- Indicadores visuales
- Información detallada

### Migraciones
**Archivo:** `create_seasonal_themes_table.sql`
- Crea tabla `seasonal_themes`
- Inserta temas predefinidos
- Configura políticas RLS
- Triggers para `updated_at`

## Animaciones CSS

### Halloween
```css
@keyframes float-bat {
  /* Murciélagos flotando en trayectoria curva */
}
```

### Navidad
```css
@keyframes snowfall {
  /* Copos de nieve cayendo con rotación */
}

@keyframes christmas-lights {
  /* Luces parpadeantes */
}

@keyframes bounce-slow {
  /* Rebote suave para decoraciones */
}
```

## Uso

### Para Administradores
1. Ir a `/dashboard/admin`
2. Click en botón "Temas"
3. Seleccionar tema deseado
4. Click en "Activar Tema"
5. Los cambios se aplican inmediatamente

### Para Desarrolladores

**Agregar nuevo tema:**
1. Insertar en base de datos:
```sql
INSERT INTO seasonal_themes (theme_name, is_active) 
VALUES ('nuevo_tema', FALSE);
```

2. Agregar efectos en `SeasonalThemeEffects.tsx`:
```tsx
{activeTheme === 'nuevo_tema' && (
  <div className="fixed inset-0 pointer-events-none z-[100]">
    {/* Efectos visuales aquí */}
  </div>
)}
```

3. Agregar estilos CSS:
```css
.theme-nuevo_tema {
  --theme-primary: #color1;
  --theme-secondary: #color2;
}
```

## Características Técnicas

### Tiempo Real
- Cambios de tema se propagan instantáneamente
- Usa Supabase Realtime
- Sin necesidad de recargar página

### Performance
- Efectos con `pointer-events-none` (no bloquean interacción)
- Animaciones CSS optimizadas
- z-index: 100 (sobre contenido, bajo modales)

### Responsive
- Adaptado para móvil y desktop
- Cantidad de partículas ajustada según viewport
- Decoraciones posicionadas estratégicamente

## Mejores Prácticas

### Cuándo Activar Temas
- **Halloween:** Octubre (especialmente última semana)
- **Navidad:** Diciembre (todo el mes)
- **Default:** Resto del año

### Consideraciones
- Solo un tema activo a la vez
- Efectos sutiles, no invasivos
- No afectan funcionalidad
- Mejoran experiencia de usuario

## Archivos Relacionados
```
src/
├── app/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   └── themes/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   └── themes/
│       └── SeasonalThemeEffects.tsx
├── hooks/
│   └── useSeasonalTheme.ts
└── supabase/
    └── migrations/
        └── create_seasonal_themes_table.sql
```

## Soporte
Para agregar nuevos temas o modificar existentes, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025
