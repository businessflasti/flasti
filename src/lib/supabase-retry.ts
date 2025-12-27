/**
 * Utilidad para reintentar operaciones de Supabase automáticamente
 * cuando fallan por problemas de conexión o timeout
 */

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: boolean; // Si true, aumenta el delay en cada reintento
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoff: true
};

/**
 * Ejecuta una función con reintentos automáticos
 * @param fn - Función async a ejecutar
 * @param options - Opciones de reintento
 * @returns El resultado de la función o lanza error después de agotar reintentos
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, delayMs, backoff } = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries!; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Log del intento fallido
      console.warn(`[Supabase Retry] Intento ${attempt}/${maxRetries} fallido:`, error);
      
      // Si es el último intento, no esperar
      if (attempt === maxRetries) {
        break;
      }
      
      // Calcular delay (con backoff exponencial si está habilitado)
      const currentDelay = backoff ? delayMs! * Math.pow(2, attempt - 1) : delayMs!;
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  // Si llegamos aquí, todos los reintentos fallaron
  throw lastError;
}

/**
 * Wrapper para queries de Supabase con retry automático
 * @param queryFn - Función que retorna una query de Supabase
 * @param options - Opciones de reintento
 */
export async function supabaseQueryWithRetry<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: RetryOptions = {}
): Promise<{ data: T | null; error: any }> {
  const { maxRetries, delayMs, backoff } = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries!; attempt++) {
    try {
      const result = await queryFn();
      
      // Si hay error de conexión/timeout, reintentar
      if (result.error) {
        const errorMessage = result.error.message?.toLowerCase() || '';
        const isRetryableError = 
          errorMessage.includes('timeout') ||
          errorMessage.includes('network') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('fetch') ||
          errorMessage.includes('failed to fetch') ||
          result.error.code === 'PGRST301' || // Timeout
          result.error.code === '57014'; // Query cancelled
        
        if (isRetryableError && attempt < maxRetries!) {
          console.warn(`[Supabase Retry] Error recuperable en intento ${attempt}/${maxRetries}:`, result.error);
          
          const currentDelay = backoff ? delayMs! * Math.pow(2, attempt - 1) : delayMs!;
          await new Promise(resolve => setTimeout(resolve, currentDelay));
          continue;
        }
      }
      
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`[Supabase Retry] Excepción en intento ${attempt}/${maxRetries}:`, error);
      
      if (attempt < maxRetries!) {
        const currentDelay = backoff ? delayMs! * Math.pow(2, attempt - 1) : delayMs!;
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }
  }
  
  return { data: null, error: lastError };
}

/**
 * Hook helper para usar en componentes React
 * Detecta si hay problemas de conexión y sugiere recargar
 */
export function isConnectionError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = (error.message || error.toString()).toLowerCase();
  
  return (
    errorMessage.includes('timeout') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('load failed') ||
    error.code === 'PGRST301' ||
    error.code === '57014'
  );
}
