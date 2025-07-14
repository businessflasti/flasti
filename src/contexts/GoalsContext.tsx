
// Solución rápida: exportar GoalsProvider y useGoals como mocks para evitar errores de importación
export function GoalsProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useGoals() {
  // Retorna mocks vacíos para evitar errores en componentes que lo usan
  return {
    goals: [],
    loading: false,
    createGoal: async () => null,
    updateGoal: async () => null,
    deleteGoal: async () => null,
    refreshGoals: async () => null,
  };
}
