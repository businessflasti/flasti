'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DataLoadingContextType {
  // Estado global de carga
  isDataReady: boolean;
  // Registrar un componente que está cargando datos
  registerLoading: (key: string) => void;
  // Marcar un componente como listo
  markReady: (key: string) => void;
  // Verificar si un componente específico está listo
  isComponentReady: (key: string) => boolean;
}

const DataLoadingContext = createContext<DataLoadingContextType | undefined>(undefined);

export function DataLoadingProvider({ children }: { children: ReactNode }) {
  // Map de componentes y su estado de carga
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const registerLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const markReady = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const isComponentReady = useCallback((key: string) => {
    return loadingStates[key] ?? true; // Si no está registrado, se considera listo
  }, [loadingStates]);

  // Todos los datos están listos cuando todos los componentes registrados están listos
  const isDataReady = Object.keys(loadingStates).length === 0 || 
                      Object.values(loadingStates).every(ready => ready);

  return (
    <DataLoadingContext.Provider value={{ isDataReady, registerLoading, markReady, isComponentReady }}>
      {children}
    </DataLoadingContext.Provider>
  );
}

export function useDataLoading() {
  const context = useContext(DataLoadingContext);
  if (context === undefined) {
    throw new Error('useDataLoading debe ser usado dentro de un DataLoadingProvider');
  }
  return context;
}

// Hook simplificado para componentes que cargan datos
export function useComponentLoading(componentKey: string) {
  const { registerLoading, markReady } = useDataLoading();
  
  const setLoading = useCallback(() => {
    registerLoading(componentKey);
  }, [componentKey, registerLoading]);
  
  const setReady = useCallback(() => {
    markReady(componentKey);
  }, [componentKey, markReady]);
  
  return { setLoading, setReady };
}
