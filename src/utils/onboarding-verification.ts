/**
 * Utilidades para verificar el sistema de onboarding (solo BD)
 */

export interface OnboardingStatus {
  database: boolean;
  errors: string[];
  completedAt?: string | null;
}

/**
 * Verifica el estado del onboarding para un usuario (solo BD)
 */
export async function verifyOnboardingStatus(): Promise<OnboardingStatus> {
  return { database: false, errors: ['Onboarding eliminado'], completedAt: null };
}

/**
 * Completa el onboarding para el usuario actual
 */
export async function completeOnboarding(userId: string): Promise<boolean> {
  // Onboarding eliminado
  return true;
}

/**
 * Diagnóstico del sistema de onboarding
 */
export async function diagnoseOnboardingSystem(): Promise<void> {
  console.log('Sistema de onboarding eliminado.');
}