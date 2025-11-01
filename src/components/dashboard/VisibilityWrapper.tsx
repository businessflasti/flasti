import { ReactNode } from 'react';
import { useElementVisibility } from '@/hooks/useElementVisibility';

interface VisibilityWrapperProps {
  page: string;
  elementKey: string;
  children: ReactNode;
}

/**
 * Componente wrapper para controlar la visibilidad de elementos
 * Uso: <VisibilityWrapper page="dashboard" elementKey="welcome_bonus">{children}</VisibilityWrapper>
 */
export default function VisibilityWrapper({ page, elementKey, children }: VisibilityWrapperProps) {
  const { isVisible } = useElementVisibility(page);
  
  if (!isVisible(elementKey)) {
    return null;
  }
  
  return <>{children}</>;
}
