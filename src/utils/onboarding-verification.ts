/**
 * Utilidades para verificar y diagnosticar el sistema de onboarding
 */

export interface OnboardingStatus {
  localStorage: boolean;
  database: boolean;
  synchronized: boolean;
  errors: string[];
}

/**
 * Verifica el estado completo del onboarding para un usuario
 */
export async function verifyOnboardingStatus(userEmail: string, userId?: string): Promise<OnboardingStatus> {
  const status: OnboardingStatus = {
    localStorage: false,
    database: false,
    synchronized: false,
    errors: []
  };

  try {
    // 1. Verificar localStorage
    const localByEmail = localStorage.getItem(`onboarding_completed_${userEmail}`);
    const localById = userId ? localStorage.getItem(`onboarding_completed_${userId}`) : null;
    
    status.localStorage = localByEmail === 'true' || localById === 'true';

    // 2. Verificar base de datos
    try {
      const response = await fetch('/api/user/onboarding-status');
      if (response.ok) {
        const { hasCompletedOnboarding } = await response.json();
        status.database = hasCompletedOnboarding;
      } else {
        status.errors.push(`Error en API: ${response.status}`);
      }
    } catch (apiError) {
      status.errors.push(`Error de conexión: ${apiError}`);
    }

    // 3. Verificar sincronización
    status.synchronized = status.localStorage === status.database;

    if (!status.synchronized) {
      status.errors.push('Desincronización entre localStorage y base de datos');
    }

  } catch (error) {
    status.errors.push(`Error general: ${error}`);
  }

  return status;
}

/**
 * Sincroniza el estado de onboarding entre localStorage y base de datos
 */
export async function synchronizeOnboardingStatus(userEmail: string, userId?: string): Promise<boolean> {
  try {
    const status = await verifyOnboardingStatus(userEmail, userId);

    // Si la BD dice que está completado pero localStorage no
    if (status.database && !status.localStorage) {
      localStorage.setItem(`onboarding_completed_${userEmail}`, 'true');
      if (userId) {
        localStorage.setItem(`onboarding_completed_${userId}`, 'true');
      }
      console.log('Sincronizado: localStorage actualizado desde BD');
      return true;
    }

    // Si localStorage dice que está completado pero BD no
    if (status.localStorage && !status.database) {
      try {
        const response = await fetch('/api/user/complete-onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            completedAt: new Date().toISOString()
          })
        });

        if (response.ok) {
          console.log('Sincronizado: BD actualizada desde localStorage');
          return true;
        }
      } catch (error) {
        console.error('Error al sincronizar BD:', error);
      }
    }

    return status.synchronized;
  } catch (error) {
    console.error('Error en sincronización:', error);
    return false;
  }
}

/**
 * Diagnóstico completo del sistema de onboarding
 */
export async function diagnoseOnboardingSystem(userEmail: string, userId?: string): Promise<void> {
  console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE ONBOARDING');
  console.log('==========================================');
  
  const status = await verifyOnboardingStatus(userEmail, userId);
  
  console.log('📊 Estado actual:');
  console.log(`  localStorage: ${status.localStorage ? '✅' : '❌'}`);
  console.log(`  Base de datos: ${status.database ? '✅' : '❌'}`);
  console.log(`  Sincronizado: ${status.synchronized ? '✅' : '❌'}`);
  
  if (status.errors.length > 0) {
    console.log('⚠️ Errores encontrados:');
    status.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (!status.synchronized) {
    console.log('🔄 Intentando sincronizar...');
    const synced = await synchronizeOnboardingStatus(userEmail, userId);
    console.log(`Sincronización: ${synced ? '✅ Exitosa' : '❌ Falló'}`);
  }
  
  console.log('==========================================');
}