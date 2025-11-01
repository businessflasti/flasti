# Rutas de Imágenes para Temas Estacionales

## 📁 Estructura de Archivos Necesarios

### 1. Fondos de Contenedores (Dashboard y Admin)
```
/public/images/fondo.webp                    ✅ Ya existe (tema predeterminado)
/public/images/fondo-halloween.webp          🆕 CREAR (tema Halloween)
/public/images/fondo-navidad.webp            🆕 CREAR (tema Navidad)
```

**Uso:** 
- Dashboard: Contenedor de balance, asesora y video
- Admin: Fondo de toda la página de administración

---

### 2. Logos de Eventos (Banner Superior)
```
/public/images/eventos/event-default.png     🆕 CREAR (tema predeterminado)
/public/images/eventos/event-halloween.png   🆕 CREAR (tema Halloween)
/public/images/eventos/event-navidad.png     🆕 CREAR (tema Navidad)
```

**Uso:** Logo que aparece en el banner sticky superior de la página principal (lado izquierdo)

**Nota:** Actualmente usa `/images/eventos/event-hallo.png` - puedes renombrar o crear nuevos

---

### 3. Logos Principales (Header)
```
/public/logo/isotipo-web.png                 ✅ Ya existe (predeterminado)
/public/logo/logo-web.png                    ✅ Ya existe (predeterminado)
```

**Uso:** Se cargan desde la base de datos (tabla `seasonal_themes`, columna `logo_url`)

---

## 🎨 Especificaciones de Diseño

### Fondos de Contenedores
- **Formato:** WebP (optimizado)
- **Dimensiones recomendadas:** 1920x1080px o superior
- **Características:**
  - Tema predeterminado: Fondo actual
  - Halloween: Tonos oscuros con elementos naranjas/morados
  - Navidad: Tonos festivos con elementos rojos/verdes/dorados

### Logos de Eventos
- **Formato:** PNG con transparencia
- **Dimensiones:** Altura 28px (se ajusta automáticamente)
- **Características:**
  - Debe ser horizontal/rectangular
  - Fondo transparente
  - Colores acordes al tema

---

## 🔧 Configuración en Base de Datos

La tabla `seasonal_themes` debe tener:
- `logo_url`: Logo principal del header
- `event_logo_url`: Logo del evento en banner (nueva columna)

Ejecutar migración: `supabase/migrations/add_event_logo_to_themes.sql`

---

## ✅ Cambios Implementados

1. ✅ Sistema de caché en localStorage para carga rápida de temas
2. ✅ Fondos temáticos en dashboard (móvil y desktop)
3. ✅ Fondos temáticos en página admin
4. ✅ Logo de evento dinámico en banner superior
5. ✅ Borde de avatar temático en sidebar
6. ✅ Guirnalda solo en StudiovaHeroSection (no en toda la página)
7. ✅ Iconos de estadísticas sin tematización (siempre iguales)

---

## 🚫 Elementos NO Tematizados

- ❌ Iconos de estadísticas en dashboard (Calendar, TrendingUp, Target, Gift)
- ❌ Formularios de login/register
- ❌ Resto de la página principal (excepto logo y guirnalda en hero)
