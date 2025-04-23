'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la nueva URL compleja
    router.replace('/secure-registration-portal-7f9a2b3c5d8e');
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirigiendo...</h1>
        <p className="text-muted-foreground">Por favor, espera un momento.</p>
      </div>
    </div>
  );
}