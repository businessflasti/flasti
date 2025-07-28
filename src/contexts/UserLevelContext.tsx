'use client';

// Archivo temporal - será eliminado después de limpiar todas las referencias

export const useUserLevel = () => {
  return {
    level: 1,
    commission: 0.5,
    balance: 0,
    getNextLevelThreshold: () => null
  };
};

export const UserLevelProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};