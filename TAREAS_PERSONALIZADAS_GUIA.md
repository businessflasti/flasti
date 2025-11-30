# Guía de Tareas Personalizadas

## Descripción General

El sistema de tareas personalizadas permite crear dos tipos de tareas diferentes para los usuarios:

### Tarea #1: Transcripción de Audio
- **Objetivo**: El usuario escucha un audio y transcribe las palabras mencionadas
- **Tipo**: Audio
- **Recompensa sugerida**: $1.50 USD
- **Color por defecto**: #255BA5 (Azul)

### Tarea #2: Control de Calidad de Video
- **Objetivo**: El usuario mira un video y encuentra un error, anotando el tiempo exacto
- **Tipo**: Video
- **Recompensa sugerida**: $2.00 USD
- **Color por defecto**: #8B2C9E (Púrpura)

## Cómo Editar las Tareas

### Acceso al Panel de Admin
1. Navega a `/dashboard/admin/custom-offers`
2. Verás dos tarjetas: "Oferta #1" y "Oferta #2"

### Campos Editables

#### Información de la Tarjeta
- **Título**: Nombre corto de la tarea
- **Descripción**: Descripción breve para la tarjeta
- **Monto (USD)**: Recompensa en dólares
- **URL de Imagen**: Ruta a la imagen de la tarea

#### Contenido del Modal
- **Título del Modal**: Título principal que ve el usuario
- **Subtítulo del Modal**: Instrucciones breves
- **URL del Audio**: Ruta al archivo de audio (para tareas de audio)
- **URL del Video**: Ruta al archivo de video (para tareas de video)
- **Etiqueta del Input**: Texto sobre el campo de entrada
- **Placeholder del Input**: Texto de ejemplo en el campo
- **Texto de Ayuda**: Instrucciones adicionales

#### Información del Partner
- **Nombre del Partner**: Empresa o marca asociada
- **URL del Logo del Partner**: Logo del partner
- **Objetivo de la Tarea**: Explicación del propósito

#### Personalización Visual
- **Tipo de Tarea**: Audio, Video, Texto, etc.
- **Color de Fondo del Bloque**: Color del bloque principal (formato hex)
- **Color de Fondo de la Imagen**: Color de fondo de la imagen (formato hex)

## Características del Reproductor de Video

### Seguridad y Restricciones
- ✅ Click derecho deshabilitado
- ✅ Descarga deshabilitada
- ✅ Picture-in-Picture deshabilitado
- ✅ Control remoto deshabilitado
- ✅ Pantalla completa deshabilitada
- ✅ Cambio de velocidad deshabilitado

### Controles Disponibles
- ▶️ Play/Pause
- 🔊 Control de volumen
- ⏱️ Barra de progreso

## Formato de Respuestas

### Tarea de Audio
- Formato: Palabras separadas por espacios
- Ejemplo: `PALABRA1 PALABRA2 PALABRA3 PALABRA4 PALABRA5`

### Tarea de Video
- Formato: Tiempo en segundos o MM:SS
- Ejemplos válidos:
  - `43` (43 segundos)
  - `00:43` (0 minutos, 43 segundos)
  - `1:23` (1 minuto, 23 segundos)

## Instrucciones Automáticas

El sistema genera automáticamente las instrucciones según el tipo de tarea:

### Para Audio:
1. Reproduce el audio
2. Escucha las palabras mencionadas
3. Escribe las palabras en el campo de texto
4. Presiona "Confirmar" para recibir tu recompensa

### Para Video:
1. Reproduce el video completo
2. Observa con atención para encontrar el error
3. Anota el tiempo exacto donde viste el fallo (formato MM:SS o segundos)
4. Presiona "Confirmar" para recibir tu recompensa

## Migración de Base de Datos

Ejecuta la migración SQL para agregar los nuevos campos:

```sql
-- Archivo: supabase/migrations/add_custom_offers_visual_fields.sql
ALTER TABLE custom_offers
ADD COLUMN IF NOT EXISTS task_type TEXT DEFAULT 'Audio',
ADD COLUMN IF NOT EXISTS block_bg_color TEXT DEFAULT '#255BA5',
ADD COLUMN IF NOT EXISTS image_bg_color TEXT DEFAULT '#255BA5',
ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';
```

## Rutas de Archivos Sugeridas

### Audio
- `/audios/tarea1.mp3`
- `/audios/tarea2.mp3`

### Video
- `/videos/tarea-video.mp4`
- `/videos/control-calidad.mp4`

### Imágenes
- `/images/tarea-audio.png`
- `/images/tarea-video.png`

### Logos de Partners
- `/images/partners/audiolab-logo.png`
- `/images/partners/qualitycheck-logo.png`

## Activar/Desactivar Tareas

Cada tarea tiene un botón de activación:
- 👁️ **Activa**: La tarea es visible para los usuarios
- 👁️‍🗨️ **Inactiva**: La tarea está oculta

## Notas Importantes

1. Los cambios se guardan inmediatamente al presionar "Guardar"
2. Los colores deben estar en formato hexadecimal (#RRGGBB)
3. Las URLs de archivos deben ser rutas válidas en el servidor
4. El sistema valida automáticamente el formato de las respuestas
5. Cada usuario solo puede completar cada tarea una vez
