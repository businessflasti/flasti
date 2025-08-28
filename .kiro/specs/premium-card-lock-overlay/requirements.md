# Requirements Document

## Introduction

Este documento define los requerimientos para implementar un sistema de bloqueo premium con efecto de vidrio esmerilado (frosted glass blur overlay) en las tarjetas de microtareas del dashboard. El objetivo es crear una experiencia visual elegante que motive a los usuarios a actualizar a premium mediante técnicas de FOMO (Fear of Missing Out) y exclusividad visual.

## Requirements

### Requirement 1

**User Story:** Como usuario gratuito, quiero ver las microtareas disponibles pero bloqueadas con un efecto visual elegante, para que entienda que hay contenido premium disponible y me sienta motivado a actualizar mi cuenta.

#### Acceptance Criteria

1. WHEN el usuario tiene una cuenta gratuita THEN todas las tarjetas de microtareas SHALL mostrar un overlay de vidrio esmerilado
2. WHEN se aplica el overlay THEN el contenido original SHALL permanecer visible pero borroso (blur 6px-12px)
3. WHEN se renderiza el overlay THEN SHALL usar backdrop-filter: blur() con fondo semitransparente rgba(0, 0, 0, 0.4)
4. WHEN se aplica el efecto THEN la forma original de la tarjeta SHALL mantenerse intacta (bordes, sombras, dimensiones)
5. WHEN el overlay está activo THEN el contenido debajo SHALL ser legible de forma mínima para despertar curiosidad

### Requirement 2

**User Story:** Como usuario gratuito, quiero ver elementos visuales que refuercen la exclusividad del contenido premium, para que comprenda claramente el valor de actualizar mi cuenta.

#### Acceptance Criteria

1. WHEN se muestra el overlay THEN SHALL incluir un ícono de candado elegante en el centro superior
2. WHEN se renderiza el candado THEN SHALL ser un SVG minimalista en blanco con opacidad 0.8
3. WHEN se muestra el overlay THEN SHALL incluir texto "Disponible solo con acceso Premium" o "Desbloquea para acceder ahora"
4. WHEN se renderiza el texto THEN SHALL usar tipografía clara (font-weight: 500) en blanco/gris claro con sombra suave
5. WHEN el texto está visible THEN SHALL estar centrado y ser legible sobre el blur

### Requirement 3

**User Story:** Como usuario gratuito, quiero que las tarjetas bloqueadas respondan a mis interacciones, para que sienta que el contenido premium es accesible y valioso.

#### Acceptance Criteria

1. WHEN el usuario hace hover sobre una tarjeta bloqueada THEN el overlay SHALL aumentar ligeramente la opacidad
2. WHEN ocurre el hover THEN SHALL mostrar un destello diagonal animado (linear-gradient animado)
3. WHEN el usuario toca una tarjeta en móvil THEN SHALL activar el mismo efecto de hover
4. WHEN el cursor está sobre una tarjeta bloqueada THEN SHALL cambiar a pointer
5. WHEN la animación de destello se ejecuta THEN SHALL ser rápida y elegante (duración < 0.5s)

### Requirement 4

**User Story:** Como usuario gratuito, quiero poder hacer clic en las tarjetas bloqueadas para acceder al proceso de actualización, para que pueda desbloquear el contenido fácilmente.

#### Acceptance Criteria

1. WHEN el usuario hace clic en una tarjeta bloqueada THEN SHALL abrir un modal de upgrade o redirigir al checkout
2. WHEN se detecta el clic THEN SHALL prevenir la acción original de la tarjeta
3. WHEN se activa la interacción THEN SHALL proporcionar feedback visual inmediato
4. WHEN el usuario interactúa THEN el sistema SHALL trackear el evento para analytics
5. WHEN se procesa el clic THEN SHALL mantener el contexto de la tarjeta específica

### Requirement 5

**User Story:** Como desarrollador, quiero que el efecto de bloqueo sea compatible con todos los navegadores y dispositivos, para que todos los usuarios tengan una experiencia consistente.

#### Acceptance Criteria

1. WHEN el navegador no soporta backdrop-filter THEN SHALL usar un fallback con PNG semitransparente
2. WHEN se renderiza en dispositivos móviles THEN el efecto SHALL mantener el rendimiento óptimo
3. WHEN se aplica el overlay THEN SHALL ser responsive y adaptarse a todos los tamaños de pantalla
4. WHEN se usa el fallback THEN la experiencia visual SHALL ser equivalente al efecto original
5. WHEN se carga la página THEN el overlay SHALL aplicarse sin afectar el tiempo de carga

### Requirement 6

**User Story:** Como usuario premium, quiero que las tarjetas se muestren normalmente sin overlay, para que pueda acceder libremente a todas las microtareas disponibles.

#### Acceptance Criteria

1. WHEN el usuario tiene cuenta premium THEN las tarjetas SHALL mostrarse sin overlay de bloqueo
2. WHEN se verifica el estado premium THEN SHALL ser en tiempo real y preciso
3. WHEN el usuario actualiza a premium THEN el overlay SHALL desaparecer inmediatamente
4. WHEN se detecta cuenta premium THEN todas las funcionalidades de tarjetas SHALL estar habilitadas
5. WHEN el estado cambia THEN la UI SHALL actualizarse sin requerir recarga de página

### Requirement 7

**User Story:** Como diseñador, quiero que el efecto visual siga los principios de Glassmorphism y diseño premium, para que la experiencia sea elegante y profesional como interfaces de Apple.

#### Acceptance Criteria

1. WHEN se aplica el efecto THEN SHALL usar degradado sutil que oscurece desde el centro hacia abajo
2. WHEN se renderiza el overlay THEN SHALL tener bordes suaves y transiciones fluidas
3. WHEN se muestra el efecto THEN SHALL mantener la jerarquía visual y legibilidad
4. WHEN se aplica el glassmorphism THEN SHALL usar colores y opacidades que complementen el tema oscuro
5. WHEN se visualiza el resultado THEN SHALL parecer premium y exclusivo, no frustrante

### Requirement 8

**User Story:** Como administrador del sistema, quiero poder controlar qué tarjetas se muestran bloqueadas, para que pueda gestionar la estrategia de monetización de forma flexible.

#### Acceptance Criteria

1. WHEN se configura el sistema THEN SHALL permitir definir qué ofertas requieren premium
2. WHEN se actualiza la configuración THEN los cambios SHALL reflejarse inmediatamente
3. WHEN se gestiona el bloqueo THEN SHALL ser por categoría, tipo de oferta o individual
4. WHEN se modifica la configuración THEN SHALL mantener logs de cambios para auditoría
5. WHEN se aplican reglas THEN SHALL ser consistente en toda la aplicación