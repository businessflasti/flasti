# Design Document

## Overview

Este documento describe el diseño técnico completo para la implementación del rediseño premium de la plataforma de juegos inspirado en Stake.com. El diseño se centra en crear una experiencia visual moderna, oscura y minimalista utilizando React, Next.js y TailwindCSS, manteniendo la arquitectura existente mientras se mejora significativamente la presentación visual y la experiencia de usuario.

El diseño sigue un enfoque mobile-first, utiliza componentes reutilizables, y prioriza el rendimiento mediante lazy loading, code splitting y animaciones GPU-aceleradas.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │    Games     │  │   Sports     │      │
│  │     Page     │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Shared Layout Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Header    │  │   Sidebar    │  │    Footer    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    Component Library                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CategoryCard│  │   GameCard   │  │  StatsCard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    Context & State                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │   Balance    │  │  LiveStats   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /api/auth   │  │ /api/balance │  │ /api/stats   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: TailwindCSS 3+
- **Icons**: Lucide React
- **Animations**: Framer Motion (opcional) o CSS Transitions
- **State Management**: React Context API + Hooks
- **Authentication**: Supabase Auth (existente)
- **Database**: Supabase PostgreSQL (existente)

## Components and Interfaces

### 1. Landing Page Component

**Path**: `src/app/(landing)/page.tsx`

**Purpose**: Página de inicio principal con hero section y tarjetas de Casino/Deportes

**Props**: None (uses context for auth state)

**Structure**:
```typescript
interface LandingPageProps {}

interface CategoryCardData {
  id: string;
  title: string;
  color: string; // '#00C67A' for Casino, '#1DB4F9' for Sports
  icon: string;
  activePlayers: number;
  image: string;
  href: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────┐
│            Header (Fixed)                │
├─────────────────────────────────────────┤
│                                          │
│         Hero Section                     │
│   "El casino con apuestas deportivas    │
│      más grande del mundo"               │
│                                          │
│   [Registrarse Button]                   │
│   [Social Login Icons]                   │
│                                          │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────────┐  ┌──────────────┐    │
│  │              │  │              │    │
│  │   Casino     │  │   Deportes   │    │
│  │   Card       │  │   Card       │    │
│  │              │  │              │    │
│  │  66,434 👥   │  │  42,509 👥   │    │
│  └──────────────┘  └──────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

### 2. Header Component

**Path**: `src/components/layout/Header.tsx`

**Purpose**: Barra superior fija con logo, navegación y autenticación

**Props**:
```typescript
interface HeaderProps {
  transparent?: boolean; // Para hero section
  fixed?: boolean; // Default true
}
```

**State**:
```typescript
interface HeaderState {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              [Nav Links]      [Login] [Register] │
│                                                           │
│ Stake              Casino  Sports    Iniciar  Registrarse│
│                                      sesión              │
└─────────────────────────────────────────────────────────┘
```

**Authenticated State**:
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]              [Nav Links]      [Balance] [Avatar] │
│                                                           │
│ Stake              Casino  Sports    💰 1,234  [👤]      │
└─────────────────────────────────────────────────────────┘
```

### 3. Sidebar Component

**Path**: `src/components/layout/Sidebar.tsx`

**Purpose**: Menú lateral de navegación con todas las opciones

**Props**:
```typescript
interface SidebarProps {
  isOpen?: boolean; // For mobile
  onClose?: () => void; // For mobile
}

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
}
```

**Menu Items**:
```typescript
const sidebarItems: SidebarItem[] = [
  { id: 'promotions', label: 'Promociones', icon: Gift, href: '/promotions' },
  { id: 'affiliate', label: 'Afiliado', icon: Users, href: '/affiliate' },
  { id: 'vip', label: 'Club VIP', icon: Crown, href: '/vip' },
  { id: 'blog', label: 'Blog', icon: FileText, href: '/blog' },
  { id: 'forum', label: 'Foro', icon: MessageSquare, href: '/forum' },
  { id: 'sponsors', label: 'Patrocinios', icon: Award, href: '/sponsors' },
];
```

**Layout**:
```
┌──────────────────┐
│                  │
│  🎁 Promociones  │
│  👥 Afiliado     │
│  👑 Club VIP     │
│  📄 Blog         │
│  💬 Foro         │
│  🏆 Patrocinios  │
│                  │
└──────────────────┘
```

### 4. Category Card Component

**Path**: `src/components/cards/CategoryCard.tsx`

**Purpose**: Tarjeta grande para Casino y Deportes con contador de jugadores

**Props**:
```typescript
interface CategoryCardProps {
  title: string;
  color: string;
  activePlayers: number;
  image: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}
```

**Visual Structure**:
```
┌─────────────────────────────────┐
│                                 │
│     [Background Image]          │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Gradient Overlay         │  │
│  │                          │  │
│  │  Casino                  │  │
│  │  👥 66,434 jugando       │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

**Hover Effect**:
- Scale: 1.02
- Brightness: 1.1
- Transition: 300ms ease-out

### 5. Game Card Component

**Path**: `src/components/cards/GameCard.tsx`

**Purpose**: Tarjeta individual para juegos en la sección de tendencias

**Props**:
```typescript
interface GameCardProps {
  id: string;
  name: string;
  image: string;
  activePlayers: number;
  category: string;
  position?: number; // For trending badge
  onClick?: () => void;
}
```

**Visual Structure**:
```
┌──────────────────┐
│ [1]              │ ← Position badge
│                  │
│  [Game Image]    │
│                  │
│                  │
├──────────────────┤
│ Sweet Bonanza    │
│ 👥 1,180 jugando │
└──────────────────┘
```

### 6. Stats Card Component

**Path**: `src/components/cards/StatsCard.tsx`

**Purpose**: Tarjeta pequeña para mostrar estadísticas (balance, ganancias, etc.)

**Props**:
```typescript
interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
```

**Visual Structure**:
```
┌──────────────────────┐
│ HOY            [📈]  │
│ 1,234               │
└──────────────────────┘
```

### 7. Live Stats Hook

**Path**: `src/hooks/useLiveStats.ts`

**Purpose**: Hook personalizado para obtener estadísticas en tiempo real

**Interface**:
```typescript
interface LiveStats {
  casino: {
    activePlayers: number;
    totalGames: number;
  };
  sports: {
    activePlayers: number;
    activeEvents: number;
  };
  isLoading: boolean;
  error: Error | null;
}

function useLiveStats(refreshInterval: number = 30000): LiveStats;
```

**Implementation**:
- Usa `useEffect` con interval para polling
- Hace fetch a `/api/stats/live`
- Actualiza estado cada 30 segundos
- Limpia interval en unmount

## Data Models

### Live Stats API Response

```typescript
interface LiveStatsResponse {
  success: boolean;
  data: {
    casino: {
      activePlayers: number;
      totalGames: number;
      popularGames: Array<{
        id: string;
        name: string;
        players: number;
      }>;
    };
    sports: {
      activePlayers: number;
      activeEvents: number;
      popularSports: Array<{
        id: string;
        name: string;
        events: number;
      }>;
    };
  };
  timestamp: string;
}
```

### User Balance Response

```typescript
interface UserBalanceResponse {
  success: boolean;
  balance: {
    chips: number;
    usd: number;
    totalWins: number;
    totalGamesPlayed: number;
  };
}
```

## Design System

### Color Palette

```typescript
const colors = {
  // Primary Background
  background: {
    primary: '#0F212E',    // Main dark blue
    secondary: '#1A2C38',  // Card background
    tertiary: '#213743',   // Hover states
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B1BAD3',
    tertiary: '#7F8EA3',
  },
  
  // Accent Colors
  accent: {
    primary: '#1E90FF',    // Main blue (buttons)
    casino: '#00C67A',     // Green for casino
    sports: '#1DB4F9',     // Cyan for sports
  },
  
  // Status Colors
  status: {
    success: '#00C67A',
    error: '#FF4757',
    warning: '#FFA502',
    info: '#1DB4F9',
  },
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
};
```

### Typography Scale

```typescript
const typography = {
  // Font Families
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    secondary: '"Poppins", sans-serif',
  },
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing Scale

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};
```

### Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};
```

### Shadows

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(30, 144, 255, 0.3)',
};
```

### Animations

```typescript
const animations = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Easing Functions
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Keyframes
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
  
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
};
```

## Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
};
```

### Responsive Behavior

**Mobile (<768px)**:
- Sidebar: Hidden, accessible via hamburger menu
- Category Cards: Stacked vertically (1 column)
- Game Cards: 2 columns
- Header: Compact with hamburger menu
- Hero text: Smaller font size (2xl instead of 4xl)

**Tablet (768px - 1024px)**:
- Sidebar: Collapsible, icons only
- Category Cards: 2 columns
- Game Cards: 3 columns
- Header: Full navigation visible

**Desktop (>1024px)**:
- Sidebar: Fully expanded with labels
- Category Cards: 2 columns with larger size
- Game Cards: 6 columns
- Header: Full navigation with all elements

## Error Handling

### API Error Handling

```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Error handling pattern
try {
  const response = await fetch('/api/stats/live');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data;
} catch (error) {
  console.error('Failed to fetch stats:', error);
  toast.error('No se pudieron cargar las estadísticas');
  return null;
}
```

### Loading States

```typescript
interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  data: any | null;
}

// Loading UI pattern
{isLoading && <Skeleton />}
{error && <ErrorMessage error={error} />}
{data && <Content data={data} />}
```

## Testing Strategy

### Unit Tests

**Components to Test**:
- CategoryCard: Props rendering, hover effects, click handlers
- GameCard: Data display, position badge, player count formatting
- Header: Auth state changes, mobile menu toggle
- Sidebar: Navigation, active state, mobile behavior

**Test Framework**: Jest + React Testing Library

**Example Test**:
```typescript
describe('CategoryCard', () => {
  it('renders with correct title and player count', () => {
    render(
      <CategoryCard
        title="Casino"
        color="#00C67A"
        activePlayers={66434}
        image="/casino.jpg"
        href="/games"
      />
    );
    
    expect(screen.getByText('Casino')).toBeInTheDocument();
    expect(screen.getByText('66,434')).toBeInTheDocument();
  });
  
  it('applies hover effect on mouse enter', () => {
    const { container } = render(<CategoryCard {...props} />);
    const card = container.firstChild;
    
    fireEvent.mouseEnter(card);
    expect(card).toHaveClass('scale-102');
  });
});
```

### Integration Tests

**Scenarios to Test**:
- Landing page loads with correct data
- User can navigate from landing to games section
- Live stats update every 30 seconds
- Mobile menu opens and closes correctly
- Authentication flow works with new UI

### E2E Tests

**Critical Paths**:
1. User visits landing page → sees hero and category cards
2. User clicks Casino card → navigates to games page
3. User clicks Register → modal opens → can complete registration
4. Authenticated user sees balance in header
5. Mobile user can open sidebar and navigate

**Test Framework**: Playwright or Cypress

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/casino-hero.jpg"
  alt="Casino"
  width={600}
  height={400}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting

```typescript
// Lazy load heavy components
const GameModal = dynamic(() => import('@/components/modals/GameModal'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### Animation Performance

```css
/* Use GPU-accelerated properties */
.card-hover {
  transform: scale(1.02); /* GPU */
  transition: transform 300ms ease-out;
}

/* Avoid */
.card-hover-bad {
  width: 110%; /* CPU - causes reflow */
  height: 110%;
}
```

### Bundle Size Optimization

- Tree-shake unused Lucide icons
- Use dynamic imports for modals and heavy components
- Minimize TailwindCSS by purging unused classes
- Use font-display: swap for custom fonts

## Implementation Phases

### Phase 1: Core Layout (Priority: High)
- Header component with auth integration
- Sidebar component with navigation
- Landing page structure
- Color system and typography setup

### Phase 2: Category Cards (Priority: High)
- CategoryCard component
- Live stats integration
- Hover animations
- Responsive behavior

### Phase 3: Games Section (Priority: Medium)
- GameCard component
- Trending games section
- Game grid layout
- Lazy loading for images

### Phase 4: Polish & Animations (Priority: Medium)
- Smooth transitions
- Loading states
- Error handling UI
- Micro-interactions

### Phase 5: Testing & Optimization (Priority: Low)
- Unit tests
- Integration tests
- Performance optimization
- Accessibility audit

## Migration Strategy

### Backward Compatibility

- Keep existing `/games` route functional
- Add new landing page at `/` or `/home`
- Gradually migrate users to new UI
- Maintain API compatibility

### Feature Flags

```typescript
const features = {
  newLandingPage: process.env.NEXT_PUBLIC_NEW_LANDING === 'true',
  liveStats: process.env.NEXT_PUBLIC_LIVE_STATS === 'true',
};

// Conditional rendering
{features.newLandingPage ? <NewLanding /> : <OldLanding />}
```

### Rollout Plan

1. **Week 1**: Deploy to staging, internal testing
2. **Week 2**: A/B test with 10% of users
3. **Week 3**: Increase to 50% if metrics are positive
4. **Week 4**: Full rollout to 100% of users
5. **Week 5**: Remove old UI code

## Accessibility Considerations

### Keyboard Navigation

```typescript
// Ensure all interactive elements are keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="Open Casino section"
>
  Casino
</button>
```

### ARIA Labels

```typescript
<nav aria-label="Main navigation">
  <ul role="list">
    <li role="listitem">
      <a href="/games" aria-current="page">Casino</a>
    </li>
  </ul>
</nav>
```

### Focus Management

```typescript
// Trap focus in modals
import { FocusTrap } from '@/components/utils/FocusTrap';

<Modal isOpen={isOpen}>
  <FocusTrap>
    <ModalContent />
  </FocusTrap>
</Modal>
```

### Color Contrast

- All text must meet WCAG AA standards (4.5:1 for normal text)
- Use tools like WebAIM Contrast Checker
- Provide alternative visual indicators beyond color

## Security Considerations

### XSS Prevention

```typescript
// Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput);
```

### CSRF Protection

- Use Next.js built-in CSRF protection
- Validate all API requests with tokens
- Use SameSite cookies

### Rate Limiting

```typescript
// Implement rate limiting for live stats API
import rateLimit from '@/lib/rateLimit';

export async function GET(request: Request) {
  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  });
  
  await limiter.check(request, 10); // 10 requests per minute
  
  // ... rest of API logic
}
```

## Monitoring and Analytics

### Performance Metrics

- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms

### User Analytics

```typescript
// Track user interactions
import { analytics } from '@/lib/analytics';

analytics.track('category_card_clicked', {
  category: 'casino',
  timestamp: Date.now(),
});
```

### Error Tracking

```typescript
// Use Sentry or similar
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: {
    component: 'CategoryCard',
    action: 'click',
  },
});
```

## Conclusion

Este diseño proporciona una base sólida para implementar el rediseño premium de la plataforma de juegos. La arquitectura es escalable, mantenible y optimizada para rendimiento. Los componentes son reutilizables y siguen las mejores prácticas de React y Next.js.

La implementación debe seguir las fases definidas, priorizando primero el layout core y las tarjetas de categorías, seguido por la sección de juegos y finalmente el pulido y optimización.
