# Design Document

## Overview

El sticky banner será integrado como un componente reutilizable que se posiciona en la parte superior de la página principal, por encima del header existente. El diseño seguirá los patrones establecidos en el proyecto y será completamente responsive.

## Architecture

### Component Structure
```
StickyBanner (componente base reutilizable)
├── StickyBannerDemo (implementación específica para la página principal)
└── Integration en MainLayout (solo para página principal)
```

### Integration Points
- **MainLayout.tsx**: Punto de integración principal donde se renderizará el banner
- **page.tsx**: Página principal donde se mostrará el banner
- **components/ui/sticky-banner.tsx**: Componente base reutilizable

## Components and Interfaces

### StickyBanner Component
```typescript
interface StickyBannerProps {
  children: React.ReactNode;
  className?: string;
  showOnPages?: string[]; // Array de rutas donde mostrar el banner
}
```

### StickyBannerDemo Component
```typescript
interface StickyBannerDemoProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}
```

### MainLayout Integration
- Nuevo prop `showStickyBanner?: boolean` para controlar la visibilidad
- Lógica condicional para mostrar solo en página principal
- Z-index management para evitar conflictos con elementos existentes

## Data Models

### Banner Configuration
```typescript
interface BannerConfig {
  id: string;
  message: string;
  linkText?: string;
  linkHref?: string;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
}
```

## Error Handling

### Fallback Behavior
- Si el componente StickyBanner falla al cargar, la página debe continuar funcionando normalmente
- Implementar error boundaries para aislar fallos del banner
- Logging de errores para debugging

### Responsive Handling
- Breakpoints específicos para diferentes tamaños de pantalla
- Texto que se ajusta automáticamente en móviles
- Manejo de overflow en textos largos

## Testing Strategy

### Unit Tests
- Renderizado correcto del componente StickyBanner
- Props correctamente pasadas y aplicadas
- Comportamiento responsive en diferentes breakpoints

### Integration Tests
- Banner se muestra correctamente en la página principal
- Banner no interfiere con funcionalidad existente del header
- Navegación y scroll funcionan correctamente con el banner

### Visual Tests
- Banner mantiene posición sticky durante scroll
- Gradiente de fondo se aplica correctamente
- Efectos hover funcionan en enlaces

## Implementation Details

### CSS Classes Structure
```css
.sticky-banner {
  position: sticky;
  top: 0;
  z-index: 60; /* Por encima del header (z-50) */
  width: 100%;
  padding: 0.75rem 1rem;
}

.sticky-banner-content {
  max-width: 90%;
  margin: 0 auto;
  text-align: center;
}
```

### Z-Index Hierarchy
- StickyBanner: z-60
- Header: z-50 (existente)
- Sidebar: z-40 (existente)
- Main content: z-10 (existente)

### Performance Considerations
- Componente ligero sin dependencias pesadas
- Lazy loading si el banner incluye imágenes
- Memoización para evitar re-renders innecesarios

### Accessibility
- Texto del banner debe ser legible (contraste adecuado)
- Enlaces deben ser navegables por teclado
- ARIA labels apropiados para screen readers

### Mobile Optimization
- Texto responsive que se ajusta al ancho de pantalla
- Touch targets apropiados para enlaces
- Padding y margins optimizados para móvil