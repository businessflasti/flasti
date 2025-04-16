'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type BalanceVisibilityContextType = {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
};

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined);

export function BalanceVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    const savedVisibility = localStorage.getItem('balanceVisibility');
    if (savedVisibility !== null) {
      setIsBalanceVisible(savedVisibility === 'true');
    }
  }, []);

  const toggleBalanceVisibility = () => {
    const newVisibility = !isBalanceVisible;
    setIsBalanceVisible(newVisibility);
    localStorage.setItem('balanceVisibility', String(newVisibility));
  };

  return (
    <BalanceVisibilityContext.Provider value={{ isBalanceVisible, toggleBalanceVisibility }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (context === undefined) {
    throw new Error('useBalanceVisibility must be used within a BalanceVisibilityProvider');
  }
  return context;
}