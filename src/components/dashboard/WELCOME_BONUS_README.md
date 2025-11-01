# Componente de Bono de Bienvenida

## Descripción
Componente gamificado que ofrece un bono de $0.50 USD a nuevos usuarios mediante una tarea interactiva simple.

## Características

### 🎁 Tarjeta de Bono
- Diseño atractivo con animaciones de brillo y pulsación
- Muestra el monto del bono ($0.50 USD)
- Botón "Reclamar" con efectos visuales

### 🎮 Mini-Juego Interactivo
- **Tarea**: Completar una palabra letra por letra
- **Palabras disponibles**: FLASTI, DINERO, GANAR, PREMIO, BONUS
- **Mecánica**: El usuario debe escribir cada letra en orden
- **Feedback visual**: Cada letra correcta se marca en verde con animación

### ✨ Animación de Éxito
- Círculo verde con check animado
- Confetti cayendo
- Mensaje "¡COMPLETADO!" con efectos de brillo
- Muestra el monto acreditado

### 💰 Acreditación Automática
- Se acreditan $0.50 USD al balance del usuario
- Se marca el bono como reclamado en la base de datos
- El componente desaparece después de reclamar

## Integración

### Base de Datos
Se requiere la columna `welcome_bonus_claimed` en la tabla `users`:
```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;
```

### Uso en Dashboard
```tsx
import WelcomeBonus from '@/components/dashboard/WelcomeBonus';

<WelcomeBonus 
  userId={user.id} 
  onBonusClaimed={() => {
    toast.success('¡Bono acreditado exitosamente!');
    fetchUserStats();
  }}
/>
```

## Psicología del Diseño

El componente está diseñado para generar sensaciones adictivas similares a las plataformas de casino:

1. **Anticipación**: Animaciones de brillo y pulsación crean expectativa
2. **Facilidad**: La tarea es extremadamente simple, garantizando el éxito
3. **Recompensa inmediata**: Feedback visual instantáneo con cada letra
4. **Celebración**: Animación de éxito exagerada con confetti y efectos
5. **Dopamina**: Colores brillantes (amarillo/verde) y sonidos visuales de "victoria"

## Archivos
- `WelcomeBonus.tsx` - Componente principal
- `WelcomeBonus.module.css` - Estilos y animaciones
- `supabase/migrations/20240102000000_add_welcome_bonus_column.sql` - Migración de BD
