"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UserLevel = 1 | 2 | 3;

type UserLevelContextType = {
  level: UserLevel;
  commission: number;
  balance: number;
  updateBalance: (newBalance: number) => void;
  getNextLevelThreshold: () => number | null;
};

const UserLevelContext = createContext<UserLevelContextType | undefined>(undefined);

/**
 * Proveedor del contexto de nivel de usuario
 *
 * Este contexto maneja el nivel del usuario y sus comisiones basado en su balance:
 * - Nivel 1: 50% de comisión (nivel inicial)
 * - Nivel 2: 60% de comisión (se desbloquea al alcanzar $20 de balance)
 * - Nivel 3: 70% de comisión (se desbloquea al alcanzar $30 de balance)
 *
 * Ejemplo: Si un usuario de nivel 1 genera una venta de $7, recibirá $3.50 de comisión (50%)
 */
export const UserLevelProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<UserLevel>(1);
  const [balance, setBalance] = useState(0);
  const [highestBalance, setHighestBalance] = useState(0);

  // Actualizar el nivel basado en el balance más alto alcanzado
  useEffect(() => {
    if (balance > highestBalance) {
      setHighestBalance(balance);
    }

    // Actualizar nivel basado en umbrales (siempre verificar el balance actual)
    if (balance >= 30) {
      setLevel(3);
    } else if (balance >= 20) {
      setLevel(2);
    } else {
      setLevel(1);
    }
  }, [balance, highestBalance]);

  // Calcular comisión basada en el nivel
  const commission = {
    1: 50,
    2: 60,
    3: 70
  }[level];

  // Obtener el umbral para el siguiente nivel
  const getNextLevelThreshold = (): number | null => {
    switch (level) {
      case 1:
        return 20;
      case 2:
        return 30;
      default:
        return null;
    }
  };

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <UserLevelContext.Provider
      value={{
        level,
        commission,
        balance,
        updateBalance,
        getNextLevelThreshold,
      }}
    >
      {children}
    </UserLevelContext.Provider>
  );
};

export const useUserLevel = () => {
  const context = useContext(UserLevelContext);
  if (context === undefined) {
    throw new Error('useUserLevel must be used within a UserLevelProvider');
  }
  return context;
};