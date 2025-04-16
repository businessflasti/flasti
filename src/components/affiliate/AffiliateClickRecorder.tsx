'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Componente minimalista para registrar clics de afiliados
 * Usa un enfoque "fire and forget" para evitar bloquear la interfaz
 */
function AffiliateClickRecorderContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener el código de afiliado de la URL
    const ref = searchParams.get('ref');
    if (!ref) return;

    // Almacenar el código de afiliado en localStorage
    localStorage.setItem('flasti_affiliate', JSON.stringify({
      ref,
      timestamp: Date.now()
    }));

    // También almacenar en cookie para compatibilidad
    document.cookie = `flasti_affiliate=${ref}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;

    console.log('Código de afiliado guardado:', ref);
  }, [searchParams]);

  // Este componente no renderiza nada
  return null;
}

export default function AffiliateClickRecorder() {
  return (
    <Suspense fallback={null}>
      <AffiliateClickRecorderContent />
    </Suspense>
  );
}
