'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-[#232323] rounded-2xl p-8 space-y-6 text-center">
          <h2 className="text-3xl font-bold text-white">Algo salió mal</h2>
          <p className="text-white/80">
            Lo sentimos, ha ocurrido un error al cargar la página. Puedes intentar recargar o volver más tarde.
          </p>
          <div className="flex justify-center">
            <Button onClick={reset} className="bg-[#3C66CE] text-white hover:opacity-90">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}