"use client";

import { useEffect } from 'react';

export default function ThemeApplier() {
  useEffect(() => {
    // Simplemente remover cualquier clase de tema que pueda existir
    document.documentElement.classList.remove('default', 'premium', 'halloween', 'christmas');
    console.log('✅ Temas estacionales desactivados - usando tema default');

  }, []);

  return null; // Este componente no renderiza nada
}
