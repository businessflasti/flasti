'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePageLoaderOptions {
  timeout?: number;
  autoLoad?: boolean;
  fallbackData?: any;
}

export function usePageLoader<T>(
  loadFunction: () => Promise<T>,
  options: UsePageLoaderOptions = {}
) {
  const { timeout = 8000, autoLoad = true, fallbackData = null } = options;
  
  const [data, setData] = useState<T | null>(fallbackData);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);
    
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Timeout para evitar loading infinito
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('Timeout en usePageLoader, finalizando carga');
        setLoading(false);
        setError(new Error('La página tardó demasiado en cargar. Intenta recargar.'));
        setData(fallbackData);
      }
    }, timeout);
    
    try {
      const result = await loadFunction();
      if (mountedRef.current) {
        setData(result);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error('Error en usePageLoader:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setData(fallbackData);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadFunction, timeout, fallbackData]);

  const reload = useCallback(() => {
    load();
  }, [load]);

  useEffect(() => {
    mountedRef.current = true;
    if (autoLoad) {
      load();
    }
    
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [load, autoLoad]);

  return {
    data,
    loading,
    error,
    reload
  };
}