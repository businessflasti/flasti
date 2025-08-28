// Types and interfaces for premium card overlay system

export interface PremiumStatus {
  isPremium: boolean;
  subscriptionType: 'free' | 'premium' | 'enterprise';
  expiresAt?: Date;
  features: string[];
}

export interface CardLockConfig {
  lockAllCards: boolean;
  lockedOfferTypes: string[];
  lockedOfferIds: string[];
  premiumOnlyFeatures: string[];
}

export interface PremiumCardOverlayProps {
  isLocked: boolean;
  onUnlockClick: () => void;
  lockReason?: 'premium' | 'subscription' | 'custom';
  customMessage?: string;
  showShimmer?: boolean;
  blurIntensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  children: React.ReactNode;
}

export interface CardLockRule {
  id: string;
  name: string;
  type: 'offer_type' | 'offer_id' | 'reward_threshold' | 'global';
  value: string | number;
  isActive: boolean;
  priority: number;
  createdAt: Date;
}