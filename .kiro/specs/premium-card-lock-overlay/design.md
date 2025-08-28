# Design Document

## Overview

Este documento describe el diseño técnico para implementar un sistema de bloqueo premium con efecto de vidrio esmerilado (frosted glass blur overlay) en las tarjetas de microtareas. El sistema utilizará CSS moderno con glassmorphism, React hooks para gestión de estado, y un enfoque modular para máxima reutilización.

## Architecture

### Component Structure
```
PremiumCardOverlay/
├── PremiumCardOverlay.tsx          # Componente principal del overlay
├── PremiumCardOverlay.module.css   # Estilos CSS con glassmorphism
├── hooks/
│   ├── usePremiumStatus.ts         # Hook para verificar estado premium
│   └── useCardLockConfig.ts        # Hook para configuración de bloqueo
├── components/
│   ├── LockIcon.tsx                # Ícono de candado SVG
│   ├── PremiumText.tsx             # Texto de upgrade premium
│   └── ShimmerEffect.tsx           # Efecto de destello animado
└── utils/
    ├── premiumUtils.ts             # Utilidades para lógica premium
    └── glassmorphismFallback.ts    # Fallbacks para navegadores antiguos
```

### Integration Points
- **OffersList Component**: Wrapper que detecta tarjetas y aplica overlay
- **Dashboard Page**: Gestión de estado premium global
- **Auth Context**: Verificación de usuario premium
- **Analytics Service**: Tracking de interacciones con overlay

## Components and Interfaces

### PremiumCardOverlay Component

```typescript
interface PremiumCardOverlayProps {
  isLocked: boolean;
  onUnlockClick: () => void;
  lockReason?: 'premium' | 'subscription' | 'custom';
  customMessage?: string;
  showShimmer?: boolean;
  blurIntensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  children: React.ReactNode;
}

interface PremiumStatus {
  isPremium: boolean;
  subscriptionType: 'free' | 'premium' | 'enterprise';
  expiresAt?: Date;
  features: string[];
}

interface CardLockConfig {
  lockAllCards: boolean;
  lockedOfferTypes: string[];
  lockedOfferIds: string[];
  premiumOnlyFeatures: string[];
}
```

### CSS Architecture

```css
/* Glassmorphism Base Styles */
.premium-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  border-radius: inherit;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover Effects */
.premium-overlay:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

/* Shimmer Animation */
.shimmer-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
```

### Hook Implementations

```typescript
// usePremiumStatus.ts
export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    subscriptionType: 'free',
    features: []
  });

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/premium-status');
        const data = await response.json();
        setPremiumStatus(data);
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    checkPremiumStatus();
  }, [user]);

  return premiumStatus;
};

// useCardLockConfig.ts
export const useCardLockConfig = () => {
  const [config, setConfig] = useState<CardLockConfig>({
    lockAllCards: true,
    lockedOfferTypes: ['high-reward', 'exclusive'],
    lockedOfferIds: [],
    premiumOnlyFeatures: ['unlimited-tasks', 'priority-support']
  });

  const shouldLockCard = useCallback((offer: CPALeadOffer) => {
    if (config.lockAllCards) return true;
    if (config.lockedOfferIds.includes(offer.id)) return true;
    if (config.lockedOfferTypes.includes(offer.type)) return true;
    return false;
  }, [config]);

  return { config, shouldLockCard };
};
```

## Data Models

### Premium Status Model
```typescript
interface PremiumUser {
  id: string;
  userId: string;
  subscriptionType: 'premium' | 'enterprise';
  startDate: Date;
  expiresAt: Date;
  features: PremiumFeature[];
  paymentStatus: 'active' | 'cancelled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}
```

### Card Lock Configuration Model
```typescript
interface CardLockRule {
  id: string;
  name: string;
  type: 'offer_type' | 'offer_id' | 'reward_threshold' | 'global';
  value: string | number;
  isActive: boolean;
  priority: number;
  createdAt: Date;
}
```

## Error Handling

### Fallback Strategies
1. **Backdrop-filter not supported**: Use pre-rendered blur PNG overlay
2. **JavaScript disabled**: Show static premium message
3. **API failures**: Default to locked state for security
4. **Network issues**: Cache premium status locally

### Error Boundaries
```typescript
class PremiumOverlayErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Premium overlay error:', error, errorInfo);
    // Fallback to simple locked state
  }

  render() {
    if (this.state.hasError) {
      return <SimplePremiumLock />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Tests
- **PremiumCardOverlay**: Render states, prop handling, event callbacks
- **usePremiumStatus**: API calls, state updates, error handling
- **useCardLockConfig**: Configuration logic, card filtering
- **Utility functions**: Browser support detection, fallback logic

### Integration Tests
- **Dashboard integration**: Overlay application on card lists
- **Premium upgrade flow**: Click handling, modal opening
- **Responsive behavior**: Mobile/desktop rendering
- **Cross-browser compatibility**: Fallback mechanisms

### Visual Regression Tests
- **Glassmorphism effects**: Blur intensity, gradient overlays
- **Animation smoothness**: Hover states, shimmer effects
- **Typography rendering**: Lock messages, icon positioning
- **Mobile responsiveness**: Touch interactions, layout preservation

### Performance Tests
- **Render performance**: Large card lists with overlays
- **Animation performance**: 60fps maintenance during effects
- **Memory usage**: Component cleanup, event listener removal
- **Bundle size impact**: CSS and JS overhead

## Implementation Phases

### Phase 1: Core Overlay Component
- Create PremiumCardOverlay component with basic glassmorphism
- Implement CSS with backdrop-filter and fallbacks
- Add lock icon and premium text
- Basic hover effects

### Phase 2: Premium Status Integration
- Implement usePremiumStatus hook
- Create API endpoint for premium verification
- Integrate with existing auth system
- Add real-time status updates

### Phase 3: Advanced Interactions
- Add shimmer animation effects
- Implement click handling for upgrade flow
- Create premium upgrade modal
- Add analytics tracking

### Phase 4: Configuration System
- Build admin interface for lock rules
- Implement useCardLockConfig hook
- Add granular control over locked cards
- Create A/B testing framework

### Phase 5: Optimization & Polish
- Performance optimizations
- Cross-browser testing and fixes
- Accessibility improvements
- Final visual polish and animations