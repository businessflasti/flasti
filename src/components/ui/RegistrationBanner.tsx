'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegistrationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center relative">
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-foreground"
        onClick={() => setIsVisible(false)}
      >
        ✕
      </button>
      <p>
        ¿Problemas con el registro? Prueba nuestras páginas alternativas:{' '}
        <Link href="/register-direct" className="underline font-bold mr-2">
          Directo
        </Link>
        <Link href="/register-simple" className="underline font-bold mr-2">
          Simple
        </Link>
        <Link href="/register-api" className="underline font-bold mr-2">
          API
        </Link>
        <Link href="/register-emergency" className="underline font-bold bg-red-500/20 px-2 py-1 rounded">
          Emergencia
        </Link>
      </p>
    </div>
  );
}
